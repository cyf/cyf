import { Test, TestingModule } from '@nestjs/testing'
import { InsiderService } from './insider.service'
import { PrismaModule } from '@/modules/prisma'

describe('InsiderService', () => {
  let service: InsiderService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [InsiderService],
    }).compile()

    service = module.get<InsiderService>(InsiderService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
