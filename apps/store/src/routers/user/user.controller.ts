import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from 'src/security/guards/jwt-auth.guard'
import { RolesGuard } from 'src/security/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enums/Role'
import { ValidationPipe } from 'src/pipes/validation.pipe'
import { ReqUser } from 'src/decorators/req-user.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { Payload } from 'src/security/auth/auth.interface'
import { File } from 'src/interfaces/file.interface'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const user = this.userService.create(createUserDto)

    return user
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Post('profile-image')
  @UseInterceptors(FileInterceptor('profile-image'))
  async uploadProfileImage(
    @UploadedFile() file: File,
    @ReqUser() user: Payload,
  ) {
    return await this.userService.uploadProfileImage(file, user)
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Get('@me')
  findOneMe(@ReqUser() user: Payload) {
    return this.userService.findOne(user.id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin')
  testAdmin() {
    return '{ "message": "Olá Admin" }'
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Get('user')
  testUser() {
    return '{ "message": "Olá User" }'
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Get('profile-image')
  @UseInterceptors()
  async downloadProfileImage(@ReqUser() user: Payload, @Res() res: Response) {
    const profileImage = await this.userService.downloadProfileImage(user)

    res.json({ profile_image: profileImage })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get(':id_user')
  findOne(@Param('id_user') userId: string) {
    return this.userService.findOne(userId)
  }

  @Get('email/:email')
  async findEmail(@Param('email') email: string, @Res() res: Response) {
    res.json({ email_found: !!(await this.userService.findByEmail(email)) })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Patch('@me')
  updateMe(
    @ReqUser() user: Payload,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user.id, updateUserDto)
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Param('id') userId: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto)
  }

  @Patch(':id/password')
  updatePassword(
    @Param('id') userId: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updatePassword(userId, updateUserDto.password)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Delete('@me')
  deleteMe(@ReqUser() user: Payload) {
    return this.userService.delete(user.id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Delete('profile-image')
  @UseInterceptors(FileInterceptor('profile-image'))
  async deleteProfileImage(
    @UploadedFile() file: File,
    @ReqUser() user: Payload,
  ) {
    return await this.userService.deleteProfileImage(user)
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Delete(':id')
  delete(@Param('id') userId: string) {
    return this.userService.delete(userId)
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.User, Role.Admin)
  // @Get('profile_img/@me')
  // downloadImage(@ReqUser() user: Payload, @Res() res: Response) {
  //   return this.userService.findImg(user, res)
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.User, Role.Admin)
  // @Patch('profile_img/@me')
  // @UseInterceptors(FileInterceptor('profile_img'))
  // uploadImage(
  //   @ReqUser() user: Payload,
  //   @UploadedFile() image: Express.Multer.File,
  // ) {
  //   return this.userService.updateImg(image, user)
  // }
}
