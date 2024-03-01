import { PartialType } from '@nestjs/swagger'
import { CreateAuthenticatorDto } from './create-authenticator.dto'

export class UpdateAuthenticatorDto extends PartialType(
  CreateAuthenticatorDto,
) {}
