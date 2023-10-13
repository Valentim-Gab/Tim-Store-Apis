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
      ignoreExpiration: true,
      secretOrKey: JwtCostants.secret,
    })
  }

  public validate(payload: JwtPayload): Payload {
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    }
  }
};
