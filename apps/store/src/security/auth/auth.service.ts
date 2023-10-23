import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { users } from '@prisma/client'
import { UserService } from 'src/routers/user/user.service'
import { BCryptService } from '../private/bcrypt.service'
import { JwtPayload, JwtSign } from './auth.interface'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private bcrypt: BCryptService,
    private config: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<users> {
    const { password, ...user } = await this.userService.findByEmail(username)

    if (user && (await this.bcrypt.validatePassword(password, pass))) {
      return user
    }

    return null
  }

  public jwtSign(data: users): JwtSign {
    const payload: JwtPayload = {
      sub: data.id_user,
      username: data.email,
      role: data.role,
    }

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.getRefreshToken(payload.sub),
    }
  }

  private getRefreshToken(sub: string): string {
    return this.jwtService.sign(
      { sub },
      {
        secret: this.config.get('refreshSecret'),
        expiresIn: '60s',
      },
    )
  }
}
