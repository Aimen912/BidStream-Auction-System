'use strict';

const mongoose = require('mongoose');
const User     = require('../models/User');
const Auction  = require('../models/Auction');
const Bid      = require('../models/Bid');
const Category = require('../models/Category');

// ─── Buyer Dashboard ──────────────────────────────────────────────────────────

/**
 * GET /api/v1/dashboard/buyer
 * Returns personalised stats for a logged-in buyer.
 */
async function getBuyerDashboard(buyerId) {
  const id = new mongoose.Types.ObjectId(buyerId);

  const [
    totalBids,
    activeBids,
    wonAuctions,
    watchlistCount,
    recentBids,
    watchlistAuctions,
    bidSummary,
  ] = await Promise.all([
    // Total bids placed
    Bid.countDocuments({ bidder: id }),

    // Currently winning bids (live auctions)
    Bid.countDocuments({ bidder: id, status: 'winning' }),

    // Auctions won
    Bid.countDocuments({ bidder: id, status: 'won' }),

    // Watchlist size
    User.findById(id).select('watchlist').then((u) => (u?.watchlist?.length || 0)),

    // 5 most recent bids with auction details
    Bid.find({ bidder: id })
      .populate({
        path:   'auction',
        select: 'title status endTime currentBid images category',
        populate: { path: 'category', select: 'name icon' },
      })
      .sort({ createdAt: -1 })
      .limit(5),

    // Watchlist — first 6 auctions
    User.findById(id)
      .select('watchlist')
      .then((u) =>
        Auction.find({ _id: { $in: u?.watchlist || [] } })
          .populate('category', 'name icon')
          .select('title status endTime currentBid startingPrice images')
          .limit(6)
      ),

    // Spending summary
    Bid.aggregate([
      { $match: { bidder: id } },
      {
        $group: {
          _id:         null,
          totalSpent:  { $sum: { $cond: [{ $eq: ['$status', 'won'] }, '$amount', 0] } },
          highestBid:  { $max: '$amount' },
          totalBids:   { $sum: 1 },
        },
      },
    ]),
  ]);

  const summary = bidSummary[0] || { totalSpent: 0, highestBid: 0, totalBids: 0 };

  return {
    stats: {
      totalBids,
      activeBids,
      wonAuctions,
      watchlistCount,
      totalSpent:  summary.totalSpent,
      highestBid:  summary.highestBid,
    },
    recentBids,
    watchlistAuctions,
  };
}

// ─── Seller Dashboard ─────────────────────────────────────────────────────────

/**
 * GET /api/v1/dashboard/seller
 * Returns personalised stats for a logged-in seller.
 */
async function getSellerDashboard(sellerId) {
  const id = new mongoose.Types.ObjectId(sellerId);

  const [
    totalAuctions,
    liveAuctions,
    soldAuctions,
    draftAuctions,
    totalBidsReceived,
    recentAuctions,
    revenueSummary,
    topAuctions,
  ] = await Promise.all([
    Auction.countDocuments({ seller: id }),
    Auction.countDocuments({ seller: id, status: { $in: ['live', 'ending_soon'] } }),
    Auction.countDocuments({ seller: id, status: 'sold' }),
    Auction.countDocuments({ seller: id, status: 'draft' }),

    // Total bids received across all seller's auctions
    Auction.find({ seller: id }).select('_id').then((auctions) => {
      const ids = auctions.map((a) => a._id);
      return Bid.countDocuments({ auction: { $in: ids } });
    }),

    // 5 most recently created auctions
    Auction.find({ seller: id })
      .populate('category', 'name icon')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status endTime currentBid startingPrice bids images'),

    // Revenue from sold auctions
    Auction.aggregate([
      { $match: { seller: id, status: 'sold' } },
      {
        $group: {
          _id:          null,
          totalRevenue: { $sum: '$currentBid' },
          avgSalePrice: { $avg: '$currentBid' },
          soldCount:    { $sum: 1 },
        },
      },
    ]),

    // Top 3 auctions by bid count
    Auction.find({ seller: id })
      .sort({ bids: -1 })
      .limit(3)
      .select('title status bids currentBid images'),
  ]);

  const revenue = revenueSummary[0] || { totalRevenue: 0, avgSalePrice: 0, soldCount: 0 };

  return {
    stats: {
      totalAuctions,
      liveAuctions,
      soldAuctions,
      draftAuctions,
      totalBidsReceived,
      totalRevenue:  revenue.totalRevenue,
      avgSalePrice:  revenue.avgSalePrice,
    },
    recentAuctions,
    topAuctions,
  };
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

/**
 * GET /api/v1/dashboard/admin
 * Returns platform-wide summary for the admin dashboard.
 */
async function getAdminDashboard() {
  const now   = new Date();
  const ago7  = new Date(now - 7  * 24 * 60 * 60 * 1000);
  const ago30 = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalBuyers,
    totalSellers,
    activeUsers,
    totalAuctions,
    liveAuctions,
    totalBids,
    totalCategories,
    newUsersLast7,
    newAuctionsLast7,
    recentUsers,
    recentAuctions,
    usersByRole,
    auctionsByStatus,
    revenueData,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'buyer' }),
    User.countDocuments({ role: 'seller' }),
    User.countDocuments({ isActive: true }),
    Auction.countDocuments(),
    Auction.countDocuments({ status: { $in: ['live', 'ending_soon'] } }),
    Bid.countDocuments(),
    Category.countDocuments({ status: 'active' }),
    User.countDocuments({ createdAt: { $gte: ago7 } }),
    Auction.countDocuments({ createdAt: { $gte: ago7 } }),

    // 5 most recently registered users
    User.find()
      .select('name username email role avatar isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(5),

    // 5 most recently created auctions
    Auction.find()
      .populate('seller',   'name username')
      .populate('category', 'name icon')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status currentBid bids seller category createdAt'),

    // User breakdown by role
    User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),

    // Auction breakdown by status
    Auction.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    // Total revenue (sum of currentBid on sold auctions)
    Auction.aggregate([
      { $match: { status: 'sold' } },
      { $group: { _id: null, totalRevenue: { $sum: '$currentBid' }, count: { $sum: 1 } } },
    ]),
  ]);

  const revenue = revenueData[0] || { totalRevenue: 0, count: 0 };

  return {
    stats: {
      totalUsers,
      totalBuyers,
      totalSellers,
      activeUsers,
      totalAuctions,
      liveAuctions,
      totalBids,
      totalCategories,
      newUsersLast7,
      newAuctionsLast7,
      totalRevenue: revenue.totalRevenue,
      soldAuctions: revenue.count,
    },
    breakdown: {
      usersByRole,
      auctionsByStatus,
    },
    recentUsers,
    recentAuctions,
  };
}

module.exports = {
  getBuyerDashboard,
  getSellerDashboard,
  getAdminDashboard,
};
