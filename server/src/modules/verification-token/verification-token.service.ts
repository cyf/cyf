import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { PrismaService } from '../prisma'
import { CreateVerificationTokenDto } from './dto/create-verification-token.dto'
import { UpdateVerificationTokenDto } from './dto/update-verification-token.dto'

@Injectable()
export class VerificationTokenService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  create(createVerificationTokenDto: CreateVerificationTokenDto) {
    return 'This action adds a new verificationToken'
  }

  findAll() {
    return `This action returns all verificationToken`
  }

  findOne(id: number) {
    return `This action returns a #${id} verificationToken`
  }

  update(id: number, updateVerificationTokenDto: UpdateVerificationTokenDto) {
    return `This action updates a #${id} verificationToken`
  }

  remove(id: number) {
    return `This action removes a #${id} verificationToken`
  }
}
