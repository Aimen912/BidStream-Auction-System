'use strict';

const User = require('../models/User');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { notifyAccountRegistered } = require('../utils/notify');

/**
 * Register a new buyer or seller.
 * Admin accounts cannot be created via self-registration.
 */
async function register({ name, username, email, phone, password, role }) {
  // Block admin self-registration
  if (role === 'admin') {
    const err = new Error('Admin accounts cannot be created via registration');
    err.statusCode = 403;
    throw err;
  }

  // Default to buyer if no role supplied
  const assignedRole = role === 'seller' ? 'seller' : 'buyer';

  // Check for existing email
  const emailTaken = await User.findOne({ email });
  if (emailTaken) {
    const err = new Error('Email already in use');
    err.statusCode = 409;
    throw err;
  }

  // Check for existing username
  const usernameTaken = await User.findOne({ username: username.toLowerCase() });
  if (usernameTaken) {
    const err = new Error('Username already taken');
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({
    name,
    username,
    email,
    phone: phone || null,
    password,
    role: assignedRole,
  });

  const tokens = generateTokens(user);

  // Welcome notification — fire and forget
  await notifyAccountRegistered(user._id, { name: user.name, role: assignedRole });

  return { user: user.toJSON(), ...tokens };
}

/**
 * Authenticate any user (buyer, seller, admin) by email + password.
 * Admin login is handled by the same logic but can be called from
 * a dedicated route to keep the API surface intentional.
 */
async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('Account is disabled. Please contact support.');
    err.statusCode = 403;
    throw err;
  }

  const tokens = generateTokens(user);
  return { user: user.toJSON(), ...tokens };
}

/**
 * Admin-specific login — same mechanics as login() but enforces
 * that the authenticated account actually holds the admin role.
 */
async function adminLogin({ email, password }) {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  if (user.role !== 'admin') {
    // Deliberately vague — don't reveal that the account exists but isn't admin
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('Account is disabled. Please contact support.');
    err.statusCode = 403;
    throw err;
  }

  const tokens = generateTokens(user);
  return { user: user.toJSON(), ...tokens };
}

/**
 * Issue a new access token from a valid refresh token.
 */
async function refresh(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findById(payload.id);
  if (!user || !user.isActive) {
    const err = new Error('User not found or account is inactive');
    err.statusCode = 401;
    throw err;
  }

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  return { accessToken };
}

/**
 * Return the authenticated user's profile.
 */
async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user.toJSON();
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateTokens(user) {
  const payload = { id: user._id, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

module.exports = { register, login, adminLogin, refresh, getProfile };
