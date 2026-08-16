'use strict';

/**
 * seedCategories.js — populates the database with default auction categories.
 *
 * Usage (from server/ directory):
 *   node scripts/seedCategories.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const Category = require('../src/models/Category');

const CATEGORIES = [
  {
    name:        'Electronics',
    description: 'Smartphones, laptops, tablets, cameras, and all electronic gadgets.',
    icon:        '💻',
    gradient:    'from-blue-600 to-cyan-400',
    status:      'active',
  },
  {
    name:        'Fashion & Clothing',
    description: 'Designer clothes, shoes, bags, watches, and fashion accessories.',
    icon:        '👗',
    gradient:    'from-pink-500 to-rose-400',
    status:      'active',
  },
  {
    name:        'Art & Collectibles',
    description: 'Paintings, sculptures, vintage collectibles, coins, and antiques.',
    icon:        '🎨',
    gradient:    'from-purple-600 to-indigo-400',
    status:      'active',
  },
  {
    name:        'Vehicles',
    description: 'Cars, motorcycles, bicycles, boats, and vehicle parts.',
    icon:        '🚗',
    gradient:    'from-orange-500 to-amber-400',
    status:      'active',
  },
  {
    name:        'Real Estate',
    description: 'Properties, plots, apartments, commercial spaces, and land.',
    icon:        '🏠',
    gradient:    'from-green-600 to-emerald-400',
    status:      'active',
  },
  {
    name:        'Jewelry & Watches',
    description: 'Gold, silver, diamond jewelry, luxury watches, and gemstones.',
    icon:        '💎',
    gradient:    'from-yellow-500 to-amber-300',
    status:      'active',
  },
  {
    name:        'Sports & Outdoors',
    description: 'Sports equipment, fitness gear, outdoor adventure items.',
    icon:        '⚽',
    gradient:    'from-lime-500 to-green-400',
    status:      'active',
  },
  {
    name:        'Books & Education',
    description: 'Rare books, textbooks, educational materials, and manuscripts.',
    icon:        '📚',
    gradient:    'from-teal-600 to-cyan-400',
    status:      'active',
  },
  {
    name:        'Home & Furniture',
    description: 'Furniture, home décor, appliances, and interior design items.',
    icon:        '🛋️',
    gradient:    'from-violet-600 to-purple-400',
    status:      'active',
  },
  {
    name:        'Musical Instruments',
    description: 'Guitars, pianos, drums, violins, and rare musical equipment.',
    icon:        '🎸',
    gradient:    'from-red-500 to-orange-400',
    status:      'active',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB\n');

  let added = 0;
  let skipped = 0;

  for (const cat of CATEGORIES) {
    const existing = await Category.findOne({ name: cat.name });
    if (existing) {
      console.log(`  SKIP  ${cat.icon}  ${cat.name} (already exists)`);
      skipped++;
    } else {
      await Category.create(cat);
      console.log(`  ADD   ${cat.icon}  ${cat.name}`);
      added++;
    }
  }

  console.log(`\nDone — ${added} added, ${skipped} skipped.`);
  console.log('Categories are now available in the auction form dropdown.');
}

seed()
  .catch((err) => { console.error('Seed failed:', err.message); process.exit(1); })
  .finally(() => mongoose.connection.close());
