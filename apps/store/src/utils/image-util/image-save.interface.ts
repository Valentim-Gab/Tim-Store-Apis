export interface ImageSave {
  save(
    multipartFile: Express.Multer.File,
    id: string,
    lastDir: string,
  ): Promise<string>
}
