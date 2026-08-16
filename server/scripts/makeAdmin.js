'use strict';

/**
 * makeAdmin.js — promotes an existing user to admin, OR creates a new admin.
 *
 * Usage (from server/ directory):
 *   node scripts/makeAdmin.js <email> <password>
 *
 * Examples:
 *   node scripts/makeAdmin.js aimenkanwal12@gmail.com Aimen@123
 *   node scripts/makeAdmin.js admin@bidstream.com AdminPass1
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../src/models/User');

const [,, email, password] = process.argv;

if (!email || !password) {
  console.error('Usage: node scripts/makeAdmin.js <email> <password>');
  process.exit(1);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    // Existing user — promote to admin and update password
    user.role     = 'admin';
    user.isActive = true;
    user.password = password; // pre-save hook will hash it
    await user.save();
    console.log(`\n✓ Existing user promoted to admin:`);
    console.log(`  Name     : ${user.name}`);
    console.log(`  Email    : ${user.email}`);
    console.log(`  Password : ${password}  (updated)`);
    console.log(`  Role     : admin`);
  } else {
    // Create new admin user
    user = await User.create({
      name:     email.split('@')[0],
      username: email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_'),
      email:    email.toLowerCase(),
      password,
      role:     'admin',
      isActive: true,
    });
    console.log(`\n✓ New admin account created:`);
    console.log(`  Email    : ${user.email}`);
    console.log(`  Password : ${password}`);
    console.log(`  Role     : admin`);
  }

  console.log('\nYou can now login at /admin/login');
}

run()
  .catch((err) => { console.error('Failed:', err.message); process.exit(1); })
  .finally(() => mongoose.connection.close());
