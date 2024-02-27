import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { jwtConstants } from '@/common/constants'
import { UserModule } from '../user'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from '@/common/strategies/jwt.strategy'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 24 * 60 * 60 },
      verifyOptions: {
        ignoreExpiration: false,
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
