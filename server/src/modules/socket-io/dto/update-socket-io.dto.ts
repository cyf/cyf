import { PartialType } from '@nestjs/mapped-types'
import { CreateSocketIoDto } from './create-socket-io.dto'

export class UpdateSocketIoDto extends PartialType(CreateSocketIoDto) {
  id: number
}
