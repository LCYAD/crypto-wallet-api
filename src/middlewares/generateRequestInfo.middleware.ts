import { Injectable, NestMiddleware } from '@nestjs/common'

import { Request, Response } from 'express'
import { get, includes } from 'lodash'
import * as uniqid from 'uniqid'

import { logger } from '@utils/logger.util'
import { Session } from '@utils/session.util'

@Injectable()
export class GenerateRequestInfoMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next): void {
    const requestID = uniqid.process('api-')
    const requestInfo = {
      path: get(req, 'params.0'),
      method: get(req, 'method'),
      requestID,
      logAPICall: includes(get(req, 'headers.admin-options'), 'logAPICall')
    }
    Session.set('requestInfo', requestInfo)
    logger.info({
      ...requestInfo,
      type: 'API Call Logger',
      query: get(req, 'query'),
      body: get(req, 'body')
    })
    next()
  }
}
