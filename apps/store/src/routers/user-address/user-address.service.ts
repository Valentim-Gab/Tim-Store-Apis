import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserAddressDto } from './dto/create-user-address.dto'
import { UpdateUserAddressDto } from './dto/update-user-address.dto'
import { PrismaService } from 'nestjs-prisma'
import { users } from '@prisma/client'
import { ErrorConstants } from 'src/constants/error.constant'
import { v4 as uuidv4 } from 'uuid'
import { ViacepService } from 'src/connections/viacep/viacep.service'
import { PrismaUtil } from 'src/utils/prisma.util'

@Injectable()
export class UserAddressService {
  constructor(
    private prisma: PrismaService,
    private viacep: ViacepService,
    private prismaUtil: PrismaUtil,
  ) {}

  async create(createUserAddressDto: CreateUserAddressDto, user: users) {
    if (!(await this.viacep.isValidCep(createUserAddressDto.zip_code))) {
      throw new BadRequestException(
        'Cep inválido',
        ErrorConstants.INVALID_ZIP_CODE,
      )
    }

    return this.prismaUtil.performOperation(
      'Não foi possível cadastrar endereço de usuário',
      async () => {
        const addressDto = {
          id_user_address: uuidv4(),
          ...createUserAddressDto,
          id_user: user.id,
        }

        return this.prisma.user_address.create({ data: addressDto })
      },
    )
  }

  findAll() {
    return this.prismaUtil.performOperation(
      'Não foi possível buscar os endereços',
      async () => {
        return this.prisma.user_address.findMany()
      },
    )
  }

  findAllByUser(user: users) {
    return this.prismaUtil.performOperation(
      'Não foi possível buscar os endereços',
      async () => {
        return this.prisma.user_address.findMany({
          where: { id_user: user.id },
        })
      },
    )
  }

  findOne(id: string) {
    return this.prismaUtil.performOperation(
      'Não foi possível busca o endereço',
      async () => {
        return this.prisma.user_address.findFirst({
          where: { id_user_address: id },
        })
      },
    )
  }

  async update(id: string, updateUserAddressDto: UpdateUserAddressDto) {
    if (!(await this.viacep.isValidCep(updateUserAddressDto.zip_code))) {
      throw new BadRequestException(
        'Cep inválido',
        ErrorConstants.INVALID_ZIP_CODE,
      )
    }

    return this.prismaUtil.performOperation(
      'Não foi possível atualizar o endereço',
      async () => {
        return this.prisma.user_address.update({
          where: { id_user_address: id },
          data: updateUserAddressDto,
        })
      },
    )
  }

  remove(id: string) {
    return this.prismaUtil.performOperation(
      'Não foi possível remover o endereço',
      async () => {
        return this.prisma.user_address.delete({
          where: { id_user_address: id },
        })
      },
    )
  }
}
