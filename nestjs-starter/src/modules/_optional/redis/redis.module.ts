import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ENV_CONFIG } from '@/config/features.config';
import { EnvConfig } from '@/config/env.schema';
import { REDIS_CLIENT } from '@/config/config.constants';
import { RedisHealthRegistrar } from './redis-health.registrar';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ENV_CONFIG],
      useFactory: (env: EnvConfig) => {
        return new Redis(env.REDIS_URL!, {
          maxRetriesPerRequest: null,
        });
      },
    },
    RedisHealthRegistrar,
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }
}
