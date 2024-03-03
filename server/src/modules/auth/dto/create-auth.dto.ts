import { IsNotEmpty, IsString } from 'class-validator'

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  account: string

  @IsNotEmpty()
  @IsString()
  password: string
}
