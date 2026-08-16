'use strict';

const jwt      = require('jsonwebtoken');
const Auction  = require('../models/Auction');
const Bid      = require('../models/Bid');

// ─── In-memory participant tracking ──────────────────────────────────────────
// auctionId → Map<socketId, { userId, name, role }>
const rooms = new Map();

function getRoomKey(auctionId) { return `auction_${auctionId}`; }

function addParticipant(auctionId, data) {
  if (!rooms.has(auctionId)) rooms.set(auctionId, new Map());
  rooms.get(auctionId).set(data.socketId, data);
}

function removeParticipant(auctionId, socketId) {
  rooms.get(auctionId)?.delete(socketId);
  if (rooms.get(auctionId)?.size === 0) rooms.delete(auctionId);
}

function participantCount(auctionId) {
  return rooms.get(auctionId)?.size ?? 0;
}

// ─── Socket auth middleware ───────────────────────────────────────────────────

function authenticateSocket(socket, next) {
  try {
    const token = socket.handshake.auth?.token
      || socket.handshake.headers?.authorization?.replace('Bearer ', '');
    if (!token) { socket.user = null; return next(); }
    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    socket.user = null;
    next();
  }
}

// ─── Starting-Soon scheduler ──────────────────────────────────────────────────
// Runs every 30 seconds. Emits:
//   • 'starting_soon'   – when 5 min or less remain before startTime
//   • 'auction_started' – when startTime has passed and status flips to live

const notifiedSoon    = new Set(); // auctionIds already notified for starting_soon
const notifiedStarted = new Set(); // auctionIds already notified for auction_started

function startScheduler(io) {
  setInterval(async () => {
    try {
      const now     = new Date();
      const in5min  = new Date(now.getTime() + 5 * 60 * 1000);

      // Auctions starting within 5 minutes (still upcoming)
      const upcoming = await Auction.find({
        status:         'upcoming',
        approvalStatus: 'approved',
        startTime:      { $lte: in5min, $gt: now },
      }).select('_id title startTime startingPrice minIncrement images seller category bids').lean();

      for (const a of upcoming) {
        const auctionId = String(a._id);
        if (!notifiedSoon.has(auctionId)) {
          notifiedSoon.add(auctionId);
          const msLeft = new Date(a.startTime) - now;
          io.emit('starting_soon', {   // broadcast to all connected sockets
            auctionId,
            title:         a.title,
            startTime:     a.startTime,
            startingPrice: a.startingPrice,
            minIncrement:  a.minIncrement,
            images:        a.images,
            msLeft,
          });
        }
      }

      // Auctions whose startTime has passed but are still marked 'upcoming'
      const readyToStart = await Auction.find({
        status:         'upcoming',
        approvalStatus: 'approved',
        startTime:      { $lte: now },
      }).select('_id title startTime startingPrice minIncrement images seller bids').lean();

      for (const a of readyToStart) {
        const auctionId = String(a._id);
        // Flip status to live
        await Auction.findByIdAndUpdate(auctionId, { status: 'live' });

        if (!notifiedStarted.has(auctionId)) {
          notifiedStarted.add(auctionId);
          // Emit to the waiting room channel AND to everyone
          io.to(getRoomKey(auctionId)).emit('auction_started', { auctionId, title: a.title });
          io.emit('auction_went_live', { auctionId, title: a.title });
        }
      }

      // Clean up old entries from Sets (prevent memory leak)
      if (notifiedSoon.size > 500)    notifiedSoon.clear();
      if (notifiedStarted.size > 500) notifiedStarted.clear();

    } catch { /* non-fatal */ }
  }, 30_000);
}

// ─── Main socket handler ──────────────────────────────────────────────────────

module.exports = function registerAuctionSocket(io) {
  io.use(authenticateSocket);

  // Start the scheduler
  startScheduler(io);

  io.on('connection', (socket) => {
    const user = socket.user;

    // Each authenticated user joins their personal room for direct notifications
    if (user?.id) {
      socket.join(`user_${user.id}`);
    }

    // ── join_conversation ──────────────────────────────────────────────────
    socket.on('join_conversation', ({ conversationId }) => {
      if (conversationId && conversationId !== 'undefined') {
        socket.join(`conv_${conversationId}`);
      }
    });

    socket.on('leave_conversation', ({ conversationId }) => {
      if (conversationId) socket.leave(`conv_${conversationId}`);
    });

    // ── join_auction (live room + waiting room shared) ─────────────────────
    socket.on('join_auction', async ({ auctionId }) => {
      try {
        if (!auctionId || auctionId === 'undefined') {
          socket.emit('error', { message: 'Invalid auction ID' });
          return;
        }

        const auction = await Auction.findById(auctionId)
          .populate('seller',   'name username')
          .populate('category', 'name');

        if (!auction) { socket.emit('error', { message: 'Auction not found' }); return; }

        const room = getRoomKey(auctionId);
        socket.join(room);
        socket.currentAuctionId = auctionId;

        if (user) {
          addParticipant(auctionId, {
            socketId: socket.id,
            userId:   user.id,
            name:     user.name || 'Anonymous',
            role:     user.role || 'buyer',
          });
        }

        // Fetch last 20 bids
        const recentBids = await Bid.find({ auction: auctionId })
          .populate('bidder', 'name username')
          .sort({ createdAt: -1 })
          .limit(20)
          .lean();

        const computedStatus = auction.getComputedStatus?.() || auction.status;

        socket.emit('auction_state', {
          auction: {
            id:            auction._id,
            title:         auction.title,
            status:        computedStatus,
            currentBid:    auction.currentBid,
            startingPrice: auction.startingPrice,
            minIncrement:  auction.minIncrement,
            endTime:       auction.endTime,
            startTime:     auction.startTime,
            bids:          auction.bids,
            seller:        auction.seller,
            category:      auction.category,
            images:        auction.images,
            highestBidder: auction.highestBidder,
            description:   auction.description,
            condition:     auction.condition,
          },
          recentBids: recentBids.reverse().map((b) => ({
            id:        b._id,
            amount:    b.amount,
            bidder:    b.bidder?.name || 'Anonymous',
            bidderId:  b.bidder?._id,
            createdAt: b.createdAt,
          })),
          participantCount: participantCount(auctionId),
        });

        io.to(room).emit('participants_update', { count: participantCount(auctionId) });
      } catch {
        socket.emit('error', { message: 'Failed to join auction room' });
      }
    });

    // ── leave_auction ──────────────────────────────────────────────────────
    socket.on('leave_auction', ({ auctionId }) => {
      const room = getRoomKey(auctionId);
      socket.leave(room);
      removeParticipant(auctionId, socket.id);
      io.to(room).emit('participants_update', { count: participantCount(auctionId) });
    });

    // ── disconnect ─────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      const auctionId = socket.currentAuctionId;
      if (auctionId) {
        removeParticipant(auctionId, socket.id);
        io.to(getRoomKey(auctionId)).emit('participants_update', { count: participantCount(auctionId) });
      }
    });
  });
};

// ─── Helpers exported for bid.service ────────────────────────────────────────

module.exports.emitBidUpdate = function emitBidUpdate(io, auctionId, payload) {
  io.to(getRoomKey(auctionId)).emit('bid_update', payload);
};

module.exports.emitAuctionEnded = function emitAuctionEnded(io, auctionId, payload) {
  io.to(getRoomKey(auctionId)).emit('auction_ended', payload);
};
