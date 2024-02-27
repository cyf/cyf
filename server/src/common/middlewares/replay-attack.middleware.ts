import {
  BadRequestException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { isString, isNumberString, isUUID } from 'class-validator'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { sign } from '@/common/utils/sign'
import logger from '../logger/logger'

@Injectable()
export class ReplayAttackMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private readonly timeLimit: number = 60 * 1000

  async use(req: Request, _res: Response, next: NextFunction) {
    logger.debug('[ReplayAttackMiddleware]: use.')
    const path = req.originalUrl
    if (path.match(/^\/api\/health/)) {
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

    const timestamp = parseInt(timestampStr, 10)
    // 请求时间和现在时间对比验证，发起请求时间和服务器时间不能超过timeLimit毫秒
    if (Date.now() - timestamp > this.timeLimit) {
      throw new BadRequestException(
        'The request initiation time exceeds the server limit',
      )
    }

    // 验证相同nonce的请求是否已经存在，存在表示为重复请求
    const result = await this.cacheManager.get(nonce)
    if (result) {
      throw new BadRequestException('Duplicate request')
    } else {
      // 如果nonce没有在缓存中，则需要加入，并设置过期时间为timeLimit毫秒
      await this.cacheManager.set(nonce, true, this.timeLimit)
    }

    const headers = req.headers
    const xSignStr = headers['x-sign']
    if (!xSignStr || xSignStr !== sign(query as Record<string, any>)) {
      throw new BadRequestException('Invalid signature')
    }
    next()
  }
}
