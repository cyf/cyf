import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import {
  isEmpty,
  isIn,
  isString,
  isNumberString,
  isUUID,
} from 'class-validator'
import logger from '../logger/logger'

@Injectable()
export class HeadersMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    logger.debug('[HeadersMiddleware]: use.')
    const path = req.originalUrl
    if (
      !path.match(/^\/api/) ||
      path.match(/^\/api\/health/) ||
      path.match(/^\/api\/user\/email\/verify\//)
    ) {
      next()
      return
    }

    const query = req.query
    const nonce = query['nonce']
    const timestampStr = query['timestamp']
    if (!isString(nonce) || !isUUID(nonce, 4)) {
      throw new BadRequestException('The nonce must be a uuid v4 string')
    }

    if (
      !isString(timestampStr) ||
      !isNumberString(timestampStr, { no_symbols: true })
    ) {
      throw new BadRequestException('The timestamp must be an integer')
    }

    const headers = req.headers
    const xSign = headers['x-sign']
    const xChannel = headers['x-channel']
    const xVersion = headers['x-version']
    const xLocale = headers['x-locale']
    if (
      isEmpty(xSign) ||
      !isString(xSign) ||
      isEmpty(xChannel) ||
      !isString(xChannel) ||
      !isIn(xChannel, ['WEB']) ||
      isEmpty(xVersion) ||
      !isString(xVersion) ||
      isEmpty(xLocale) ||
      !isString(xLocale) ||
      !isIn(xLocale, ['en', 'zh'])
    ) {
      throw new BadRequestException('Invalid request header')
    }

    next()
  }
}
