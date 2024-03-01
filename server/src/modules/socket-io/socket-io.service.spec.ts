import { Test, TestingModule } from '@nestjs/testing'
import { SocketIoService } from './socket-io.service'
import { PrismaModule } from '@/modules/prisma'

describe('SocketIoService', () => {
  let service: SocketIoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [SocketIoService],
    }).compile()

    service = module.get<SocketIoService>(SocketIoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
