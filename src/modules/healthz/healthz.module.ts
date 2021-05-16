import { Module } from '@nestjs/common'

import { HealthzController } from './controllers/healthz.controller'

@Module({
  imports: [],
  controllers: [HealthzController],
  providers: []
})
export class HealthzModule {}
