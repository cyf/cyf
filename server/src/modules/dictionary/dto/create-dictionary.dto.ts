import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateDictionaryDto {
  @IsNotEmpty()
  @IsString()
  primary: string

  @IsNotEmpty()
  @IsString()
  key: string

  @IsNotEmpty()
  @IsString()
  label: string

  @IsOptional()
  @IsString()
  description?: string
}
