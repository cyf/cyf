import {
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  CanActivate,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RoleType } from '@prisma/client'
import { AuthService } from '@/modules/auth'
import { ROLES_KEY } from '@/common/decorators/roles.decorator'

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<string>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const { user } = context.switchToHttp().getRequest()
    if (!user || !user.id) throw new UnauthorizedException()
    const role = await this.authService.getRole(user.id)

    if (role === RoleType.ADMIN) {
      return true
    }

    if (requiredRole && requiredRole !== role) {
      throw new ForbiddenException()
    }

    return true
  }
}
