'use strict';

const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

/**
 * connectDB – establishes a Mongoose connection to MongoDB.
 * Retries are handled automatically by Mongoose's built-in reconnect logic.
 */
async function connectDB() {
  const uri = env.MONGO_URI();

  mongoose.connection.on('connected', () =>
    logger.info('MongoDB connected')
  );
  mongoose.connection.on('disconnected', () =>
    logger.warn('MongoDB disconnected')
  );
  mongoose.connection.on('error', (err) =>
    logger.error(`MongoDB connection error: ${err.message}`)
  );

await mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,
  family: 4,
});
}

module.exports = { connectDB };
