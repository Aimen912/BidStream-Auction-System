'use strict';

const Order   = require('../models/Order');
const Auction = require('../models/Auction');
const User    = require('../models/User');
const { notifyPayment, notifySystem } = require('../utils/notify');

function notFound(msg = 'Order not found') {
  const e = new Error(msg); e.statusCode = 404; return e;
}
function forbidden(msg = 'Forbidden') {
  const e = new Error(msg); e.statusCode = 403; return e;
}
function badRequest(msg) {
  const e = new Error(msg); e.statusCode = 400; return e;
}

const POPULATE_OPTS = [
  { path: 'auction', select: 'title images category startingPrice currentBid status' },
  { path: 'buyer',   select: 'name username email avatar' },
  { path: 'seller',  select: 'name username email avatar' },
];

/**
 * Emit order_updated to both buyer and seller user rooms.
 */
function emitOrderUpdate(order) {
  try {
    const app = require('../../app');
    const io  = app.get ? app.get('io') : null;
    if (!io) return;
    const payload = {
      orderId:   String(order._id),
      status:    order.status,
      trackingNumber: order.trackingNumber || null,
      courier:        order.courier        || null,
    };
    io.to(`user_${order.buyer}`).emit('order_updated',  payload);
    io.to(`user_${order.seller}`).emit('order_updated', payload);
  } catch { /* non-fatal */ }
}

// ─── createOrder ─────────────────────────────────────────────────────────────
/**
 * Called automatically by endAuction / buyNow after a winner is determined.
 * Returns silently if an order already exists for this auction.
 */
async function createOrder(auctionId, buyerId, sellerId, winningBid) {
  // Idempotent — avoid double-creates
  const existing = await Order.findOne({ auction: auctionId });
  if (existing) return existing;

  const order = await Order.create({
    auction:    auctionId,
    buyer:      buyerId,
    seller:     sellerId,
    winningBid: winningBid,
    status:     'pending_payment',
  });

  // Emit new_order to buyer and seller instantly
  try {
    const app = require('../../app');
    const io  = app.get ? app.get('io') : null;
    if (io) {
      const payload = { orderId: String(order._id), status: 'pending_payment', auctionId: String(auctionId) };
      io.to(`user_${buyerId}`).emit('new_order',  payload);
      io.to(`user_${sellerId}`).emit('new_order', payload);
    }
  } catch { /* non-fatal */ }

  // Notify buyer
  const auction = await Auction.findById(auctionId).select('title').lean();
  const title   = auction?.title || 'Auction';

  await notifyPayment(buyerId, {
    title:        '🏆 You won! Complete your payment',
    description:  `You won "${title}" with a bid of $${winningBid.toLocaleString()}. Please submit payment within 48 hours.`,
    auctionId,
    auctionTitle: title,
  });

  // Notify seller
  await notifyPayment(sellerId, {
    title:        '🎉 Auction sold — awaiting buyer payment',
    description:  `Your auction "${title}" sold for $${winningBid.toLocaleString()}. Waiting for buyer payment.`,
    auctionId,
    auctionTitle: title,
  });

  return order;
}

