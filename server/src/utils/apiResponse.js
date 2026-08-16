'use strict';

/**
 * Standardised JSON response helpers.
 * Usage:
 *   sendSuccess(res, { data: user }, 201);
 *   sendError(res, 'Not found', 404);
 */

function sendSuccess(res, data = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    ...data,
  });
}

function sendError(res, message = 'Something went wrong', statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = { sendSuccess, sendError };
