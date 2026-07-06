import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvConfig } from '@/config/env.schema';

export function setupSwagger(app: INestApplication, env: EnvConfig): void {
  if (!env.SWAGGER_ENABLED) {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle(env.APP_NAME)
    .setDescription('NestJS Starter API')
    .setVersion(env.APP_VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
