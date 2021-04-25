import { LogTransportInfo } from 'logging'
import Transport from 'winston-transport'
import { LPTE } from '../eventbus'

export class EventbusTransport extends Transport {
  lpte?: LPTE

  constructor (opts: any = {}) {
    super(opts)

    this.log = this.log.bind(this)
  }

  log (info: LogTransportInfo, callback: () => void): void {
    if (info.level.includes('error') && this.lpte !== undefined) {
      this.lpte.emit({
        meta: {
          namespace: 'log',
          type: 'message',
          version: 1
        },
        log: info
      })
    }

    callback()
  }
}
