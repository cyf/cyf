import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { IsDel } from '@prisma/client'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { encrypt, hashed } from '@/common/utils/crypto'
import { decrypt } from '@/common/utils/privacy'
import { PrismaService } from '@/modules/prisma'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getHello() {
    // await this.cacheManager.set('user-hello', 'Kimmy')
    return await this.cacheManager.get<string | undefined>('user-hello')
  }

  async create(createUserDto: CreateUserDto, avatar?: string): Promise<User> {
    const { username, nickname, password, email } = createUserDto
    return this.prismaService.user.create({
      data: {
        username,
        nickname: nickname || username,
        password: password ? hashed(encrypt(decrypt(password))) : null,
        email,
        avatar,
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        email_verified: true,
        avatar: true,
        role: true,
        create_date: true,
        update_date: true,
      },
    })
  }

  async findAll(): Promise<Array<User>> {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        email_verified: true,
        avatar: true,
        role: true,
        create_date: true,
        update_date: true,
      },
      where: {
        is_del: IsDel.NO,
      },
    })
  }

  async findOne(id: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        email_verified: true,
        avatar: true,
        role: true,
        create_date: true,
        update_date: true,
      },
      where: {
        id,
        is_del: IsDel.NO,
      },
    })
  }

  async findByAccount(account: string) {
    return this.prismaService.user.findFirst({
      select: {
        id: true,
        username: true,
        nickname: true,
        password: true,
        email: true,
        avatar: true,
        role: true,
        create_date: true,
        update_date: true,
      },
      where: {
        AND: {
          OR: [
            {
              username: account,
            },
            {
              email: account,
            },
          ],
        },
        is_del: IsDel.NO,
      },
    })
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    avatar?: string,
  ): Promise<User | null> {
    const { username, nickname, password, email } = updateUserDto
    return this.prismaService.user.update({
      data: {
        username,
        nickname,
        password: password ? hashed(encrypt(decrypt(password))) : null,
        email,
        avatar,
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        email_verified: true,
        avatar: true,
        role: true,
        create_date: true,
        update_date: true,
      },
      where: {
        id,
        is_del: IsDel.NO,
      },
    })
  }

  async remove(id: string): Promise<User | null> {
    return this.prismaService.user.update({
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        email_verified: true,
        avatar: true,
        role: true,
        create_date: true,
        update_date: true,
      },
      data: {
        is_del: IsDel.YES,
      },
      where: {
        id,
        is_del: IsDel.NO,
      },
    })
  }
}
