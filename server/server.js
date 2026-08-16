'use strict';

// Load environment variables first – before any other module reads process.env
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const http   = require('http');
const { Server } = require('socket.io');
const { validateEnv, PORT, NODE_ENV } = require('./src/config/env');
const { connectDB } = require('./src/config/db');
const logger = require('./src/utils/logger');
const app    = require('./src/app');

// Validate all required env vars up-front
validateEnv();

const port = PORT();

async function start() {
  try {
    await connectDB();

    // ── HTTP server wrapping Express ─────────────────────────────────────
    const httpServer = http.createServer(app);

    // ── Socket.io ────────────────────────────────────────────────────────
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN
          ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
          : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175',
             'http://localhost:5176', 'http://localhost:5177'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Attach io to app so services can emit events
    app.set('io', io);

    // Mount auction socket handlers
    require('./src/socket/auction.socket')(io);

    httpServer.listen(port, () => {
      logger.info(`BidStream API running on port ${port} [${NODE_ENV()}]`);
    });

    // ── Graceful Shutdown ────────────────────────────────────────────────
    const shutdown = (signal) => {
      logger.info(`${signal} received – shutting down gracefully`);
      httpServer.close(async () => {
        const mongoose = require('mongoose');
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

start();
