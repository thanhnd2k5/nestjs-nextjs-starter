import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppConfigModule } from './config/config.module';
import { registerOptionalModules } from './config/features.config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AppLoggerModule } from './infrastructure/logger/logger.module';
import { HealthModule } from './infrastructure/health/health.module';
import { CryptoModule } from './infrastructure/crypto/crypto.module';
import { AppThrottlerModule } from './infrastructure/throttler/throttler.module';
import { AppFeatureModule } from './modules/app/app.module';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    HealthModule,
    CryptoModule,
    AppFeatureModule,
    ...registerOptionalModules(),
    AppThrottlerModule.register(),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
