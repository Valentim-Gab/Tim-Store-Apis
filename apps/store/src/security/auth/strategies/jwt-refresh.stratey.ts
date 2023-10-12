import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtCostants } from "src/constants/JwtConstants";
import { JwtPayload, Payload } from '../auth.interface'

@Injectable()
export default class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtCostants.secret,
    })
  }

  validate(payload: JwtPayload): Payload {
    return {
      id_user: payload.sub,
      email: payload.username,
      role: payload.role,
    }
  }
};
