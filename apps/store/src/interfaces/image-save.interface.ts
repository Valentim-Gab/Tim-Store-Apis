import { File } from 'multer';

export interface ImageSave {
  save(multipartFile: File, id: number, lastDir: string): Promise<string>
}