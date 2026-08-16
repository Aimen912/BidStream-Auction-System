'use strict';

const { Router } = require('express');
const { body, query, param } = require('express-validator');

const categoryController              = require('../controllers/category.controller');
const validate                        = require('../middleware/validate');
const { authenticate, authorize }     = require('../middleware/authenticate');
const { uploadCategoryImage }         = require('../middleware/upload');

const router = Router();

// ─── Validation chains ───────────────────────────────────────────────────────

const mongoIdParam = [
  param('id')
    .isMongoId().withMessage('Invalid category ID'),
];

const getAllValidation = [
  query('status')
    .optional()
    .isIn(['active', 'inactive', 'all']).withMessage('status must be active, inactive, or all'),
  query('sort')
    .optional()
    .isIn(['name', 'auctions', 'updated']).withMessage('sort must be name, auctions, or updated'),
];

const createValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 60 }).withMessage('Name cannot exceed 60 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 300 }).withMessage('Description cannot exceed 300 characters'),

  body('icon')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 10 }).withMessage('Icon cannot exceed 10 characters'),

  body('gradient')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Gradient string cannot exceed 100 characters'),

  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
];

const updateValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be blank')
    .isLength({ max: 60 }).withMessage('Name cannot exceed 60 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be blank')
    .isLength({ max: 300 }).withMessage('Description cannot exceed 300 characters'),

  body('icon')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 10 }).withMessage('Icon cannot exceed 10 characters'),

  body('gradient')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Gradient string cannot exceed 100 characters'),

  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
];

// ─── Public routes (no auth required) ────────────────────────────────────────

// GET /api/v1/categories              — list all categories (public)
router.get(
  '/',
  getAllValidation,
  validate,
  categoryController.getAll
);

// GET /api/v1/categories/:id          — single category by _id or slug (public)
router.get(
  '/:id',
  categoryController.getById
);

// ─── Admin-only routes (auth required) ───────────────────────────────────────

// POST /api/v1/categories             — create category
router.post(
  '/',
  authenticate,
  authorize('admin'),
  createValidation,
  validate,
  categoryController.create
);

// PATCH /api/v1/categories/:id        — update category fields
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  mongoIdParam,
  updateValidation,
  validate,
  categoryController.update
);

// PATCH /api/v1/categories/:id/status — toggle active ↔ inactive
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  mongoIdParam,
  validate,
  categoryController.toggleStatus
);

// DELETE /api/v1/categories/:id       — delete category
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  mongoIdParam,
  validate,
  categoryController.remove
);

// POST /api/v1/categories/:id/image   — upload category image
router.post(
  '/:id/image',
  authenticate,
  authorize('admin'),
  mongoIdParam,
  validate,
  uploadCategoryImage,             // multer — must run before controller
  categoryController.uploadImage
);

// DELETE /api/v1/categories/:id/image — remove category image
router.delete(
  '/:id/image',
  authenticate,
  authorize('admin'),
  mongoIdParam,
  validate,
  categoryController.deleteImage
);

module.exports = router;
