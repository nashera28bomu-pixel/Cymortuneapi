import { Router } from 'express';
import * as ctrl from '../controllers/search.controller.js';

const router = Router();

// GET /api/v1/search?q=blinding+lights
router.get('/',          ctrl.searchAll);
router.get('/songs',     ctrl.searchSongs);
router.get('/albums',    ctrl.searchAlbums);
router.get('/artists',   ctrl.searchArtists);
router.get('/playlists', ctrl.searchPlaylists);

export default router;
