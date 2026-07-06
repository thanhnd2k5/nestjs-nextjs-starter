import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';

export type HealthIndicatorFn = () => Promise<HealthIndicatorResult>;

@Injectable()
export class HealthIndicatorRegistry {
  private readonly indicators: HealthIndicatorFn[] = [];

  register(fn: HealthIndicatorFn): void {
    this.indicators.push(fn);
  }

  getAll(): HealthIndicatorFn[] {
    return [...this.indicators];
  }
}
