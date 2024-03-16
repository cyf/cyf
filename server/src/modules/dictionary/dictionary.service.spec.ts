import { Test, TestingModule } from '@nestjs/testing'
import { DictionaryService } from './dictionary.service'
import { PrismaModule } from '@/modules/prisma'

describe('DictionaryService', () => {
  let service: DictionaryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [DictionaryService],
    }).compile()

    service = module.get<DictionaryService>(DictionaryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
