/**
 * @file config/cache.js
 * @description In-memory cache (NodeCache) for v1. Designed so a future
 * Redis-backed cache can swap in behind the same get/set/remember interface
 * without touching any service code.
 */

import NodeCache from 'node-cache';
import env from './env.js';

const cache = new NodeCache({
  stdTTL: env.cache.ttl,
  checkperiod: Math.floor(env.cache.ttl / 2),
  maxKeys: env.cache.maxKeys,
  useClones: false,
});

const get = (key) => cache.get(key);
const set = (key, value, ttl = env.cache.ttl) => cache.set(key, value, ttl);
const del = (key) => cache.del(key);
const clear = () => cache.flushAll();
const stats = () => ({ ...cache.getStats(), keys: cache.keys().length });

const remember = async (key, fn, ttl = env.cache.ttl) => {
  const cached = get(key);
  if (cached !== undefined) return cached;
  const fresh = await fn();
  if (fresh !== undefined && fresh !== null) set(key, fresh, ttl);
  return fresh;
};

const buildKey = (...parts) =>
  parts.map((p) => String(p).toLowerCase().replace(/[^a-z0-9_:-]/g, '_')).join(':');

export default { get, set, del, clear, stats, remember, buildKey };
