import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
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
import { users } from '@prisma/client'
import { ReqUser } from 'src/decorators/req-user.decorator'
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';
import { Response } from 'express'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const user = this.userService.create(createUserDto)

    return user
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.userService.findAll()
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.User, Role.Admin)
  // @Get('@me')
  // findOneMe(@ReqUser() user: users) {
  //   return this.userService.findOne(user.id)
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.User, Role.Admin)
  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.userService.findOne(id)
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.User, Role.Admin)
  // @Patch('@me')
  // updateMe(
  //   @ReqUser() user: users,
  //   @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  // ) {
  //   return this.userService.update(user.id, updateUserDto)
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  // ) {
  //   return this.userService.update(id, updateUserDto)
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.User, Role.Admin)
  // @Delete('@me')
  // deleteMe(@ReqUser() user: users) {
  //   return this.userService.delete(user.id)
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  // @Delete(':id')
  // delete(@Param('id', ParseIntPipe) id: number) {
  //   return this.userService.delete(id)
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.User, Role.Admin)
  // @Get('profile_img/@me')
  // downloadImage(@ReqUser() user: users, @Res() res: Response) {
  //   return this.userService.findImg(user, res)
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.User, Role.Admin)
  // @Patch('profile_img/@me')
  // @UseInterceptors(FileInterceptor('image'))
  // uploadImage(@ReqUser() user: users, @UploadedFile() image: File) {
  //   return this.userService.updateImg(image, user)
  // }  
}
