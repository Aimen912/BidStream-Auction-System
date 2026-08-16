'use strict';

const { Router } = require('express');
const { body, param, query } = require('express-validator');
const msgCtrl    = require('../controllers/message.controller');
const validate   = require('../middleware/validate');
const { authenticate } = require('../middleware/authenticate');

const router = Router();
router.use(authenticate);

// GET  /api/v1/messages/conversations          — list all conversations
router.get('/conversations', msgCtrl.listConversations);

// GET  /api/v1/messages/unread-count           — total unread count
router.get('/unread-count', msgCtrl.getUnreadCount);

// POST /api/v1/messages/conversations          — start or get conversation
router.post('/conversations',
  [body('userId').isMongoId().withMessage('Valid user ID required')],
  validate,
  msgCtrl.getOrCreateConversation
);

// GET  /api/v1/messages/conversations/:id      — get messages in conversation
router.get('/conversations/:id',
  [param('id').isMongoId()],
  validate,
  msgCtrl.getMessages
);

// POST /api/v1/messages/conversations/:id/messages — send message
router.post('/conversations/:id/messages',
  [
    param('id').isMongoId(),
    body('text').trim().notEmpty().withMessage('Message text is required')
      .isLength({ max: 2000 }).withMessage('Message too long'),
  ],
  validate,
  msgCtrl.sendMessage
);

module.exports = router;
