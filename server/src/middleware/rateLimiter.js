'use strict';

const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV !== 'production';

/**
 * General API rate limiter.
 * Dev:  500 req / 15 min  (generous for testing)
 * Prod: 100 req / 15 min
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 500 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

/**
 * Auth routes limiter (register, login, refresh).
 * Dev:  100 req / 15 min  — allows free testing
 * Prod: 15  req / 15 min  — prevents brute force
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 100 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

module.exports = { apiLimiter, authLimiter };
