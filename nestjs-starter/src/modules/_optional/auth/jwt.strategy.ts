import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser } from '@/common/types/authenticated-user';
import { ENV_CONFIG } from '@/config/features.config';
import { EnvConfig } from '@/config/env.schema';
import { AuthJwtPayload } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(ENV_CONFIG) env: EnvConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_ACCESS_SECRET!,
    });
  }

  validate(payload: AuthJwtPayload): AuthenticatedUser {
    return { id: payload.sub, email: payload.email };
  }
}
