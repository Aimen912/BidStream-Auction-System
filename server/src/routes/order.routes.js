'use strict';

const { Router } = require('express');
const { param, body, query } = require('express-validator');
const orderController = require('../controllers/order.controller');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/authenticate');

const router = Router();
router.use(authenticate);

const idParam = [param('id').isMongoId().withMessage('Invalid order ID')];

// Buyer routes
router.get('/my',    authorize('buyer'),  orderController.getBuyerOrders);

// Seller routes
router.get('/seller', authorize('seller'), orderController.getSellerOrders);

// Single order (buyer or seller)
router.get('/:id', idParam, validate, orderController.getOrder);

// Buyer: submit shipping address
router.patch('/:id/shipping-address',
  authorize('buyer'),
  idParam,
  [
    body('fullName').optional().trim(),
    body('phone').optional().trim(),
    body('address').optional().trim(),
    body('city').optional().trim(),
    body('country').optional().trim(),
  ],
  validate,
  orderController.submitShippingAddress
);

// Buyer: mark payment submitted
router.patch('/:id/pay',
  authorize('buyer'),
  idParam,
  [
    body('paymentMethod').optional().trim().isIn(['jazzcash','easypaisa','bank','cod','card']),
    body('paymentProof').optional().trim(),
  ],
  validate,
  orderController.submitPayment
);

// Buyer: confirm delivery received
router.patch('/:id/confirm-delivery',
  authorize('buyer'),
  idParam,
  validate,
  orderController.confirmDelivery
);

// Seller: confirm payment received
router.patch('/:id/confirm-payment',
  authorize('seller'),
  idParam,
  validate,
  orderController.confirmPayment
);

// Seller: add tracking
router.patch('/:id/tracking',
  authorize('seller'),
  idParam,
  [
    body('trackingNumber').notEmpty().withMessage('Tracking number is required'),
    body('courier').optional().trim(),
  ],
  validate,
  orderController.addTracking
);

module.exports = router;
