import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { users } from '@prisma/client'
import { UserService } from 'src/routers/user/user.service'
import { BCryptService } from '../private/bcrypt.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private bcrypt: BCryptService,
  ) {}

  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = await this.userService.findByEmail(username)
  //   if (user && (await this.bcrypt.validatePassword(user.password, pass))) {
  //     const { password, ...result } = user

  //     return result
  //   }
  //   return null
  // }

  async login(user: users) {
    // const userPermission = (await this.userService.findOne(user.id)).role
    // const payload = {
    //   username: user.email,
    //   sub: user.id,
    //   roles: userPermission,
    // }

    // return {
    //   access_token: this.jwtService.sign(payload),
    // }
  }
}
