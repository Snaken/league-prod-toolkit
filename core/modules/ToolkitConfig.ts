import { ModuleType, PluginConfig } from '.'

export interface ToolkitConfig {
  modes: ModuleType[]
  plugin?: PluginConfig
  disabled?: boolean
  scope: string
}
