import { Router } from 'express';

import moduleService from '../../modules/ModuleService';

const router = Router();

router.get('/', (req, res) => {
  res.render('plugins', { title: 'Plugins', plugins: moduleService.activePlugins });
});
router.get('/api', (req, res) => {
  res.json(moduleService.activePlugins.map((plugin) => plugin.toJson()));
});

export default router;
