'use strict';

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    // The two participants (always exactly 2)
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    // Latest message text (denormalised for conversation list)
    lastMessage:  { type: String, default: '' },
    lastSender:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastAt:       { type: Date, default: Date.now },
    // Per-participant unread counters
    unread: {
      type: Map,
      of:   Number,
      default: {},
    },
  },
  { timestamps: true, versionKey: false }
);

// Unique conversation between any two users
messageSchema.index({ participants: 1 }, { unique: false });

const conversationSchema = mongoose.Schema; // alias for clarity
const Conversation = mongoose.model('Conversation', messageSchema);

// ── Individual messages ────────────────────────────────────────────────────────

const msgSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender:       { type: mongoose.Schema.Types.ObjectId, ref: 'User',         required: true },
    text:         { type: String, required: true, maxlength: 2000 },
    readBy:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true, versionKey: false }
);

const Msg = mongoose.model('Message', msgSchema);

module.exports = { Conversation, Msg };
