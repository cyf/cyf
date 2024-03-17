import { Module } from '@nestjs/common'
import { InsiderService } from './insider.service'
import { InsiderController } from './insider.controller'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '@/modules/prisma'
import { DictionaryModule } from '@/modules/dictionary'
import { IsInDatabaseConstraint } from '@/common/validators/is-in-database'

@Module({
  imports: [ConfigModule, PrismaModule, DictionaryModule],
  controllers: [InsiderController],
  providers: [IsInDatabaseConstraint, InsiderService],
})
export class InsiderModule {}
