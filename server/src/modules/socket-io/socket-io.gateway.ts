import { UseFilters, UseGuards } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  WsResponse,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { from, map, Observable } from 'rxjs'
import { SocketIoService } from './socket-io.service'
// import { CreateSocketIoDto } from './dto/create-socket-io.dto'
// import { UpdateSocketIoDto } from './dto/update-socket-io.dto'
import { Public } from '@/common/decorators/public.decorator'
import logger from '@/common/logger/logger'
import { CurrentUser } from '@/common/decorators/user.decorator'
import { WebsocketExceptionFilter } from '@/common/filters/ws-exception.filter'
import { SocketIoAuthGuard } from '@/common/guards/socket-io.guard'
import { SocketIoThrottlerGuard } from '@/common/guards/socket-io.throttler.guard'
import { EmailVerifiedEvent } from '@/modules/user'

// const basePath = process.env.NODE_ENV === 'production' ? 'portal/' : ''

@WebSocketGateway({
  // for socket-io
  // http://127.0.0.1:3001/ws
  // namespace: `${basePath}/ws`,
  // path: `/${basePath}socket.io/`,
  // namespace: 'ws',
  // for ws
  // ws://127.0.0.1:3001/ws
  // path: '/ws',
  cors: {
    // origin: '*',
    origin: [/chenyifaer\.com/, /localhost:3000/],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // for socket-io
  transports: ['websocket', 'polling'],
})
@UseFilters(new WebsocketExceptionFilter())
@UseGuards(SocketIoThrottlerGuard, SocketIoAuthGuard)
export class SocketIoGateway implements OnGatewayInit<Server> {
  @WebSocketServer()
  server: Server

  constructor(
    private readonly socketIoService: SocketIoService,
    private readonly i18n: I18nService,
  ) {}

  @Public()
  @SubscribeMessage('hello')
  hello(@MessageBody() data: any): string {
    logger.debug('this.i18n', this.i18n.t, I18nContext.current())
    return this.i18n.t('common.HELLO', { lang: I18nContext.current().lang })
  }

  @Public()
  @SubscribeMessage('hello2')
  hello2(@MessageBody() data: any): WsResponse<any> {
    return { event: 'hello2', data }
  }

  @SubscribeMessage('events')
  findAll(
    @MessageBody() data: any,
    @CurrentUser('id') operator: string,
  ): Observable<WsResponse<number>> {
    console.log('operator', operator)
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    )
  }

  @Public()
  @SubscribeMessage('identity')
  async identity(socket: Socket, @MessageBody() data: number): Promise<number> {
    return data
  }

  @OnEvent('email.verified', { async: true })
  emailVerify(payload: EmailVerifiedEvent) {
    console.log('payload', payload)
    return { event: 'verified', data: { id: payload.id } }
  }

  afterInit(server: Server): any {
    // console.log('server', server)
  }

  // @SubscribeMessage('createSocketIo')
  // create(@MessageBody() createSocketIoDto: CreateSocketIoDto) {
  //   return this.socketIoService.create(createSocketIoDto);
  // }
  //
  // @SubscribeMessage('findAllSocketIo')
  // findAll() {
  //   return this.socketIoService.findAll();
  // }
  //
  // @SubscribeMessage('findOneSocketIo')
  // findOne(@MessageBody() id: number) {
  //   return this.socketIoService.findOne(id);
  // }
  //
  // @SubscribeMessage('updateSocketIo')
  // update(@MessageBody() updateSocketIoDto: UpdateSocketIoDto) {
  //   return this.socketIoService.update(updateSocketIoDto.id, updateSocketIoDto);
  // }
  //
  // @SubscribeMessage('removeSocketIo')
  // remove(@MessageBody() id: number) {
  //   return this.socketIoService.remove(id);
  // }
}
