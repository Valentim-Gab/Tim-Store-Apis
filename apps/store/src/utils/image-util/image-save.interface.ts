import { File } from 'multer'

export interface ImageSave {
  save(multipartFile: File, id: string, lastDir: string): Promise<string>
}
