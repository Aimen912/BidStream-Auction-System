'use strict';

const { Router } = require('express');
const { query, param, body } = require('express-validator');

const adminController = require('../controllers/admin.controller');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/authenticate');

const router = Router();

router.use(authenticate, authorize('admin'));

const pagingValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

const userSearchValidation = [
  ...pagingValidation,
  query('role')
    .optional()
    .isIn(['all', 'buyer', 'seller', 'admin']).withMessage('Invalid role filter'),
  query('status')
    .optional()
    .isIn(['all', 'active', 'inactive']).withMessage('Invalid status filter'),
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'name', 'role']).withMessage('Invalid sort option'),
];

const auctionSearchValidation = [
  ...pagingValidation,
  query('status')
    .optional()
    .isIn(['all', 'draft', 'upcoming', 'live', 'ending_soon', 'ended', 'sold', 'cancelled'])
    .withMessage('Invalid status filter'),
  query('approvalStatus')
    .optional()
    .isIn(['all', 'pending', 'approved', 'rejected'])
    .withMessage('Invalid approval status filter'),
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'ending', 'price_asc', 'price_desc', 'bids'])
    .withMessage('Invalid sort option'),
  query('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),
];

const idParam = [
  param('id').isMongoId().withMessage('Invalid ID'),
];

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/users',           userSearchValidation,    validate, adminController.searchUsers);
router.get('/auctions',        auctionSearchValidation, validate, adminController.searchAuctions);
router.get('/auctions/pending', pagingValidation,       validate, adminController.getPendingAuctions);
router.get('/reports',         pagingValidation,        validate, adminController.getReports);
router.get('/analytics',                                          adminController.getAnalytics);
router.delete('/users/:id',    idParam, validate, adminController.deleteUser);
router.delete('/auctions/:id', idParam, validate, adminController.deleteAuction);
router.delete('/categories/:id', idParam, validate, adminController.deleteCategory);
router.patch('/users/:id/status',
  idParam,
  [body('isActive').isBoolean().withMessage('isActive must be true or false')],
  validate,
  adminController.updateUserStatus
);
router.patch('/auctions/:id/approve',
  idParam, validate,
  adminController.approveAuction
);
router.patch('/auctions/:id/reject',
  idParam,
  [body('remark').optional().isString().isLength({ max: 500 })],
  validate,
  adminController.rejectAuction
);
router.patch('/auctions/:id',
  idParam,
  [
    body('title').optional().trim().notEmpty().isLength({ max: 200 }),
    body('status').optional().isIn(['live', 'upcoming', 'ended', 'draft', 'cancelled']),
  ],
  validate,
  adminController.updateAuction
);

module.exports = router;