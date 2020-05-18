export enum ModuleType {
  STANDALONE = 'STANDALONE',
  PLUGIN = 'PLUGIN',
}

export default class Module {
  packageJson: any = {};

  constructor(packageJson: any) {
    this.packageJson = packageJson;
  }

  public getName(): string {
    return this.packageJson.name;
  }

  public getMeta(): any {
    return this.packageJson['league-prod-toolkit'];
  }

  public getModes(): ModuleType[] {
    return this.getMeta().modes.map((mode: string) => mode.toUpperCase());
  }

  public hasMode(mode: ModuleType): boolean {
    return this.getModes().includes(mode);
  }
}

export class Plugin extends Module {
  isLoaded = false;

  getPluginConfig(): any {
    return this.getMeta().plugin;
  }

  getMain(): string {
    return this.getPluginConfig().main;
  }
}
