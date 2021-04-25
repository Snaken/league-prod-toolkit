import { ToolkitConfig } from '.'

export interface PackageJson {
  name: string
  version: string
  author: string
  toolkit: ToolkitConfig
}
