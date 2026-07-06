export interface AuthJwtPayload {
  sub: string;
  email: string;
}

export type JwtExpiresIn = `${number}${'s' | 'm' | 'h' | 'd'}`;

export interface AuthTokenPair {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string };
}

export interface AuthProfile {
  id: string;
  email: string;
  createdAt: Date;
}
