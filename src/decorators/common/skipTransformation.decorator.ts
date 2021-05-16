import 'reflect-metadata'

import { SKIP_TRANSFORMATION } from '../../configs/metaKey.config'

export const SkipTransformation = (): MethodDecorator => {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(SKIP_TRANSFORMATION, true, descriptor.value)
  }
}
