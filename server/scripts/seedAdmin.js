'use strict';

/**
 * seedAdmin.js — creates the initial admin account in MongoDB.
 *
 * Admin accounts cannot be created via the registration API, so this
 * script must be run once manually before testing admin login.
 *
 * Usage (from the server/ directory):
 *   node scripts/seedAdmin.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../src/models/User');

const ADMIN = {
  name:     'Aimen Kanwal',
  username: 'aimen_admin',
  email:    'aimenkanwal12@gmail.com',
  password: 'Aimen@123',
  role:     'admin',
  isActive: true,
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // If admin with this email already exists, update it
  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    existing.name     = ADMIN.name;
    existing.username = ADMIN.username;
    existing.role     = 'admin';
    existing.isActive = true;
    existing.password = ADMIN.password; // pre-save hook will hash it
    await existing.save();
    console.log(`Admin account updated successfully.`);
  } else {
    await User.create(ADMIN);
    console.log(`Admin account created successfully.`);
  }

  console.log(`\n  Email   : ${ADMIN.email}`);
  console.log(`  Password: ${ADMIN.password}`);
  console.log(`  Role    : admin`);
  console.log(`\n  Login at: http://localhost:5173/admin/login`);
}

seed()
  .catch((err) => { console.error('Seed failed:', err.message); process.exit(1); })
  .finally(() => mongoose.connection.close());
