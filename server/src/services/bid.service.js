'use strict';

const mongoose = require('mongoose');
const Bid      = require('../models/Bid');
const Auction  = require('../models/Auction');
const { notifyOutbid, notifyBidPlaced, notifyNewBid } = require('../utils/notify');

// ─── Error helpers ────────────────────────────────────────────────────────────

function notFound(msg = 'Auction not found') {
  const err = new Error(msg);
  err.statusCode = 404;
  return err;
}

function forbidden(msg) {
  const err = new Error(msg);
  err.statusCode = 403;
  return err;
}

function badRequest(msg) {
  const err = new Error(msg);
  err.statusCode = 400;
  return err;
}

// ─── Populate fields ──────────────────────────────────────────────────────────

const BIDDER_FIELDS  = 'name username avatar';
const AUCTION_FIELDS = 'title status endTime currentBid category seller images';

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * POST /api/v1/auctions/:auctionId/bids
 *
 * Guards (in order):
 *  1. Auction must exist
 *  2. Auction must be live or ending_soon
 *  3. Bidder role must be 'buyer'
 *  4. Bidder must not be the auction seller
 *  5. Amount must be > currentBid (or >= startingPrice when no bids yet)
 *  6. Amount must satisfy minIncrement over currentBid
 *
 * On success:
 *  - Previous winning bid is marked 'outbid'
 *  - New Bid document is created with status 'winning'
 *  - Auction.currentBid, Auction.highestBidder, Auction.bids are updated atomically
 */
async function placeBid(bidderId, bidderRole, auctionId, amount) {
  // ── Guard 1: auction exists ──────────────────────────────────────────────
  const auction = await Auction.findById(auctionId);
  if (!auction) throw notFound();

  // ── Guard 2: auction is accepting bids ───────────────────────────────────
  // Sync computed status first so we react to real time
  const now = new Date();
  const computedStatus = auction.getComputedStatus();
  if (computedStatus !== auction.status) {
    auction.status = computedStatus;
    await auction.save();
  }

  if (!['live', 'ending_soon'].includes(auction.status)) {
    throw badRequest(
      auction.status === 'upcoming'
        ? 'This auction has not started yet'
        : auction.status === 'ended' || auction.status === 'sold'
        ? 'This auction has already ended'
        : 'This auction is not accepting bids'
    );
  }

  // ── Guard 3: only buyers can bid ─────────────────────────────────────────
  if (bidderRole !== 'buyer') {
    throw forbidden('Only buyers can place bids');
  }

  // ── Guard 4: seller cannot bid on their own auction ──────────────────────
  if (auction.seller.toString() === bidderId) {
    throw forbidden('You cannot bid on your own auction');
  }

  // ── Guard 5 & 6: amount must beat current bid + minIncrement ─────────────
  const floor = auction.currentBid > 0
    ? auction.currentBid + auction.minIncrement
    : auction.startingPrice;

  if (amount < floor) {
    const msg = auction.currentBid > 0
      ? `Bid must be at least $${floor.toFixed(2)} (current bid $${auction.currentBid.toFixed(2)} + minimum increment $${auction.minIncrement.toFixed(2)})`
      : `Bid must be at least the starting price of $${floor.toFixed(2)}`;
    throw badRequest(msg);
  }

  // ── Atomically update previous winning bid → outbid ──────────────────────
  const previousWinningBids = await Bid.find({ auction: auctionId, status: 'winning' })
    .populate('bidder', 'name username');

  await Bid.updateMany(
    { auction: auctionId, status: 'winning' },
    { $set: { status: 'outbid' } }
  );

  // ── Create new winning bid ────────────────────────────────────────────────
  const bid = await Bid.create({
    auction: auctionId,
    bidder:  bidderId,
    amount,
    status:  'winning',
  });

  // ── Update auction denormalised fields atomically ─────────────────────────
  await Auction.findByIdAndUpdate(auctionId, {
    $set: {
      currentBid:    amount,
      highestBidder: bidderId,
    },
    $inc: { bids: 1 },
  });

  await Promise.allSettled(
    previousWinningBids
      .filter((prevBid) => prevBid.bidder && prevBid.bidder._id.toString() !== bidderId)
      .map((prevBid) =>
        notifyOutbid(prevBid.bidder._id, {
          auctionId,
          auctionTitle: auction.title,
          newAmount: amount,
        })
      )
  );

  // Notify the bidder — bid placed successfully
  await notifyBidPlaced(bidderId, {
    auctionId,
    auctionTitle: auction.title,
    amount,
  });

  // Notify the seller — new bid received
  await notifyNewBid(auction.seller, {
    auctionId,
    auctionTitle: auction.title,
    amount,
    bidderName: 'A buyer',
  });

  // ── Emit real-time socket event to all room participants ─────────────────
  try {
    const app  = require('../app');              // server/src/app.js
    const io   = app.get ? app.get('io') : null;
    if (io) {
      const { emitBidUpdate } = require('../socket/auction.socket');
      const bidderUser = await require('../models/User').findById(bidderId).select('name').lean();
      const updatedAuction = await Auction.findById(auctionId).select('bids currentBid').lean();
      emitBidUpdate(io, auctionId, {
        auctionId,
        amount,
        currentBid:    amount,
        totalBids:     updatedAuction?.bids ?? (auction.bids + 1),
        highestBidder: { id: bidderId, name: bidderUser?.name || 'A buyer' },
        createdAt:     new Date(),
        bid: {
          id:        bid._id,
          amount,
          bidder:    bidderUser?.name || 'A buyer',
          bidderId,
          createdAt: bid.createdAt,
        },
      });
    }
  } catch (socketErr) {
    // socket emit is non-fatal — log for debugging
    try { require('../utils/logger').warn('[socket] bid emit failed: ' + socketErr.message); } catch { /* */ }
  }

  // Return populated bid
  await bid.populate('bidder', BIDDER_FIELDS);
  await bid.populate({
    path:   'auction',
    select: AUCTION_FIELDS,
  });

  return bid;
}

