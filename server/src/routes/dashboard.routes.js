'use strict';

const { Router }                      = require('express');
const dashboardController             = require('../controllers/dashboard.controller');
const { authenticate, authorize }     = require('../middleware/authenticate');

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// GET /api/v1/dashboard/buyer  — buyer personalised dashboard
router.get('/buyer',  authorize('buyer'),           dashboardController.getBuyerDashboard);

// GET /api/v1/dashboard/seller — seller personalised dashboard
router.get('/seller', authorize('seller'),          dashboardController.getSellerDashboard);

// GET /api/v1/dashboard/admin  — admin platform-wide dashboard
router.get('/admin',  authorize('admin'),           dashboardController.getAdminDashboard);

module.exports = router;
