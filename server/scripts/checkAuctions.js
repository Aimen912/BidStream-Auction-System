'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Auction  = require('../src/models/Auction');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  const auctions = await Auction.find({}).select('title status currentBid highestBidder bids approvalStatus').lean();
  console.log('All auctions:');
  auctions.forEach((a) => {
    console.log(`  "${a.title}" | status:${a.status} | approval:${a.approvalStatus} | bid:${a.currentBid} | bids:${a.bids} | winner:${a.highestBidder}`);
  });
  await mongoose.disconnect();
}
run().catch(console.error);
