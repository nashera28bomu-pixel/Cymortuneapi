/**
 * @file middleware/setup.js
 * @description Registers all application-level middleware.
 */

import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import express from 'express';
import env from '../config/env.js';

const buildCors = () => {
  if (env.allowedOrigins === '*') return { origin: '*', methods: ['GET', 'OPTIONS'] };
  const list = env.allowedOrigins.split(',').map((o) => o.trim());
  return {
    origin: (origin, cb) => {
      if (!origin || list.includes(origin)) cb(null, true);
      else cb(new Error(`CORS: ${origin} not allowed`));
    },
    methods: ['GET', 'OPTIONS'],
  };
};

const buildRateLimiter = () =>
  rateLimit({
    windowMs: env.rateLimit.windowMinutes * 60 * 1000,
    max: env.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please slow down.' },
    skip: (req) => req.path === '/api/v1/health',
  });

const setup = (app) => {
  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }));
  app.use(compression());
  app.use(cors(buildCors()));
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan(env.isProd ? 'combined' : 'dev'));
  app.use(buildRateLimiter());
};

export default setup;
