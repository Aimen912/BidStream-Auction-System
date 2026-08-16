'use strict';

const mongoose = require('mongoose');

/**
 * Category model
 *
 * Fields kept compatible with the frontend ADMIN_CATEGORIES_DATA shape:
 *   name, description, icon, gradient, image, status, auctionCount
 *
 * slug is auto-generated from name and used for clean URL lookups.
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [60, 'Category name cannot exceed 60 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    // Emoji icon shown in the frontend category card (e.g. "📷")
    icon: {
      type: String,
      trim: true,
      default: '🏷️',
      maxlength: [10, 'Icon cannot exceed 10 characters'],
    },
    // Tailwind gradient string (e.g. "from-blue-600 to-cyan-400")
    gradient: {
      type: String,
      trim: true,
      default: 'from-secondary-600 to-primary-700',
      maxlength: [100, 'Gradient cannot exceed 100 characters'],
    },
    // Stored path of the uploaded category image, e.g. /uploads/categories/<filename>
    image: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: 'Status must be active or inactive',
      },
      default: 'active',
    },
    // Denormalised count — incremented/decremented by the Auction module later
    auctionCount: {
      type: Number,
      default: 0,
      min: [0, 'Auction count cannot be negative'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ─── Auto-generate slug from name before saving ───────────────────────────────

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')   // strip special chars
      .replace(/\s+/g, '-')            // spaces → hyphens
      .replace(/-+/g, '-');            // collapse duplicate hyphens
  }
  next();
});

// ─── Virtual: keep both _id and id for frontend compatibility ────────────────

categorySchema.set('toJSON', {
  virtuals: true,
  transform(_doc, ret) {
    ret.id  = ret._id.toString();
    // Keep _id as well so frontend can use either c._id or c.id
    ret._id = ret._id.toString();
    return ret;
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
