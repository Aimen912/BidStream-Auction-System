'use strict';

const { Router }                  = require('express');
const { body, param, query }      = require('express-validator');

const bidController               = require('../controllers/bid.controller');
const validate                    = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/authenticate');

const router = Router();

// ─── Validation chains ────────────────────────────────────────────────────────

const auctionIdParam = [
  param('auctionId')
    .isMongoId().withMessage('Invalid auction ID'),
];

const placeBidValidation = [
  body('amount')
    .notEmpty().withMessage('Bid amount is required')
    .isFloat({ min: 0.01 }).withMessage('Bid amount must be a positive number'),
];

const paginationQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

const myBidsQuery = [
  ...paginationQuery,
  query('status')
    .optional()
    .isIn(['all', 'winning', 'outbid', 'won', 'lost'])
    .withMessage('Status must be winning, outbid, won, or lost'),
];

// ─── Routes ──────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/auctions/:auctionId/bids
 * Place a bid — buyer only.
 */
router.post(
  '/auctions/:auctionId/bids',
  authenticate,
  authorize('buyer'),
  auctionIdParam,
  placeBidValidation,
  validate,
  bidController.placeBid
);

/**
 * GET /api/v1/auctions/:auctionId/bids
 * View bid history for an auction — any authenticated user.
 */
router.get(
  '/auctions/:auctionId/bids',
  authenticate,
  auctionIdParam,
  paginationQuery,
  validate,
  bidController.getAuctionBids
);

/**
 * GET /api/v1/bids/my
 * Buyer's personal bid history with summary stats.
 */
router.get(
  '/bids/my',
  authenticate,
  authorize('buyer'),
  myBidsQuery,
  validate,
  bidController.getMyBids
);

/**
 * GET /api/v1/bids/highest/:auctionId
 * Returns the current highest bid for an auction.
 * Any authenticated user can view this.
 */
router.get(
  '/bids/highest/:auctionId',
  authenticate,
  auctionIdParam,
  validate,
  bidController.getHighestBid
);

/**
 * DELETE /api/v1/bids/:id
 * Admin deletes any bid. Buyer can delete their own non-winning bid.
 */
router.delete(
  '/bids/:id',
  authenticate,
  [param('id').isMongoId().withMessage('Invalid bid ID')],
  validate,
  bidController.removeBid
);

module.exports = router;