// ─── getBuyerOrders ───────────────────────────────────────────────────────────
async function getBuyerOrders(buyerId, { status = 'all', page = 1, limit = 20 } = {}) {
  const query = { buyer: buyerId };
  if (status !== 'all') query.status = status;

  const total  = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate(POPULATE_OPTS)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return { orders, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
}

// ─── getSellerOrders ──────────────────────────────────────────────────────────
async function getSellerOrders(sellerId, { status = 'all', page = 1, limit = 20 } = {}) {
  const query = { seller: sellerId };
  if (status !== 'all') query.status = status;

  const total  = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate(POPULATE_OPTS)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return { orders, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
}

// ─── getOrder (single) ────────────────────────────────────────────────────────
async function getOrder(orderId, userId, userRole) {
  const order = await Order.findById(orderId).populate(POPULATE_OPTS);
  if (!order) throw notFound();

  const uid = String(userId);
  if (
    userRole !== 'admin' &&
    String(order.buyer._id || order.buyer.id) !== uid &&
    String(order.seller._id || order.seller.id) !== uid
  ) {
    throw forbidden('You do not have access to this order');
  }
  return order;
}

// ─── submitPayment (buyer) ───────────────────────────────────────────────────
async function submitPayment(orderId, buyerId, { paymentMethod, paymentProof } = {}) {
  const order = await Order.findById(orderId);
  if (!order) throw notFound();
  if (String(order.buyer) !== String(buyerId)) throw forbidden();
  if (!['pending_payment', 'payment_submitted'].includes(order.status)) {
    throw badRequest('Payment already processed');
  }

  order.paymentMethod  = paymentMethod  || order.paymentMethod;
  order.paymentProof   = paymentProof   || order.paymentProof;
  order.status         = 'payment_submitted';
  order.paidAt         = new Date();
  await order.save();
  emitOrderUpdate(order);

  // Notify seller
  const auction = await Auction.findById(order.auction).select('title').lean();
  await notifyPayment(order.seller, {
    title:        '💳 Buyer submitted payment',
    description:  `Buyer submitted payment proof for "${auction?.title}". Please confirm and prepare shipment.`,
    auctionId:    order.auction,
    auctionTitle: auction?.title,
  });

  return order;
}

// ─── confirmPayment (seller) ─────────────────────────────────────────────────
async function confirmPayment(orderId, sellerId) {
  const order = await Order.findById(orderId);
  if (!order) throw notFound();
  if (String(order.seller) !== String(sellerId)) throw forbidden();
  if (order.status !== 'payment_submitted') throw badRequest('No payment submitted yet');

  order.status = 'preparing';
  await order.save();
  emitOrderUpdate(order);

  const auction = await Auction.findById(order.auction).select('title').lean();
  await notifySystem(order.buyer, {
    title:       '✅ Payment confirmed!',
    description: `Seller confirmed your payment for "${auction?.title}". Order is being prepared.`,
    link:        '/orders',
  });

  return order;
}

// ─── addTracking (seller) ─────────────────────────────────────────────────────
async function addTracking(orderId, sellerId, { trackingNumber, courier } = {}) {
  const order = await Order.findById(orderId);
  if (!order) throw notFound();
  if (String(order.seller) !== String(sellerId)) throw forbidden();
  if (!['preparing', 'payment_confirmed'].includes(order.status)) {
    throw badRequest('Order must be in preparing status to add tracking');
  }
  if (!trackingNumber) throw badRequest('Tracking number is required');

  order.trackingNumber = trackingNumber;
  order.courier        = courier || 'Courier';
  order.status         = 'shipped';
  order.shippedAt      = new Date();
  await order.save();
  emitOrderUpdate(order);

  const auction = await Auction.findById(order.auction).select('title').lean();
  await notifySystem(order.buyer, {
    title:       '📦 Your order has been shipped!',
    description: `"${auction?.title}" is on its way. Tracking: ${trackingNumber} (${courier || 'Courier'})`,
    link:        '/orders',
  });

  return order;
}

// ─── submitShippingAddress (buyer) ────────────────────────────────────────────
async function submitShippingAddress(orderId, buyerId, address) {
  const order = await Order.findById(orderId);
  if (!order) throw notFound();
  if (String(order.buyer) !== String(buyerId)) throw forbidden();

  order.shippingAddress = { ...order.shippingAddress, ...address };
  await order.save();

  const auction = await Auction.findById(order.auction).select('title').lean();
  await notifySystem(order.seller, {
    title:       '📋 Buyer submitted delivery address',
    description: `Buyer provided shipping info for "${auction?.title}". You can now prepare the shipment.`,
    link:        '/seller/orders',
  });

  return order;
}

// ─── confirmDelivery (buyer) ──────────────────────────────────────────────────
async function confirmDelivery(orderId, buyerId) {
  const order = await Order.findById(orderId);
  if (!order) throw notFound();
  if (String(order.buyer) !== String(buyerId)) throw forbidden();
  if (order.status !== 'shipped') throw badRequest('Order has not been shipped yet');

  order.status      = 'completed';
  order.deliveredAt = new Date();
  order.completedAt = new Date();
  await order.save();
  emitOrderUpdate(order);

  const auction = await Auction.findById(order.auction).select('title').lean();
  await notifySystem(order.seller, {
    title:       '🎉 Order completed!',
    description: `Buyer confirmed delivery of "${auction?.title}". Payment has been released.`,
    link:        '/seller/orders',
  });

  return order;
}

module.exports = {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  getOrder,
  submitPayment,
  confirmPayment,
  addTracking,
  submitShippingAddress,
  confirmDelivery,
};
