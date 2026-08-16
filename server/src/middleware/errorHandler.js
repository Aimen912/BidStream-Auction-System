'use strict';

const logger = require('../utils/logger');
const env = require('../config/env');

/**
 * errorHandler – global Express error-handling middleware.
 * Must be registered LAST in the middleware chain (4-arg signature).
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;

  // Log server errors
  if (statusCode >= 500) {
    logger.error(err);
  }

  const body = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  // Include stack trace in development only
  if (env.NODE_ENV() !== 'production' && err.stack) {
    body.stack = err.stack;
  }

  // Mongoose validation errors → 422
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key → 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}`,
    });
  }

  return res.status(statusCode).json(body);
}

module.exports = errorHandler;
