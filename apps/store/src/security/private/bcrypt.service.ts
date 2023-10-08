import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class BCryptService {
  async encryptPassword(password: string): Promise<string> {
    const saltOrRounds = 10
    return bcrypt.hash(password, saltOrRounds)
  }

  async validatePassword(hash: string, password: string) {
    return await bcrypt.compare(password, hash)
  }
}
