'use strict'

import devConfig from './config.development'
import localConfig from './config.local'

const getConfig = () => {
  switch (process.env.APP_ENV) {
    case 'development':
      return devConfig
    case 'local':
      return localConfig
    default:
      return devConfig
  }
}

export default getConfig()
