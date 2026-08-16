'use strict';

const dashboardService = require('../services/dashboard.service');
const { sendSuccess }  = require('../utils/apiResponse');

/**
 * GET /api/v1/dashboard/buyer
 * Returns personalised stats + recent bids + watchlist for the logged-in buyer.
 */
async function getBuyerDashboard(req, res) {
  const result = await dashboardService.getBuyerDashboard(req.user.id);
  return sendSuccess(res, result);
}

/**
 * GET /api/v1/dashboard/seller
 * Returns personalised stats + recent auctions for the logged-in seller.
 */
async function getSellerDashboard(req, res) {
  const result = await dashboardService.getSellerDashboard(req.user.id);
  return sendSuccess(res, result);
}

/**
 * GET /api/v1/dashboard/admin
 * Returns platform-wide stats + recent users + recent auctions for admin.
 */
async function getAdminDashboard(req, res) {
  const result = await dashboardService.getAdminDashboard();
  return sendSuccess(res, result);
}

module.exports = { getBuyerDashboard, getSellerDashboard, getAdminDashboard };
