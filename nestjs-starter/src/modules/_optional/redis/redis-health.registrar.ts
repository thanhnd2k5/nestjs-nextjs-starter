import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { REDIS_CLIENT } from '@/config/config.constants';
import { HealthIndicatorRegistry } from '@/infrastructure/health/health-indicator.registry';
import Redis from 'ioredis';

@Injectable()
export class RedisHealthRegistrar implements OnModuleInit {
  constructor(
    private readonly registry: HealthIndicatorRegistry,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  onModuleInit(): void {
    this.registry.register(async (): Promise<HealthIndicatorResult> => {
      const pong = await this.redis.ping();
      return {
        redis: { status: pong === 'PONG' ? 'up' : 'down' },
      };
    });
  }
}
