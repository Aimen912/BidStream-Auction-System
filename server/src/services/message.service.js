'use strict';

const { Conversation, Msg } = require('../models/Message');
const User = require('../models/User');

function notFound(msg = 'Not found') {
  const e = new Error(msg); e.statusCode = 404; return e;
}
function forbidden(msg = 'Forbidden') {
  const e = new Error(msg); e.statusCode = 403; return e;
}

/**
 * GET /api/v1/messages/conversations
 * Returns all conversations for the current user, sorted by latest message.
 */
async function listConversations(userId) {
  const convs = await Conversation.find({ participants: userId })
    .populate('participants', 'name username avatar role')
    .populate('lastSender', 'name username')
    .sort({ lastAt: -1 });

  return convs.map((c) => {
    const other = c.participants.find((p) => p._id.toString() !== userId.toString());
    const unreadCount = c.unread?.get?.(userId.toString()) ?? 0;
    return {
      id:           c._id,
      participant:  other,
      lastMessage:  c.lastMessage,
      lastSender:   c.lastSender,
      lastAt:       c.lastAt,
      unread:       unreadCount,
    };
  });
}

/**
 * GET /api/v1/messages/conversations/:id
 * Returns messages for a conversation (paginated, newest last).
 */
async function getMessages(convId, userId, { page = 1, limit = 50 } = {}) {
  const conv = await Conversation.findById(convId);
  if (!conv) throw notFound('Conversation not found');

  const isParticipant = conv.participants.some((p) => p.toString() === userId.toString());
  if (!isParticipant) throw forbidden('Access denied');

  const skip = (Math.max(1, page) - 1) * limit;
  const total = await Msg.countDocuments({ conversation: convId });
  const messages = await Msg.find({ conversation: convId })
    .populate('sender', 'name username avatar')
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(Number(limit));

  // Mark messages as read
  await Msg.updateMany(
    { conversation: convId, readBy: { $ne: userId } },
    { $addToSet: { readBy: userId } }
  );
  // Reset unread counter
  conv.unread.set(userId.toString(), 0);
  await conv.save();

  return { messages, total, page: Number(page), limit: Number(limit) };
}

/**
 * POST /api/v1/messages/conversations
 * Start or get existing conversation with another user.
 */
async function getOrCreateConversation(userId, otherUserId) {
  if (userId.toString() === otherUserId.toString()) {
    const e = new Error('Cannot message yourself'); e.statusCode = 400; throw e;
  }

  const other = await User.findById(otherUserId);
  if (!other) throw notFound('User not found');

  // Find existing conversation
  let conv = await Conversation.findOne({
    participants: { $all: [userId, otherUserId], $size: 2 },
  });

  if (!conv) {
    conv = await Conversation.create({
      participants: [userId, otherUserId],
      unread: { [userId.toString()]: 0, [otherUserId.toString()]: 0 },
    });
  }

  await conv.populate('participants', 'name username avatar role');
  const participant = conv.participants.find((p) => p._id.toString() !== userId.toString());
  return { id: conv._id, participant, lastMessage: conv.lastMessage, lastAt: conv.lastAt, unread: 0 };
}

/**
 * POST /api/v1/messages/conversations/:id/messages
 * Send a message in a conversation.
 */
async function sendMessage(convId, senderId, text) {
  const conv = await Conversation.findById(convId);
  if (!conv) throw notFound('Conversation not found');

  const isParticipant = conv.participants.some((p) => p.toString() === senderId.toString());
  if (!isParticipant) throw forbidden('Access denied');

  const msg = await Msg.create({
    conversation: convId,
    sender:       senderId,
    text:         text.trim(),
    readBy:       [senderId],
  });

  // Update conversation meta
  conv.lastMessage = text.trim().slice(0, 100);
  conv.lastSender  = senderId;
  conv.lastAt      = new Date();

  // Increment unread for the other participant
  conv.participants.forEach((p) => {
    if (p.toString() !== senderId.toString()) {
      const cur = conv.unread.get(p.toString()) ?? 0;
      conv.unread.set(p.toString(), cur + 1);
    }
  });
  await conv.save();

  await msg.populate('sender', 'name username avatar');

  // ── Emit real-time new_message to conversation room ──────────────────────
  try {
    const app = require('../../app');
    const io  = app.get ? app.get('io') : null;
    if (io) {
      const convRoom = `conv_${convId}`;
      io.to(convRoom).emit('new_message', {
        conversationId: convId,
        message: {
          id:         msg._id,
          text:       msg.text,
          sender:     { id: msg.sender._id, name: msg.sender.name, avatar: msg.sender.avatar },
          createdAt:  msg.createdAt,
          readBy:     msg.readBy,
        },
        // Also update conversation preview for both participants
        lastMessage: text.trim().slice(0, 100),
        lastAt:      conv.lastAt,
        senderId:    String(senderId),
      });

      // Notify the recipient (the other participant) via their user room
      conv.participants.forEach((p) => {
        if (p.toString() !== String(senderId)) {
          io.to(`user_${p}`).emit('message_notification', {
            conversationId: convId,
            senderName:    msg.sender.name,
            preview:       text.trim().slice(0, 60),
          });
        }
      });
    }
  } catch { /* non-fatal */ }

  return msg;
}

/**
 * GET /api/v1/messages/unread-count
 * Total unread messages across all conversations.
 */
async function getUnreadCount(userId) {
  const convs = await Conversation.find({ participants: userId });
  let total = 0;
  convs.forEach((c) => {
    total += c.unread?.get?.(userId.toString()) ?? 0;
  });
  return { count: total };
}

module.exports = {
  listConversations,
  getMessages,
  getOrCreateConversation,
  sendMessage,
  getUnreadCount,
};
