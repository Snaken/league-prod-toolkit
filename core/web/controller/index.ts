import modules from './modules';
import home from './home';
import plugins from './plugins';
import events from './events';

export default {
  '/': home,
  '/modules': modules,
  '/plugins': plugins,
  '/events': events
};
