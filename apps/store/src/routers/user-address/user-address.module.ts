import { Module } from '@nestjs/common'
import { UserAddressService } from './user-address.service'
import { UserAddressController } from './user-address.controller'
import { PrismaService } from 'nestjs-prisma'
import { ViacepService } from 'src/connections/viacep/viacep.service'

@Module({
  controllers: [UserAddressController],
  providers: [UserAddressService, PrismaService, ViacepService],
})
export class UserAddressModule {}
