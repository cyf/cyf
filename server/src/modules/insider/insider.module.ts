import { Module } from '@nestjs/common'
import { InsiderService } from './insider.service'
import { InsiderController } from './insider.controller'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '@/modules/prisma'

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [InsiderController],
  providers: [InsiderService],
})
export class InsiderModule {}
