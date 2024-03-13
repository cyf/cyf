import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator'

export class CreateInsiderDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['fafa-runner', 'homing-pigeon'])
  app: string

  @IsNotEmpty()
  @IsString()
  @IsIn(['ios', 'android', 'macos'])
  platform: string

  @IsNotEmpty()
  @IsEmail()
  email: string
}
