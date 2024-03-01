import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma'
import { SessionService } from './session.service'

@Module({
  imports: [PrismaModule],
  providers: [SessionService],
})
export class SessionModule {}
