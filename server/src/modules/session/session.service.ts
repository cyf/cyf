import { Inject, Injectable } from '@nestjs/common'

import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { PrismaService } from '../prisma'
import { CreateSessionDto } from './dto/create-session.dto'
import { UpdateSessionDto } from './dto/update-session.dto'

@Injectable()
export class SessionService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  create(createSessionDto: CreateSessionDto) {
    return 'This action adds a new session'
  }

  findAll() {
    return `This action returns all session`
  }

  findOne(id: number) {
    return `This action returns a #${id} session`
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`
  }

  remove(id: number) {
    return `This action removes a #${id} session`
  }
}
