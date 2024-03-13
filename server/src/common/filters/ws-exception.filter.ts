import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { WsException, BaseWsExceptionFilter } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { isString } from 'class-validator'
import logger from '../logger/logger'

@Catch(WsException)
export class WebsocketExceptionFilter extends BaseWsExceptionFilter<WsException> {
  catch(exception: WsException, host: ArgumentsHost) {
    logger.debug('exception:', exception)
    const client = host.switchToWs().getClient<Socket>()

    const error = exception.getError()
    const code = isString(error)
      ? HttpStatus.INTERNAL_SERVER_ERROR
      : (error as any).code
    const msg = isString(error) ? error : (error as any).msg

    super.catch(
      new WsException({
        code,
        msg,
        timestamp: Date.now(),
        path: client.handshake.url,
      }),
      host,
    )
  }
}
