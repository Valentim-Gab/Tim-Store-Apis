import { Module } from '@nestjs/common'
import { UserAddressService } from './user-address.service'
import { UserAddressController } from './user-address.controller'
import { PrismaService } from 'nestjs-prisma'
import { ViacepService } from 'src/connections/viacep/viacep.service'
import { PrismaUtil } from 'src/utils/prisma.util'

@Module({
  controllers: [UserAddressController],
  providers: [UserAddressService, PrismaService, ViacepService, PrismaUtil],
})
export class UserAddressModule {}
