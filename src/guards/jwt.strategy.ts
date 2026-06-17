import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // Automatically looks for and extracts the 'Bearer <token>' header from Postman
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecret', // MUST perfectly match the secret string in your AuthModule!
    });
  }

  async validate(payload: any) {
    // This payload contains the user details decoded from your JWT
    if (!payload) {
      throw new UnauthorizedException();
    }
    
    // Whatever we return here gets attached by NestJS directly to req.user
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      country: payload.country,
    };
  }
}