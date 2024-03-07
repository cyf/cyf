import { Test, TestingModule } from '@nestjs/testing'
// import { PassportModule } from '@nestjs/passport'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { AppModule } from '../../app.module'
import { MailModule } from '@/modules/mail'
import { PrismaModule } from '@/modules/prisma'

describe('UsersController', () => {
  let controller: UserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // PassportModule,
        AppModule,
        MailModule,
        PrismaModule,
        NestjsFormDataModule,
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
