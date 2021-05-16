import { classToPlain, plainToClass } from 'class-transformer'
import { validateSync, ValidationError } from 'class-validator'
import {
  compact,
  flatten,
  forEach,
  get,
  isArray,
  isEmpty,
  isUndefined,
  map,
  omitBy,
  some
} from 'lodash'

import { ValidationErrorException } from '@filters/validationError.exception'

const generateErrorMsg = (errors: ValidationError, initial = ''): any[] => {
  return map(errors, (error) => {
    if (!error.contraints && !isEmpty(get(error, 'children', []))) {
      return {
        path: `${initial}${get(error, 'property')}`,
        children: generateErrorMsg(error.children)
      }
    }
    const constraints = get(error, 'constraints', null)
    return {
      path: `${initial}${get(error, 'property')}`,
      msg: constraints ? JSON.stringify(constraints) : 'error unknown',
      value: get(error, 'value')
    }
  })
}

const transformErrorMsg = (errMsg: any[]) => {
  const result = []
  const handleChildren = (children, currentPath = '') => {
    forEach(children, (child) => {
      const newPath =
        currentPath === '' ? child.path : `${currentPath}.${child.path}`
      if (child.msg) {
        result.push({
          path: newPath,
          msg: child.msg,
          value: child.value
        })
      } else {
        handleChildren(child.children, newPath)
      }
    })
  }
  handleChildren(errMsg)
  return result
}

export const getErrorMsg = (err, arrResponse = false): any[] => {
  let errorMsg
  if (arrResponse) {
    errorMsg = flatten(
      compact(
        map(err, (e, index) => {
          if (isEmpty(e)) {
            return null
          }
          return generateErrorMsg(e, `${index}.`)
        })
      )
    )
  } else {
    errorMsg = generateErrorMsg(err)
  }

  return transformErrorMsg(errorMsg)
}

export const validateAndTransform = (
  classType: any,
  value: Record<string, unknown> | any[],
  location: string
): Record<string, unknown> | any[] => {
  const classObject = plainToClass(classType, value, classTransformOptions)
  if (isArray(classObject)) {
    const errors = map(classObject, (objectElement) =>
      validateSync(objectElement, validatorOptions)
    )
    if (some(errors, (error) => error.length !== 0)) {
      throw new ValidationErrorException(location, getErrorMsg(errors, true))
    }
    return map(classToPlain(classObject), (obj) => omitBy(obj, isUndefined))
  } else {
    const errors = validateSync(
      classObject as Record<string, unknown>,
      validatorOptions
    )
    if (errors.length) {
      throw new ValidationErrorException(location, getErrorMsg(errors, false))
    }
    return omitBy(classToPlain(classObject), isUndefined)
  }
}

export const validatorOptions = {
  validationError: {
    target: false,
    value: true
  }
}

export const classTransformOptions = {
  enableImplicitConversion: true
}
