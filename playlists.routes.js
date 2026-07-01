import { Router } from 'express';
import * as ctrl from '../controllers/playlists.controller.js';

const router = Router();

router.get('/:id', ctrl.getPlaylist);
router.get('/',    ctrl.getPlaylist); // ?link=...

export default router;
