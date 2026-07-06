import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictAppException, InvalidCredentialsException } from '@/common/exceptions/app.exception';
import { ENV_CONFIG } from '@/config/features.config';
import { EnvConfig } from '@/config/env.schema';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import {
  AuthJwtPayload,
  AuthProfile,
  AuthTokenPair,
  JwtExpiresIn,
} from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(ENV_CONFIG) private readonly env: EnvConfig,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokenPair> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictAppException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash },
    });

    return this.buildAuthResponse(user.id, user.email);
  }

  async login(dto: LoginDto): Promise<AuthTokenPair> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new InvalidCredentialsException();
    }

    return this.buildAuthResponse(user.id, user.email);
  }

  async refresh(userId: string, email: string): Promise<{ accessToken: string }> {
    return {
      accessToken: this.signAccessToken({ sub: userId, email }),
    };
  }

  async getProfile(userId: string): Promise<AuthProfile | null> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  signAccessToken(payload: AuthJwtPayload): string {
    return this.jwtService.sign({ sub: payload.sub, email: payload.email });
  }

  signRefreshToken(payload: AuthJwtPayload): string {
    return this.jwtService.sign(
      { sub: payload.sub, email: payload.email },
      {
        secret: this.env.JWT_REFRESH_SECRET!,
        expiresIn: this.env.JWT_REFRESH_EXPIRES_IN as JwtExpiresIn,
      },
    );
  }

  verifyRefreshToken(token: string): AuthJwtPayload {
    return this.jwtService.verify<AuthJwtPayload>(token, {
      secret: this.env.JWT_REFRESH_SECRET!,
    });
  }

  private buildAuthResponse(userId: string, email: string): AuthTokenPair {
    const payload: AuthJwtPayload = { sub: userId, email };
    return {
      accessToken: this.signAccessToken(payload),
      refreshToken: this.signRefreshToken(payload),
      user: { id: userId, email },
    };
  }
}
