import { Test, TestingModule } from '@nestjs/testing'
import { SocketIoGateway } from './socket-io.gateway'
import { SocketIoService } from './socket-io.service'
import { AppModule } from '../../app.module'
import { UserModule } from '@/modules/user'
import { AuthModule } from '@/modules/auth'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from '@/common/constants'
import { PrismaModule } from '@/modules/prisma'

describe('SocketIoGateway', () => {
  let gateway: SocketIoGateway

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        PrismaModule,
        UserModule,
        AuthModule,
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: 24 * 60 * 60 },
        }),
      ],
      providers: [SocketIoGateway, SocketIoService],
    }).compile()

    gateway = module.get<SocketIoGateway>(SocketIoGateway)
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  })
})
