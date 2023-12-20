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

    // res.cookie('refresh_token', tokens.refresh_token, {
    //   httpOnly: true,
    //   secure: true,
    //   maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
    //   path: '/',
    // })

    // res.cookie('access_token', tokens.access_token, {
    //   httpOnly: true,
    //   secure: true,
    //   maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
    //   path: '/',
    // })

    console.log('Bateu')

    res.json({ user, tokens })
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  public async refresh(@Res() res: Response, @ReqUser() payload: Payload) {
    const user = await this.userService.findOne(payload.id)

    res.cookie('teste', 'Value', { path: '/' })

    this.login(res, user)
  }

  @Get('/test')
  public test(
    @Res() res: Response,
    @ReqUser() user: users,
    @Cookies('access_token') token: string,
  ) {
    console.log(token)

    return res.json(user)
  }

  @Get('/logout')
  public logout(@Res() res: Response, @Cookies('access_token') token: string) {
    console.log(token)

    res.clearCookie('refresh_token', { path: '/' })
    res.clearCookie('access_token', { path: '/' })

    res.json({ message: 'Logout' })
  }
}
