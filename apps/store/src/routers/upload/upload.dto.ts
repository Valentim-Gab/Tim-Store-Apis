import { IsMultibyte, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class FileDto {
  @IsString()
  @IsNotEmpty()
  fieldname: string

  @IsString()
  @IsNotEmpty()
  originalname: string

  @IsString()
  @IsNotEmpty()
  encoding: string

  @IsString()
  @IsNotEmpty()
  mimetype: string

  @IsMultibyte()
  @IsNotEmpty()
  buffer: Buffer

  @IsNumber()
  @IsNotEmpty()
  size: number
}
