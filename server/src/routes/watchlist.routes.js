'use strict';

const { Router } = require('express');
const { param, body } = require('express-validator');

const watchlistController = require('../controllers/watchlist.controller');
const validate            = require('../middleware/validate');
const { authenticate }    = require('../middleware/authenticate');

const router = Router();

router.use(authenticate);

const auctionIdParam = [
  param('auctionId').isMongoId().withMessage('Invalid auction ID'),
];

const auctionIdBody = [
  body('auctionId').isMongoId().withMessage('auctionId is required and must be a valid ID'),
];

// ─── GET /api/v1/wishlist          — get current user's watchlist ─────────────
router.get('/', watchlistController.getWatchlist);

// ─── POST /api/v1/wishlist         — add to watchlist (body: { auctionId }) ───
// Spec-compliant: POST with body
router.post('/', auctionIdBody, validate, watchlistController.addToWatchlistByBody);

// ─── DELETE /api/v1/wishlist/:auctionId — remove from watchlist ───────────────
router.delete('/:auctionId', auctionIdParam, validate, watchlistController.removeFromWatchlist);

// ─── Legacy param-based add (kept for backward compat) ────────────────────────
router.post('/:auctionId', auctionIdParam, validate, watchlistController.addToWatchlist);

module.exports = router;
