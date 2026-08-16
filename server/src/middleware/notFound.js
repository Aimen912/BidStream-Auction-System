'use strict';

/**
 * notFound – catch-all for unmatched routes.
 * Register this AFTER all routers and BEFORE errorHandler.
 */
function notFound(req, res, next) {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
}

module.exports = notFound;
