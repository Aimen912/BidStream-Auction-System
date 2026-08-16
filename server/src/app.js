'use strict';

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Must be registered before any route imports that read process.env
require('express-async-errors');

const env = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimiter');
const routes = require('./routes/index');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: env.CORS_ORIGIN(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Logging ─────────────────────────────────────────────────────────────────
if (env.NODE_ENV() !== 'test') {
  app.use(morgan(env.NODE_ENV() === 'production' ? 'combined' : 'dev'));
}

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ─── Static Files — uploaded avatars ─────────────────────────────────────────
// Serves GET /uploads/avatars/<filename> directly.
// helmet() sets restrictive CSP by default; images are served as static assets.
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'), {
    maxAge: '7d',         // cache avatars in browser for 7 days
    etag: true,
    index: false,         // disable directory listing
  })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
