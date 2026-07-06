# nestjs-starter

**Repo độc lập** — NestJS API base với optional infra modules (Prisma, Redis, BullMQ, Auth).

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

- http://localhost:3000 — API info
- http://localhost:3000/docs — Swagger (when enabled)
- http://localhost:3000/health — Health check

## Feature flags

| Module | Env |
|--------|-----|
| Prisma | `FEATURE_PRISMA=true` + `DATABASE_URL` |
| Redis | `FEATURE_REDIS=true` + `REDIS_URL` |
| BullMQ | `FEATURE_BULLMQ=true` (requires Redis) |
| Auth | `FEATURE_AUTH=true` (requires Prisma + JWT secrets) |

See [docs/ENABLE_FEATURES.md](./docs/ENABLE_FEATURES.md).

## Docker (local DB + Redis)

```bash
docker compose -f docker/docker-compose.yml --profile db --profile redis up -d
```

## Docs

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [ENABLE_FEATURES.md](./docs/ENABLE_FEATURES.md)
- [NEW_PROJECT.md](./docs/NEW_PROJECT.md)
