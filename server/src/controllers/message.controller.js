'use strict';

const messageService = require('../services/message.service');
const { sendSuccess } = require('../utils/apiResponse');

async function listConversations(req, res) {
  const result = await messageService.listConversations(req.user.id);
  return sendSuccess(res, { conversations: result });
}

async function getMessages(req, res) {
  const { page, limit } = req.query;
  const result = await messageService.getMessages(req.params.id, req.user.id, { page, limit });
  return sendSuccess(res, result);
}

async function getOrCreateConversation(req, res) {
  const { userId } = req.body;
  const result = await messageService.getOrCreateConversation(req.user.id, userId);
  return sendSuccess(res, { conversation: result }, 201);
}

async function sendMessage(req, res) {
  const { text } = req.body;
  const result = await messageService.sendMessage(req.params.id, req.user.id, text);
  return sendSuccess(res, { message: result }, 201);
}

async function getUnreadCount(req, res) {
  const result = await messageService.getUnreadCount(req.user.id);
  return sendSuccess(res, result);
}

module.exports = { listConversations, getMessages, getOrCreateConversation, sendMessage, getUnreadCount };
