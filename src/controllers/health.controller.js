/**
 * @file controllers/health.controller.js
 */

import os from 'os';
import cache from '../config/cache.js';
import env from '../config/env.js';
import response from '../utils/response.js';

export const health = (req, res) => {
  const uptime = process.uptime();
  return response.success(res, {
    status: 'ok',
    uptime_seconds: Math.floor(uptime),
    memory: {
      used_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total_mb: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
    node_version: process.version,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  }, 'Cymor Tune API is healthy');
};

export const status = async (req, res, next) => {
  try {
    const cacheStats = cache.stats();
    return response.success(res, {
      api: { name: env.api.name, version: env.api.version, status: 'operational' },
      provider: { name: 'jiosaavn', base_url: env.provider.baseUrl },
      cache: {
        keys: cacheStats.keys,
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        hit_rate: cacheStats.hits + cacheStats.misses > 0
          ? ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1) + '%'
          : 'N/A',
      },
      system: {
        platform: os.platform(),
        node_version: process.version,
        uptime_seconds: Math.floor(process.uptime()),
      },
      timestamp: new Date().toISOString(),
    }, 'Status check complete');
  } catch (err) { next(err); }
};
