'use strict';

const { verifyAccessToken } = require('../utils/jwt');
const { sendError } = require('../utils/apiResponse');

/**
 * authenticate – verifies the Bearer JWT in the Authorization header.
 * Attaches the decoded payload to req.user on success.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return sendError(res, message, 401);
  }
}

/**
 * authorize – role-based access control middleware factory.
 * Usage: router.delete('/resource/:id', authenticate, authorize('admin'), handler)
 * @param {...string} roles – allowed roles
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 'Forbidden – insufficient permissions', 403);
    }
    next();
  };
}

module.exports = { authenticate, authorize };
