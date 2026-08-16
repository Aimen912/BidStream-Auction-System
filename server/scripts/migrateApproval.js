'use strict';

/**
 * migrateApproval.js
 * Sets approvalStatus = 'approved' on all existing auctions that
 * were created before the approval system was added (approvalStatus is null/undefined).
 *
 * Usage: node scripts/migrateApproval.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const Auction  = require('../src/models/Auction');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB\n');

  // Count auctions missing approvalStatus
  const missing = await Auction.countDocuments({
    $or: [
      { approvalStatus: { $exists: false } },
      { approvalStatus: null },
    ],
  });

  console.log(`Found ${missing} auction(s) without approvalStatus.`);

  if (missing === 0) {
    console.log('Nothing to migrate.');
    return;
  }

  // Set these to 'approved' so they keep showing to buyers
  const result = await Auction.updateMany(
    {
      $or: [
        { approvalStatus: { $exists: false } },
        { approvalStatus: null },
      ],
    },
    {
      $set: {
        approvalStatus: 'approved',
        adminRemark:    '',
      },
    }
  );

  console.log(`✓ Updated ${result.modifiedCount} auctions → approvalStatus: "approved"`);
  console.log('\nMigration complete.');
}

migrate()
  .catch((err) => { console.error('Migration failed:', err.message); process.exit(1); })
  .finally(() => mongoose.connection.close());
