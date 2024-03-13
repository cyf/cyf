import { PartialType } from '@nestjs/swagger'
import { CreateInsiderDto } from './create-insider.dto'

export class UpdateInsiderDto extends PartialType(CreateInsiderDto) {}
