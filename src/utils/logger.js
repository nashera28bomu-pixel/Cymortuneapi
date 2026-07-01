/**
 * @file utils/logger.js
 * @description Centralized structured logger. Respects LOG_LEVEL env var.
 */

import env from '../config/env.js';

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const MIN_LEVEL = LEVELS[process.env.LOG_LEVEL || (env.isProd ? 'warn' : 'debug')] ?? 0;
const ts = () => new Date().toISOString();

const log = (level, ...args) => {
  if (LEVELS[level] < MIN_LEVEL) return;
  const prefix = `[${ts()}] [${level.toUpperCase()}]`;
  if (level === 'error') console.error(prefix, ...args);
  else if (level === 'warn') console.warn(prefix, ...args);
  else console.log(prefix, ...args);
};

export default {
  debug: (...a) => log('debug', ...a),
  info:  (...a) => log('info',  ...a),
  warn:  (...a) => log('warn',  ...a),
  error: (...a) => log('error', ...a),
};
