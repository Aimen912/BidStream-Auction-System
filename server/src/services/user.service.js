'use strict';

const fs   = require('fs');
const path = require('path');
const User = require('../models/User');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function notFound() {
  const err = new Error('User not found');
  err.statusCode = 404;
  return err;
}

function forbidden(msg = 'Forbidden') {
  const err = new Error(msg);
  err.statusCode = 403;
  return err;
}

/**
 * Delete a previously stored avatar file from disk.
 * Silently ignores errors (file may already be gone).
 */
function deleteAvatarFile(avatarPath) {
  if (!avatarPath) return;
  try {
    const abs = path.join(__dirname, '../../', avatarPath);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch {
    // non-fatal — log if needed
  }
}

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * GET /api/v1/users/profile
 * Returns the full profile of the authenticated user.
 */
async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) throw notFound();
  return user.toJSON();
}

/**
 * PATCH /api/v1/users/profile
 * Updates allowed profile fields: name, bio, location.
 * Phone and password have dedicated endpoints.
 */
async function updateProfile(userId, { name, bio, location }) {
  const user = await User.findById(userId);
  if (!user) throw notFound();

  if (name     !== undefined) user.name     = name;
  if (bio      !== undefined) user.bio      = bio;
  if (location !== undefined) user.location = location;

  await user.save();
  return user.toJSON();
}

/**
 * PATCH /api/v1/users/phone
 * Updates the phone number of the authenticated user.
 */
async function updatePhone(userId, phone) {
  const user = await User.findById(userId);
  if (!user) throw notFound();

  user.phone = phone || null;
  await user.save();
  return user.toJSON();
}

/**
 * PATCH /api/v1/users/name
 * Updates only the display name of the authenticated user.
 */
async function updateName(userId, name) {
  const user = await User.findById(userId);
  if (!user) throw notFound();

  user.name = name;
  await user.save();
  return user.toJSON();
}

/**
 * PATCH /api/v1/users/password
 * Changes password after verifying the current one.
 * bcrypt re-hash is handled by the User pre-save hook.
 */
async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId).select('+password');
  if (!user) throw notFound();

  const match = await user.comparePassword(currentPassword);
  if (!match) throw forbidden('Current password is incorrect');

  if (currentPassword === newPassword) {
    const err = new Error('New password must be different from current password');
    err.statusCode = 422;
    throw err;
  }

  user.password = newPassword; // pre-save hook will hash it
  await user.save();

  return { message: 'Password changed successfully' };
}

/**
 * POST /api/v1/users/avatar
 * Stores the uploaded file path in MongoDB.
 * Deletes the previous avatar file from disk if one existed.
 *
 * @param {string} userId
 * @param {Express.Multer.File} file  – multer file object from req.file
 */
async function uploadAvatar(userId, file) {
  if (!file) {
    const err = new Error('No image file provided');
    err.statusCode = 422;
    throw err;
  }

  const user = await User.findById(userId);
  if (!user) throw notFound();

  // Remove old avatar from disk before saving new path
  deleteAvatarFile(user.avatar);

  // Store as a URL-safe relative path served by the static middleware
  user.avatar = `/uploads/avatars/${file.filename}`;
  await user.save();

  return { avatar: user.avatar };
}

/**
 * DELETE /api/v1/users/avatar
 * Removes the avatar image from disk and clears the field in MongoDB.
 */
async function deleteAvatar(userId) {
  const user = await User.findById(userId);
  if (!user) throw notFound();

  deleteAvatarFile(user.avatar);
  user.avatar = null;
  await user.save();

  return { message: 'Avatar removed successfully' };
}

/**
 * POST /api/v1/users/cover
 * Stores the uploaded cover image path in MongoDB.
 * Deletes the previous cover from disk if one existed.
 *
 * @param {string} userId
 * @param {Express.Multer.File} file  – multer file object from req.file
 */
async function uploadCoverImage(userId, file) {
  if (!file) {
    const err = new Error('No image file provided');
    err.statusCode = 422;
    throw err;
  }

  const user = await User.findById(userId);
  if (!user) throw notFound();

  // Remove old cover from disk before saving new path
  if (user.coverImage) deleteAvatarFile(user.coverImage);

  user.coverImage = `/uploads/covers/${file.filename}`;
  await user.save();

  return { coverImage: user.coverImage };
}

/**
 * DELETE /api/v1/users/cover
 * Removes the cover image from disk and clears the field in MongoDB.
 */
async function deleteCoverImage(userId) {
  const user = await User.findById(userId);
  if (!user) throw notFound();

  if (user.coverImage) deleteAvatarFile(user.coverImage);
  user.coverImage = null;
  await user.save();

  return { message: 'Cover image removed successfully' };
}

/**
 * GET /api/v1/users/:id
 * Returns a public-safe view of any user's profile (no password, no email).
 */
async function getPublicProfile(userId) {
  const user = await User.findById(userId)
    .select('name username avatar bio location role createdAt');
  if (!user) throw notFound();
  return user;
}

/**
 * GET /api/v1/users/search?q=&limit=
 * Role-based user search for messaging:
 *   - seller  → returns buyers
 *   - buyer   → returns sellers
 *   - admin   → returns all non-admin users
 * Searches name, username, email (case-insensitive).
 */
async function searchUsersForMessaging(currentUserId, currentRole, q = '', limit = 10) {
  // Determine which role(s) to show
  let roleFilter;
  if (currentRole === 'seller') roleFilter = 'buyer';
  else if (currentRole === 'buyer') roleFilter = 'seller';
  else roleFilter = { $in: ['buyer', 'seller'] }; // admin sees all

  const query = { role: roleFilter, _id: { $ne: currentUserId } };

  if (q.trim()) {
    const re = new RegExp(q.trim(), 'i');
    query.$or = [{ name: re }, { username: re }, { email: re }];
  }

  const users = await User.find(query)
    .select('name username email avatar role')
    .limit(Math.min(Number(limit) || 10, 50))
    .lean();

  return users;
}

/**
 * DELETE /api/v1/users/:id
 * Admin deletes a user account.
 */
async function deleteUser(userId, currentAdminId) {
  if (String(userId) === String(currentAdminId)) {
    const err = new Error('You cannot delete your own admin account');
    err.statusCode = 403;
    throw err;
  }
  const user = await User.findById(userId);
  if (!user) throw notFound();
  await user.deleteOne();
  return { message: 'User deleted successfully' };
}

module.exports = {
  getProfile,
  updateProfile,
  updatePhone,
  updateName,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  uploadCoverImage,
  deleteCoverImage,
  getPublicProfile,
  searchUsersForMessaging,
  deleteUser,
};
