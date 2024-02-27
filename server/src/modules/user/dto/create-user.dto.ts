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

  @IsOptional()
  @IsString()
  password?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsMobilePhone()
  phone?: string

  @IsOptional()
  @IsString()
  @IsUrl({ protocols: ['http', 'https'] })
  avatar?: string
}
