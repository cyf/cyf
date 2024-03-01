import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma'
import { AccountService } from './account.service'

@Module({
  imports: [PrismaModule],
  providers: [AccountService],
})
export class AccountModule {}
