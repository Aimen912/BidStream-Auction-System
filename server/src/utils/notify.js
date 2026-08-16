'use strict';

const Notification = require('../models/Notification');

/**
 * Low-level helper — never throws.
 */
async function createNotification({
  recipient, sender = null, type, title, description,
  auctionTitle = null, auction = null, link = null,
}) {
  try {
    const notif = await Notification.create({ recipient, sender, type, title, description, auctionTitle, auction, link });

    // Emit real-time socket event to the recipient's personal room
    try {
      const app = require('../../app');
      const io  = app.get ? app.get('io') : null;
      if (io) {
        const recipientId = String(recipient);
        io.to(`user_${recipientId}`).emit('new_notification', {
          id:          notif._id,
          type,
          title,
          description,
          link,
          read:        false,
          createdAt:   notif.createdAt,
        });
      }
    } catch { /* non-fatal — socket emit optional */ }

  } catch (err) {
    try {
      const logger = require('./logger');
      logger.error(`[notify] ${err.message}`);
    } catch {
      console.error(`[notify] ${err.message}`);
    }
  }
}

// ─── Buyer notifications ──────────────────────────────────────────────────────

async function notifyBidPlaced(recipientId, { auctionId, auctionTitle, amount }) {
  await createNotification({
    recipient:    recipientId,
    type:         'bid_placed',
    title:        'Bid placed successfully',
    description:  `Your bid of $${amount.toLocaleString()} on "${auctionTitle}" has been placed.`,
    auctionTitle,
    auction:      auctionId,
    link:         `/auctions/${auctionId}`,
  });
}

async function notifyOutbid(recipientId, { auctionId, auctionTitle, newAmount }) {
  await createNotification({
    recipient:    recipientId,
    type:         'outbid',
    title:        "You've been outbid!",
    description:  `Someone placed a higher bid of $${newAmount.toLocaleString()} on "${auctionTitle}". Increase your bid to stay competitive.`,
    auctionTitle,
    auction:      auctionId,
    link:         `/auctions/${auctionId}`,
  });
}

async function notifyAuctionWon(recipientId, { auctionId, auctionTitle, winningBid }) {
  await createNotification({
    recipient:    recipientId,
    type:         'auction_won',
    title:        'Congratulations! You won!',
    description:  `You won the auction for "${auctionTitle}" with a bid of $${winningBid.toLocaleString()}. Payment is due within 48 hours.`,
    auctionTitle,
    auction:      auctionId,
    link:         `/auctions/${auctionId}`,
  });
}

async function notifyAuctionLost(recipientId, { auctionId, auctionTitle, winningBid }) {
  await createNotification({
    recipient:    recipientId,
    type:         'auction_lost',
    title:        "Auction ended — you didn't win",
    description:  `"${auctionTitle}" has ended. The winning bid was $${winningBid.toLocaleString()}.`,
    auctionTitle,
    auction:      auctionId,
    link:         `/auctions/${auctionId}`,
  });
}

async function notifyEndingSoon(recipientId, { auctionId, auctionTitle, minutesLeft, isHighest }) {
  const status = isHighest ? 'You are the current highest bidder.' : "You haven't placed a bid yet.";
  await createNotification({
    recipient:    recipientId,
    type:         'ending_soon',
    title:        'Auction ending soon',
    description:  `"${auctionTitle}" ends in ${minutesLeft} minutes. ${status}`,
    auctionTitle,
    auction:      auctionId,
    link:         `/auctions/${auctionId}`,
  });
}

// ─── Seller notifications ─────────────────────────────────────────────────────

async function notifyAuctionSubmitted(recipientId, { auctionId, auctionTitle }) {
  await createNotification({
    recipient:    recipientId,
    type:         'auction_submitted',
    title:        'Auction submitted for review',
    description:  `Your auction "${auctionTitle}" has been submitted and is pending admin review.`,
    auctionTitle,
    auction:      auctionId,
    link:         `/seller/auctions`,
  });
}

async function notifyAuctionApproved(recipientId, { auctionId, auctionTitle }) {
  await createNotification({
    recipient:    recipientId,
    type:         'auction_approved',
    title:        'Auction approved!',
    description:  `Your auction "${auctionTitle}" has been approved and is now live.`,
    auctionTitle,
    auction:      auctionId,
    link:         `/auctions/${auctionId}`,
  });
}

async function notifyAuctionRejected(recipientId, { auctionId, auctionTitle, remark }) {
  await createNotification({
    recipient:    recipientId,
    type:         'auction_rejected',
    title:        'Auction rejected',
    description:  `Your auction "${auctionTitle}" was rejected. Reason: ${remark || 'No reason provided.'}`,
    auctionTitle,
    auction:      auctionId,
    link:         `/seller/auctions`,
  });
}

async function notifyNewBid(recipientId, { auctionId, auctionTitle, amount, bidderName }) {
  await createNotification({
    recipient:    recipientId,
    type:         'new_bid',
    title:        'New bid received',
    description:  `${bidderName} placed a bid of $${amount.toLocaleString()} on your auction "${auctionTitle}".`,
    auctionTitle,
    auction:      auctionId,
    link:         `/seller/auctions`,
  });
}

async function notifyAuctionSold(recipientId, { auctionId, auctionTitle, amount }) {
  await createNotification({
    recipient:    recipientId,
    type:         'auction_sold',
    title:        'Auction sold!',
    description:  `Congratulations! Your auction "${auctionTitle}" sold for $${amount.toLocaleString()}.`,
    auctionTitle,
    auction:      auctionId,
    link:         `/seller/auctions`,
  });
}

// ─── Admin notifications ──────────────────────────────────────────────────────

async function notifyAdminNewAuction(recipientId, { auctionId, auctionTitle, sellerName }) {
  await createNotification({
    recipient:    recipientId,
    type:         'admin_new_auction',
    title:        'New auction pending review',
    description:  `${sellerName} submitted "${auctionTitle}" for approval.`,
    auctionTitle,
    auction:      auctionId,
    link:         `/admin/auctions`,
  });
}

// ─── Shared ───────────────────────────────────────────────────────────────────

async function notifyPayment(recipientId, { title, description, auctionId = null, auctionTitle = null }) {
  await createNotification({
    recipient:    recipientId,
    type:         'payment',
    title,
    description,
    auctionTitle,
    auction:      auctionId,
  });
}

async function notifySystem(recipientId, { title, description, link = null }) {
  await createNotification({ recipient: recipientId, type: 'system', title, description, link });
}

async function notifyAccountRegistered(recipientId, { name, role }) {
  await createNotification({
    recipient:    recipientId,
    type:         'account_registered',
    title:        `Welcome to BidStream, ${name}!`,
    description:  `Your ${role} account has been created successfully. Start ${role === 'seller' ? 'listing auctions' : 'bidding'} now.`,
    link:         role === 'seller' ? '/seller/dashboard' : '/dashboard',
  });
}

module.exports = {
  createNotification,
  // Buyer
  notifyBidPlaced,
  notifyOutbid,
  notifyAuctionWon,
  notifyAuctionLost,
  notifyEndingSoon,
  // Seller
  notifyAuctionSubmitted,
  notifyAuctionApproved,
  notifyAuctionRejected,
  notifyNewBid,
  notifyAuctionSold,
  // Admin
  notifyAdminNewAuction,
  // Shared
  notifyPayment,
  notifySystem,
  notifyAccountRegistered,
};
