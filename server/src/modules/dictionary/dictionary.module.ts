import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '@/modules/prisma'
import { DictionaryService } from './dictionary.service'
import { DictionaryController } from './dictionary.controller'
import { AuthModule } from '@/modules/auth'

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule],
  controllers: [DictionaryController],
  providers: [DictionaryService],
  exports: [DictionaryService],
})
export class DictionaryModule {}
