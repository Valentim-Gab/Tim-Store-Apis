import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { createWriteStream } from 'fs'
import { ensureDir } from 'fs-extra'
import { File } from 'multer'
import { extname } from 'path'
import { ImageSave } from 'src/interfaces/image-save.interface'
import { ImageUtil } from '../image.util'
import { FileConstants } from 'src/constants/file.constant'

@Injectable()
export class DefaultImageSaveStrategy implements ImageSave {
  private readonly rootDirectory = FileConstants.ROOT_DIRECTORY

  constructor(private imageUtil: ImageUtil) {}

  async save(
    multipartFile: File,
    id: number,
    lastDir: string,
  ): Promise<string> {
    const dir = `${this.rootDirectory}/${lastDir}`

    try {
      const filename = multipartFile.originalname
      const fileExternsion = extname(filename)
      const uuid = randomUUID()
      const newFileName = `id=${id}-${lastDir}=${uuid}${fileExternsion}`

      this.imageUtil.deleteImage(dir, id)
      await ensureDir(dir)

      const writeStream = createWriteStream(`${dir}/${newFileName}`)

      writeStream.write(multipartFile.buffer)
      writeStream.end()

      return newFileName
    } catch (error) {
      throw error
    }
  }
}
