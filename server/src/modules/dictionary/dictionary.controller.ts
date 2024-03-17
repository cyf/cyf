import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
  BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiSecurity, ApiQuery, ApiHeaders } from '@nestjs/swagger'
import { RoleType } from '@prisma/client'
import { DictionaryService } from './dictionary.service'
import { CreateDictionaryDto } from './dto/create-dictionary.dto'
import { UpdateDictionaryDto } from './dto/update-dictionary.dto'
import { CurrentUser } from '@/common/decorators/user.decorator'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { Roles } from '@/common/decorators/roles.decorator'
import { I18nService } from 'nestjs-i18n'
import { ExistedException } from '@/common/exception/existed.exception'

@Controller('dictionary')
@ApiTags('dictionary')
@ApiSecurity('admin')
@ApiHeaders([
  {
    name: 'x-sign',
    description: '加密字符串',
    required: true,
  },
  {
    name: 'x-token',
    description: '请求token',
    required: true,
  },
  {
    name: 'x-version',
    description: '版本号',
    required: true,
  },
  {
    name: 'x-locale',
    description: '语言',
    required: true,
  },
])
@ApiQuery({
  name: 'nonce',
  description: '请求过程中只能使用一次的字符串',
  required: true,
})
@ApiQuery({
  name: 'timestamp',
  description: '请求时间戳',
  required: true,
})
@UseGuards(JwtAuthGuard)
@UseFilters(new HttpExceptionFilter())
export class DictionaryController {
  constructor(
    private readonly dictionaryService: DictionaryService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @Roles(RoleType.ADMIN)
  async create(
    @Body() createDictionaryDto: CreateDictionaryDto,
    @CurrentUser() user: any,
  ) {
    const dictionary =
      await this.dictionaryService.preCreate(createDictionaryDto)
    if (dictionary) {
      throw new ExistedException()
    }

    return this.dictionaryService.create(createDictionaryDto, user?.id)
  }

  @Get()
  @Roles(RoleType.ADMIN)
  async findAll() {
    return this.dictionaryService.findAll()
  }

  @Get('primary')
  @Roles(RoleType.ADMIN)
  async findAllPrimary() {
    return this.dictionaryService.findAllPrimary()
  }

  @Get('primary/:primary')
  async findAllByPrimary(@Param('primary') primary: string) {
    if (!primary) {
      throw new BadRequestException()
    }

    return this.dictionaryService.findAllByPrimary(primary)
  }

  @Get(':id')
  @Roles(RoleType.ADMIN)
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    if (!id) {
      throw new BadRequestException()
    }

    return this.dictionaryService.findOne(id, user?.id)
  }

  @Patch(':id')
  @Roles(RoleType.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateDictionaryDto: UpdateDictionaryDto,
    @CurrentUser() user: any,
  ) {
    if (!id) {
      throw new BadRequestException()
    }

    return this.dictionaryService.update(id, updateDictionaryDto, user?.id)
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN)
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    if (!id) {
      throw new BadRequestException()
    }

    return this.dictionaryService.remove(id, user?.id)
  }
}
