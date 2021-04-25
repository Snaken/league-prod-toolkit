import { ModuleType, PackageJson, Plugin, ToolkitConfig } from '.'

export class Module {
  packageJson: PackageJson
  plugin: undefined | Plugin
  folder: string

  constructor (packageJson: any, folder: string) {
    this.packageJson = packageJson
    this.folder = folder
  }

  public getName (): string {
    return this.packageJson.name
  }

  public getVersion (): string {
    return this.packageJson.version
  }

  public getAuthor (): string {
    return this.packageJson.author
  }

  public getConfig (): ToolkitConfig {
    return this.packageJson.toolkit
  }

  public hasMode (mode: ModuleType): boolean {
    return this.getConfig().modes.includes(mode)
  }

  public hasPlugin (): boolean {
    return this.plugin !== undefined
  }

  public getPlugin (): Plugin | undefined {
    return this.plugin
  }

  public getFolder (): string {
    return this.folder
  }

  public getIsDisabled (): boolean {
    return this.getConfig().disabled === true
  }

  public getScope (): string {
    return this.getConfig().scope
  }

  toJson (goDeep: boolean = true): any {
    return {
      name: this.getName(),
      version: this.getVersion(),
      author: this.getAuthor(),
      folder: this.getFolder(),
      config: this.getConfig(),
      plugin: goDeep ? this.getPlugin()?.toJson(false) : null
    }
  }
}
