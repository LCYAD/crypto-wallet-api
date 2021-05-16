import * as pino from 'pino'

export const logger = pino({
  level: 'info',
  customLevels: {
    audit: 35
  }
})
