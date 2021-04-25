import { EventbusTransport } from 'logging'
import winston, { Logger } from 'winston'

const customFormat = winston.format.printf(
  info =>
    `${info.timestamp as string} [${info.level.padEnd(15)}] ${`\u001b[95m${info.label as string}\u001b[39m`.padEnd(
      22
    )}: ${info.message}`
)

export const eventbusTransport = new EventbusTransport()

const createLogger = (label: string): Logger =>
  winston.createLogger({
    level: process.env.LOGLEVEL ?? 'debug',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      customFormat
    ),
    defaultMeta: { label },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      // new winston.transports.File({ filename: 'error.log', level: 'error' }),
      // new winston.transports.File({ filename: 'combined.log' })
      new winston.transports.Console(),
      eventbusTransport
    ]
  })

export default (label: string): Logger => createLogger(label)
