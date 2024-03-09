import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
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
    ConfigModule,
    AccountModule,
    AuthenticatorModule,
    MailModule,
    PrismaModule,
    SessionModule,
    VerificationTokenModule,
    NestjsFormDataModule,
    EventEmitterModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
