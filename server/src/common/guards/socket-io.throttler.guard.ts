import { ExecutionContext, Injectable } from '@nestjs/common'
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerOptions,
} from '@nestjs/throttler'

@Injectable()
export class SocketIoThrottlerGuard extends ThrottlerGuard {
  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
    throttler: ThrottlerOptions,
  ): Promise<boolean> {
    const client = context.switchToWs().getClient()
    const ip = client.conn.remoteAddress
    const key = this.generateKey(context, ip, throttler.name)
    const { totalHits } = await this.storageService.increment(key, ttl)

    if (totalHits > limit) {
      throw new ThrottlerException()
    }

    return true
  }
}
