import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { PrismaService } from 'nestjs-prisma'
import { BCryptService } from 'src/security/private/bcrypt.service'
import { Prisma } from '@prisma/client'
import { ErrorConstants } from 'src/constants/error.constant'
import { ImageUtil } from 'src/utils/image-util/image.util'
import { v4 as uuidv4 } from 'uuid'
import { Role } from 'src/enums/Role'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  private selectedColumns = {
    id_user: true,
    name: true,
    last_name: true,
    email: true,
    active: true,
    cnpj: true,
    date_birth: true,
    phone_number: true,
    role: true,
    id_sex: true,
    //img: true,
  }

  constructor(
    private prisma: PrismaService,
    private bcrypt: BCryptService,
    private imageUtil: ImageUtil,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.performUserOperation('cadastrar', async () => {
      const id_user = uuidv4()
      const encryptPassword = await this.bcrypt.encryptPassword(
        createUserDto.password,
      )

      const userDto = {
        id_user,
        ...createUserDto,
        password: encryptPassword,
        role: [Role.User],
      }

      return this.prisma.users.create({
        data: { ...userDto, sex: { connect: { id_sex: userDto.sex.id_sex } } },
        select: this.selectedColumns,
      })
    })
  }

  async findAll() {
    return this.performUserOperation('receber', async () => {
      return await this.prisma.users.findMany({
        select: this.selectedColumns,
      })
    })
  }

  async findOne(idUser: string) {
    const id_user = idUser

    return this.performUserOperation('receber', async () => {
      return this.prisma.users.findFirst({
        where: { id_user },
        select: this.selectedColumns,
      })
    })
  }

  // async findImg(user: users, res: Response) {
  //   user = await this.findOne(user.id)

  //   try {
  //     const bytes = await this.imageUtil.get(user.img, 'user')
  //     res.setHeader('Content-Type', 'image/*')
  //     res.send(bytes)
  //   } catch (error) {
  //     throw new BadRequestException(`Foto não encontrada`)
  //   }
  // }

  findByEmail(email: string) {
    return this.performUserOperation('receber', async () => {
      return this.prisma.users.findFirst({ where: { email } })
    })
  }

  async update(id_user: string, updateUserDto: UpdateUserDto) {
    return this.performUserOperation('atualizar', async () => {
      const { sex, ...userDto } = updateUserDto

      const data = {
        ...userDto,
        ...(sex && { sex: { connect: { id_sex: sex.id_sex } } }),
      }

      return this.prisma.users.update({
        where: { id_user },
        data: data,
        select: this.selectedColumns,
      })
    })
  }

  async updatePassword(id_user: string, password: string) {
    return this.performUserOperation('atualizar senha', async () => {
      const encryptPassword = await this.bcrypt.encryptPassword(password)

      return this.prisma.users.update({
        where: { id_user },
        data: { password: encryptPassword },
        select: this.selectedColumns,
      })
    })
  }

  // async updateImg(image: File, user: users) {
  //   const { id } = user
  //   const strategy =
  //     image.size > 1_000_000
  //       ? new CompressImageSaveStrategy(this.imageUtil)
  //       : new DefaultImageSaveStrategy(this.imageUtil)

  //   this.imageUtil.setSaveStrategy(strategy)

  //   const filename = await this.imageUtil.save(image, id, 'user')
  //   const userUpdate = { img: filename }

  //   return this.performUserOperation('atualizar', async () => {
  //     return this.prisma.users.update({
  //       where: { id: user.id },
  //       data: userUpdate,
  //       select: this.selectedColumns,
  //     })
  //   })
  // }

  // async delete(id: number) {
  //   return this.performUserOperation('deletar', async () => {
  //     return this.prisma.users.delete({
  //       where: { id },
  //       select: {
  //         id: true,
  //       },
  //     })
  //   })
  // }

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
      throw new BadRequestException(`Erro ao ${action} o usuário`)
    }
  }
}
