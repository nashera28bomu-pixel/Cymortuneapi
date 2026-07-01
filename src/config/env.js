/**
 * @file config/env.js
 * @description Validates and exports all environment variables.
 * Nothing else in the app touches process.env directly.
 */

import 'dotenv/config';

const get = (key, defaultValue = undefined) => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`[Config] Missing required environment variable: ${key}`);
  }
  return value;
};

const getInt = (key, defaultValue) => parseInt(get(key, String(defaultValue)), 10);

const env = {
  NODE_ENV: get('NODE_ENV', 'development'),
  isProd: get('NODE_ENV', 'development') === 'production',
  PORT: getInt('PORT', 5000),

  provider: {
    baseUrl: get('JIOSAAVN_BASE_URL', 'https://saavn.dev/api'),
    timeout: getInt('PROVIDER_TIMEOUT', 15000),
  },

  cache: {
    ttl: getInt('CACHE_TTL', 600),
    maxKeys: getInt('CACHE_MAX_KEYS', 1000),
  },

  rateLimit: {
    max: getInt('RATE_LIMIT_MAX', 120),
    windowMinutes: getInt('RATE_LIMIT_WINDOW', 15),
  },

  allowedOrigins: get('ALLOWED_ORIGINS', '*'),

  api: {
    version: get('API_VERSION', 'v1'),
    name: get('API_NAME', 'Cymor Tune API'),
  },
};

export default env;
