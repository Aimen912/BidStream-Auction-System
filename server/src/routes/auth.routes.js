'use strict';

const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/authenticate');

const router = Router();

// ─── Validation chains ───────────────────────────────────────────────────────

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .isLength({ max: 30 }).withMessage('Username cannot exceed 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

  // Phone is optional — only basic length check, no strict format enforcement
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 20 }).withMessage('Phone number is too long'),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  body('role')
    .optional()
    .isIn(['buyer', 'seller']).withMessage('Role must be buyer or seller'),
];

const loginValidation = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

const refreshValidation = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required'),
];

// ─── Routes ──────────────────────────────────────────────────────────────────

// Buyer / Seller registration — admin cannot self-register
router.post(
  '/register',
  authLimiter,
  registerValidation,
  validate,
  authController.register
);

// Buyer / Seller login
router.post(
  '/login',
  authLimiter,
  loginValidation,
  validate,
  authController.login
);

// Admin-only login — separate endpoint, same rate limiter
router.post(
  '/admin/login',
  authLimiter,
  loginValidation,
  validate,
  authController.adminLogin
);

// Refresh access token
router.post(
  '/refresh',
  authLimiter,
  refreshValidation,
  validate,
  authController.refresh
);

// Logout — requires valid access token
router.post(
  '/logout',
  authenticate,
  authController.logout
);

// Current user profile — requires valid access token
router.get(
  '/me',
  authenticate,
  authController.me
);

// PUT /api/v1/auth/change-password — change password (spec alias)
// Delegates to user service through auth controller
router.put(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('confirmNewPassword').custom((v, { req }) => {
      if (v !== req.body.newPassword) throw new Error('Passwords do not match');
      return true;
    }),
  ],
  validate,
  authController.changePassword
);

module.exports = router;
