import { Module } from '@nestjs/common'
// import { PassportModule } from '@nestjs/passport'
import { NestjsFormDataModule } from 'nestjs-form-data'
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
    // PassportModule,
    AccountModule,
    AuthenticatorModule,
    MailModule,
    PrismaModule,
    SessionModule,
    VerificationTokenModule,
    NestjsFormDataModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
