import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  Type
} from '@nestjs/common'

import { includes, isArray } from 'lodash'

import { ValidationErrorException } from '@filters/validationError.exception'
import { validateAndTransform } from '@utils/validation.util'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    if (isArray(value)) {
      throw new ValidationErrorException(
        'ValidationPipe',
        'request does not allow data of array type'
      )
    }
    return validateAndTransform(metatype, value, 'ValidationPipe')
  }

  private toValidate(metatype: Type<any>): boolean {
    const typesToSkip = [String, Boolean, Number, Array, Object]
    return !includes(typesToSkip, metatype)
  }
}
