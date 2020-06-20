export enum ModuleType {
  STANDALONE = 'STANDALONE',
  PLUGIN = 'PLUGIN',
}

export type PackageJson = {
  name: string;
  version: string;
  author: string;
  toolkit: ToolkitConfig;
};

export type PluginConfig = {
  main: string;
};

export type ToolkitConfig = {
  modes: Array<ModuleType>;
  plugin: undefined | PluginConfig;
};

export default class Module {
  packageJson: PackageJson;
  plugin: undefined | Plugin;

  constructor(packageJson: any) {
    this.packageJson = packageJson;
  }

  public getName(): string {
    return this.packageJson.name;
  }

  public getVersion(): string {
    return this.packageJson.version;
  }

  public getAuthor(): string {
    return this.packageJson.author;
  }

  public getConfig(): ToolkitConfig {
    return this.packageJson.toolkit;
  }

  public hasMode(mode: ModuleType): boolean {
    return this.getConfig().modes.includes(mode);
  }

  public hasPlugin(): boolean {
    return this.plugin !== undefined;
  }

  public getPlugin() {
    return this.plugin;
  }

  toJson(goDeep: boolean = true): any {
    return {
      name: this.getName(),
      version: this.getVersion(),
      author: this.getAuthor(),
      config: this.getConfig(),
      plugin: goDeep ? this.getPlugin()?.toJson(false) : null,
    };
  }
}

export class Plugin {
  isLoaded = false;
  isRunning = false;
  module: Module;

  constructor(module: Module) {
    this.module = module;
    this.isLoaded = true;
  }

  getModule() {
    return this.module;
  }

  getPluginConfig(): any {
    return this.module.getConfig().plugin;
  }

  getMain(): string {
    return this.getPluginConfig().main;
  }

  toJson(goDeep: boolean = true): any {
    return {
      pluginConfig: this.getPluginConfig(),
      main: this.getMain(),
      module: goDeep ? this.getModule().toJson(false) : null,
      isLoaded: this.isLoaded,
      isRunning: this.isRunning,
    };
  }

  initialize() {
    const main = this.getMain();
    console.log(main);
  }
}
