'use strict';

const mongoose = require('mongoose');

const ORDER_STATUSES = [
  'pending_payment',   // winner selected, payment not yet made
  'payment_submitted', // buyer marked payment done (manual proof)
  'payment_confirmed', // seller/admin confirmed payment
  'preparing',         // seller packing
  'shipped',           // seller added tracking
  'delivered',         // buyer confirmed delivery
  'completed',         // order closed
  'cancelled',         // payment timeout or dispute
];

const shippingAddressSchema = new mongoose.Schema({
  fullName:  { type: String, default: '' },
  phone:     { type: String, default: '' },
  address:   { type: String, default: '' },
  city:      { type: String, default: '' },
  state:     { type: String, default: '' },
  country:   { type: String, default: '' },
  zipCode:   { type: String, default: '' },
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type:    String,
      unique:  true,
      // generated in pre-save hook
    },
    auction: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Auction',
      required: true,
    },
    buyer: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    seller: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    winningBid: {
      type:     Number,
      required: true,
      min:      0,
    },
    status: {
      type:    String,
      enum:    ORDER_STATUSES,
      default: 'pending_payment',
    },
    paymentMethod:  { type: String, default: null },   // 'jazzcash' | 'easypaisa' | 'bank' | 'cod'
    paymentProof:   { type: String, default: null },   // uploaded image path
    paidAt:         { type: Date,   default: null },

    shippingAddress: {
      type:    shippingAddressSchema,
      default: () => ({}),
    },
    trackingNumber: { type: String, default: null },
    courier:        { type: String, default: null },
    shippedAt:      { type: Date,   default: null },
    deliveredAt:    { type: Date,   default: null },
    completedAt:    { type: Date,   default: null },
    cancelledAt:    { type: Date,   default: null },
    cancelReason:   { type: String, default: null },

    // Payment deadline — 48h from order creation
    paymentDeadline: {
      type:    Date,
      default: () => new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
  },
  { timestamps: true, versionKey: false }
);

// ── Auto-generate order number ───────────────────────────────────────────────
orderSchema.pre('save', async function preSave(next) {
  if (!this.isNew || this.orderNumber) return next();
  try {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(5, '0')}`;
  } catch {
    // fallback to timestamp-based order number
    this.orderNumber = `ORD-${Date.now()}`;
  }
  next();
});

orderSchema.index({ buyer:  1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ auction: 1 }, { unique: true, sparse: true });

orderSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Order', orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
