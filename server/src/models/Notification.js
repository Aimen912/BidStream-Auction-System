'use strict';

const mongoose = require('mongoose');

const NOTIFICATION_TYPES = [
  // Buyer
  'bid_placed',
  'outbid',
  'auction_won',
  'auction_lost',
  'ending_soon',
  // Seller
  'auction_submitted',
  'auction_approved',
  'auction_rejected',
  'new_bid',
  'auction_sold',
  // Admin
  'admin_new_auction',
  // Shared
  'new_message',
  'payment',
  'order_shipped',
  'order_completed',
  'account_registered',
  'system',
];

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Recipient is required'],
    },
    sender: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'User',
      default: null,
    },
    type: {
      type:     String,
      enum:     { values: NOTIFICATION_TYPES, message: 'Invalid notification type' },
      required: [true, 'Notification type is required'],
    },
    title: {
      type:      String,
      required:  [true, 'Title is required'],
      trim:      true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type:      String,
      required:  [true, 'Description is required'],
      trim:      true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    auctionTitle: { type: String, trim: true, default: null },
    auction:      { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', default: null },
    // Deep-link — frontend navigates here when notification is clicked
    link:         { type: String, default: null },
    read:         { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });

notificationSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
module.exports.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
