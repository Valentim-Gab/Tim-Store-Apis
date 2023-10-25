import { BadRequestException, Injectable } from '@nestjs/common'
import { FileDto } from './upload.dto'
import { Payload } from 'src/security/auth/auth.interface'
import { UserService } from '../user/user.service'
import { ErrorConstants } from 'src/constants/error.constant'
import * as path from 'path'
import { ConfigService } from '@nestjs/config'
import { SupabaseService } from 'src/connections/supabase/supabase.service'
import { users } from '@prisma/client'

@Injectable()
export class UploadService {
  constructor(
    private userService: UserService,
    private config: ConfigService,
    private supabaseService: SupabaseService,
  ) {}

  async upload(file: FileDto, user: Payload): Promise<any> {
    const supabase = this.supabaseService.createClientSupabase()

    const filename = `id=${user.id}+image=profile-img${path.extname(
      file.originalname,
    )}`

    const result = await supabase.storage
      .from(this.config.get('supabaseBucket'))
      .upload(filename, file.buffer, {
        upsert: true,
      })

    if (result.error) {
      throw new BadRequestException(
        'Erro no upload de imagem',
        ErrorConstants.FILE_UPLOAD_ERROR,
      )
    }

    return this.userService.uploadProfileImage(filename, user)
  }

  async download(user: Payload): Promise<any> {
    const supabase = this.supabaseService.createClientSupabase()

    const userDB: users = await this.userService.findOne(user.id)

    const result = await supabase.storage
      .from(this.config.get('supabaseBucket'))
      .createSignedUrl(userDB.profile_image, 60 * 60 * 24 * 7 /* 1 week */)

    if (result.error) {
      throw new BadRequestException(
        'Erro no download',
        ErrorConstants.FILE_DOWNLOAD_ERROR,
      )
    }

    return result.data.signedUrl
  }
}
