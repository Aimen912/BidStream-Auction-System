'use strict';

/**
 * env.js – loads and validates required environment variables.
 * Call this once, early in the process lifecycle (before any other imports
 * that depend on process.env).
 */

const required = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Check server/.env.example for the full list.'
    );
  }
}

module.exports = {
  validateEnv,

  // Centralised env accessors – avoids scattering process.env throughout the app
  PORT: () => parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: () => process.env.NODE_ENV || 'development',
  MONGO_URI: () => process.env.MONGO_URI,
  JWT_SECRET: () => process.env.JWT_SECRET,
  JWT_EXPIRES_IN: () => process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: () => process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: () => process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  CORS_ORIGIN: () => {
    const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((o) => o.trim());
    // In development, also allow any localhost port dynamically
    if (process.env.NODE_ENV !== 'production') {
      for (let port = 5173; port <= 5180; port++) {
        const origin = `http://localhost:${port}`;
        if (!origins.includes(origin)) origins.push(origin);
      }
    }
    return origins;
  },
};
