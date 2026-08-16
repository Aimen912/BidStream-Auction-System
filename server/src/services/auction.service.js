'use strict';

const fs       = require('fs');
const path     = require('path');
const Auction  = require('../models/Auction');
const Category = require('../models/Category');
const User     = require('../models/User');
const {
  notifyAuctionSubmitted,
  notifyAuctionApproved,
  notifyAuctionRejected,
  notifyAuctionSold,
  notifyAuctionWon,
  notifyAuctionLost,
  notifyAdminNewAuction,
} = require('../utils/notify');

function notFound(msg = 'Auction not found') {
  const err = new Error(msg);
  err.statusCode = 404;
  return err;
}

function forbidden(msg = 'Forbidden') {
  const err = new Error(msg);
  err.statusCode = 403;
  return err;
}

function badRequest(msg) {
  const err = new Error(msg);
  err.statusCode = 400;
  return err;
}

// ─── Disk helpers ─────────────────────────────────────────────────────────────

function deleteImageFile(imagePath) {
  if (!imagePath) return;
  try {
    const abs = path.join(__dirname, '../../', imagePath);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch {
    // non-fatal
  }
}

function deleteAllImages(images = []) {
  images.forEach(deleteImageFile);
}

// ─── Status sync ─────────────────────────────────────────────────────────────

/**
 * Recomputes and persists the derived status of an auction.
 * Call this when returning an auction so the client always sees
 * an up-to-date status without a separate cron job.
 */
async function syncStatus(auction) {
  const computed = auction.getComputedStatus();
  if (computed !== auction.status) {
    const wasLive = ['live', 'ending_soon'].includes(auction.status);
    auction.status = computed;
    await auction.save();

    // If auction just transitioned to ended and has a winner — auto-create order
    if (computed === 'ended' && wasLive && auction.currentBid > 0 && auction.highestBidder) {
      try {
        const { createOrder } = require('./order.service');
        const winnerId = auction.highestBidder._id || auction.highestBidder;
        await createOrder(auction._id, winnerId, auction.seller, auction.currentBid);
      } catch { /* non-fatal */ }
    }
  }
  return auction;
}

// ─── Category counter helpers ─────────────────────────────────────────────────

async function incrementCategoryCount(categoryId) {
  await Category.findByIdAndUpdate(categoryId, { $inc: { auctionCount: 1 } });
}

async function decrementCategoryCount(categoryId) {
  await Category.findByIdAndUpdate(categoryId, {
    $inc: { auctionCount: -1 },
    // clamp at 0 with a second op via $max isn't needed — keep simple
  });
}

// ─── Populate helper ─────────────────────────────────────────────────────────

const SELLER_FIELDS   = 'name username avatar';
const CATEGORY_FIELDS = 'name slug icon gradient';
const APPROVAL_FIELDS = 'approvalStatus adminRemark approvedBy approvedAt';

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * GET /api/v1/auctions
 * Public listing — buyers see all non-draft, non-cancelled auctions.
 * Supports filtering by status, category, search (text), and pagination.
 */
async function getAll({
  status,
  category,
  search,
  page    = 1,
  limit   = 12,
  sort    = 'newest',
} = {}) {
  const filter = {
    status:         { $nin: ['draft', 'cancelled'] },
    approvalStatus: 'approved',   // buyers only see admin-approved auctions
  };

  if (status && status !== 'all') filter.status = status;
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const sortMap = {
    newest:     { createdAt: -1 },
    oldest:     { createdAt:  1 },
    ending:     { endTime:    1 },
    price_asc:  { startingPrice: 1 },
    price_desc: { startingPrice: -1 },
    bids:       { bids: -1 },
  };

  const skip  = (Math.max(1, page) - 1) * limit;
  const total = await Auction.countDocuments(filter);

  const auctions = await Auction.find(filter)
    .populate('seller',   SELLER_FIELDS)
    .populate('category', CATEGORY_FIELDS)
    .sort(sortMap[sort] || { createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Sync status on each returned auction
  for (const a of auctions) {
    await syncStatus(a);
  }

  return {
    auctions,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * GET /api/v1/auctions/:id
 * Single auction — visible to any authenticated user.
 */
async function getById(id) {
  const auction = await Auction.findById(id)
    .populate('seller',      SELLER_FIELDS)
    .populate('category',    CATEGORY_FIELDS)
    .populate('highestBidder', 'name username avatar');

  if (!auction) throw notFound();
  await syncStatus(auction);
  return auction;
}

/**
 * GET /api/v1/auctions/my
 * Seller's own auctions — all statuses including drafts.
 */
async function getMyAuctions(sellerId, { status, page = 1, limit = 12, sort = 'newest' } = {}) {
  const filter = { seller: sellerId };
  if (status && status !== 'all') filter.status = status;

  const sortMap = {
    newest:  { createdAt: -1 },
    oldest:  { createdAt:  1 },
    ending:  { endTime:    1 },
  };

  const skip  = (Math.max(1, page) - 1) * limit;
  const total = await Auction.countDocuments(filter);

  const auctions = await Auction.find(filter)
    .populate('category', CATEGORY_FIELDS)
    .sort(sortMap[sort] || { createdAt: -1 })
    .skip(skip)
    .limit(limit);

  for (const a of auctions) {
    await syncStatus(a);
  }

  return {
    auctions,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * POST /api/v1/auctions
 * Seller creates an auction.
 * status is set automatically based on startTime:
 *   - startTime in the future → 'upcoming'
 *   - startTime now or past   → 'live'
 *   - 'draft' if explicitly requested
 */
async function create(sellerId, {
  title, description, category, startingPrice, minIncrement,
  reservePrice, buyNowPrice, condition, location, shipping, tags,
  startTime, endTime, status,
}) {
  // Verify the category exists
  const cat = await Category.findById(category);
  if (!cat) throw notFound('Category not found');

  if (endTime <= startTime) {
    throw badRequest('End time must be after start time');
  }

  // Normalise tags — accept array or comma-separated string
  const normalisedTags = normaliseTags(tags);

  // Auto-derive status unless seller explicitly wants a draft
  const assignedStatus = status === 'draft'
    ? 'draft'
    : new Date(startTime) <= new Date() ? 'live' : 'upcoming';

  // Validate buyNowPrice > startingPrice if provided
  if (buyNowPrice != null && buyNowPrice <= startingPrice) {
    throw badRequest('Buy Now price must be greater than the starting price');
  }

  const auction = await Auction.create({
    title,
    description,
    seller:         sellerId,
    category,
    startingPrice,
    minIncrement:   minIncrement  || 1,
    reservePrice:   reservePrice  || 0,
    buyNowPrice:    buyNowPrice   || null,
    condition,
    location:       location      || null,
    shipping:       shipping      || 'Domestic',
    tags:           normalisedTags,
    startTime:      new Date(startTime),
    endTime:        new Date(endTime),
    status:         assignedStatus,
    approvalStatus: 'pending',
    adminRemark:    '',
  });

  // Increment category counter (only for non-draft auctions)
  if (assignedStatus !== 'draft') {
    await incrementCategoryCount(category);
  }

  // Notify seller that auction is submitted for review
  await notifyAuctionSubmitted(sellerId, { auctionId: auction._id, auctionTitle: title });

  // Notify all admins about new pending auction
  const admins = await User.find({ role: 'admin', isActive: true }).select('_id').lean();
  const seller = await User.findById(sellerId).select('name').lean();
  await Promise.allSettled(
    admins.map((admin) =>
      notifyAdminNewAuction(admin._id, {
        auctionId:    auction._id,
        auctionTitle: title,
        sellerName:   seller?.name || 'A seller',
      })
    )
  );

  return auction.populate('category', CATEGORY_FIELDS);
}

/**
 * PATCH /api/v1/auctions/:id
 * Seller updates their own auction.
 * Live auctions may only update description, location, and shipping.
 */
async function update(id, sellerId, fields) {
  const auction = await Auction.findById(id);
  if (!auction) throw notFound();
  if (auction.seller.toString() !== sellerId) throw forbidden('You do not own this auction');

  // ── Permission: locked once auction has started ──────────────────────────
  const STARTED_STATUSES = ['live', 'ending_soon', 'ended', 'sold', 'cancelled'];
  if (STARTED_STATUSES.includes(auction.status)) {
    throw forbidden(`Cannot edit a ${auction.status} auction`);
  }

  // ── If approved + upcoming: reset to pending + notify admin ─────────────
  const wasApproved = auction.approvalStatus === 'approved';
  if (wasApproved) {
    auction.approvalStatus = 'pending';
    auction.adminRemark    = '';

    // Notify all admins that an approved auction was modified
    try {
      const User = require('../models/User');
      const { notifyAdminNewAuction } = require('../utils/notify');
      const admins = await User.find({ role: 'admin', isActive: true }).select('_id').lean();
      const seller = await User.findById(sellerId).select('name').lean();
      await Promise.allSettled(
        admins.map((admin) =>
          notifyAdminNewAuction(admin._id, {
            auctionId:    auction._id,
            auctionTitle: auction.title,
            sellerName:   `${seller?.name || 'A seller'} (edited — re-review required)`,
          })
        )
      );
    } catch { /* non-fatal */ }

    // Emit socket so admin dashboard updates instantly
    try {
      const app = require('../app');
      const io  = app.get ? app.get('io') : null;
      if (io) {
        io.emit('auction_resubmitted', {
          auctionId: String(auction._id),
          title:     auction.title,
        });
      }
    } catch { /* non-fatal */ }
  }

  const {
    title, description, category, startingPrice, minIncrement,
    reservePrice, buyNowPrice, condition, location, shipping, tags,
    startTime, endTime, status,
  } = fields;

  const isLive   = ['live', 'ending_soon'].includes(auction.status);
  const isEnded  = ['ended', 'sold', 'cancelled'].includes(auction.status);

  if (isEnded) {
    // Ended/sold — allow editing all fields (no active bidders to protect)
    if (title          !== undefined) auction.title         = title;
    if (description    !== undefined) auction.description   = description;
    if (startingPrice  !== undefined) auction.startingPrice = startingPrice;
    if (minIncrement   !== undefined) auction.minIncrement  = minIncrement;
    if (reservePrice   !== undefined) auction.reservePrice  = reservePrice;
    if (buyNowPrice    !== undefined) auction.buyNowPrice   = buyNowPrice || null;
    if (condition      !== undefined) auction.condition     = condition;
    if (location       !== undefined) auction.location      = location;
    if (shipping       !== undefined) auction.shipping      = shipping;
    if (tags           !== undefined) auction.tags          = normaliseTags(tags);

    // Category change for ended auction
    if (category !== undefined && category !== auction.category?.toString()) {
      const cat = await Category.findById(category);
      if (!cat) throw notFound('Category not found');
      auction.category = category;
    }
  } else if (isLive) {
    // Restricted edits only
    if (description !== undefined) auction.description = description;
    if (location    !== undefined) auction.location    = location;
    if (shipping    !== undefined) auction.shipping    = shipping;
  } else {
    // Full edits allowed on draft / upcoming
    if (title          !== undefined) auction.title         = title;
    if (description    !== undefined) auction.description   = description;
    if (startingPrice  !== undefined) auction.startingPrice = startingPrice;
    if (minIncrement   !== undefined) auction.minIncrement  = minIncrement;
    if (reservePrice   !== undefined) auction.reservePrice  = reservePrice;
    if (buyNowPrice    !== undefined) auction.buyNowPrice   = buyNowPrice || null;
    if (condition      !== undefined) auction.condition     = condition;
    if (location       !== undefined) auction.location      = location;
    if (shipping       !== undefined) auction.shipping      = shipping;
    if (tags           !== undefined) auction.tags          = normaliseTags(tags);

    // Category change — update counters
    if (category !== undefined && category !== auction.category.toString()) {
      const cat = await Category.findById(category);
      if (!cat) throw notFound('Category not found');

      if (auction.status !== 'draft') {
        await decrementCategoryCount(auction.category);
        await incrementCategoryCount(category);
      }
      auction.category = category;
    }

    // Schedule change — only update if fields are present AND actually different
    // This prevents overwriting original times when seller only edits title/description/etc.
    if (startTime !== undefined && startTime !== null) {
      const newStart = new Date(startTime);
      const curStart = new Date(auction.startTime);
      // Compare ISO strings truncated to minute to ignore sub-second differences
      if (newStart.toISOString().slice(0, 16) !== curStart.toISOString().slice(0, 16)) {
        auction.startTime = newStart;
      }
    }
    if (endTime !== undefined && endTime !== null) {
      const newEnd = new Date(endTime);
      const curEnd = new Date(auction.endTime);
      if (newEnd.toISOString().slice(0, 16) !== curEnd.toISOString().slice(0, 16)) {
        auction.endTime = newEnd;
      }
    }

    // Validate ordering only if at least one was actually changed
    if (auction.startTime >= auction.endTime) {
      throw badRequest('End time must be after start time');
    }

    // Allow manual draft → upcoming/live transition
    if (status !== undefined && ['draft', 'upcoming', 'cancelled'].includes(status)) {
      // draft was a non-published state; publishing it increments the counter
      if (auction.status === 'draft' && status !== 'draft') {
        await incrementCategoryCount(auction.category);
      }
      if (auction.status !== 'draft' && status === 'draft') {
        await decrementCategoryCount(auction.category);
      }
      auction.status = status;
    }
  }

  await auction.save();
  await syncStatus(auction);
  return auction.populate('category', CATEGORY_FIELDS);
}

/**
 * DELETE /api/v1/auctions/:id
 * Seller deletes their own auction.
 * Cannot delete live or sold auctions.
 */
async function remove(id, sellerId) {
  const auction = await Auction.findById(id);
  if (!auction) throw notFound();
  if (auction.seller.toString() !== sellerId) throw forbidden('You do not own this auction');

  // ── Permission: locked once auction has started ──────────────────────────
  if (['live', 'ending_soon', 'sold'].includes(auction.status)) {
    throw badRequest('Cannot delete a live or sold auction');
  }

  // ── If approved + upcoming: notify admin of deletion ────────────────────
  if (auction.approvalStatus === 'approved' && auction.status === 'upcoming') {
    try {
      const User = require('../models/User');
      const { notifySystem } = require('../utils/notify');
      const admins = await User.find({ role: 'admin', isActive: true }).select('_id').lean();
      const seller = await User.findById(sellerId).select('name').lean();
      await Promise.allSettled(
        admins.map((admin) =>
          notifySystem(admin._id, {
            title:       '🗑️ Approved auction deleted',
            description: `${seller?.name || 'A seller'} deleted the approved auction "${auction.title}" before it started.`,
            link:        '/admin/auctions',
          })
        )
      );
    } catch { /* non-fatal */ }
  }

  // Clean up images from disk
  deleteAllImages(auction.images);

  // Decrement category counter for non-draft auctions
  if (auction.status !== 'draft') {
    await decrementCategoryCount(auction.category);
  }

  await auction.deleteOne();
  return { message: 'Auction deleted successfully' };
}

/**
 * POST /api/v1/auctions/:id/images
 * Seller uploads images for their auction.
 * If replace=true in query → old images deleted and replaced.
 * Otherwise appends (total capped at 8).
 */
async function uploadImages(id, sellerId, files, { replace = false } = {}) {
  if (!files || files.length === 0) {
    throw badRequest('No image files provided');
  }

  const auction = await Auction.findById(id);
  if (!auction) throw notFound();
  if (auction.seller.toString() !== sellerId) throw forbidden('You do not own this auction');

  if (replace) {
    // Delete old images from disk then replace
    deleteAllImages(auction.images);
    const newPaths = files.map((f) => `/uploads/auctions/${f.filename}`);
    auction.images = newPaths;
    await auction.save();
    return { images: auction.images };
  }

  // Append mode — cap at 8
  const totalAfter = auction.images.length + files.length;
  if (totalAfter > 8) {
    files.forEach((f) => deleteImageFile(`/uploads/auctions/${f.filename}`));
    throw badRequest(`Adding ${files.length} image(s) would exceed the 8-image limit (currently have ${auction.images.length})`);
  }

  const newPaths = files.map((f) => `/uploads/auctions/${f.filename}`);
  auction.images.push(...newPaths);
  await auction.save();

  return { images: auction.images };
}

/**
 * DELETE /api/v1/auctions/:id/images/:filename
 * Seller removes a single image from their auction.
 */
async function removeImage(id, sellerId, filename) {
  const auction = await Auction.findById(id);
  if (!auction) throw notFound();
  if (auction.seller.toString() !== sellerId) throw forbidden('You do not own this auction');

  const imagePath = `/uploads/auctions/${filename}`;
  const idx = auction.images.indexOf(imagePath);
  if (idx === -1) throw notFound('Image not found on this auction');

  deleteImageFile(imagePath);
  auction.images.splice(idx, 1);
  await auction.save();

  return { images: auction.images };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function normaliseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
  if (typeof tags === 'string') {
    return tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
  }
  return [];
}

/**
 * PATCH /api/v1/auctions/:id/start
 * Seller manually starts an upcoming auction (sets status to 'live').
 * Can only be done if the auction is in 'upcoming' state.
 */
async function startAuction(id, sellerId) {
  const auction = await Auction.findById(id);
  if (!auction) throw notFound();
  if (auction.seller.toString() !== sellerId) throw forbidden('You do not own this auction');

  if (auction.status !== 'upcoming') {
    throw badRequest(`Cannot start a ${auction.status} auction`);
  }

  auction.status = 'live';
  await auction.save();

  // Notify all room participants + broadcast globally
  try {
    const app = require('../app');
    const io  = app.get ? app.get('io') : null;
    if (io) {
      const { getRoomKey } = require('../socket/auction.socket');
      const room = `auction_${id}`;
      io.to(room).emit('auction_started', { auctionId: String(id), title: auction.title });
      io.emit('auction_went_live',         { auctionId: String(id), title: auction.title });
    }
  } catch { /* non-fatal */ }

  return auction.populate('category', CATEGORY_FIELDS);
}

/**
 * PATCH /api/v1/auctions/:id/end
 * Seller or admin manually ends a live auction (sets status to 'ended' or 'sold').
 * Marks the highest bidder's bid as 'won', all others as 'lost'.
 */
async function endAuction(id, userId, userRole) {
  const Bid = require('../models/Bid');
  const { notifyAuctionWon, notifyAuctionLost } = require('../utils/notify');

  const auction = await Auction.findById(id)
    .populate('highestBidder', 'name username');
  if (!auction) throw notFound();

  // Only seller who owns it, or admin
  if (userRole !== 'admin' && auction.seller.toString() !== userId) {
    throw forbidden('You do not own this auction');
  }

  if (!['live', 'ending_soon'].includes(auction.status)) {
    throw badRequest(`Cannot end an auction with status: ${auction.status}`);
  }

  const hasBids = auction.currentBid > 0 && auction.highestBidder;
  auction.status  = hasBids ? 'sold' : 'ended';
  auction.endTime = new Date();
  await auction.save();

  if (hasBids) {
    // Mark highest bid as won
    await Bid.updateMany(
      { auction: id, status: 'winning' },
      { $set: { status: 'won' } }
    );
    // Mark all other bids as lost
    await Bid.updateMany(
      { auction: id, status: { $in: ['outbid'] } },
      { $set: { status: 'lost' } }
    );

    // Notify winner
    await notifyAuctionWon(auction.highestBidder._id, {
      auctionId:    auction._id,
      auctionTitle: auction.title,
      winningBid:   auction.currentBid,
    });

    // Notify all unique losers
    const losingBids = await Bid.find({ auction: id, status: 'lost' })
      .distinct('bidder');

    await Promise.allSettled(
      losingBids
        .filter((bidderId) => bidderId.toString() !== auction.highestBidder._id.toString())
        .map((bidderId) =>
          notifyAuctionLost(bidderId, {
            auctionId:    auction._id,
            auctionTitle: auction.title,
            winningBid:   auction.currentBid,
          })
        )
    );

    // Notify seller — auction sold
    await notifyAuctionSold(auction.seller, {
      auctionId:    auction._id,
      auctionTitle: auction.title,
      amount:       auction.currentBid,
    });

    // Auto-create order for the winner
    try {
      const { createOrder } = require('./order.service');
      // highestBidder is stored as ObjectId — use directly
      const winnerId = auction.highestBidder._id || auction.highestBidder;
      await createOrder(auction._id, winnerId, auction.seller, auction.currentBid);
    } catch (e) {
      try { require('../utils/logger').warn('[order] create failed: ' + e.message); } catch { /* */ }
    }

    // Emit auction_ended to all room participants
    try {
      const app = require('../app');
      const io  = app.get ? app.get('io') : null;
      if (io) {
        const { emitAuctionEnded } = require('../socket/auction.socket');
        emitAuctionEnded(io, id, {
          auctionId:     id,
          status:        'ended',
          winningBid:    auction.currentBid,
          winnerName:    auction.highestBidder?.name || 'A buyer',
          winnerId:      auction.highestBidder?._id || auction.highestBidder,
        });
      }
    } catch { /* non-fatal */ }
  }

  return auction;
}

/**
 * POST /api/v1/auctions/:id/buy-now
 * Buyer instantly purchases the auction at buyNowPrice.
 * Closes the auction immediately (status → 'sold').
 */
async function buyNow(auctionId, buyerId, buyerRole) {
  const Bid = require('../models/Bid');
  const { notifyAuctionWon, notifyAuctionLost } = require('../utils/notify');

  const auction = await Auction.findById(auctionId)
    .populate('seller', 'name username');
  if (!auction) throw notFound();

  // Only buyers can use Buy Now
  if (buyerRole !== 'buyer') throw forbidden('Only buyers can use Buy Now');

  // Cannot buy own auction
  if (auction.seller._id.toString() === buyerId) {
    throw forbidden('You cannot buy your own auction');
  }

  // Auction must be live
  const computed = auction.getComputedStatus();
  if (!['live', 'ending_soon'].includes(computed)) {
    throw badRequest('Buy Now is only available on live auctions');
  }

  // Must have a buyNowPrice set
  if (!auction.buyNowPrice || auction.buyNowPrice <= 0) {
    throw badRequest('This auction does not have a Buy Now price');
  }

  // Mark all existing winning bids as outbid first
  const previousWinners = await Bid.find({ auction: auctionId, status: 'winning' })
    .populate('bidder', 'name username');
  await Bid.updateMany({ auction: auctionId, status: 'winning' }, { $set: { status: 'outbid' } });

  // Create the winning Buy Now bid
  const bid = await Bid.create({
    auction: auctionId,
    bidder:  buyerId,
    amount:  auction.buyNowPrice,
    status:  'won',
    isBuyNow: true,
  });

  // Close the auction
  auction.status        = 'sold';
  auction.currentBid    = auction.buyNowPrice;
  auction.highestBidder = buyerId;
  auction.bids          = (auction.bids || 0) + 1;
  auction.endTime       = new Date();
  await auction.save();

  // Mark all outbid bids as lost
  await Bid.updateMany(
    { auction: auctionId, status: 'outbid' },
    { $set: { status: 'lost' } }
  );

  // Notify winner
  await notifyAuctionWon(buyerId, {
    auctionId:    auction._id,
    auctionTitle: auction.title,
    winningBid:   auction.buyNowPrice,
  });

  // Notify losers
  const losingBidders = await Bid.find({ auction: auctionId, status: 'lost' }).distinct('bidder');
  await Promise.allSettled(
    losingBidders
      .filter((id) => id.toString() !== buyerId)
      .map((id) =>
        notifyAuctionLost(id, {
          auctionId:    auction._id,
          auctionTitle: auction.title,
          winningBid:   auction.buyNowPrice,
        })
      )
  );

  // Auto-create order for Buy Now winner
  try {
    const { createOrder } = require('./order.service');
    await createOrder(auction._id, buyerId, auction.seller._id, auction.buyNowPrice);
  } catch { /* non-fatal */ }

  // Emit auction_ended to room
  try {
    const app = require('../app');
    const io  = app.get ? app.get('io') : null;
    if (io) {
      const { emitAuctionEnded } = require('../socket/auction.socket');
      emitAuctionEnded(io, auctionId, {
        auctionId,
        status:    'sold',
        winningBid: auction.buyNowPrice,
        winnerId:   buyerId,
      });
    }
  } catch { /* non-fatal */ }

  return { auction, bid };
}

// Add startAuction and endAuction to exports
module.exports = {
  getAll,
  getById,
  getMyAuctions,
  create,
  update,
  remove,
  uploadImages,
  removeImage,
  startAuction,
  endAuction,
  buyNow,
};
