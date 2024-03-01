import { Test, TestingModule } from '@nestjs/testing'
import { CacheModule, CacheStore } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-store'
import { PrismaModule } from '../prisma'
import { SessionService } from './session.service'

describe('SessionService', () => {
  let service: SessionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        CacheModule.registerAsync({
          useFactory: async () => {
            const store = await redisStore({
              socket: {
                host: process.env.KV_HOST,
                port: +process.env.KV_PORT,
                tls: true,
              },
              username: process.env.KV_USERNAME,
              password: process.env.KV_PASSWORD,
              ttl: 60,
            })
            return {
              store: store as unknown as CacheStore,
            }
          },
        }),
      ],
      providers: [SessionService],
    }).compile()

    service = module.get<SessionService>(SessionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
