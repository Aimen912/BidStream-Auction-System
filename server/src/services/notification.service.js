'use strict';

const Notification = require('../models/Notification');

function escapeRegExp(value = '') {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildQuery(userId, { type = 'all', read = 'all', search = '' } = {}) {
  const query = { recipient: userId };

  if (type && type !== 'all') {
    query.type = type;
  }

  if (read === 'read') {
    query.read = true;
  } else if (read === 'unread') {
    query.read = false;
  }

  if (search && search.trim()) {
    const term = escapeRegExp(search.trim());
    query.$or = [
      { title: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
      { auctionTitle: { $regex: term, $options: 'i' } },
    ];
  }

  return query;
}

async function listNotifications(userId, { type = 'all', read = 'all', search = '', page = 1, limit = 20, sort = 'newest' } = {}) {
  const query = buildQuery(userId, { type, read, search });
  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (pageNumber - 1) * limitNumber;

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(limitNumber),
    Notification.countDocuments(query),
    Notification.countDocuments({ recipient: userId, read: false }),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      pages: Math.ceil(total / limitNumber),
    },
  };
}

async function getUnreadCount(userId) {
  const unreadCount = await Notification.countDocuments({ recipient: userId, read: false });
  return { unreadCount };
}

async function markAsRead(userId, notificationId) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { $set: { read: true } },
    { new: true }
  );

  if (!notification) {
    const err = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }

  return { notification };
}

async function markAllAsRead(userId) {
  const result = await Notification.updateMany(
    { recipient: userId, read: false },
    { $set: { read: true } }
  );

  return {
    matchedCount: result.matchedCount ?? result.nMatched ?? 0,
    modifiedCount: result.modifiedCount ?? result.nModified ?? 0,
  };
}

async function removeNotification(userId, notificationId) {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    const err = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }

  return { message: 'Notification deleted successfully' };
}

module.exports = {
  listNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  removeNotification,
};