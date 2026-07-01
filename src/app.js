/**
 * @file app.js
 * @description Express application factory.
 */

import express from 'express';
import setup from './middleware/setup.js';
import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import env from './config/env.js';

const createApp = () => {
  const app = express();

  setup(app);

  // Root welcome
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: `Welcome to ${env.api.name} 🎵`,
      version: env.api.version,
      endpoints: `/api/${env.api.version}`,
      health: `/api/${env.api.version}/health`,
      docs: {
        search:    `/api/${env.api.version}/search?q=blinding+lights`,
        songs:     `/api/${env.api.version}/songs/{id}`,
        lyrics:    `/api/${env.api.version}/songs/{id}/lyrics`,
        albums:    `/api/${env.api.version}/albums/{id}`,
        artists:   `/api/${env.api.version}/artists/{id}`,
        playlists: `/api/${env.api.version}/playlists/{id}`,
        trending:  `/api/${env.api.version}/trending`,
      },
    });
  });

  app.use(`/api/${env.api.version}`, routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
