'use strict';

const userService = require('../services/user.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * GET /api/v1/users/profile
 * Returns the full profile of the authenticated user.
 */
async function getProfile(req, res) {
  const user = await userService.getProfile(req.user.id);
  return sendSuccess(res, { user });
}

/**
 * PATCH /api/v1/users/profile
 * Updates name, bio, and/or location in a single call.
 * Body: { name?, bio?, location? }
 */
async function updateProfile(req, res) {
  const { name, bio, location } = req.body;
  const user = await userService.updateProfile(req.user.id, { name, bio, location });
  return sendSuccess(res, { user });
}

/**
 * PATCH /api/v1/users/name
 * Updates the display name only.
 * Body: { name }
 */
async function updateName(req, res) {
  const user = await userService.updateName(req.user.id, req.body.name);
  return sendSuccess(res, { user });
}

/**
 * PATCH /api/v1/users/phone
 * Updates the phone number only.
 * Body: { phone }
 */
async function updatePhone(req, res) {
  const user = await userService.updatePhone(req.user.id, req.body.phone);
  return sendSuccess(res, { user });
}

/**
 * PATCH /api/v1/users/password
 * Changes password after verifying the current one.
 * Body: { currentPassword, newPassword, confirmNewPassword }
 */
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const result = await userService.changePassword(req.user.id, {
    currentPassword,
    newPassword,
  });
  return sendSuccess(res, result);
}

/**
 * POST /api/v1/users/avatar
 * Uploads a profile image (multipart/form-data, field name: avatar).
 * The uploadAvatar middleware runs before this handler and populates req.file.
 */
async function uploadAvatar(req, res) {
  const result = await userService.uploadAvatar(req.user.id, req.file);
  return sendSuccess(res, result);
}

/**
 * DELETE /api/v1/users/avatar
 * Removes the current avatar from disk and clears the field in MongoDB.
 */
async function deleteAvatar(req, res) {
  const result = await userService.deleteAvatar(req.user.id);
  return sendSuccess(res, result);
}

/**
 * POST /api/v1/users/cover
 * Uploads a cover image (multipart/form-data, field name: cover).
 */
async function uploadCoverImage(req, res) {
  const result = await userService.uploadCoverImage(req.user.id, req.file);
  return sendSuccess(res, result);
}

/**
 * DELETE /api/v1/users/cover
 * Removes the current cover image from disk and clears the field in MongoDB.
 */
async function deleteCoverImage(req, res) {
  const result = await userService.deleteCoverImage(req.user.id);
  return sendSuccess(res, result);
}

/**
 * GET /api/v1/users/search?q=&limit=
 * Returns users based on the caller's role (seller→buyers, buyer→sellers).
 */
async function searchUsers(req, res) {
  const { q = '', limit = 10 } = req.query;
  const users = await userService.searchUsersForMessaging(
    req.user.id,
    req.user.role,
    q,
    limit
  );
  return sendSuccess(res, { users });
}

/**
 * GET /api/v1/users/:id
 * Public profile — returns safe fields only (name, username, avatar, bio, role).
 */
async function getPublicProfile(req, res) {
  const user = await userService.getPublicProfile(req.params.id);
  return sendSuccess(res, { user });
}

/**
 * DELETE /api/v1/users/:id
 * Admin deletes a user account.
 */
async function deleteUser(req, res) {
  const result = await userService.deleteUser(req.params.id, req.user.id);
  return sendSuccess(res, result);
}

module.exports = {
  getProfile,
  updateProfile,
  updateName,
  updatePhone,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  uploadCoverImage,
  deleteCoverImage,
  searchUsers,
  getPublicProfile,
  deleteUser,
};
