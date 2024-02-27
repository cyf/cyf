import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Request } from 'express'
import { isString } from 'class-validator'
import { JwtPayload } from '../interfaces/jwt-payload.interface'
import { jwtConstants } from '@/common/constants'
import { AuthService } from '@/modules/auth'
import { User } from '@/modules/user'

const extractTokenFromHeader = () => (req: Request) => {
  const xToken = req.headers['x-token']
  if (isString(xToken)) {
    const [type, token] = xToken?.split(' ') ?? []
    return type === 'Bearer' ? token : null
  }
  return null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractTokenFromHeader()]),
      secretOrKey: jwtConstants.secret,
      ignoreExpiration: false,
      passReqToCallback: false,
    })
  }

  validate(payload: JwtPayload): Promise<User> {
    return this.authService.verifyPayload(payload)
  }
}
