/**
 * @file server.js
 * @description HTTP server entry point. Handles graceful shutdown for Render.
 */

import createApp from './app.js';
import env from './config/env.js';
import logger from './utils/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info('──────────────────────────────────────────');
  logger.info(`  🎵 ${env.api.name}`);
  logger.info(`  Environment : ${env.NODE_ENV}`);
  logger.info(`  Port        : ${env.PORT}`);
  logger.info(`  API         : http://localhost:${env.PORT}/api/${env.api.version}`);
  logger.info(`  Health      : http://localhost:${env.PORT}/api/${env.api.version}/health`);
  logger.info('──────────────────────────────────────────');
});

const shutdown = (signal) => {
  logger.info(`[Server] ${signal} — shutting down gracefully...`);
  server.close(() => {
    logger.info('[Server] Closed. Bye 🎵');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('unhandledRejection', (r) => logger.error('[Server] Unhandled rejection:', r));
process.on('uncaughtException',  (e) => { logger.error('[Server] Uncaught exception:', e); process.exit(1); });

export default server;
