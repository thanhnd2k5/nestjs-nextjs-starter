import { DynamicModule, Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { ENV_CONFIG } from '@/config/features.config';
import { EnvConfig } from '@/config/env.schema';
import { REDIS_CLIENT } from '@/config/config.constants';

@Module({})
export class AppThrottlerModule {
  static register(): DynamicModule {
    return {
      module: AppThrottlerModule,
      imports: [
        ThrottlerModule.forRootAsync({
          inject: [ENV_CONFIG, { token: REDIS_CLIENT, optional: true }],
          useFactory: (env: EnvConfig, redis?: Redis): ThrottlerModuleOptions => {
            const options: ThrottlerModuleOptions = {
              throttlers: [
                {
                  ttl: env.THROTTLE_TTL,
                  limit: env.THROTTLE_LIMIT,
                },
              ],
            };

            if (env.FEATURE_REDIS && redis) {
              options.storage = new ThrottlerStorageRedisService(redis);
            }

            return options;
          },
        }),
      ],
      exports: [ThrottlerModule],
    };
  }
}
