import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator'

export class CreateMailDto {
  @IsNotEmpty()
  @IsString()
  to: string

  @IsNotEmpty()
  @IsString()
  subject: string

  @IsNotEmptyObject()
  context: object

  @IsNotEmpty()
  @IsString()
  template: string
}
