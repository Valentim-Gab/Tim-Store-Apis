import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from 'src/routers/user/user.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtCostants } from 'src/constants/JwtConstants'
import { BCryptService } from '../private/bcrypt.service'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import JwtRefreshStrategy from './strategies/jwt-refresh.stratey'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JwtCostants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, BCryptService],
})
export class AuthModule {}
