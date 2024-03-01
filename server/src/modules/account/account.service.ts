import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { PrismaService } from '../prisma'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  create(createAccountDto: CreateAccountDto) {
    return 'This action adds a new account'
  }

  findAll() {
    return `This action returns all account`
  }

  findOne(id: number) {
    return `This action returns a #${id} account`
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`
  }

  remove(id: number) {
    return `This action removes a #${id} account`
  }
}
