import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { SocketIoService } from './socket-io.service'
import { SocketIoGateway } from './socket-io.gateway'
import { PrismaModule } from '@/modules/prisma'
import { UserModule } from '@/modules/user'
import { AuthModule } from '@/modules/auth'
import { jwtConstants } from '@/common/constants'

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 24 * 60 * 60 },
    }),
  ],
  providers: [SocketIoGateway, SocketIoService],
})
export class SocketIoModule {}
