import { gender } from '@prisma/client'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsISO8601,
  IsNotEmpty,
  IsObject,
  IsPhoneNumber,
  IsString,
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  last_name: string

  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsBoolean()
  active: boolean

  @IsString()
  cpf: string

  @IsString()
  cnpj: string

  @IsDate()
  @IsISO8601()
  date_birth: Date

  @IsPhoneNumber()
  phone_nmber: string

  @IsArray()
  @IsNotEmpty()
  role: string[]

  @IsObject()
  @IsNotEmpty()
  gender: gender
}
