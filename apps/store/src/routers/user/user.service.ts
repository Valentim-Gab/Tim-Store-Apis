import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { PrismaService } from 'nestjs-prisma'
import { BCryptService } from 'src/security/private/bcrypt.service'
import { users } from '@prisma/client'
import { ErrorConstants } from 'src/constants/error.constant'
import { ImageUtil } from 'src/utils/image-util/image.util'
import { v4 as uuidv4 } from 'uuid'
import { Role } from 'src/enums/Role'
import { UpdateUserDto } from './dto/update-user.dto'
import { Response } from 'express'
import { extname } from 'path'
import { ConfigService } from '@nestjs/config'
import { SupabaseService } from 'src/connections/supabase/supabase.service'
import { File } from 'src/interfaces/file.interface'
import { StorageResult } from 'src/interfaces/supabase.interface'
import { PrismaUtil } from 'src/utils/prisma.util'

@Injectable()
export class UserService {
  private selectedColumns = {
    id: true,
    name: true,
    last_name: true,
    email: true,
    active: true,
    cnpj: true,
    date_birth: true,
    phone_number: true,
    role: true,
    gender: true,
    profile_image: true,
  }

  constructor(
    private prisma: PrismaService,
    private bcrypt: BCryptService,
    private imageUtil: ImageUtil,
    private config: ConfigService,
    private supabaseService: SupabaseService,
    private prismaUtil: PrismaUtil,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.prismaUtil.performOperation(
      'Não foi possível cadastrar usuário',
      async () => {
        const encryptPassword = await this.bcrypt.encryptPassword(
          createUserDto.password,
        )

        const userDto = {
          id: uuidv4(),
          ...createUserDto,
          password: encryptPassword,
          role: [Role.User],
        }

        return this.prisma.users.create({
          data: {
            ...userDto,
            gender: { connect: { id_gender: userDto.gender.id_gender } },
          },
          select: this.selectedColumns,
        })
      },
    )
  }

  async findAll() {
    return this.prismaUtil.performOperation(
      'Não foi possível buscar pelos usuários',
      async () => {
        return await this.prisma.users.findMany({
          select: this.selectedColumns,
        })
      },
    )
  }

  async findOne(idUser: string) {
    return this.prismaUtil.performOperation(
      'Não foi possível buscar pelo usuário',
      async () => {
        return this.prisma.users.findFirst({
          where: { id: idUser },
          select: this.selectedColumns,
        })
      },
    )
  }

  findByEmail(email: string) {
    return this.prismaUtil.performOperation(
      'Não foi possível buscar pelo usuário',
      async () => {
        return this.prisma.users.findFirst({ where: { email } })
      },
    )
  }

  async update(idUser: string, updateUserDto: UpdateUserDto) {
    return this.prismaUtil.performOperation(
      'Não foi porrível atualizar o usuário',
      async () => {
        const { gender, ...userDto } = updateUserDto

        const data = {
          ...userDto,
          ...(gender && { sex: { connect: { id_gender: gender.id_gender } } }),
        }

        return this.prisma.users.update({
          where: { id: idUser },
          data: data,
          select: this.selectedColumns,
        })
      },
    )
  }

  async updatePassword(idUser: string, password: string) {
    return this.prismaUtil.performOperation(
      'Não foi possível atualizar a senha do usuário',
      async () => {
        const encryptPassword = await this.bcrypt.encryptPassword(password)

        return this.prisma.users.update({
          where: { id: idUser },
          data: { password: encryptPassword },
          select: this.selectedColumns,
        })
      },
    )
  }

  async delete(userId: string) {
    return this.prismaUtil.performOperation(
      'Não foi possível deletar o usuário',
      async () => {
        return this.prisma.users.update({
          where: { id: userId },
          data: { active: false },
          select: this.selectedColumns,
        })
      },
    )
  }

  async findImg(user: users, res: Response) {
    const userDB: users = await this.findOne(user.id)

    try {
      const bytes = await this.imageUtil.get(userDB.profile_image, 'user')

      res.setHeader('Content-Type', 'profile_image/*')
      res.send(bytes)
    } catch (error) {
      throw new BadRequestException(`Foto não encontrada`)
    }
  }

  // async updateImg(image: Express.Multer.File, user: Payload) {
  //   const userId = user.id
  //   const strategy =
  //     image.size > 1_000_000
  //       ? new CompressImageSaveStrategy(this.imageUtil)
  //       : new DefaultImageSaveStrategy(this.imageUtil)

  //   this.imageUtil.setSaveStrategy(strategy)

  //   const filename = await this.imageUtil.save(image, userId, 'user')

  //   return this.prismaUtil.performOperation('atualizar', async () => {
  //     return this.prisma.users.update({
  //       where: { id_user: userId },
  //       data: { profile_image: filename },
  //       select: this.selectedColumns,
  //     })
  //   })
  // }

  async uploadProfileImage(file: File, user: users): Promise<StorageResult> {
    const supabase = this.supabaseService.createClientSupabase()

    const filename = `id=${user.id}+image=profile-img${extname(
      file.originalname,
    )}`

    const result = await supabase.storage
      .from(this.config.get('bucketUserProfileImages'))
      .upload(filename, file.buffer, {
        upsert: true,
      })

    if (result.error) {
      throw new BadRequestException(
        'Erro no upload de imagem',
        ErrorConstants.FILE_UPLOAD_ERROR,
      )
    }

    return this.prismaUtil.performOperation(
      'Não foi possível atualizar a imagem do usuário',
      async () => {
        return this.prisma.users.update({
          where: { id: user.id },
          data: { profile_image: filename },
          select: this.selectedColumns,
        })
      },
    )
  }

  async downloadProfileImage(user: users): Promise<string> {
    const supabase = this.supabaseService.createClientSupabase()
    const userDB: users = await this.findOne(user.id)
    const expiresIn: number = 60 * 60 * 24 * 7 //1 week

    const result = await supabase.storage
      .from(this.config.get('bucketUserProfileImages'))
      .createSignedUrl(userDB.profile_image, expiresIn)

    if (result.error) {
      throw new BadRequestException(
        'Erro no download',
        ErrorConstants.FILE_DOWNLOAD_ERROR,
      )
    }

    return result.data.signedUrl
  }

  async deleteProfileImage(user: users) {
    const supabase = this.supabaseService.createClientSupabase()
    const userDB: users = await this.findOne(user.id)

    const result = await supabase.storage
      .from(this.config.get('bucketUserProfileImages'))
      .remove([userDB.profile_image])

    if (result.error) {
      throw new BadRequestException(
        'Erro ao deletar imagem',
        ErrorConstants.FILE_DELETE_ERROR,
      )
    }

    return this.prismaUtil.performOperation(
      'Não foi possível deletar a imagem do usuário',
      async () => {
        return this.prisma.users.update({
          where: { id: user.id },
          data: { profile_image: null },
          select: this.selectedColumns,
        })
      },
    )
  }
}
