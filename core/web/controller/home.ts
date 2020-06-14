import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Home', version: '0.0.1' });
});

export default router;
