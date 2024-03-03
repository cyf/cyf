import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { MailerService } from '@nestjs-modules/mailer'
import { Cache } from 'cache-manager'
import { PrismaService } from '@/modules/prisma'
import { CreateMailDto } from './dto/create-mail.dto'
import { UpdateMailDto } from './dto/update-mail.dto'
import { encrypt } from '@/common/utils/crypto'

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createBy: string, createMailDto: CreateMailDto) {
    // {
    //   accepted: [ 'kjxbyz@163.com' ],
    //   rejected: [],
    //   ehlo: [
    //     '8BITMIME',
    //     'AUTH=PLAIN LOGIN XALIOAUTH',
    //     'AUTH PLAIN LOGIN XALIOAUTH',
    //     'PIPELINING',
    //     'DSN'
    //   ],
    //   envelopeTime: 88,
    //   messageTime: 159,
    //   messageSize: 438,
    //   response: '250 Data Ok: queued as freedom ###envid=600000068977514582',
    //   envelope: {
    //     from: 'noreply@notifications.chenyifaer.com',
    //     to: [ 'kjxbyz@163.com' ]
    //   },
    //   messageId: '<261fe80c-1648-7b30-d99d-dc11695d41d0@notifications.chenyifaer.com>'
    // }
    const res = await this.mailerService.sendMail({
      to: createMailDto.to, // list of receivers
      // from: process.env.SMTP_SERVER_USER, // sender address
      subject: createMailDto.subject, // Subject line
      context: createMailDto.context,
      template: createMailDto.template,
    })

    return this.prismaService.email.create({
      data: {
        message_id: encrypt(res.messageId),
        to: encrypt(createMailDto.to),
        subject: encrypt(createMailDto.subject),
        context: encrypt(JSON.stringify(createMailDto.context)),
        template: encrypt(createMailDto.template),
        create_by: createBy,
      },
      select: {
        id: true,
        message_id: true,
      },
    })
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
