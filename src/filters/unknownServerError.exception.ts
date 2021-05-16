import { HttpException, HttpStatus } from '@nestjs/common'

export class UnknownServerErrorException extends HttpException {
  constructor(location = 'unknown', err = null) {
    super(
      {
        title: 'Server Error!',
        type: 'UnknownServerError',
        errorCode: '10000',
        message: 'Unknown error, see error log',
        location,
        err
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
