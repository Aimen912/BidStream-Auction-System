'use strict';

const { Router } = require('express');
const { param, query } = require('express-validator');

const notificationController = require('../controllers/notification.controller');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/authenticate');

const router = Router();

router.use(authenticate);

const listQueryValidation = [
  query('type')
    .optional()
    .isIn([
      'all',
      // Buyer
      'bid_placed', 'outbid', 'auction_won', 'auction_lost', 'ending_soon',
      // Seller
      'auction_submitted', 'auction_approved', 'auction_rejected', 'new_bid', 'auction_sold',
      // Admin
      'admin_new_auction',
      // Shared
      'new_message', 'payment', 'order_shipped', 'order_completed',
      'account_registered', 'system',
    ])
    .withMessage('Invalid notification type'),

  query('read')
    .optional()
    .isIn(['all', 'read', 'unread'])
    .withMessage('Invalid read filter'),

  query('sort')
    .optional()
    .isIn(['newest', 'oldest'])
    .withMessage('Invalid sort option'),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

const idParam = [
  param('id').isMongoId().withMessage('Invalid notification ID'),
];

router.get('/', listQueryValidation, validate, notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', idParam, validate, notificationController.markAsRead);
router.delete('/:id', idParam, validate, notificationController.remove);

module.exports = router;