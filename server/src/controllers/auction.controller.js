'use strict';

const auctionService = require('../services/auction.service');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/v1/auctions
 * Query: status, category, search, page, limit, sort
 * Any authenticated user (buyer, seller, admin).
 */
async function getAll(req, res) {
  const { status, category, search, page, limit, sort } = req.query;
  const result = await auctionService.getAll({ status, category, search, page, limit, sort });
  return sendSuccess(res, result);
}

/**
 * GET /api/v1/auctions/my
 * Seller's own auctions — all statuses including drafts.
 * Query: status, page, limit, sort
 */
async function getMyAuctions(req, res) {
  const { status, page, limit, sort } = req.query;
  const result = await auctionService.getMyAuctions(req.user.id, { status, page, limit, sort });
  return sendSuccess(res, result);
}

/**
 * GET /api/v1/auctions/:id
 * Single auction — any authenticated user.
 */
async function getById(req, res) {
  const auction = await auctionService.getById(req.params.id);
  return sendSuccess(res, { auction });
}

/**
 * POST /api/v1/auctions
 * Seller creates an auction.
 * Body: { title, description, category, startingPrice, minIncrement?,
 *         reservePrice?, condition, location?, shipping?, tags?,
 *         startTime, endTime, status? }
 */
async function create(req, res) {
  const auction = await auctionService.create(req.user.id, req.body);
  return sendSuccess(res, { auction }, 201);
}

/**
 * PATCH /api/v1/auctions/:id
 * Seller updates their own auction.
 * Body: any subset of create fields.
 */
async function update(req, res) {
  const auction = await auctionService.update(req.params.id, req.user.id, req.body);
  return sendSuccess(res, { auction });
}

/**
 * DELETE /api/v1/auctions/:id
 * Seller deletes their own auction (not allowed if live or sold).
 */
async function remove(req, res) {
  const result = await auctionService.remove(req.params.id, req.user.id);
  return sendSuccess(res, result);
}

/**
 * POST /api/v1/auctions/:id/images
 * Seller uploads images for their auction.
 * multipart/form-data, field name: images (up to 8 files).
 * uploadAuctionImages middleware populates req.files before this runs.
 */
async function uploadImages(req, res) {
  const replace = req.query.replace === 'true';
  const result = await auctionService.uploadImages(req.params.id, req.user.id, req.files, { replace });
  return sendSuccess(res, result);
}

/**
 * DELETE /api/v1/auctions/:id/images/:filename
 * Seller removes a single image by filename.
 */
async function removeImage(req, res) {
  const result = await auctionService.removeImage(
    req.params.id,
    req.user.id,
    req.params.filename
  );
  return sendSuccess(res, result);
}

/**
 * PATCH /api/v1/auctions/:id/start
 * Seller manually starts an upcoming auction.
 */
async function startAuction(req, res) {
  const auction = await auctionService.startAuction(req.params.id, req.user.id);
  return sendSuccess(res, { auction });
}

/**
 * PATCH /api/v1/auctions/:id/end
 * Seller or admin manually ends a live auction.
 */
async function endAuction(req, res) {
  const auction = await auctionService.endAuction(req.params.id, req.user.id, req.user.role);
  return sendSuccess(res, { auction });
}

/**
 * POST /api/v1/auctions/:id/buy-now
 * Buyer instantly purchases at buyNowPrice — closes auction immediately.
 */
async function buyNow(req, res) {
  const result = await auctionService.buyNow(req.params.id, req.user.id, req.user.role);
  return sendSuccess(res, result);
}

module.exports = {
  getAll,
  getMyAuctions,
  getById,
  create,
  update,
  remove,
  uploadImages,
  removeImage,
  startAuction,
  endAuction,
  buyNow,
};
