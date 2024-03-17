import { Reflector } from '@nestjs/core'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { JwtService } from '@nestjs/jwt'
import { Socket } from 'socket.io'
import { jwtConstants } from '@/common/constants'
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator'
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface'
import { AuthService } from '@/modules/auth'

@Injectable()
export class SocketIoAuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const client = context.switchToWs().getClient<Socket>()
    const token = this.extractTokenFromHeader(client)
    if (!token) {
      throw new WsException({
        code: HttpStatus.UNAUTHORIZED,
        msg: 'unauthorized',
      })
    }
    try {
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const user = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      })
      request['user'] = await this.authService.verifyPayload(user as JwtPayload)
    } catch {
      throw new WsException({
        code: HttpStatus.UNAUTHORIZED,
        msg: 'unauthorized',
      })
    }
    return true
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
