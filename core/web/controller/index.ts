import modules from './modules';
import home from './home';
import plugins from './plugins';
import events from './events';
import api from './api';

export default {
  '/': home,
  '/modules': modules,
  '/plugins': plugins,
  '/events': events,
  '/api': api
};
