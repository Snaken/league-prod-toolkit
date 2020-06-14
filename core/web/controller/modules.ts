import { Router } from 'express';

import moduleService from '../../modules/ModuleService';

const router = Router();

router.get('/', (req, res) => {
  res.render('modules', { title: 'Modules', modules: moduleService.modules });
});
router.get('/api', (req, res) => {
  res.json(moduleService.modules.map((module) => module.toJson()));
});

export default router;
