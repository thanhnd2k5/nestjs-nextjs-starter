import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ENV_CONFIG } from './config.constants';
import { getEnvConfig } from './env.loader';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [getEnvConfig],
    }),
  ],
  providers: [
    {
      provide: ENV_CONFIG,
      useFactory: getEnvConfig,
    },
  ],
  exports: [ENV_CONFIG],
})
export class AppConfigModule {}
