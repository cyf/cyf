import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import {
  // ApiBearerAuth,
  // ApiOperation,
  // ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtService } from '@nestjs/jwt'
import { FormDataRequest } from 'nestjs-form-data'
import { omitBy } from 'lodash'
import { AuthService } from './auth.service'
import { CreateAuthDto } from '@/modules/auth/dto/create-auth.dto'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { Public } from '@/common/decorators/public.decorator'
import { Roles } from '@/common/decorators/roles.decorator'
import { CurrentUser } from '@/common/decorators/user.decorator'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { CreateUserDto } from '@/modules/user/dto/create-user.dto'
import { RoleType } from '@prisma/client'
import { putObject } from '@/common/utils/upload'

@Controller('auth')
@ApiTags('auth')
@UseGuards(JwtAuthGuard)
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('register')
  @FormDataRequest()
  async register(@Body() createUserDto: CreateUserDto) {
    const s3File = await putObject(createUserDto.file)
    return this.authService.register(createUserDto, s3File.url)
  }

  @Public()
  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signIn(
      createAuthDto.account,
      createAuthDto.password,
    )
  }

  @Get('refresh')
  async getRefreshToken(@CurrentUser() user: any) {
    console.log('user', user)
    const payload = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
      create_seconds: Date.now(),
      expire_seconds: 24 * 60 * 60,
    }
  }

  @Roles(RoleType.USER)
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    console.log('user', user)
    return omitBy(user, (key: string, value: string | Date) =>
      ['password'].includes(key),
    )
  }
}
