'use strict';

const { validationResult } = require('express-validator');

/**
 * validate – runs after express-validator chains.
 * Returns 422 with field errors if any validation failed.
 *
 * Usage:
 *   router.post('/login', [...validationChain], validate, loginController)
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    });
  }
  next();
}

module.exports = validate;
