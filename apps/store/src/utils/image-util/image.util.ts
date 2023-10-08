import { Injectable } from "@nestjs/common";
import { readdir, unlink, readFile } from "fs-extra";
import { File } from 'multer';
import { DefaultImageSaveStrategy } from "./strategies/default-image-save.strategy";
import * as path from 'path'
import { ImageSave } from "src/interfaces/image-save.interface";
import { FileConstants } from "src/constants/FileConstants";

@Injectable()
export class ImageUtil {
  private readonly rootDirectory = FileConstants.rootDirectory
  private saveStrategy: ImageSave

  constructor() {
    this.saveStrategy = new DefaultImageSaveStrategy(this)
  }

  setSaveStrategy(strategy: ImageSave) {
    this.saveStrategy = strategy
  }

  async save(multipartFile: File, id: number, lastDir: string): Promise<string> {
    return this.saveStrategy.save(multipartFile, id, lastDir);
  }

  async get(imgName: string, lastDir: string) {
    try {
      const dir = path.join(this.rootDirectory, lastDir, imgName)
      const buffer = await readFile(dir)

      return Buffer.from(buffer)
    } catch (error) {
      throw error
    }
  }

  async deleteImage(dir: string, id: number): Promise<void> {
    try {
      const files = await readdir(dir)
      const filesToDelete = files.filter(image => image.includes(`id=${id}`))

      for (const image of filesToDelete) {
        const imagePath = path.join(dir, image)
        await unlink(imagePath)
      }
    } catch (error) {
      console.error('Error deleting images:', error)
    }
  }
} 