import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from 'src/routers/user/user.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtCostants } from 'src/constants/JwtConstants'
import { LocalStrategy } from './strategy/local.strategy'
import { JwtStrategy } from './strategy/jwt.strategy'
import { BCryptService } from '../private/bcrypt.service'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JwtCostants.secret,
      signOptions: { expiresIn: '2000s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, BCryptService],
})
export class AuthModule {}
