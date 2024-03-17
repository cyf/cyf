import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { IsInDatabase } from '@/common/validators/is-in-database'

export class CreateInsiderDto {
  @IsNotEmpty()
  @IsString()
  // @IsIn(['fafa-runner', 'homing-pigeon'])
  @IsInDatabase()
  app: string

  @IsNotEmpty()
  @IsString()
  // @IsIn(['ios', 'android', 'macos'])
  @IsInDatabase()
  platform: string

  @IsNotEmpty()
  @IsEmail()
  email: string
}
