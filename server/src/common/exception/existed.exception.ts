import { HttpException, HttpStatus } from '@nestjs/common'

export class ExistedException extends HttpException {
  constructor() {
    super('Existed', HttpStatus.FOUND)
  }
}
