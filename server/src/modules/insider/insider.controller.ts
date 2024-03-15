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
import { ApiTags } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { I18nService } from 'nestjs-i18n'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { CurrentUser } from '@/common/decorators/user.decorator'
import { ExistedException } from '@/common/exception/existed.exception'
import { InsiderService } from './insider.service'
import { CreateInsiderDto } from './dto/create-insider.dto'
import { UpdateInsiderDto } from './dto/update-insider.dto'

@Controller('insider')
@ApiTags('insider')
@UseGuards(JwtAuthGuard)
@UseFilters(new HttpExceptionFilter())
export class InsiderController {
  constructor(
    private readonly insiderService: InsiderService,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async create(
    @Body() createInsiderDto: CreateInsiderDto,
    @CurrentUser() user: any,
  ) {
    const insider = await this.insiderService.preCreate(
      createInsiderDto,
      user?.id,
    )
    if (insider) {
      throw new ExistedException()
    }

    return this.insiderService.create(createInsiderDto, user?.id)
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.insiderService.findAll(user?.role === 'USER' ? user?.id : null)
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    if (!id) {
      throw new BadRequestException()
    }

    return this.insiderService.findOne(id, user?.id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInsiderDto: UpdateInsiderDto,
    @CurrentUser() user: any,
  ) {
    if (!id) {
      throw new BadRequestException()
    }

    return this.insiderService.update(id, updateInsiderDto, user?.id)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    if (!id) {
      throw new BadRequestException()
    }

    return this.insiderService.remove(id, user?.id)
  }
}
