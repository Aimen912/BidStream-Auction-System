'use strict';

const { Router }                      = require('express');
const { body, param, query }          = require('express-validator');

const auctionController               = require('../controllers/auction.controller');
const validate                        = require('../middleware/validate');
const { authenticate, authorize }     = require('../middleware/authenticate');
const { uploadAuctionImages }         = require('../middleware/upload');

const router = Router();

// ─── Validation helpers ───────────────────────────────────────────────────────

const mongoId = (field) =>
  param(field).isMongoId().withMessage(`Invalid ${field}`);

// ─── Query validation — shared by getAll and getMyAuctions ───────────────────

const listQueryValidation = [
  query('status')
    .optional()
    .isIn(['all', 'draft', 'upcoming', 'live', 'ending_soon', 'ended', 'sold', 'cancelled'])
    .withMessage('Invalid status filter'),

  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'ending', 'price_asc', 'price_desc', 'bids'])
    .withMessage('Invalid sort option'),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),
];

// ─── Body validation — create ─────────────────────────────────────────────────

const createValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),

  body('startingPrice')
    .notEmpty().withMessage('Starting price is required')
    .isFloat({ min: 0 }).withMessage('Starting price must be a non-negative number'),

  body('minIncrement')
    .optional()
    .isFloat({ min: 1 }).withMessage('Minimum increment must be at least 1'),

  body('reservePrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Reserve price must be a non-negative number'),

  body('buyNowPrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Buy Now price must be a non-negative number'),

  body('condition')
    .notEmpty().withMessage('Condition is required')
    .isIn(['New', 'Like New', 'Excellent', 'Good', 'Fair'])
    .withMessage('Condition must be New, Like New, Excellent, Good, or Fair'),

  body('location')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),

  body('shipping')
    .optional()
    .isIn(['Worldwide', 'Domestic', 'Local Only', 'No Shipping'])
    .withMessage('Invalid shipping option'),

  body('tags')
    .optional()
    .custom((val) => {
      if (Array.isArray(val) || typeof val === 'string') return true;
      throw new Error('Tags must be an array or comma-separated string');
    }),

  body('startTime')
    .notEmpty().withMessage('Start time is required')
    .isISO8601().withMessage('Start time must be a valid ISO 8601 date'),

  body('endTime')
    .notEmpty().withMessage('End time is required')
    .isISO8601().withMessage('End time must be a valid ISO 8601 date')
    .custom((endTime, { req }) => {
      if (new Date(endTime) <= new Date(req.body.startTime)) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(['draft', 'upcoming'])
    .withMessage('Status on create must be draft or upcoming'),
];

// ─── Body validation — update (all fields optional) ──────────────────────────

const updateValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be blank')
    .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be blank')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),

  body('startingPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Starting price must be a non-negative number'),

  body('minIncrement')
    .optional()
    .isFloat({ min: 1 }).withMessage('Minimum increment must be at least 1'),

  body('reservePrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Reserve price must be a non-negative number'),

  body('buyNowPrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Buy Now price must be a non-negative number'),

  body('condition')
    .optional()
    .isIn(['New', 'Like New', 'Excellent', 'Good', 'Fair'])
    .withMessage('Condition must be New, Like New, Excellent, Good, or Fair'),

  body('location')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),

  body('shipping')
    .optional()
    .isIn(['Worldwide', 'Domestic', 'Local Only', 'No Shipping'])
    .withMessage('Invalid shipping option'),

  body('tags')
    .optional()
    .custom((val) => {
      if (Array.isArray(val) || typeof val === 'string') return true;
      throw new Error('Tags must be an array or comma-separated string');
    }),

  body('startTime')
    .optional()
    .isISO8601().withMessage('Start time must be a valid ISO 8601 date'),

  body('endTime')
    .optional()
    .isISO8601().withMessage('End time must be a valid ISO 8601 date'),

  body('status')
    .optional()
    .isIn(['draft', 'upcoming', 'cancelled'])
    .withMessage('Status update must be draft, upcoming, or cancelled'),
];

// ─── Routes ──────────────────────────────────────────────────────────────────

// ── Public routes (no auth required) ─────────────────────────────────────────

// GET /api/v1/auctions              — browse all public auctions
router.get(
  '/',
  listQueryValidation,
  validate,
  auctionController.getAll
);

// ── Seller — own auctions (auth required) ─────────────────────────────────────

// GET  /api/v1/auctions/my         — seller views their own auctions
// IMPORTANT: /my must be registered BEFORE /:id to avoid Express matching 'my' as an ID
router.get(
  '/my',
  authenticate,
  authorize('seller'),
  listQueryValidation,
  validate,
  auctionController.getMyAuctions
);

// GET /api/v1/auctions/:id          — view single auction detail (public)
router.get(
  '/:id',
  [mongoId('id')],
  validate,
  auctionController.getById
);

// POST /api/v1/auctions             — seller creates an auction
router.post(
  '/',
  authenticate,
  authorize('seller'),
  createValidation,
  validate,
  auctionController.create
);

// PATCH /api/v1/auctions/:id        — seller updates their auction
router.patch(
  '/:id',
  authenticate,
  authorize('seller'),
  [mongoId('id'), ...updateValidation],
  validate,
  auctionController.update
);

// PUT /api/v1/auctions/:id          — same as PATCH (spec alias)
router.put(
  '/:id',
  authenticate,
  authorize('seller'),
  [mongoId('id'), ...updateValidation],
  validate,
  auctionController.update
);

// PATCH /api/v1/auctions/:id/start  — seller manually starts an upcoming auction
router.patch(
  '/:id/start',
  authenticate,
  authorize('seller'),
  [mongoId('id')],
  validate,
  auctionController.startAuction
);

// PATCH /api/v1/auctions/:id/end    — seller or admin manually ends a live auction
router.patch(
  '/:id/end',
  authenticate,
  authorize('seller', 'admin'),
  [mongoId('id')],
  validate,
  auctionController.endAuction
);

// POST /api/v1/auctions/:id/buy-now  — buyer purchases instantly at buyNowPrice
router.post(
  '/:id/buy-now',
  authenticate,
  authorize('buyer'),
  [mongoId('id')],
  validate,
  auctionController.buyNow
);

// DELETE /api/v1/auctions/:id       — seller deletes their auction
router.delete(
  '/:id',
  authenticate,
  authorize('seller'),
  [mongoId('id')],
  validate,
  auctionController.remove
);

// POST /api/v1/auctions/:id/images  — seller uploads images
router.post(
  '/:id/images',
  authenticate,
  authorize('seller'),
  [mongoId('id')],
  validate,
  uploadAuctionImages,              // multer — must run before controller
  auctionController.uploadImages
);

// DELETE /api/v1/auctions/:id/images/:filename  — seller removes one image
router.delete(
  '/:id/images/:filename',
  authenticate,
  authorize('seller'),
  [mongoId('id')],
  validate,
  auctionController.removeImage
);

module.exports = router;
