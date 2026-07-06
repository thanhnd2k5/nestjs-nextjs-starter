import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '@/common/decorators/public.decorator';
import { ENV_CONFIG } from '@/config/features.config';
import { EnvConfig } from '@/config/env.schema';
import { HealthIndicatorRegistry } from './health-indicator.registry';

@SkipThrottle()
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly registry: HealthIndicatorRegistry,
    @Inject(ENV_CONFIG) private readonly env: EnvConfig,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    const checks: Array<() => Promise<HealthIndicatorResult>> = [
      ...this.registry.getAll(),
    ];

    if (this.env.NODE_ENV !== 'test') {
      checks.unshift(() => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024));
    }

    return this.health.check(checks).then((result) => ({
      ...result,
      version: this.env.APP_VERSION,
      app: this.env.APP_NAME,
    }));
  }
}
