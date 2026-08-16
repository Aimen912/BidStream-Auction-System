'use strict';

const { Router } = require('express');
const authRoutes          = require('./auth.routes');
const userRoutes          = require('./user.routes');
const categoryRoutes      = require('./category.routes');
const auctionRoutes       = require('./auction.routes');
const bidRoutes           = require('./bid.routes');
const notificationRoutes  = require('./notification.routes');
const adminRoutes         = require('./admin.routes');
const watchlistRoutes     = require('./watchlist.routes');
const dashboardRoutes     = require('./dashboard.routes');
const orderRoutes         = require('./order.routes');
const messageRoutes       = require('./message.routes');

const router = Router();

router.use('/auth',          authRoutes);
router.use('/users',         userRoutes);
router.use('/categories',    categoryRoutes);
router.use('/auctions',      auctionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin',         adminRoutes);
router.use('/wishlist',      watchlistRoutes);
router.use('/watchlist',     watchlistRoutes);
router.use('/dashboard',     dashboardRoutes);
router.use('/orders',       orderRoutes);
router.use('/messages',      messageRoutes);

// Bid routes span two URL shapes:
//   POST/GET  /api/v1/auctions/:auctionId/bids
//   GET       /api/v1/bids/my
//   GET       /api/v1/bids/highest/:auctionId
//   DELETE    /api/v1/bids/:id
router.use('/', bidRoutes);

module.exports = router;
