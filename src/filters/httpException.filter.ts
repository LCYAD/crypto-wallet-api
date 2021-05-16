import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'

import { get, omit } from 'lodash'

import { logger } from '@utils/logger.util'
import { Session } from '@utils/session.util'

import { APIRouteNotFoundErrorException } from './apiRouteNotFoundError.exception'
import { UnauthorizedAccessErrorException } from './unauthorizedAccessError.exception'
import { UnknownServerErrorException } from './unknownServerError.exception'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    let status
    let errContent
    let err
    let location
    try {
      if (exception instanceof NotFoundException) {
        throw new APIRouteNotFoundErrorException()
      }
      if (exception instanceof UnauthorizedException) {
        throw new UnauthorizedAccessErrorException()
      }
      if (
        !exception.getStatus ||
        (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR &&
          !(exception instanceof HttpException))
      ) {
        throw new UnknownServerErrorException('see stack', exception.stack)
      }
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      location = get(exceptionResponse, 'location', 'unknown')
      err = get(exceptionResponse, 'err', null)
      errContent = omit(exceptionResponse as Record<string, unknown>, [
        'err',
        'location'
      ])
    } catch (e) {
      status = e.status
      ;({ location, err, ...errContent } = e.response)
    }
    const requestInfo = Session.get('requestInfo')
    logger.error({
      status,
      location: {
        errorPoint: location,
        requestInfo
      },
      type: errContent.type,
      err
    })
    response.status(status).json({
      ...errContent
    })
  }
}
