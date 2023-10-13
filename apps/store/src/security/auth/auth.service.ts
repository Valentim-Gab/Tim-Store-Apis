import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { users } from '@prisma/client'
import { UserService } from 'src/routers/user/user.service'
import { BCryptService } from '../private/bcrypt.service'
import { JwtPayload, JwtSign, Payload } from './auth.interface'
import { JwtCostants } from 'src/constants/JwtConstants'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private bcrypt: BCryptService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(username)
    if (user && (await this.bcrypt.validatePassword(user.password, pass))) {
      const { password, ...result } = user

      return result
    }
    return null
  }

  public validateRefreshToken(data: Payload, refreshToken: string): boolean {
    if (!this.jwtService.verify(refreshToken, {
      secret: JwtCostants.secretRefresh
    })) {
      return false
    }

    const { sub } = this.jwtService.decode(refreshToken) as { sub: string }

    return sub === data.id
  }

  public jwtSign(data: users): JwtSign {
    const payload: JwtPayload = {
      sub: data.id_user,
      username: data.email,
      role: data.role
    }

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.getRefreshToken(payload.sub)
    }
  }

  private getRefreshToken(sub: string): string {
    return this.jwtService.sign(
      { sub },
      {
        secret: JwtCostants.secretRefresh,
        expiresIn: '7d'
      }
    )
  }
}
