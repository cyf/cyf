import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseGuards,
  BadRequestException,
  NotFoundException,
  UseInterceptors,
  Inject,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { I18nContext, I18nService } from 'nestjs-i18n'
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager'
import {
  // ApiBearerAuth,
  // ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { Cache } from 'cache-manager'
// import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'
import EmailVerifiedEvent from './events/email-verified.event'
import { MailService } from '@/modules/mail'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { VersionGuard } from '@/common/guards/version.guard'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { Public } from '@/common/decorators/public.decorator'
import { CurrentUser } from '@/common/decorators/user.decorator'
import { putObject } from '@/common/utils/upload'
import * as privacy from '@/common/utils/privacy'

@Controller('user')
@ApiTags('user')
@UseGuards(JwtAuthGuard)
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @ApiOperation({ deprecated: true })
  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('user-hello')
  @CacheTTL(30) // override TTL to 30 seconds
  @Get('hello')
  async getHello(): Promise<string> {
    // const result = await this.userService.getHello()
    return this.i18n.t('common.HELLO', { lang: I18nContext.current().lang })
  }

  @ApiOperation({ deprecated: true })
  @Get('hello2')
  @UseGuards(new VersionGuard('>=1.0.0'))
  getHello2(): string {
    return this.i18n.t('common.NEW', {
      args: { name: 'Kimmy' },
      lang: I18nContext.current().lang,
    })
  }

  @Get()
  async findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException()
    }

    const user = await this.userService.findOne(id)

    if (!user) {
      throw new NotFoundException()
    }

    return user
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!id) {
      throw new BadRequestException()
    }

    const s3File = await putObject(updateUserDto.file)
    const user = await this.userService.update(id, updateUserDto, s3File.url)

    if (!user) {
      throw new NotFoundException()
    }

    return user
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException()
    }

    const user = await this.userService.remove(id)

    if (!user) {
      throw new NotFoundException()
    }

    return user
  }

  @Public()
  @Get('email/verify/:id')
  async verify(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException()
    }

    const userId = privacy.decrypt(id)
    const user = await this.userService.findOne(userId)

    if (!user) {
      throw new NotFoundException()
    }

    const cachedValue = await this.cacheManager.get(`email_verify__${userId}`)
    if (!cachedValue) {
      return { status: 'email_verification_expired' }
    }

    await this.userService.verify(userId)

    this.eventEmitter.emit('email.verified', new EmailVerifiedEvent(id))

    return true
  }

  @Post('email/send')
  async send(@CurrentUser() user: any, @Headers('x-locale') locale: string) {
    const cachedValue = await this.cacheManager.get(`email_verify__${user.id}`)
    if (cachedValue) {
      return { status: 'email_verification_sent' }
    }

    const subject = this.i18n.t('validation.SUBJECT', {
      lang: I18nContext.current().lang,
    })

    // 获取邮件过期时间配置
    const expires = this.configService.get<number>('email.verify.expires')

    const res = await this.mailService.create(user.id, {
      to: user.email, // list of receivers
      subject, // Subject line
      context: {
        username: user.username,
        expires,
        link: `https://www.chenyifaer.com/portal/api/user/email/verify/${privacy.encrypt(user.id)}`,
        copyright: new Date().getFullYear(),
      },
      template: `email-verify-${locale}`,
    })

    await this.cacheManager.set(
      `email_verify__${user.id}`,
      'true',
      expires * 60 * 1000,
    )

    return res
  }

  @Public()
  @Post('has-username')
  async findOneByUsername(@Body('username') username: string) {
    if (!username) {
      throw new BadRequestException()
    }

    const user = await this.userService.findOneByUsername(username)

    return !user
  }

  @Public()
  @Post('has-email')
  async findOneByEmail(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException()
    }

    const user = await this.userService.findOneByEmail(email)

    return !user
  }
}
