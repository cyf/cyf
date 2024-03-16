import { Test, TestingModule } from '@nestjs/testing'
import { DictionaryController } from './dictionary.controller'
import { DictionaryService } from './dictionary.service'
import { AppModule } from '../../app.module'
import { MailModule } from '@/modules/mail'
import { PrismaModule } from '@/modules/prisma'
import { AuthModule } from '@/modules/auth'

describe('DictionaryController', () => {
  let controller: DictionaryController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MailModule, PrismaModule, AuthModule],
      controllers: [DictionaryController],
      providers: [DictionaryService],
    }).compile()

    controller = module.get<DictionaryController>(DictionaryController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
