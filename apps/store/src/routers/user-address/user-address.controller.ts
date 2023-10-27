import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { UserAddressService } from './user-address.service'
import { CreateUserAddressDto } from './dto/create-user-address.dto'
import { UpdateUserAddressDto } from './dto/update-user-address.dto'
import { ReqUser } from 'src/decorators/req-user.decorator'
import { users } from '@prisma/client'
import { JwtAuthGuard } from 'src/security/guards/jwt-auth.guard'
import { RolesGuard } from 'src/security/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enums/Role'

@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Post()
  create(@Body() addressDto: CreateUserAddressDto, @ReqUser() user: users) {
    return this.userAddressService.create(addressDto, user)
  }

  @Get()
  findAll() {
    return this.userAddressService.findAll()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Get('user')
  findAllByUser(@ReqUser() user: users) {
    return this.userAddressService.findAllByUser(user)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAddressService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
  ) {
    return this.userAddressService.update(id, updateUserAddressDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAddressService.remove(id)
  }
}
