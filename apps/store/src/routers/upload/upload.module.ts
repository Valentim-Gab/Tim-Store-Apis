import { Module } from '@nestjs/common'
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'
import { UserService } from '../user/user.service'
import { PrismaService } from 'nestjs-prisma'
import { BCryptService } from 'src/security/private/bcrypt.service'
import { ImageUtil } from 'src/utils/image-util/image.util'

@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    UserService,
    PrismaService,
    BCryptService,
    ImageUtil,
  ],
  exports: [UserService],
})
export class UploadModule {}
