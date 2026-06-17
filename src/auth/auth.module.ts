import { Module, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// 1. Define the JwtStrategy directly right here in the same file!
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecret', // Matches your token key
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      country: payload.country,
    };
  }
}

// 2. Register it straight into your Module
@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'supersecret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Registered perfectly right here
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}