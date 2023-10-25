import { BadRequestException, Injectable } from '@nestjs/common'
import { FileDto } from './upload.dto'
import { createClient } from '@supabase/supabase-js'
import { Payload } from 'src/security/auth/auth.interface'
import { UserService } from '../user/user.service'
import { ErrorConstants } from 'src/constants/error.constant'
import * as path from 'path'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UploadService {
  constructor(
    private userService: UserService,
    private config: ConfigService,
  ) {}

  async upload(file: FileDto, user: Payload): Promise<any> {
    const supabaseURL = this.config.get('supabaseURL')
    const supabaseKEY = this.config.get('supabaseKEY')

    const supabase = createClient(supabaseURL, supabaseKEY, {
      auth: {
        persistSession: false,
      },
    })

    const filename = `id=${user.id}+image=profile-img${path.extname(
      file.originalname,
    )}`

    const data = await supabase.storage
      .from('tim-store-images')
      .upload(filename, file.buffer, {
        upsert: true,
      })

    if (data.error) {
      throw new BadRequestException(
        'Erro no upload de imagem',
        ErrorConstants.FILE_UPLOAD_ERROR,
      )
    }

    return this.userService.uploadProfileImage(filename, user)
  }
}
