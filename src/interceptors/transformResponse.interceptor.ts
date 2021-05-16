import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'

import { classToPlain, plainToClass } from 'class-transformer'
import * as _ from 'lodash'
import { ConfigService } from 'nestjs-config'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { DtoNotFoundErrorException } from '@filters/dtoNotFoundError.exception'

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const call$ = next.handle()
    const request = context.switchToHttp().getRequest()
    const urlPath = request.url
    const skipTransformation = Reflect.getMetadata(
      this.config.get('metaKey.SKIP_TRANSFORMATION'),
      context.getHandler()
    )
    if (skipTransformation) {
      return call$
    } else {
      return call$.pipe(
        map((response) => {
          const apiResponses = Reflect.getMetadata(
            this.config.get('metaKey.RESDTO'),
            context.getHandler()
          )
          const successApiResponseDto = _.chain(apiResponses)
            .map((value, key) => ({
              ...value,
              status: _.toInteger(key)
            }))
            .filter((apiResponse) => apiResponse.status < 300)
            .head()
            .value()
          const resDtoClass = _.get(successApiResponseDto, 'type', null)
          if (!resDtoClass) {
            throw new DtoNotFoundErrorException(
              'TransformResponseInterceptor - intercept',
              `Api Response Dto Not Found at path ${urlPath}`
            )
          } else {
            return classToPlain(
              plainToClass(resDtoClass, response, {
                enableImplicitConversion: true
              })
            )
          }
        })
      )
    }
  }
}
