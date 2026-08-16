'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Signs an access token.
 * @param {object} payload – data to encode (e.g. { id, role })
 */
function signAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET(), {
    expiresIn: env.JWT_EXPIRES_IN(),
  });
}

/**
 * Signs a refresh token.
 * @param {object} payload
 */
function signRefreshToken(payload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET(), {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN(),
  });
}

/**
 * Verifies an access token.
 * Throws JsonWebTokenError / TokenExpiredError on failure.
 * @param {string} token
 */
function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET());
}

/**
 * Verifies a refresh token.
 * @param {string} token
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET());
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
