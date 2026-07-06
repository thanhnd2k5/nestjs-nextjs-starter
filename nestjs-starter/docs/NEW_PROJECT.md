# New Project Checklist

Use when cloning `nestjs-starter` for a new backend project.

## 1. Clone and rename

```bash
git clone <nestjs-starter-url> my-project
cd my-project
rm -rf .git
git init
```

Update in `.env` and `package.json`:

- `APP_NAME`
- `APP_VERSION`

## 2. Choose features

Copy `.env.example` → `.env` and enable needed optional modules.

## 3. Infrastructure

- [ ] Provision PostgreSQL + Redis if using Prisma/Redis/BullMQ
- [ ] Set `DATABASE_URL`, `REDIS_URL`
- [ ] Generate strong secrets: `JWT_*`, `ENCRYPTION_SECRET`
- [ ] Run `npm run db:migrate` (when Prisma enabled)

## 4. Add domain modules

```
src/modules/
├── your-feature/
└── ...
```

Import each in `app.module.ts`:

```typescript
imports: [
  // ... core + optional
  YourFeatureModule,
],
```

## 5. Extend Prisma schema

Add models to `prisma/schema.prisma`, run `npm run db:migrate`.

- **Using auth:** keep and extend the `User` model.
- **Not using auth:** remove the `User` model before your first migration to avoid an unused table.

## 6. Production deploy

- [ ] Set `NODE_ENV=production`
- [ ] Set `ENCRYPTION_SECRET` (min 32 characters)
- [ ] Set `SWAGGER_ENABLED=false` (or protect `/docs`)
- [ ] Configure `CORS_ORIGINS` to frontend URL
- [ ] Deploy with Dockerfile or platform native build
- [ ] Run `prisma migrate deploy` on deploy
- [ ] Verify `GET /health`

## Do not modify (extend instead)

- `src/common/filters/global-exception.filter.ts`
- `src/common/interceptors/transform.interceptor.ts`
- `src/config/env.schema.ts` — add new env vars here with validation

Domain exceptions extend `AppException` from `src/common/exceptions/`.
