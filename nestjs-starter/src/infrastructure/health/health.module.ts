import { Global, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HealthIndicatorRegistry } from './health-indicator.registry';

@Global()
@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [HealthIndicatorRegistry],
  exports: [HealthIndicatorRegistry],
})
export class HealthModule {}
