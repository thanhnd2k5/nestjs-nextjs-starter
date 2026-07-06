# Enable Optional Features

## 1. Prisma + PostgreSQL

```env
FEATURE_PRISMA=true
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nestjs_starter
```

```bash
docker compose -f docker/docker-compose.yml --profile db up -d
pnpm run db:migrate
```

Provides: `PrismaService` (global inject), DB health check on `/health`.

> **Note:** Schema includes `User` model for optional auth. If you use Prisma without auth, remove `User` from `schema.prisma` before your first migration.

## 2. Redis

```env
FEATURE_REDIS=true
REDIS_URL=redis://localhost:6379
```

```bash
docker compose -f docker/docker-compose.yml --profile redis up -d
```

Provides: `REDIS_CLIENT` injection token (ioredis).

## 3. BullMQ

Requires Redis first.

```env
FEATURE_REDIS=true
FEATURE_BULLMQ=true
REDIS_URL=redis://localhost:6379
```

Provides:
- BullMQ connection via Redis
- Default queue `default` — add processors in your domain modules

**Add a job processor in your project:**

1. Import `DEFAULT_QUEUE` from `@/modules/_optional/bullmq/bullmq.constants`
2. Define job name constants in your module
3. Create a processor extending `WorkerHost` with `@Processor(DEFAULT_QUEUE)`
4. Inject `@InjectQueue(DEFAULT_QUEUE)` to enqueue jobs

## 4. Auth (JWT + Refresh Cookie)

Requires Prisma.

```env
FEATURE_PRISMA=true
FEATURE_AUTH=true
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
```

Endpoints:

| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| POST | `/auth/refresh` | Public (httpOnly cookie) |
| POST | `/auth/logout` | Public |
| GET | `/users/me` | Bearer token |

- Access token: 15 min (configurable) — client memory only
- Refresh token: 7 days — httpOnly cookie, path `/auth/refresh`

Use `@Public()` on routes that skip JWT when auth is enabled.

## Full stack example

```env
FEATURE_PRISMA=true
FEATURE_REDIS=true
FEATURE_BULLMQ=true
FEATURE_AUTH=true
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nestjs_starter
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=dev-access-secret-min-32-characters
JWT_REFRESH_SECRET=dev-refresh-secret-min-32-characters
ENCRYPTION_SECRET=dev-encryption-secret-32chars!!
```

```bash
docker compose -f docker/docker-compose.yml --profile db --profile redis up -d
pnpm run db:migrate
pnpm run dev
```
