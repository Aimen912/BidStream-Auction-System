'use strict';
/**
 * Migration: create Order documents for auctions that are
 * sold/ended with a winner but have no corresponding Order.
 *
 * Run once:  node scripts/createMissingOrders.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const Auction  = require('../src/models/Auction');
const Order    = require('../src/models/Order');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Find all ended/sold auctions that have a highestBidder and a bid
  const soldAuctions = await Auction.find({
    status:         { $in: ['sold', 'ended'] },
    highestBidder:  { $ne: null },
    currentBid:     { $gt: 0 },
  }).lean();

  console.log(`Found ${soldAuctions.length} sold auctions`);

  let created = 0;
  let skipped = 0;

  for (const a of soldAuctions) {
    // Check if order already exists
    const existing = await Order.findOne({ auction: a._id });
    if (existing) { skipped++; continue; }

    try {
      const winnerId = a.highestBidder;
      const sellerId = a.seller;
      await Order.create({
        auction:    a._id,
        buyer:      winnerId,
        seller:     sellerId,
        winningBid: a.currentBid,
        status:     'pending_payment',
      });
      created++;
      console.log(`  ✓ Created order for auction: ${a.title} (${a._id})`);
    } catch (e) {
      console.error(`  ✗ Failed for ${a._id}: ${e.message}`);
    }
  }

  console.log(`\nDone: ${created} created, ${skipped} already existed`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
