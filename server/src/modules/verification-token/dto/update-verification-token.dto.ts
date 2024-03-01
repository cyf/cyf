import { PartialType } from '@nestjs/swagger'
import { CreateVerificationTokenDto } from './create-verification-token.dto'

export class UpdateVerificationTokenDto extends PartialType(
  CreateVerificationTokenDto,
) {}
