import { ModuleType } from 'modules'
import { EventType, LPTEventInput } from '.'

export type LPTEvent = LPTEventInput & {
  meta: {
    sender?: {
      name: string
      version: string
      mode: ModuleType
    }
    channelType?: EventType
    reply?: string
  }
}
