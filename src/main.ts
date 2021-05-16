import * as dotenv from 'dotenv'
const result = dotenv.config()
if (result.error) {
  throw result.error
}

if (!process.env.NO_ALIAS) {
  require('module-alias/register')
}

import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { createNamespace } from 'cls-hooked'

import { HttpExceptionFilter } from '@filters/httpException.filter'
import { ValidationPipe } from '@pipes/validation.pipe'
import { logger } from '@utils/logger.util'

import { AppModule } from './app.module'
import { SESSION_NAMESPACE } from './configs/metaKey.config'

async function bootstrap() {
  createNamespace(SESSION_NAMESPACE)
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn']
  })

  const configService = app.get('ConfigService')
  const port = configService.get('app.APP.port')
  app.enableCors()
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe())

  if (process.env.APP_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Crypto Wallet API')
      .setDescription('Crypto Wallet API')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('docs', app, document)
  }

  await app.listen(port, () =>
    logger.info(`application running on port ${port}`)
  )
}
bootstrap()
