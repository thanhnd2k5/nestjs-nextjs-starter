import { DynamicModule, Type } from '@nestjs/common';
import { EnvConfig, getFeatureFlags } from './env.schema';
import { ENV_CONFIG } from './config.constants';
import { getEnvConfig } from './env.loader';
import { PrismaModule } from '../modules/_optional/prisma/prisma.module';
import { RedisModule } from '../modules/_optional/redis/redis.module';
import { BullMqModule } from '../modules/_optional/bullmq/bullmq.module';
import { AuthModule } from '../modules/_optional/auth/auth.module';

export { ENV_CONFIG };

export function getValidatedEnv(): EnvConfig {
  return getEnvConfig();
}

export function registerOptionalModules(env?: EnvConfig): Array<Type<unknown> | DynamicModule> {
  const config = env ?? getEnvConfig();
  const features = getFeatureFlags(config);
  const modules: Array<Type<unknown> | DynamicModule> = [];

  if (features.prisma) {
    modules.push(PrismaModule);
  }

  if (features.redis) {
    modules.push(RedisModule);
  }

  if (features.bullmq) {
    modules.push(BullMqModule);
  }

  if (features.auth) {
    modules.push(AuthModule);
  }

  return modules;
}
