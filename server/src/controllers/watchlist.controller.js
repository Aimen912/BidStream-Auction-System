'use strict';

const watchlistService = require('../services/watchlist.service');
const { sendSuccess } = require('../utils/apiResponse');

async function getWatchlist(req, res) {
  const result = await watchlistService.getWatchlist(req.user.id);
  return sendSuccess(res, result);
}

async function addToWatchlist(req, res) {
  const result = await watchlistService.addToWatchlist(req.user.id, req.params.auctionId);
  return sendSuccess(res, result, 201);
}

async function addToWatchlistByBody(req, res) {
  const result = await watchlistService.addToWatchlist(req.user.id, req.body.auctionId);
  return sendSuccess(res, result, 201);
}

async function removeFromWatchlist(req, res) {
  const result = await watchlistService.removeFromWatchlist(req.user.id, req.params.auctionId);
  return sendSuccess(res, result);
}

module.exports = {
  getWatchlist,
  addToWatchlist,
  addToWatchlistByBody,
  removeFromWatchlist,
};
