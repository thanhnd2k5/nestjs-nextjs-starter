import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ENV_CONFIG } from '@/config/features.config';
import { EnvConfig } from '@/config/env.schema';
import { DEFAULT_QUEUE } from './bullmq.constants';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ENV_CONFIG],
      useFactory: (env: EnvConfig) => ({
        connection: { url: env.REDIS_URL! },
      }),
    }),
    BullModule.registerQueue({ name: DEFAULT_QUEUE }),
  ],
  exports: [BullModule],
})
export class BullMqModule {}
