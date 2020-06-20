import { Router } from 'express';

import lpteService from '../../eventbus/LPTEService';

const router = Router();

router.get('/', (req, res) => {
  res.render('events', { title: 'Events', events: lpteService.eventHistory });
});
router.get('/api', (req, res) => {
  res.json(lpteService.eventHistory.map(evt => JSON.stringify(evt)));
});

export default router;
