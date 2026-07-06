import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ENV_CONFIG } from './config/features.config';
import { EnvConfig } from './config/env.schema';
import { configureApp } from './bootstrap/configure-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableShutdownHooks();

  const logger = app.get(Logger);
  app.useLogger(logger);

  const env = app.get<EnvConfig>(ENV_CONFIG);
  configureApp(app, env);

  const port = env.PORT;
  await app.listen(port);
  logger.log(`Application running on http://localhost:${port}`);
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
