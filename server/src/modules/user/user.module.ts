import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { AccountModule } from '../account'
import { AuthenticatorModule } from '../authenticator'
import { MailModule } from '../mail'
import { PrismaModule } from '../prisma'
import { SessionModule } from '../session'
import { VerificationTokenModule } from '../verification-token'

@Module({
  imports: [
    AccountModule,
    AuthenticatorModule,
    MailModule,
    PrismaModule,
    SessionModule,
    VerificationTokenModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
