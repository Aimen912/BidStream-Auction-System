'use strict';

const mongoose = require('mongoose');

/**
 * Auction model
 *
 * Field names kept compatible with the frontend data shapes:
 *   AUCTIONS_DATA.js, SELLER_AUCTIONS.js, AuctionForm.jsx, AuctionCard.jsx
 */
const auctionSchema = new mongoose.Schema(
  {
    // ─── Core ──────────────────────────────────────────────────────────────
    title: {
      type: String,
      required: [true, 'Auction title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    // ─── Relations ─────────────────────────────────────────────────────────
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller reference is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },

    // ─── Images ────────────────────────────────────────────────────────────
    // Array of relative URL paths: /uploads/auctions/<filename>
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 8,
        message: 'An auction can have at most 8 images',
      },
    },

    // ─── Pricing ───────────────────────────────────────────────────────────
    startingPrice: {
      type: Number,
      required: [true, 'Starting price is required'],
      min: [0, 'Starting price cannot be negative'],
    },
    currentBid: {
      type: Number,
      default: 0,
      min: [0, 'Current bid cannot be negative'],
    },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    minIncrement: {
      type: Number,
      default: 1,
      min: [1, 'Minimum increment must be at least 1'],
    },
    reservePrice: {
      type: Number,
      default: 0,
      min: [0, 'Reserve price cannot be negative'],
    },
    buyNowPrice: {
      type: Number,
      default: null,
      min: [0, 'Buy Now price cannot be negative'],
    },

    // ─── Item details ──────────────────────────────────────────────────────
    condition: {
      type: String,
      enum: {
        values: ['New', 'Like New', 'Excellent', 'Good', 'Fair'],
        message: 'Condition must be New, Like New, Excellent, Good, or Fair',
      },
      required: [true, 'Item condition is required'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
      default: null,
    },
    shipping: {
      type: String,
      enum: {
        values: ['Worldwide', 'Domestic', 'Local Only', 'No Shipping'],
        message: 'Shipping must be Worldwide, Domestic, Local Only, or No Shipping',
      },
      default: 'Domestic',
    },
    tags: {
      type: [String],
      default: [],
    },

    // ─── Schedule ──────────────────────────────────────────────────────────
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },

    // ─── Status ────────────────────────────────────────────────────────────
    // draft     — saved but not yet scheduled/published
    // upcoming  — published, start time in the future
    // live      — currently accepting bids
    // ending_soon — live but ends within 1 hour
    // ended     — past end time, awaiting finalisation
    // sold      — winner confirmed
    // cancelled — cancelled by seller or admin
    status: {
      type: String,
      enum: {
        values: ['draft', 'upcoming', 'live', 'ending_soon', 'ended', 'sold', 'cancelled'],
        message: 'Invalid auction status',
      },
      default: 'draft',
    },

    // ─── Bid activity ──────────────────────────────────────────────────────
    bids: {
      type: Number,
      default: 0,
      min: [0, 'Bid count cannot be negative'],
    },

    // ─── Admin Approval ────────────────────────────────────────────────
    // pending   — awaiting admin review (default for new auctions)
    // approved  — admin approved, visible to buyers
    // rejected  — admin rejected, hidden from buyers
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminRemark: {
      type: String,
      default: '',
      maxlength: [500, 'Admin remark cannot exceed 500 characters'],
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },

    // ─── Flags ─────────────────────────────────────────────────────────────
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

auctionSchema.index({ seller: 1, status: 1 });
auctionSchema.index({ category: 1, status: 1 });
auctionSchema.index({ status: 1, endTime: 1 });
auctionSchema.index({ approvalStatus: 1 });
auctionSchema.index({ title: 'text', description: 'text', tags: 'text' });

// ─── Virtual: computed status based on current time ───────────────────────────
// Used by getComputedStatus() in the service. Not persisted.

auctionSchema.methods.getComputedStatus = function () {
  // draft and cancelled never auto-change
  if (this.status === 'draft' || this.status === 'cancelled') return this.status;
  if (this.status === 'sold') return 'sold';

  const now = new Date();
  if (now < this.startTime) return 'upcoming';

  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  if (now >= this.startTime && this.endTime > oneHourFromNow) return 'live';
  if (now >= this.startTime && this.endTime <= oneHourFromNow && this.endTime > now) return 'ending_soon';
  if (now >= this.endTime) return 'ended';

  return this.status;
};

// ─── toJSON — map _id → id, populate seller/category name only ───────────────

auctionSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
