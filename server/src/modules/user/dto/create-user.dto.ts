import {
  IsNotEmpty,
  IsUrl,
  IsString,
  IsOptional,
  IsEmail,
  IsMobilePhone,
} from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsOptional()
  @IsString()
  nickname?: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsOptional()
  @IsString()
  @IsUrl({ protocols: ['http', 'https'] })
  avatar?: string
}
