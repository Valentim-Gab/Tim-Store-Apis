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

  async validateUser(username: string, pass: string): Promise<any> {
    // const user = await this.userService.findByEmail(username)

    const user = {
      id: 'dc7fb99a-2f8a-46bb-a915-2a5fa911a155',
      name: 'adm',
      last_name: null,
      email: 'adm@email.vale',
      password: '$2b$10$LKA.RVeztsScuvW0PSfrUOivtcl/UpSZ48RlrnOHAy2IzM9mgutx2',
      active: true,
      cpf: null,
      cnpj: null,
      date_birth: null,
      phone_number: null,
      role: ['admin'],
      profile_image: null,
      id_gender: 3,
    }

    if (user && (await this.bcrypt.validate(user.password, pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user

      return result
    }

    return null
  }

  public jwtSign(data: users): JwtSign {
    const payload: JwtPayload = {
      sub: data.id,
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
