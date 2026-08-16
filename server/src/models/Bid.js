'use strict';

const mongoose = require('mongoose');

/**
 * Bid model
 *
 * Stores the full history of every bid placed on every auction.
 * The Auction document holds denormalised currentBid, highestBidder,
 * and bids-count for fast reads; this collection is the source of truth
 * for the complete history and the buyer's "My Bids" view.
 *
 * Status lifecycle:
 *   winning   — this bid is currently the highest on its auction
 *   outbid    — a higher bid has since been placed
 *   won       — auction ended and this bidder was the winner
 *   lost      — auction ended and this bidder was not the winner
 */
const bidSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction',
      required: [true, 'Auction reference is required'],
    },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Bidder reference is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Bid amount is required'],
      min: [0, 'Bid amount cannot be negative'],
    },
    // Status reflects the bid's standing at any point in time
    status: {
      type: String,
      enum: {
        values: ['winning', 'outbid', 'won', 'lost'],
        message: 'Bid status must be winning, outbid, won, or lost',
      },
      default: 'winning',
    },
  },
  {
    timestamps: true,  // createdAt = time of bid placement
    versionKey: false,
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

bidSchema.index({ auction: 1, amount: -1 });    // bid history per auction, highest first
bidSchema.index({ bidder: 1, createdAt: -1 });  // buyer's own bids, newest first
bidSchema.index({ auction: 1, bidder: 1 });     // check if bidder already bid on auction

// ─── toJSON — map _id → id ────────────────────────────────────────────────────

bidSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
