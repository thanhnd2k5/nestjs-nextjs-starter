import { Injectable, OnModuleInit } from '@nestjs/common';
import { HealthIndicatorRegistry } from '@/infrastructure/health/health-indicator.registry';
import { PrismaHealthIndicator } from './prisma.health';

@Injectable()
export class PrismaHealthRegistrar implements OnModuleInit {
  constructor(
    private readonly registry: HealthIndicatorRegistry,
    private readonly prismaHealth: PrismaHealthIndicator,
  ) {}

  onModuleInit(): void {
    this.registry.register(() => this.prismaHealth.isHealthy('database'));
  }
}
