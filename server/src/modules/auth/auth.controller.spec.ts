import { Test, TestingModule } from '@nestjs/testing'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AppModule } from '../../app.module'
import { UserModule } from '@/modules/user'
import { jwtConstants } from '@/common/constants'
import { JwtStrategy } from '@/common/strategies/jwt.strategy'

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        UserModule,
        PassportModule,
        NestjsFormDataModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: 24 * 60 * 60 },
          verifyOptions: {
            ignoreExpiration: false,
          },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
