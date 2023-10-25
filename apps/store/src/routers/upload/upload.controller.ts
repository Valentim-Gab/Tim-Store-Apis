import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UploadService } from './upload.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileDto } from './upload.dto'
import { Roles } from 'src/decorators/roles.decorator'
import { JwtAuthGuard } from 'src/security/guards/jwt-auth.guard'
import { Role } from 'src/enums/Role'
import { RolesGuard } from 'src/security/guards/roles.guard'
import { ReqUser } from 'src/decorators/req-user.decorator'
import { Payload } from 'src/security/auth/auth.interface'
import { Response } from 'express'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Post('/profile-image')
  @UseInterceptors(FileInterceptor('profile-image'))
  async uploadFile(@UploadedFile() file: FileDto, @ReqUser() user: Payload) {
    return await this.uploadService.upload(file, user)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Get('/profile-image')
  @UseInterceptors()
  async download(@ReqUser() user: Payload, @Res() res: Response) {
    const signedUrl = await this.uploadService.download(user)

    res.json({ signedUrl })
  }
}
