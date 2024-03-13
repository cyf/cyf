import { Test, TestingModule } from '@nestjs/testing'
import { InsiderController } from './insider.controller'
import { InsiderService } from './insider.service'
import { AppModule } from '../../app.module'
import { MailModule } from '@/modules/mail'
import { PrismaModule } from '@/modules/prisma'

describe('InsiderController', () => {
  let controller: InsiderController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MailModule, PrismaModule],
      controllers: [InsiderController],
      providers: [InsiderService],
    }).compile()

    controller = module.get<InsiderController>(InsiderController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
