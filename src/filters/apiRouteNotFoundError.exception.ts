import { HttpException, HttpStatus } from '@nestjs/common'

export class APIRouteNotFoundErrorException extends HttpException {
  constructor(location = 'unknown', err = null) {
    super(
      {
        title: 'Invalid API Call!',
        type: 'APIRouteNotFoundError',
        errorCode: '10401',
        message: 'Request API route does not exist',
        location,
        err
      },
      HttpStatus.NOT_FOUND
    )
  }
}
