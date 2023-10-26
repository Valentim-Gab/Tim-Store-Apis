import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from 'nestjs-prisma'
import { BCryptService } from 'src/security/private/bcrypt.service'
import { ImageUtil } from 'src/utils/image-util/image.util'
import { SupabaseService } from 'src/connections/supabase/supabase.service'

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    BCryptService,
    ImageUtil,
    SupabaseService,
  ],
  exports: [UserService],
})
export class UserModule {}
