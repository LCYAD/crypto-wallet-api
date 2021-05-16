import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { SkipTransformation } from '@decorators/common/skipTransformation.decorator'

@ApiTags('Healthz')
@Controller('healthz')
export class HealthzController {
  @Get()
  @SkipTransformation()
  @ApiOperation({
    summary: 'CheckHealth',
    description: '- Check if api is up or not'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK'
  })
  checkHealth(): string {
    return 'OK'
  }
}
