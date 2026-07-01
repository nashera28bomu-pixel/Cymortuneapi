import { Router } from 'express';
import * as ctrl from '../controllers/albums.controller.js';

const router = Router();

router.get('/:id', ctrl.getAlbum);
router.get('/',    ctrl.getAlbum); // ?link=...

export default router;
