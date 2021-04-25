import path from 'path'
import { Logger } from 'winston'
import { Plugin } from '.'
import lpteService from '../eventbus/LPTEService'
import { LPTE } from 'eventbus/LPTE'
import logger from '../logging'

export class PluginContext {
  log: Logger
  require: (file: string) => any
  LPTE: LPTE
  plugin: Plugin

  constructor (plugin: Plugin) {
    this.log = logger(`plugin-${plugin.getModule().getName()}`)
    this.require = (file: string) => require(path.join(plugin.getModule().getFolder(), file))
    this.LPTE = lpteService.forPlugin(plugin)
    this.plugin = plugin
  }
}
