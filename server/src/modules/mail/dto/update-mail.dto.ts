import { PartialType } from '@nestjs/swagger'
import { CreateMailDto } from './create-mail.dto'

export class UpdateMailDto extends PartialType(CreateMailDto) {}
