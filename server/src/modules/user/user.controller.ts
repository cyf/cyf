import {
  Controller,
  Get,
  Post,
  Body,
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
import { I18nContext, I18nService } from 'nestjs-i18n'
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager'
import {
  // ApiBearerAuth,
  // ApiOperation,
  // ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
// import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'
import { MailService } from '@/modules/mail'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { VersionGuard } from '@/common/guards/version.guard'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { Public } from '@/common/decorators/public.decorator'
import { CurrentUser } from '@/common/decorators/user.decorator'
import { Cache } from 'cache-manager'

@Controller()
@ApiTags('user')
@UseGuards(JwtAuthGuard)
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly i18n: I18nService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('user-hello')
  @CacheTTL(30) // override TTL to 30 seconds
  @Get('hello')
  async getHello(): Promise<string> {
    // const result = await this.userService.getHello()
    return this.i18n.t('common.HELLO', { lang: I18nContext.current().lang })
  }

  @Get('hello2')
  @UseGuards(new VersionGuard('>=1.0.0'))
  getHello2(): string {
    return this.i18n.t('common.NEW', {
      args: { name: 'Kimmy' },
      lang: I18nContext.current().lang,
    })
  }

  @Post('verify')
  async verify(@CurrentUser() user: any) {
    const cachedValue = await this.cacheManager.get(`email_verify__${user.id}`)
    if (cachedValue) {
      return { status: 'email_verification_sent' }
    }

    const res = await this.mailService.create(user.id, {
      to: user.email, // list of receivers
      subject: 'Verify Testing ✔', // Subject line
      context: {
        author: 'Test User',
      },
      template: 'email-verify',
    })

    await this.cacheManager.set(
      `email_verify__${user.id}`,
      'true',
      5 * 60 * 1000,
    )

    return res
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

    const user = await this.userService.update(id, updateUserDto)

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
}
