import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { MailerService } from '@nestjs-modules/mailer'
import { Cache } from 'cache-manager'
import { PrismaService } from '@/modules/prisma'
import { CreateMailDto } from './dto/create-mail.dto'
import { UpdateMailDto } from './dto/update-mail.dto'

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createMailDto: CreateMailDto) {
    await this.mailerService.sendMail({})
    return 'This action adds a new mail'
  }

  findAll() {
    return `This action returns all mail`
  }

  findOne(id: number) {
    return `This action returns a #${id} mail`
  }

  update(id: number, updateMailDto: UpdateMailDto) {
    return `This action updates a #${id} mail`
  }

  remove(id: number) {
    return `This action removes a #${id} mail`
  }
}
