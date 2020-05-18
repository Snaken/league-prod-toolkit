import { promisify } from 'util';
import { readdir, stat, exists } from 'fs';
import path from 'path';

import logging from '../logging';
import Module, { ModuleType, Plugin } from './Module';

const readdirPromise = promisify(readdir);
const statPromise = promisify(stat);
const existsPromise = promisify(exists);
const log = logging('ModuleSrv');

export class ModuleService {
  modules: Module[] = [];
  activePlugins: Plugin[] = [];
  // activeStandalones: Standalone[] = [];

  public async initialize() {
    log.info('Initializing module service.');
    const modulePath = path.join(__dirname, '../../../modules');
    log.debug(`Modules path: ${modulePath}`);
    const data = await readdirPromise(modulePath);
    const allModules = await Promise.all(
      data.map((folderName) =>
        this.handleFolder(path.join(modulePath, folderName))
      )
    );

    this.modules = allModules.filter((module) => module) as Module[];
    log.info(
      `Initialized ${this.modules.length} module(s). Now loading plugins.`
    );

    this.activePlugins = await this.loadPlugins();
    log.info(`Loaded ${this.activePlugins.length} plugin(s).`);
  }

  private async loadPlugins(): Promise<Plugin[]> {
    const possibleModules = this.modules.filter((module) =>
      module.hasMode(ModuleType.PLUGIN)
    );

    return await Promise.all(
      possibleModules.map((module) => this.loadPlugin(module))
    );
  }

  private async loadPlugin(module: Module): Promise<Plugin> {
    const plugin = module as Plugin;

    return plugin;
  }

  private async handleFolder(folder: string) {
    const statData = await statPromise(folder);

    if (!statData.isDirectory()) {
      log.debug(
        `Expected ${folder} to be a directory, but it wasn't. Skipping.`
      );
      return null;
    }

    return await this.handleModule(folder);
  }

  private async handleModule(folder: string): Promise<Module | null> {
    const packageJsonPath = path.join(folder, 'package.json');

    if (!(await existsPromise(packageJsonPath))) {
      log.debug(
        `Expected ${packageJsonPath} to exist, but it didn't. Skipping.`
      );
      return null;
    }

    if (!(await statPromise(packageJsonPath)).isFile()) {
      log.debug(
        `Expected ${packageJsonPath} to be a file, but it wasn't. Skipping.`
      );
      return null;
    }

    const packageJson = require(packageJsonPath);

    return new Module(packageJson);
  }
}
