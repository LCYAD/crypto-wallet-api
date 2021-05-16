import { Injectable, NestMiddleware } from '@nestjs/common'

import { getNamespace } from 'cls-hooked'
import { Request, Response } from 'express'

import { SESSION_NAMESPACE } from '../configs/metaKey.config'

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(_req: Request, _res: Response, next): void {
    const nameSpace = getNamespace(SESSION_NAMESPACE)
    nameSpace.run(async () => {
      next()
    })
  }
}
