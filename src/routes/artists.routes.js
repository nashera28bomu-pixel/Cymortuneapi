import { Router } from 'express';
import * as ctrl from '../controllers/artists.controller.js';

const router = Router();

router.get('/:id',        ctrl.getArtist);
router.get('/:id/songs',  ctrl.getArtistSongs);
router.get('/:id/albums', ctrl.getArtistAlbums);

export default router;
