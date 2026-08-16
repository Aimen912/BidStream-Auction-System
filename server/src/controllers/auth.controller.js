'use strict';

const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * POST /api/v1/auth/register
 * Body: { name, username, email, phone?, password, confirmPassword, role }
 * Role must be 'buyer' or 'seller' — 'admin' is rejected at the service level.
 */
async function register(req, res) {
  // Strip confirmPassword before passing to service — it's a UI-only field
  const { confirmPassword, ...fields } = req.body;
  const result = await authService.register(fields);
  return sendSuccess(res, result, 201);
}

/**
 * POST /api/v1/auth/login
 * Body: { email, password }
 * Works for buyer and seller roles.
 */
async function login(req, res) {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  return sendSuccess(res, result);
}

/**
 * POST /api/v1/auth/admin/login
 * Body: { email, password }
 * Dedicated admin login — returns 401 if the account is not an admin.
 */
async function adminLogin(req, res) {
  const { email, password } = req.body;
  const result = await authService.adminLogin({ email, password });
  return sendSuccess(res, result);
}

/**
 * POST /api/v1/auth/refresh
 * Body: { refreshToken }
 */
async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return sendError(res, 'Refresh token is required', 400);
  const result = await authService.refresh(refreshToken);
  return sendSuccess(res, result);
}

/**
 * POST /api/v1/auth/logout
 * Protected — requires valid access token in Authorization header.
 * Stateless JWT: instructs the client to discard tokens.
 * Extend with a token blocklist here if needed.
 */
async function logout(req, res) {
  return sendSuccess(res, { message: 'Logged out successfully' });
}

/**
 * GET /api/v1/auth/me
 * Protected — returns the profile of the currently authenticated user.
 */
async function me(req, res) {
  const user = await authService.getProfile(req.user.id);
  return sendSuccess(res, { user });
}

/**
 * PUT /api/v1/auth/change-password
 * Protected — changes password (spec-required endpoint).
 * Delegates to userService to avoid duplicating logic.
 */
async function changePassword(req, res) {
  const userService = require('../services/user.service');
  const { currentPassword, newPassword } = req.body;
  const result = await userService.changePassword(req.user.id, { currentPassword, newPassword });
  return sendSuccess(res, result);
}

module.exports = { register, login, adminLogin, refresh, logout, me, changePassword };
