import { users } from '@prisma/client'
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator'

export class CreateUserAddressDto {
  @IsString()
  @IsNotEmpty()
  zip_code: string

  @IsInt()
  @IsNotEmpty()
  number: number

  @IsString()
  @IsNotEmpty()
  street: string

  @IsString()
  @IsNotEmpty()
  neighborhood: string

  @IsString()
  @IsNotEmpty()
  complement: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  state: string

  @IsString()
  @IsNotEmpty()
  country: string

  @IsBoolean()
  @IsNotEmpty()
  selected_address: boolean

  @IsBoolean()
  @IsNotEmpty()
  home_address: boolean

  @IsBoolean()
  @IsNotEmpty()
  work_address: boolean

  @IsObject()
  user: users
}
