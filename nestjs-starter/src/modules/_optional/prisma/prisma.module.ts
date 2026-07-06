import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaHealthIndicator } from './prisma.health';
import { PrismaHealthRegistrar } from './prisma-health.registrar';

@Global()
@Module({
  providers: [PrismaService, PrismaHealthIndicator, PrismaHealthRegistrar],
  exports: [PrismaService],
})
export class PrismaModule {}
