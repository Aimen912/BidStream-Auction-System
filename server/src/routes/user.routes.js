'use strict';

const { Router } = require('express');
const { body, param }   = require('express-validator');

const userController          = require('../controllers/user.controller');
const validate                = require('../middleware/validate');
const { authenticate, authorize }        = require('../middleware/authenticate');
const { uploadAvatar, uploadCoverImage } = require('../middleware/upload');

const router = Router();

// Every route in this file requires a valid access token
router.use(authenticate);

// ─── Validation chains ───────────────────────────────────────────────────────

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be blank')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('bio')
    .optional({ nullable: true, checkFalsy: false })
    .trim()
    .isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters'),

  body('location')
    .optional({ nullable: true, checkFalsy: false })
    .trim()
    .isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
];

const updateNameValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
];

const updatePhoneValidation = [
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .isMobilePhone().withMessage('Please enter a valid phone number'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('New password must contain at least one number'),

  body('confirmNewPassword')
    .notEmpty().withMessage('Please confirm your new password')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET  /api/v1/users/profile        — get current user's full profile
router.get(
  '/profile',
  userController.getProfile
);

// PATCH /api/v1/users/profile       — update name, bio, location (any combination)
router.patch(
  '/profile',
  updateProfileValidation,
  validate,
  userController.updateProfile
);

// PUT /api/v1/users/profile         — same as PATCH (spec alias)
router.put(
  '/profile',
  updateProfileValidation,
  validate,
  userController.updateProfile
);

// PATCH /api/v1/users/name          — update display name only
router.patch(
  '/name',
  updateNameValidation,
  validate,
  userController.updateName
);

// PATCH /api/v1/users/phone         — update phone number only
router.patch(
  '/phone',
  updatePhoneValidation,
  validate,
  userController.updatePhone
);

// PATCH /api/v1/users/password      — change password (requires current password)
router.patch(
  '/password',
  changePasswordValidation,
  validate,
  userController.changePassword
);

// POST  /api/v1/users/avatar        — upload profile image (multipart/form-data)
router.post(
  '/avatar',
  uploadAvatar,            // multer middleware — must run before controller
  userController.uploadAvatar
);

// DELETE /api/v1/users/avatar       — remove profile image
router.delete(
  '/avatar',
  userController.deleteAvatar
);

// POST  /api/v1/users/cover         — upload cover image (multipart/form-data, field: cover)
router.post(
  '/cover',
  uploadCoverImage,
  userController.uploadCoverImage
);

// DELETE /api/v1/users/cover        — remove cover image
router.delete(
  '/cover',
  userController.deleteCoverImage
);

// GET  /api/v1/users/search        — role-based user search for messaging
router.get('/search', userController.searchUsers);

// GET /api/v1/users/:id             — public profile lookup (any authenticated user)
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid user ID')],
  validate,
  userController.getPublicProfile
);

// DELETE /api/v1/users/:id          — admin deletes a user account
router.delete(
  '/:id',
  authorize('admin'),
  [param('id').isMongoId().withMessage('Invalid user ID')],
  validate,
  userController.deleteUser
);

module.exports = router;
