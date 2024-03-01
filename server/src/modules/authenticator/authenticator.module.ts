import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma'
import { AuthenticatorService } from './authenticator.service'

@Module({
  imports: [PrismaModule],
  providers: [AuthenticatorService],
})
export class AuthenticatorModule {}
