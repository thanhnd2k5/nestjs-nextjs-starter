import { createTestApp } from '../helpers/create-test-app';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / returns app info', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('nestjs-starter');
      });
  });

  it('GET /health returns health status', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });
});
