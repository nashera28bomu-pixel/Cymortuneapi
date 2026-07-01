/**
 * @file config/axios.js
 * @description Single shared Axios instance for all upstream provider calls.
 * Centralizes timeout, headers, and error normalization so services never
 * touch axios directly.
 */

import axios from 'axios';
import env from './env.js';
import logger from '../utils/logger.js';
import { ProviderError, TimeoutError } from '../utils/errors.js';

const providerClient = axios.create({
  baseURL: env.provider.baseUrl,
  timeout: env.provider.timeout,
  headers: {
    Accept: 'application/json',
    'User-Agent': 'CymorTune/1.0 (+https://cymortune.app)',
  },
});

providerClient.interceptors.request.use((config) => {
  config.metadata = { start: Date.now() };
  return config;
});

providerClient.interceptors.response.use(
  (response) => {
    const ms = Date.now() - response.config.metadata.start;
    logger.debug(`[Provider] ${response.config.method.toUpperCase()} ${response.config.url} — ${ms}ms`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new TimeoutError(`Provider request timed out: ${error.config?.url}`);
    }
    if (error.response) {
      throw new ProviderError(
        `Provider returned ${error.response.status} for ${error.config?.url}`
      );
    }
    throw new ProviderError(`Provider unreachable: ${error.message}`);
  }
);

export default providerClient;
