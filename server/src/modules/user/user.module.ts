import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { PrismaModule } from '../prisma'

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
