import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../helpers/create-test-app';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const authEnabled = process.env.FEATURE_AUTH === 'true';

  beforeAll(async () => {
    if (!authEnabled) {
      return;
    }

    app = await createTestApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  (authEnabled ? it : it.skip)('auth flow: register → me → refresh → logout', async () => {
    const email = `user-${Date.now()}@example.com`;
    const password = 'password123';

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password })
      .expect(201);

    expect(registerRes.body.success).toBe(true);
    expect(registerRes.body.data.accessToken).toBeDefined();

    const accessToken = registerRes.body.data.accessToken as string;

    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.email).toBe(email);
      });

    const refreshRes = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', registerRes.headers['set-cookie'])
      .expect(201);

    expect(refreshRes.body.data.accessToken).toBeDefined();

    await request(app.getHttpServer())
      .post('/auth/logout')
      .expect(201)
      .expect((res) => {
        expect(res.body.data.success).toBe(true);
      });
  });
});
