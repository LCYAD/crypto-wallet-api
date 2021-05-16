import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { ConfigModule } from 'nestjs-config'
import * as path from 'path'

import { TransformResponseInterceptor } from '@interceptors/transformResponse.interceptor'
import { GenerateRequestInfoMiddleware } from '@middlewares/generateRequestInfo.middleware'
import { SessionMiddleware } from '@middlewares/sessions.middleware'
import { HealthzModule } from '@modules/healthz/healthz.module'

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'configs', '**/!(*.d).{ts,js}'), {
      modifyConfigName: (name) => name.replace('.config', '')
    }),
    HealthzModule
  ],
  controllers: [],
  providers: [
    // Interceptor sequence (output):
    // TransformResponseInterceptor
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware, GenerateRequestInfoMiddleware)
      .forRoutes('*')
  }
}
