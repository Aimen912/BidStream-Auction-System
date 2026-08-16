'use strict';

const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const Category = require('../models/Category');

const {
  notifyAuctionApproved,
  notifyAuctionRejected,
  notifySystem,
} = require('../utils/notify');

function notFound(message) {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

function forbidden(message = 'Forbidden') {
  const error = new Error(message);
  error.statusCode = 403;
  return error;
}

function deleteImageFile(imagePath) {
  if (!imagePath) return;

  try {
    const absolutePath = path.join(__dirname, '../../', imagePath);
    if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
  } catch {
    // Non-fatal cleanup.
  }
}

function normalisePaging({ page = 1, limit = 20 } = {}) {
  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.min(100, Math.max(1, Number(limit) || 20));

  return {
    pageNumber,
    limitNumber,
    skip: (pageNumber - 1) * limitNumber,
  };
}

function escapeRegExp(value = '') {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getDashboardStats() {
  const [totalUsers, totalAuctions, totalBids] = await Promise.all([
    User.countDocuments(),
    Auction.countDocuments(),
    Bid.countDocuments(),
  ]);

  return {
    totalUsers,
    totalAuctions,
    totalBids,
  };
}

async function listUsers({ search = '', role = 'all', status = 'all', sort = 'newest', page = 1, limit = 20 } = {}) {
  const query = {};

  if (role && role !== 'all') {
    query.role = role;
  }

  if (status === 'active') {
    query.isActive = true;
  } else if (status === 'inactive') {
    query.isActive = false;
  }

  if (search && search.trim()) {
    const term = escapeRegExp(search.trim());
    query.$or = [
      { name: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
      { phone: { $regex: term, $options: 'i' } },
    ];
  }

  const { pageNumber, limitNumber, skip } = normalisePaging({ page, limit });
  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    name: { name: 1 },
    role: { role: 1 },
  };

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(limitNumber),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      pages: Math.ceil(total / limitNumber),
    },
  };
}

async function listAuctions({ search = '', status = 'all', approvalStatus = 'all', category = 'all', page = 1, limit = 20, sort = 'newest' } = {}) {
  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (category && category !== 'all') {
    query.category = category;
  }

  // Filter by approvalStatus if provided — for admin All tab we show approved + rejected
  // (pending auctions appear only in the Pending Review tab)
  if (approvalStatus && approvalStatus !== 'all') {
    query.approvalStatus = approvalStatus;
  } else {
    // Default: All Auctions tab shows approved and rejected (not pending)
    query.approvalStatus = { $in: ['approved', 'rejected'] };
  }

  if (search && search.trim()) {
    query.$or = [
      { title: { $regex: escapeRegExp(search.trim()), $options: 'i' } },
      { description: { $regex: escapeRegExp(search.trim()), $options: 'i' } },
    ];
  }

  const { pageNumber, limitNumber, skip } = normalisePaging({ page, limit });
  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    ending: { endTime: 1 },
    price_asc: { currentBid: 1, startingPrice: 1 },
    price_desc: { currentBid: -1, startingPrice: -1 },
    bids: { bids: -1 },
  };

  const [auctions, total] = await Promise.all([
    Auction.find(query)
      .populate('seller', 'name username email role')
      .populate('category', 'name slug icon gradient status')
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(limitNumber),
    Auction.countDocuments(query),
  ]);

  return {
    auctions,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      pages: Math.ceil(total / limitNumber),
    },
  };
}

async function removeUser(userId, currentUserId) {
  if (String(userId) === String(currentUserId)) {
    throw forbidden('You cannot delete your own admin account');
  }

  const user = await User.findById(userId);
  if (!user) throw notFound('User not found');

  await user.deleteOne();
  return { message: 'User deleted successfully' };
}

async function removeAuction(auctionId) {
  const auction = await Auction.findById(auctionId);
  if (!auction) throw notFound('Auction not found');

  (auction.images || []).forEach(deleteImageFile);

  if (auction.status !== 'draft') {
    await Category.findByIdAndUpdate(auction.category, { $inc: { auctionCount: -1 } });
  }

  await Bid.deleteMany({ auction: auctionId });
  await auction.deleteOne();

  return { message: 'Auction deleted successfully' };
}

async function removeCategory(categoryId) {
  const category = await Category.findById(categoryId);
  if (!category) throw notFound('Category not found');

  deleteImageFile(category.image);
  await category.deleteOne();

  return { message: 'Category deleted successfully' };
}

/**
 * PATCH /api/v1/admin/users/:id/status
 * Toggle a user's isActive flag.
 * Admin cannot deactivate their own account.
 */
async function updateUserStatus(userId, currentAdminId, { isActive }) {
  if (String(userId) === String(currentAdminId)) {
    throw forbidden('You cannot change your own account status');
  }

  const user = await User.findById(userId).select('-password');
  if (!user) throw notFound('User not found');

  user.isActive = Boolean(isActive);
  await user.save();

  return { user, message: `User ${user.isActive ? 'activated' : 'suspended'} successfully` };
}

/**
 * GET /api/v1/admin/reports
 * Returns a summary of reported content (auctions and users).
 * For FYP: returns recently created auctions as "reports" since a dedicated
 * Report model doesn't exist yet.
 */
