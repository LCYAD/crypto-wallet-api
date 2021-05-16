import { HttpException, HttpStatus } from '@nestjs/common'

export class DtoNotFoundErrorException extends HttpException {
  constructor(location = 'unknown', err = null) {
    super(
      {
        title: 'Dto not found!',
        type: 'DtoNotFoundError',
        errorCode: '10001',
        message: 'Could not find Dto reference',
        location,
        err
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
