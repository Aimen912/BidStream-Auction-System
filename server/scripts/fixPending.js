'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Auction  = require('../src/models/Auction');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  // Set existing auctions WITHOUT approvalStatus to 'pending'
  // so they appear in admin's Pending Review tab
  const r1 = await Auction.updateMany(
    { approvalStatus: { $exists: false } },
    { $set: { approvalStatus: 'pending', adminRemark: '' } }
  );
  console.log(`Set to PENDING: ${r1.modifiedCount} auctions (new ones without approvalStatus)`);

  // Show current state
  const all = await Auction.find({}, { title: 1, approvalStatus: 1 }).lean();
  console.log('\nCurrent state:');
  all.forEach((a) => console.log(`  ${a.title}: ${a.approvalStatus}`));

  mongoose.connection.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
