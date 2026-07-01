/**
 * @file middleware/errorHandler.js
 * @description Centralized 404 and global error handling middleware.
 */

import { ApiError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  if (statusCode >= 500) {
    logger.error(`[Error] ${statusCode} ${req.method} ${req.originalUrl} — ${err.message}`);
  } else {
    logger.warn(`[Error] ${statusCode} ${req.method} ${req.originalUrl} — ${err.message}`);
  }

  const body = {
    success: false,
    message: statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred'
      : err.message || 'Unexpected error',
  };

  if (process.env.NODE_ENV !== 'production') {
    body.error = { type: err.name || 'Error', details: err.details || null };
  }

  return res.status(statusCode).json(body);
};
