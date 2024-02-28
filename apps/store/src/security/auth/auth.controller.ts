import { Controller, Post, UseGuards, Res, Get, Headers } from '@nestjs/common'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { AuthService } from './auth.service'
import { ReqUser } from 'src/decorators/req-user.decorator'
import { Response } from 'express'
import { users } from '@prisma/client'
import { UserService } from 'src/routers/user/user.service'
import { Payload } from './auth.interface'
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard'
import { Cookies } from 'src/decorators/cookies.decorator'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enums/Role'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { RolesGuard } from '../guards/roles.guard'

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  public login(@Res() res: Response, @ReqUser() user: users) {
    const tokens = this.authService.jwtSign(user)

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
    })

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
    })

    res.cookie('session', tokens.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: 30,
    })

    res.json({ user, tokens })
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  public async refresh(@Res() res: Response, @ReqUser() payload: Payload) {
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

    // const user = await this.userService.findOne(payload.id)

    this.login(res, user)
  }

  @Get('/test')
  public test(
    @Res() res: Response,
    @ReqUser() user: users,
    @Cookies('access_token') token: string,
    @Headers('authorization') auth: string,
  ) {
    console.log(auth)

    return res.json(user)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Post('/testy')
  public testPost(@Res() res: Response) {
    return res.json({ message: 'teste bem sucedido' })
  }

  @Get('/logout')
  public logout(@Res() res: Response, @Cookies('access_token') token: string) {
    console.log(token)

    res.clearCookie('refresh_token', { path: '/' })
    res.clearCookie('access_token', { path: '/' })

    res.json({ message: 'Logout' })
  }
}
