/**
 * @file routes/index.js
 * @description Central route registry. Mount all route modules here.
 */

import { Router } from 'express';
import searchRoutes    from './search.routes.js';
import songsRoutes     from './songs.routes.js';
import albumsRoutes    from './albums.routes.js';
import artistsRoutes   from './artists.routes.js';
import playlistsRoutes from './playlists.routes.js';
import trendingRoutes  from './trending.routes.js';
import healthRoutes    from './health.routes.js';

const router = Router();

router.use('/search',    searchRoutes);
router.use('/songs',     songsRoutes);
router.use('/albums',    albumsRoutes);
router.use('/artists',   artistsRoutes);
router.use('/playlists', playlistsRoutes);
router.use('/trending',  trendingRoutes);
router.use('/',          healthRoutes);

export default router;
