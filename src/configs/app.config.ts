import secret from '../../secret'

export const APP = {
  env: secret.APP_ENV,
  port: secret.DEV_PORT ? parseInt(secret.DEV_PORT, 10) : 3000
}
