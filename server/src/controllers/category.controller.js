'use strict';

const categoryService = require('../services/category.service');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/v1/categories
 * Query params: status (active|inactive|all), sort (name|auctions|updated)
 */
async function getAll(req, res) {
  const { status, sort } = req.query;
  const categories = await categoryService.getAll({ status, sort });
  return sendSuccess(res, { categories, total: categories.length });
}

/**
 * GET /api/v1/categories/:id
 * :id can be a MongoDB _id or a slug.
 */
async function getById(req, res) {
  const category = await categoryService.getById(req.params.id);
  return sendSuccess(res, { category });
}

/**
 * POST /api/v1/categories
 * Body: { name, description, icon?, gradient?, status? }
 */
async function create(req, res) {
  const { name, description, icon, gradient, status } = req.body;
  const category = await categoryService.create({ name, description, icon, gradient, status });
  return sendSuccess(res, { category }, 201);
}

/**
 * PATCH /api/v1/categories/:id
 * Body: { name?, description?, icon?, gradient?, status? }
 */
async function update(req, res) {
  const { name, description, icon, gradient, status } = req.body;
  const category = await categoryService.update(req.params.id, {
    name, description, icon, gradient, status,
  });
  return sendSuccess(res, { category });
}

/**
 * PATCH /api/v1/categories/:id/status
 * Toggles active ↔ inactive with no body required.
 */
async function toggleStatus(req, res) {
  const category = await categoryService.toggleStatus(req.params.id);
  return sendSuccess(res, { category });
}

/**
 * DELETE /api/v1/categories/:id
 */
async function remove(req, res) {
  const result = await categoryService.remove(req.params.id);
  return sendSuccess(res, result);
}

/**
 * POST /api/v1/categories/:id/image
 * multipart/form-data, field name: image
 * uploadCategoryImage middleware populates req.file before this runs.
 */
async function uploadImage(req, res) {
  const result = await categoryService.uploadImage(req.params.id, req.file);
  return sendSuccess(res, result);
}

/**
 * DELETE /api/v1/categories/:id/image
 */
async function deleteImage(req, res) {
  const result = await categoryService.deleteImage(req.params.id);
  return sendSuccess(res, result);
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
