import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserAddressDto } from './dto/create-user-address.dto'
import { UpdateUserAddressDto } from './dto/update-user-address.dto'
import { PrismaService } from 'nestjs-prisma'
import { Prisma, users } from '@prisma/client'
import { ErrorConstants } from 'src/constants/error.constant'
import { v4 as uuidv4 } from 'uuid'
import { ViacepService } from 'src/connections/viacep/viacep.service'

@Injectable()
export class UserAddressService {
  constructor(
    private prisma: PrismaService,
    private viacep: ViacepService,
  ) {}

  async create(createUserAddressDto: CreateUserAddressDto, user: users) {
    if (!(await this.viacep.isValidCep(createUserAddressDto.zip_code))) {
      console.log('ah')

      throw new BadRequestException(
        'Cep inválido',
        ErrorConstants.INVALID_ZIP_CODE,
      )
    }

    return this.performUserOperation('cadastrar', async () => {
      const addressDto = {
        id_user_address: uuidv4(),
        ...createUserAddressDto,
        id_user: user.id,
      }

      return this.prisma.user_address.create({ data: addressDto })
    })
  }

  findAll() {
    return `This action returns all userAddress`
  }

  findAllByUser(user: users) {
    return `This action returns all userAddress: ${user}`
  }

  findOne(id: string) {
    return `This action returns a #${id} userAddress`
  }

  update(id: string, updateUserAddressDto: UpdateUserAddressDto) {
    return `This action updates a #${id} userAddress: ${updateUserAddressDto}`
  }

  remove(id: string) {
    return `This action removes a #${id} userAddress`
  }

  private async performUserOperation(
    action: string,
    operation: () => Promise<any>,
  ) {
    try {
      return await this.prisma.$transaction(async () => {
        return await operation()
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === ErrorConstants.UNIQUE_VIOLATED
      ) {
        const uniqueColumn = error.meta.target[0]
        throw new BadRequestException(`Campo ${uniqueColumn} em uso!`)
      }
      console.error(error)
      throw new BadRequestException(`Erro ao ${action} o endereço de usuário`)
    }
  }
}
