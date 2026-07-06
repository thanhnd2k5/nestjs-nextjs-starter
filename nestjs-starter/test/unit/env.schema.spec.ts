import { validateEnv } from '@/config/env.schema';

describe('env.schema', () => {
  const baseEnv = {
    NODE_ENV: 'test',
    PORT: '3000',
    FEATURE_PRISMA: 'false',
    FEATURE_REDIS: 'false',
    FEATURE_BULLMQ: 'false',
    FEATURE_AUTH: 'false',
  };

  it('accepts minimal config with all features disabled', () => {
    const env = validateEnv(baseEnv);
    expect(env.FEATURE_PRISMA).toBe(false);
    expect(env.PORT).toBe(3000);
  });

  it('rejects FEATURE_BULLMQ without FEATURE_REDIS', () => {
    expect(() =>
      validateEnv({
        ...baseEnv,
        FEATURE_BULLMQ: 'true',
        FEATURE_REDIS: 'false',
      }),
    ).toThrow(/FEATURE_BULLMQ requires FEATURE_REDIS/);
  });

  it('rejects FEATURE_AUTH without FEATURE_PRISMA', () => {
    expect(() =>
      validateEnv({
        ...baseEnv,
        FEATURE_AUTH: 'true',
        FEATURE_PRISMA: 'false',
      }),
    ).toThrow(/FEATURE_AUTH requires FEATURE_PRISMA/);
  });

  it('requires DATABASE_URL when prisma enabled', () => {
    expect(() =>
      validateEnv({
        ...baseEnv,
        FEATURE_PRISMA: 'true',
      }),
    ).toThrow(/DATABASE_URL is required/);
  });

  it('defaults SWAGGER_ENABLED to false in production', () => {
    const env = validateEnv({
      ...baseEnv,
      NODE_ENV: 'production',
      ENCRYPTION_SECRET: 'production-encryption-secret-32-chars',
    });
    expect(env.SWAGGER_ENABLED).toBe(false);
  });

  it('defaults SWAGGER_ENABLED to true in development', () => {
    const env = validateEnv(baseEnv);
    expect(env.SWAGGER_ENABLED).toBe(true);
  });

  it('requires ENCRYPTION_SECRET in production', () => {
    expect(() =>
      validateEnv({
        ...baseEnv,
        NODE_ENV: 'production',
      }),
    ).toThrow(/ENCRYPTION_SECRET is required in production/);
  });

  it('requires JWT secrets min 32 chars when auth enabled', () => {
    expect(() =>
      validateEnv({
        ...baseEnv,
        FEATURE_PRISMA: 'true',
        FEATURE_AUTH: 'true',
        DATABASE_URL: 'postgresql://localhost:5432/test',
        JWT_ACCESS_SECRET: 'short',
        JWT_REFRESH_SECRET: 'test-refresh-secret-min-32-characters',
      }),
    ).toThrow(/JWT_ACCESS_SECRET is required when FEATURE_AUTH=true \(min 32 characters\)/);
  });
});
