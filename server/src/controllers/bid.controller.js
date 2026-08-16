'use strict';

const bidService = require('../services/bid.service');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * POST /api/v1/auctions/:auctionId/bids
 * Body: { amount }
 * Only buyers can call this. Seller / auction-owner guards are in the service.
 */
async function placeBid(req, res) {
  const bid = await bidService.placeBid(
    req.user.id,
    req.user.role,
    req.params.auctionId,
    Number(req.body.amount)
  );
  return sendSuccess(res, { bid }, 201);
}

/**
 * GET /api/v1/auctions/:auctionId/bids
 * Query: page, limit
 * Any authenticated user can view an auction's bid history.
 */
async function getAuctionBids(req, res) {
  const { page, limit } = req.query;
  const result = await bidService.getAuctionBids(req.params.auctionId, { page, limit });
  return sendSuccess(res, result);
}

/**
 * GET /api/v1/bids/my
 * Query: status, page, limit
 * Returns the authenticated buyer's personal bid history with summary stats.
 */
async function getMyBids(req, res) {
  const { status, page, limit } = req.query;
  const result = await bidService.getMyBids(req.user.id, { status, page, limit });
  return sendSuccess(res, result);
}

/**
 * GET /api/v1/bids/highest/:auctionId
 * Returns the current highest bid for an auction.
 */
async function getHighestBid(req, res) {
  const result = await bidService.getHighestBid(req.params.auctionId);
  return sendSuccess(res, result);
}

/**
 * DELETE /api/v1/bids/:id
 * Admin deletes any bid. Buyer deletes their own non-winning bid.
 */
async function removeBid(req, res) {
  const result = await bidService.removeBid(req.params.id, req.user.id, req.user.role);
  return sendSuccess(res, result);
}

module.exports = { placeBid, getAuctionBids, getMyBids, getHighestBid, removeBid };
