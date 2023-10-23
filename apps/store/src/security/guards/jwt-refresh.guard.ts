import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import * as jwt from 'jsonwebtoken'
import { JwtCostants } from 'src/constants/JwtConstants'
import { ErrorConstants } from 'src/constants/ErrorConstants'

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const refreshToken = this.extractRefreshTokenFromBody(context)
      const accessToken = this.extractTokenFromAuthHeader(context)

      if (refreshToken && accessToken) {
        try {
          jwt.verify(refreshToken, JwtCostants.secretRefresh)
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
}
