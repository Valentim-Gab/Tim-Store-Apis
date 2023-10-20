import {
  Controller,
  Post,
  UseGuards,
  Res,
  Body,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { AuthService } from './auth.service'
import { ReqUser } from 'src/decorators/req-user.decorator'
import { Response } from 'express'
import { users } from '@prisma/client'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enums/Role'
import { RolesGuard } from '../guards/roles.guard'
import { UserService } from 'src/routers/user/user.service'
import { Payload } from './auth.interface'
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard'
import { ErrorConstants } from 'src/constants/ErrorConstants'
import * as jwt from 'jsonwebtoken'
import { JwtCostants } from 'src/constants/JwtConstants'

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

    res.json({ user, tokens })
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  public async refresh(
    @Res() res: Response,
    @ReqUser() payload: Payload,
    @Body('refresh_token') token: string,
  ) {
    try {
      if (!token || !jwt.verify(token, JwtCostants.secretRefresh)) {
        throw new UnauthorizedException('InvalidRefreshToken')
      }

      const user = await this.userService.findOne(payload.id)

      this.login(res, user)
    } catch (error) {
      console.error(error)

      if (error instanceof jwt.TokenExpiredError) {
        throw new ForbiddenException(
          'Sessão expirada',
          ErrorConstants.SESSION_EXPIRED,
        )
      }
      throw new UnauthorizedException(
        'Token inválido',
        ErrorConstants.INVALID_TOKEN,
      )
    }
  }
}
