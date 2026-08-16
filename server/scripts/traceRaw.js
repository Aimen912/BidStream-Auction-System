'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Auction  = require('../src/models/Auction');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const auctions = await Auction.find()
    .populate('category', 'name slug icon gradient')
    .limit(2)
    .lean();  // <-- lean(): returns plain JS objects, NOT mongoose docs

  console.log('\n=== STEP 1a: .lean() result (plain object) ===');
  const a = auctions[0];
  console.log('  _id :', a?._id?.toString());
  console.log('  id  :', a?.id);
  console.log('  title:', a?.title);

  // Now test WITHOUT .lean() — goes through toJSON
  const auctions2 = await Auction.find()
    .populate('category', 'name slug icon gradient')
    .limit(2);

  console.log('\n=== STEP 1b: WITHOUT .lean() — after toJSON serialization ===');
  const b = JSON.parse(JSON.stringify(auctions2[0]));
  console.log('  _id :', b?._id);
  console.log('  id  :', b?.id);
  console.log('  title:', b?.title);

  // Simulate getMyAuctions service — uses populate NOT lean
  console.log('\n=== STEP 2: Simulated API response shape ===');
  const Auction2 = require('../src/models/Auction');
  const docs = await Auction2.find().populate('category', 'name slug icon gradient');
  const responseJSON = JSON.parse(JSON.stringify({ auctions: docs }));
  const apiAuction = responseJSON.auctions[0];
  console.log('  _id :', apiAuction?._id);
  console.log('  id  :', apiAuction?.id);
  console.log('  title:', apiAuction?.title);
  console.log('\n  All keys:', Object.keys(apiAuction || {}));

  mongoose.connection.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
