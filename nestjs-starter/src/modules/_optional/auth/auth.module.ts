import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { ENV_CONFIG } from '@/config/features.config';
import { EnvConfig } from '@/config/env.schema';
import { AuthController, UsersController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtExpiresIn } from './auth.types';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ENV_CONFIG],
      useFactory: (env: EnvConfig) => ({
        secret: env.JWT_ACCESS_SECRET!,
        signOptions: {
          expiresIn: env.JWT_ACCESS_EXPIRES_IN as JwtExpiresIn,
        },
      }),
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
