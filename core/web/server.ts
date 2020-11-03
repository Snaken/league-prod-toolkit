import express from 'express';
import path from 'path';

import logging from '../logging';
import globalContext from './globalContext';
import getController from './controller';

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
app.use(
  '/vendor/jquery',
  express.static(path.join(__dirname, '../../../node_modules/jquery/dist'))
)
app.use(
  '/vendor/jspath',
  express.static(path.join(__dirname, '../../../node_modules/jspath'))
)
app.use(express.json());

/**
 * Routes
 */
for (let [key, value] of Object.entries(getController(globalContext))) {
  app.use(key, value);
  log.debug(`Registered route: ${key}`);
}

/**
 * Run server
 */
export const runServer = () => {
  app.listen(port, () => {
    log.info(`Listening for requests on http://localhost:${port}`);
  });
};
