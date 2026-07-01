import { Router } from 'express';
import * as ctrl from '../controllers/songs.controller.js';

const router = Router();

// GET /api/v1/songs/:id
router.get('/:id',             ctrl.getSong);
// GET /api/v1/songs/:id/lyrics
router.get('/:id/lyrics',      ctrl.getLyrics);
// GET /api/v1/songs/:id/suggestions
router.get('/:id/suggestions', ctrl.getSuggestions);

export default router;
