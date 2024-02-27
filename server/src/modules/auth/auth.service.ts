import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { omitBy } from 'lodash'
import { User, UserService } from '@/modules/user'
import { encrypt, compare } from '@/common/utils/crypto'
import { decrypt } from '@/common/utils/privacy'
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface'
import { CreateUserDto } from '@/modules/user/dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User

    try {
      user = await this.userService.findOne(payload.id)
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with id: ${payload.id}`,
      )
    }

    if (!user) {
      throw new UnauthorizedException(
        `There isn't any user with id: ${payload.id}`,
      )
    }

    return user
  }

  async getRole(id: string) {
    const user = await this.userService.findOne(id)
    if (!user) {
      throw new UnauthorizedException(`There isn't any user with id: ${id}`)
    }
    return user.role
  }

  async register(createUserDto: CreateUserDto) {
    const existedUser = await this.userService.findByAccount(
      createUserDto.email || createUserDto.phone || createUserDto.username,
    )
    if (existedUser) throw new ConflictException()

    const user = await this.userService.create(createUserDto)
    const payload = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
      create_seconds: Date.now(),
      expire_seconds: 24 * 60 * 60,
      user,
    }
  }

  async signIn(username: string, pass: string) {
    const user = await this.userService.findByAccount(username)
    if (!user) throw new NotFoundException()
    if (!compare(encrypt(decrypt(pass)), user?.password)) {
      throw new UnauthorizedException()
    }
    const payload = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
      create_seconds: Date.now(),
      expire_seconds: 24 * 60 * 60,
      user: omitBy(user, (key: string, value: string | Date) =>
        ['password'].includes(key),
      ),
    }
  }
}
