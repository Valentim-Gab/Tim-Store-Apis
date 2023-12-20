import { Controller, Post, UseGuards, Res, Get } from '@nestjs/common'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { AuthService } from './auth.service'
import { ReqUser } from 'src/decorators/req-user.decorator'
import { Response } from 'express'
import { users } from '@prisma/client'
import { UserService } from 'src/routers/user/user.service'
import { Payload } from './auth.interface'
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard'
import { Cookies } from 'src/decorators/cookies.decorator'

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
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
    })

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
    })

    res.json(user)
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  public async refresh(@Res() res: Response, @ReqUser() payload: Payload) {
    const user = await this.userService.findOne(payload.id)

    this.login(res, user)
  }

  @Get('/test')
  public test(
    @Res() res: Response,
    @ReqUser() user: users,
    @Cookies('access_token') token: string,
  ) {
    console.log(res.cookie)

    return res.json(user)
  }
}
