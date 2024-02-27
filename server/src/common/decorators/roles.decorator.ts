import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common'
import { RoleType } from '@prisma/client'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { RolesAuthGuard } from '../guards/role.guard'

export const ROLES_KEY = 'roles'

export const Roles = (role: RoleType) =>
  applyDecorators(
    SetMetadata(ROLES_KEY, role),
    UseGuards(JwtAuthGuard, RolesAuthGuard),
  )
