import { classToPlain, plainToClass } from 'class-transformer'
import * as _ from 'lodash'

import { classTransformOptions } from './validation.util'

export const transformObj = <T>({
  from: value,
  to: Dto
}: {
  from: any
  to: new (...arg) => T
}): T => {
  const classObject = plainToClass(Dto, value, classTransformOptions)
  return _.omitBy(classToPlain(classObject), _.isUndefined) as T
}

export const transformArray = <T>({
  from: value,
  to: Dto
}: {
  from: any[]
  to: new (...arg) => T
}): T[] => {
  const classObject = plainToClass(Dto, value, classTransformOptions)
  return _.map(classToPlain(classObject), (obj) =>
    _.omitBy(obj, _.isUndefined)
  ) as T[]
}
