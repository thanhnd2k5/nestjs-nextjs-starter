import { z } from 'zod';

const booleanFromEnv = z
  .union([z.boolean(), z.string()])
  .transform((val) => val === true || val === 'true');

export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    APP_NAME: z.string().default('nestjs-starter'),
    APP_VERSION: z.string().default('1.0.0'),

    CORS_ORIGINS: z.string().default('http://localhost:3000'),
    API_PREFIX: z.string().default(''),

    SWAGGER_ENABLED: booleanFromEnv.optional(),

    FEATURE_PRISMA: booleanFromEnv.default(false),
    FEATURE_REDIS: booleanFromEnv.default(false),
    FEATURE_BULLMQ: booleanFromEnv.default(false),
    FEATURE_AUTH: booleanFromEnv.default(false),

    DATABASE_URL: z.string().optional(),

    REDIS_URL: z.string().optional(),

    JWT_ACCESS_SECRET: z.string().optional(),
    JWT_REFRESH_SECRET: z.string().optional(),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

    ENCRYPTION_SECRET: z.string().optional(),

    THROTTLE_TTL: z.coerce.number().int().positive().default(60000),
    THROTTLE_LIMIT: z.coerce.number().int().positive().default(100),
  })
  .superRefine((data, ctx) => {
    if (data.FEATURE_BULLMQ && !data.FEATURE_REDIS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'FEATURE_BULLMQ requires FEATURE_REDIS=true',
        path: ['FEATURE_BULLMQ'],
      });
    }

    if (data.FEATURE_AUTH && !data.FEATURE_PRISMA) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'FEATURE_AUTH requires FEATURE_PRISMA=true',
        path: ['FEATURE_AUTH'],
      });
    }

    if (data.FEATURE_PRISMA && !data.DATABASE_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'DATABASE_URL is required when FEATURE_PRISMA=true',
        path: ['DATABASE_URL'],
      });
    }

    if (data.FEATURE_REDIS && !data.REDIS_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'REDIS_URL is required when FEATURE_REDIS=true',
        path: ['REDIS_URL'],
      });
    }

    if (data.FEATURE_AUTH) {
      if (!data.JWT_ACCESS_SECRET || data.JWT_ACCESS_SECRET.length < 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'JWT_ACCESS_SECRET is required when FEATURE_AUTH=true (min 32 characters)',
          path: ['JWT_ACCESS_SECRET'],
        });
      }
      if (!data.JWT_REFRESH_SECRET || data.JWT_REFRESH_SECRET.length < 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'JWT_REFRESH_SECRET is required when FEATURE_AUTH=true (min 32 characters)',
          path: ['JWT_REFRESH_SECRET'],
        });
      }
    }

    if (data.NODE_ENV === 'production') {
      if (!data.ENCRYPTION_SECRET || data.ENCRYPTION_SECRET.length < 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ENCRYPTION_SECRET is required in production (min 32 characters)',
          path: ['ENCRYPTION_SECRET'],
        });
      }
    }
  })
  .transform((data) => ({
    ...data,
    SWAGGER_ENABLED: data.SWAGGER_ENABLED ?? data.NODE_ENV !== 'production',
  }));

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const messages = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    throw new Error(`Environment validation failed:\n${messages.join('\n')}`);
  }
  return result.data;
}

export function getFeatureFlags(env: EnvConfig) {
  return {
    prisma: env.FEATURE_PRISMA,
    redis: env.FEATURE_REDIS,
    bullmq: env.FEATURE_BULLMQ,
    auth: env.FEATURE_AUTH,
  };
}

export type FeatureFlags = ReturnType<typeof getFeatureFlags>;
