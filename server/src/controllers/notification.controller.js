'use strict';

const notificationService = require('../services/notification.service');
const { sendSuccess } = require('../utils/apiResponse');

async function getNotifications(req, res) {
  const { type, read, search, page, limit, sort } = req.query;
  const result = await notificationService.listNotifications(req.user.id, {
    type,
    read,
    search,
    page,
    limit,
    sort,
  });

  return sendSuccess(res, result);
}

async function getUnreadCount(req, res) {
  const result = await notificationService.getUnreadCount(req.user.id);
  return sendSuccess(res, result);
}

async function markAsRead(req, res) {
  const result = await notificationService.markAsRead(req.user.id, req.params.id);
  return sendSuccess(res, result);
}

async function markAllAsRead(req, res) {
  const result = await notificationService.markAllAsRead(req.user.id);
  return sendSuccess(res, result);
}

async function remove(req, res) {
  const result = await notificationService.removeNotification(req.user.id, req.params.id);
  return sendSuccess(res, result);
}

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  remove,
};