import { Router } from 'express';
import * as ctrl from '../controllers/trending.controller.js';

const router = Router();

router.get('/',             ctrl.getTrending);
router.get('/charts',       ctrl.getCharts);
router.get('/new-releases', ctrl.getNewReleases);

export default router;
