import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator'
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data'

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

  @IsFile()
  @MaxFileSize(5 * 1000 * 1000)
  @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
  file: MemoryStoredFile
}