/**
 * GET /api/v1/auctions/:auctionId/bids
 * Returns the full bid history for an auction, ordered highest → lowest.
 * Any authenticated user can view this.
 */
async function getAuctionBids(auctionId, { page = 1, limit = 20 } = {}) {
  const auction = await Auction.findById(auctionId).select('title status');
  if (!auction) throw notFound();

  const skip  = (Math.max(1, page) - 1) * limit;
  const total = await Bid.countDocuments({ auction: auctionId });

  const bids = await Bid.find({ auction: auctionId })
    .populate('bidder', BIDDER_FIELDS)
    .sort({ amount: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    auction: { id: auction._id, title: auction.title, status: auction.status },
    bids,
    pagination: {
      total,
      page:  Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * GET /api/v1/bids/my
 * Returns the authenticated buyer's own bid history across all auctions.
 * Newest bids first. Supports pagination and status filter.
 *
 * Status values match the frontend BidTable:
 *   winning, outbid, won, lost
 */
async function getMyBids(bidderId, { status, page = 1, limit = 12 } = {}) {
  const filter = { bidder: bidderId };
  if (status && status !== 'all') filter.status = status;

  const skip  = (Math.max(1, page) - 1) * limit;
  const total = await Bid.countDocuments(filter);

  const bids = await Bid.find(filter)
    .populate({
      path:   'auction',
      select: 'title status endTime currentBid startingPrice images category seller',
      populate: [
        { path: 'category', select: 'name slug icon gradient' },
        { path: 'seller',   select: 'name username avatar'    },
      ],
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Summary counts across ALL bidder's bids (unfiltered)
  const [summary] = await Bid.aggregate([
    { $match: { bidder: new mongoose.Types.ObjectId(bidderId) } },
    {
      $group: {
        _id:        null,
        totalBids:  { $sum: 1 },
        winning:    { $sum: { $cond: [{ $eq: ['$status', 'winning']  }, 1, 0] } },
        outbid:     { $sum: { $cond: [{ $eq: ['$status', 'outbid']   }, 1, 0] } },
        won:        { $sum: { $cond: [{ $eq: ['$status', 'won']      }, 1, 0] } },
        lost:       { $sum: { $cond: [{ $eq: ['$status', 'lost']     }, 1, 0] } },
        totalAmount:{ $sum: '$amount' },
      },
    },
  ]);

  return {
    bids,
    summary: summary || {
      totalBids: 0, winning: 0, outbid: 0, won: 0, lost: 0, totalAmount: 0,
    },
    pagination: {
      total,
      page:  Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * GET /api/v1/bids/highest/:auctionId
 * Returns the single highest bid for an auction.
 * Useful for real-time display without fetching full bid history.
 */
async function getHighestBid(auctionId) {
  const auction = await Auction.findById(auctionId).select('title status currentBid highestBidder');
  if (!auction) throw notFound();

  const bid = await Bid.findOne({ auction: auctionId, status: 'winning' })
    .populate('bidder', BIDDER_FIELDS)
    .sort({ amount: -1 });

  return {
    auction: {
      id:           auction._id,
      title:        auction.title,
      status:       auction.status,
      currentBid:   auction.currentBid,
    },
    highestBid: bid || null,
  };
}

/**
 * DELETE /api/v1/bids/:id
 * Admin can delete any bid. Buyer can only delete their own losing bid.
 * Cannot delete a winning bid on a live auction.
 */
async function removeBid(bidId, userId, userRole) {
  const bid = await Bid.findById(bidId).populate('auction', 'title status');
  if (!bid) throw notFound('Bid not found');

  // Buyers can only delete their own bids
  if (userRole !== 'admin' && bid.bidder.toString() !== userId) {
    throw forbidden('You can only delete your own bids');
  }

  // Cannot delete winning bid on live auction
  const auctionStatus = bid.auction?.status;
  if (bid.status === 'winning' && ['live', 'ending_soon'].includes(auctionStatus)) {
    throw badRequest('Cannot delete the winning bid on a live auction');
  }

  await bid.deleteOne();
  return { message: 'Bid deleted successfully' };
}

module.exports = { placeBid, getAuctionBids, getMyBids, getHighestBid, removeBid };
