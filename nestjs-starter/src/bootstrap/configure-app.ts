import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { EnvConfig } from '@/config/env.schema';
import { setupSwagger } from '@/infrastructure/swagger/setup-swagger';
import { ROUTES_EXCLUDED_FROM_PREFIX } from './app-routes';

export function configureApp(app: INestApplication, env: EnvConfig): void {
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: env.CORS_ORIGINS.split(',').map((o) => o.trim()),
    credentials: true,
  });

  if (env.API_PREFIX) {
    app.setGlobalPrefix(env.API_PREFIX, {
      exclude: [...ROUTES_EXCLUDED_FROM_PREFIX],
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  setupSwagger(app, env);
}
