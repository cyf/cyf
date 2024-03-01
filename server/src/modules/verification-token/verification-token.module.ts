import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma'
import { VerificationTokenService } from './verification-token.service'

@Module({
  imports: [PrismaModule],
  providers: [VerificationTokenService],
})
export class VerificationTokenModule {}
