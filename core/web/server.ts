import express from 'express';
import path from 'path';

import logging from '../logging';

/**
 * App Variables
 */
const log = logging('server');
const app = express();
const port = process.env.PORT || '3003';

/**
 * App Configuration
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(
  '/vendor/bootstrap',
  express.static(path.join(__dirname, '../../../node_modules/bootstrap/dist'))
);

console.log(path.join(__dirname, '../../node_modules/bootstrap/dist'));

/**
 * Routes
 */
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', version: 'v0.0.1' });
});

app.get('/modules', (req, res) => {
  res.render('modules', { title: 'Modules', modules: [] });
});

/**
 * Run server
 */
export const runServer = () => {
  app.listen(port, () => {
    log.info(`Listening for requests on http://localhost:${port}`);
  });
};
