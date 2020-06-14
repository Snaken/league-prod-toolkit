import minimist from 'minimist';

import logger from './logging';
import { runServer } from './web/server';
import moduleService from './modules/ModuleService';

const argv = minimist(process.argv.slice(2));

const log = logger('main');

log.info(' _          _       _____           _ _    _ _   ');
log.info('| |    ___ | |     |_   _|__   ___ | | | _(_) |_ ');
log.info('| |   / _ \\| |       | |/ _ \\ / _ \\| | |/ / | __|');
log.info('| |__| (_) | |___    | | (_) | (_) | |   <| | |_ ');
log.info('|_____\\___/|_____|   |_|\\___/ \\___/|_|_|\\_\\_|\\__|');
log.info('');

const main = async () => {
  await moduleService.initialize();

  runServer();
};

main();
