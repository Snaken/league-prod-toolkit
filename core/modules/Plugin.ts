import path from 'path'
import { Module, ModuleService, PluginContext, PluginStatus } from '.'

export class Plugin {
  isLoaded = false
  status = PluginStatus.UNAVAILABLE
  module: Module
  context: undefined | PluginContext

  constructor (module: Module) {
    this.module = module
    this.isLoaded = true
  }

  getModule (): Module {
    return this.module
  }

  getPluginConfig (): any {
    return this.module.getConfig().plugin
  }

  getMain (): string {
    return this.getPluginConfig().main
  }

  getScope (): string {
    return this.module.getConfig().scope
  }

  toJson (goDeep: boolean = true): any {
    return {
      pluginConfig: this.getPluginConfig(),
      main: this.getMain(),
      module: goDeep ? this.getModule().toJson(false) : null,
      isLoaded: this.isLoaded,
      status: this.status
    }
  }

  async initialize (svc: ModuleService): Promise<null> {
    // Craft context
    this.context = new PluginContext(this)

    const mainFile = this.getMain()
    const { default: main } = await import(path.join(this.getModule().getFolder(), mainFile))
    console.log(main)

    // Execute main
    main(this.context)

    return null
  }
}
