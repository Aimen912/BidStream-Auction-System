'use strict';

const adminService = require('../services/admin.service');
const { sendSuccess } = require('../utils/apiResponse');

async function getDashboardStats(_req, res) {
  const stats = await adminService.getDashboardStats();
  return sendSuccess(res, { stats });
}

async function searchUsers(req, res) {
  const { search, role, status, page, limit, sort } = req.query;
  const result = await adminService.listUsers({ search, role, status, page, limit, sort });
  return sendSuccess(res, result);
}

async function searchAuctions(req, res) {
  const { search, status, category, page, limit, sort } = req.query;
  const result = await adminService.listAuctions({ search, status, category, page, limit, sort });
  return sendSuccess(res, result);
}

async function deleteUser(req, res) {
  const result = await adminService.removeUser(req.params.id, req.user.id);
  return sendSuccess(res, result);
}

async function deleteAuction(req, res) {
  const result = await adminService.removeAuction(req.params.id);
  return sendSuccess(res, result);
}

async function deleteCategory(req, res) {
  const result = await adminService.removeCategory(req.params.id);
  return sendSuccess(res, result);
}

async function updateUserStatus(req, res) {
  const result = await adminService.updateUserStatus(
    req.params.id,
    req.user.id,
    { isActive: req.body.isActive }
  );
  return sendSuccess(res, result);
}

async function getReports(req, res) {
  const { page, limit } = req.query;
  const result = await adminService.getReports({ page, limit });
  return sendSuccess(res, result);
}

async function getAnalytics(_req, res) {
  const result = await adminService.getAnalytics();
  return sendSuccess(res, result);
}

async function getPendingAuctions(req, res) {
  const { page, limit } = req.query;
  const result = await adminService.listPendingAuctions({ page, limit });
  return sendSuccess(res, result);
}

async function approveAuction(req, res) {
  const result = await adminService.approveAuction(req.params.id, req.user.id);
  return sendSuccess(res, result);
}

async function rejectAuction(req, res) {
  const result = await adminService.rejectAuction(req.params.id, req.user.id, req.body.remark);
  return sendSuccess(res, result);
}

async function updateAuction(req, res) {
  const { title, status } = req.body;
  const result = await adminService.updateAuction(req.params.id, { title, status });
  return sendSuccess(res, result);
}

module.exports = {
  getDashboardStats,
  searchUsers,
  searchAuctions,
  getPendingAuctions,
  deleteUser,
  deleteAuction,
  deleteCategory,
  updateUserStatus,
  updateAuction,
  getReports,
  getAnalytics,
  approveAuction,
  rejectAuction,
};