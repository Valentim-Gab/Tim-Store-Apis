import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'
import * as jwt from 'jsonwebtoken'
import { ErrorConstants } from 'src/constants/error.constant'

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private config: ConfigService) {
    super()
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      let refreshToken = this.extractRefreshTokenFromBody(context)
      let accessToken = this.extractTokenFromAuthHeader(context)

      if (!accessToken && !refreshToken) {
        const tokens = this.extractTokensFromCookies(context)

        console.log(tokens)

        refreshToken = tokens.refresh_token ?? null
        accessToken = tokens.access_token ?? null

        if (accessToken) {
          const decodedToken = jwt.decode(
            accessToken,
            this.config.get('secret'),
          )

          user = {
            id: decodedToken.sub,
            username: decodedToken.username,
            role: decodedToken.role,
          }
        }
      }

      if (refreshToken && accessToken) {
        try {
          jwt.verify(refreshToken, this.config.get('refreshSecret'))
        } catch (error) {
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
      } else {
        throw new UnauthorizedException(
          'Não autenticado',
          ErrorConstants.UNAUTHENTICATED,
        )
      }
    }

    return user
  }

  private extractRefreshTokenFromBody(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest()
    const refreshToken = request.body.refresh_token

    return refreshToken ?? null
  }

  private extractTokenFromAuthHeader(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    return null
  }

  private extractTokensFromCookies(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const tokens = request.cookies

    console.log(request.cookies)

    return tokens
  }
}
