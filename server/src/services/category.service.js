'use strict';

const fs       = require('fs');
const path     = require('path');
const Category = require('../models/Category');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function notFound() {
  const err = new Error('Category not found');
  err.statusCode = 404;
  return err;
}

function conflict(msg) {
  const err = new Error(msg);
  err.statusCode = 409;
  return err;
}

/**
 * Safely delete a category image file from disk.
 * Silently ignores missing files.
 */
function deleteImageFile(imagePath) {
  if (!imagePath) return;
  try {
    const abs = path.join(__dirname, '../../', imagePath);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch {
    // non-fatal
  }
}

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * GET /api/v1/categories
 * Returns all categories, optionally filtered by status.
 * Sorted by name by default.
 */
async function getAll({ status, sort = 'name' } = {}) {
  const filter = {};
  if (status && status !== 'all') filter.status = status;

  const sortMap = {
    name:     { name: 1 },
    auctions: { auctionCount: -1 },
    updated:  { updatedAt: -1 },
  };

  const categories = await Category.find(filter)
    .sort(sortMap[sort] || { name: 1 });

  return categories;
}

/**
 * GET /api/v1/categories/:id
 * Returns a single category by MongoDB _id or slug.
 */
async function getById(idOrSlug) {
  const isId = idOrSlug.match(/^[a-f\d]{24}$/i);
  const category = isId
    ? await Category.findById(idOrSlug)
    : await Category.findOne({ slug: idOrSlug });

  if (!category) throw notFound();
  return category;
}

/**
 * POST /api/v1/categories
 * Creates a new category. Name must be unique.
 */
async function create({ name, description, icon, gradient, status }) {
  const existing = await Category.findOne({
    name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
  });
  if (existing) throw conflict(`Category "${name}" already exists`);

  const category = await Category.create({
    name,
    description,
    icon,
    gradient,
    status: status || 'active',
  });

  return category;
}

/**
 * PATCH /api/v1/categories/:id
 * Updates allowed fields. Name uniqueness is re-checked on change.
 */
async function update(id, { name, description, icon, gradient, status }) {
  const category = await Category.findById(id);
  if (!category) throw notFound();

  // Check name uniqueness only if it's actually changing
  if (name && name.trim().toLowerCase() !== category.name.toLowerCase()) {
    const taken = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      _id:  { $ne: id },
    });
    if (taken) throw conflict(`Category "${name}" already exists`);
  }

  if (name        !== undefined) category.name        = name;
  if (description !== undefined) category.description = description;
  if (icon        !== undefined) category.icon        = icon;
  if (gradient    !== undefined) category.gradient    = gradient;
  if (status      !== undefined) category.status      = status;

  await category.save();
  return category;
}

/**
 * PATCH /api/v1/categories/:id/status
 * Toggles active ↔ inactive without requiring a full body.
 */
async function toggleStatus(id) {
  const category = await Category.findById(id);
  if (!category) throw notFound();

  category.status = category.status === 'active' ? 'inactive' : 'active';
  await category.save();
  return category;
}

/**
 * DELETE /api/v1/categories/:id
 * Deletes a category and removes its image from disk.
 */
async function remove(id) {
  const category = await Category.findById(id);
  if (!category) throw notFound();

  deleteImageFile(category.image);
  await category.deleteOne();

  return { message: 'Category deleted successfully' };
}

/**
 * POST /api/v1/categories/:id/image
 * Stores the uploaded file path in MongoDB.
 * Deletes the previous image file from disk if one existed.
 *
 * @param {string}               id   – category _id
 * @param {Express.Multer.File}  file – multer file object from req.file
 */
async function uploadImage(id, file) {
  if (!file) {
    const err = new Error('No image file provided');
    err.statusCode = 422;
    throw err;
  }

  const category = await Category.findById(id);
  if (!category) throw notFound();

  // Remove the old image before saving the new path
  deleteImageFile(category.image);

  category.image = `/uploads/categories/${file.filename}`;
  await category.save();

  return { image: category.image };
}

/**
 * DELETE /api/v1/categories/:id/image
 * Removes the category image from disk and clears the field in MongoDB.
 */
async function deleteImage(id) {
  const category = await Category.findById(id);
  if (!category) throw notFound();

  deleteImageFile(category.image);
  category.image = null;
  await category.save();

  return { message: 'Category image removed successfully' };
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  toggleStatus,
  remove,
  uploadImage,
  deleteImage,
};
