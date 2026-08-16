'use strict';

const { createLogger, format, transports } = require('winston');
const env = require('../config/env');

const { combine, timestamp, printf, colorize, errors } = format;

const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) =>
    stack ? `${ts} ${level}: ${message}\n${stack}` : `${ts} ${level}: ${message}`
  )
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  format.json()
);

const logger = createLogger({
  level: env.NODE_ENV() === 'production' ? 'warn' : 'debug',
  format: env.NODE_ENV() === 'production' ? prodFormat : devFormat,
  transports: [
    new transports.Console(),
    // Uncomment to persist logs:
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new transports.File({ filename: 'logs/combined.log' }),
  ],
});

module.exports = logger;
