import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { PrismaService } from '../prisma'
import { CreateAuthenticatorDto } from './dto/create-authenticator.dto'
import { UpdateAuthenticatorDto } from './dto/update-authenticator.dto'

@Injectable()
export class AuthenticatorService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  create(createAuthenticatorDto: CreateAuthenticatorDto) {
    return 'This action adds a new authenticator'
  }

  findAll() {
    return `This action returns all authenticator`
  }

  findOne(id: number) {
    return `This action returns a #${id} authenticator`
  }

  update(id: number, updateAuthenticatorDto: UpdateAuthenticatorDto) {
    return `This action updates a #${id} authenticator`
  }

  remove(id: number) {
    return `This action removes a #${id} authenticator`
  }
}
