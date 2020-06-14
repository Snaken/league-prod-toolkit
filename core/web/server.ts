import express from 'express';
import path from 'path';

import logging from '../logging';
import controller from './controller';

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
for (let [key, value] of Object.entries(controller)) {
  app.use(key, value);
  log.debug(`Registered route: ${key}`);
}
/* app.get('/', (req, res) => {
  res.render('index', { title: 'Home', version: '0.0.1' });
}); */

/**
 * Run server
 */
export const runServer = () => {
  app.listen(port, () => {
    log.info(`Listening for requests on http://localhost:${port}`);
  });
};