async function getReports({ page = 1, limit = 20 } = {}) {
  const { pageNumber, limitNumber, skip } = normalisePaging({ page, limit });

  // Use recently ended/cancelled auctions as "flagged content" for FYP demo
  const [reports, total] = await Promise.all([
    Auction.find({ status: { $in: ['ended', 'cancelled', 'sold'] } })
      .populate('seller', 'name username email')
      .populate('category', 'name')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .select('title status currentBid bids seller category createdAt updatedAt'),
    Auction.countDocuments({ status: { $in: ['ended', 'cancelled', 'sold'] } }),
  ]);

  return {
    reports,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      pages: Math.ceil(total / limitNumber),
    },
  };
}

/**
 * GET /api/v1/admin/analytics
 * Returns platform-wide analytics data suitable for charts.
 */
async function getAnalytics() {
  const now  = new Date();
  const ago7  = new Date(now - 7  * 24 * 60 * 60 * 1000);
  const ago30 = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalAuctions,
    totalBids,
    totalCategories,
    activeAuctions,
    newUsersLast7,
    newUsersLast30,
    newAuctionsLast7,
    newAuctionsLast30,
    newBidsLast7,
    usersByRole,
    auctionsByStatus,
    topCategories,
  ] = await Promise.all([
    User.countDocuments(),
    Auction.countDocuments(),
    Bid.countDocuments(),
    Category.countDocuments({ status: 'active' }),
    Auction.countDocuments({ status: { $in: ['live', 'ending_soon'] } }),
    User.countDocuments({ createdAt: { $gte: ago7 } }),
    User.countDocuments({ createdAt: { $gte: ago30 } }),
    Auction.countDocuments({ createdAt: { $gte: ago7 } }),
    Auction.countDocuments({ createdAt: { $gte: ago30 } }),
    Bid.countDocuments({ createdAt: { $gte: ago7 } }),
    User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),
    Auction.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Category.aggregate([
      { $match: { status: 'active' } },
      { $sort: { auctionCount: -1 } },
      { $limit: 5 },
      { $project: { name: 1, auctionCount: 1, icon: 1 } },
    ]),
  ]);

  return {
    overview: {
      totalUsers,
      totalAuctions,
      totalBids,
      totalCategories,
      activeAuctions,
    },
    growth: {
      newUsersLast7,
      newUsersLast30,
      newAuctionsLast7,
      newAuctionsLast30,
      newBidsLast7,
    },
    breakdown: {
      usersByRole,
      auctionsByStatus,
      topCategories,
    },
  };
}

// exports are at bottom of file

/**
 * GET /api/v1/admin/auctions/pending
 * Returns all auctions with approvalStatus = 'pending'.
 */
async function listPendingAuctions({ page = 1, limit = 20 } = {}) {
  const { pageNumber, limitNumber, skip } = normalisePaging({ page, limit });

  const [auctions, total] = await Promise.all([
    Auction.find({ approvalStatus: 'pending' })
      .populate('seller',   'name username email avatar')
      .populate('category', 'name slug icon gradient')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),
    Auction.countDocuments({ approvalStatus: 'pending' }),
  ]);

  return {
    auctions,
    pagination: {
      total,
      page:  pageNumber,
      limit: limitNumber,
      pages: Math.ceil(total / limitNumber),
    },
  };
}

/**
 * PATCH /api/v1/admin/auctions/:id/approve
 * Admin approves a pending auction — it becomes visible to buyers.
 */
async function approveAuction(auctionId, adminId) {
  const auction = await Auction.findById(auctionId);
  if (!auction) throw notFound('Auction not found');

  auction.approvalStatus = 'approved';
  auction.approvedBy     = adminId;
  auction.approvedAt     = new Date();
  auction.adminRemark    = '';
  await auction.save();

  // Notify seller
  await notifyAuctionApproved(auction.seller, {
    auctionId:    auction._id,
    auctionTitle: auction.title,
  });

  // Notify all active buyers — new auction is now live
  const buyers = await User.find({ role: 'buyer', isActive: true }).select('_id').lean();
  await Promise.allSettled(
    buyers.map((b) =>
      notifySystem(b._id, {
        title:       'New auction available',
        description: `A new auction "${auction.title}" has been approved and is now available for bidding.`,
        link:        `/auctions/${auction._id}`,
      })
    )
  );

  return { message: 'Auction approved successfully', auction };
}

/**
 * PATCH /api/v1/admin/auctions/:id/reject
 * Admin rejects a pending auction with a reason.
 * Auction stays hidden from buyers.
 */
async function rejectAuction(auctionId, adminId, remark) {
  const auction = await Auction.findById(auctionId);
  if (!auction) throw notFound('Auction not found');

  auction.approvalStatus = 'rejected';
  auction.approvedBy     = adminId;
  auction.approvedAt     = new Date();
  auction.adminRemark    = remark || 'Rejected by admin.';
  await auction.save();

  // Notify seller
  await notifyAuctionRejected(auction.seller, {
    auctionId:    auction._id,
    auctionTitle: auction.title,
    remark:       auction.adminRemark,
  });

  return { message: 'Auction rejected', auction };
}

/**
 * PATCH /api/v1/admin/auctions/:id
 * Admin updates an auction's basic fields (title, status).
 */
async function updateAuction(auctionId, { title, status }) {
  const auction = await Auction.findById(auctionId);
  if (!auction) throw notFound('Auction not found');

  if (title  !== undefined) auction.title  = title;
  if (status !== undefined) auction.status = status;
  await auction.save();

  return { message: 'Auction updated successfully', auction };
}

module.exports = {
  getDashboardStats,
  listUsers,
  listAuctions,
  listPendingAuctions,
  removeUser,
  removeAuction,
  removeCategory,
  updateUserStatus,
  updateAuction,
  getReports,
  getAnalytics,
  approveAuction,
  rejectAuction,
};
