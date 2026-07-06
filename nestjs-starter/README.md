# nestjs-starter

**Repo độc lập** — NestJS API base với optional infra modules (Prisma, Redis, BullMQ, Auth).

## Quick start

Requires [pnpm](https://pnpm.io/installation) 10+:

```bash
# Node 24 trở xuống (corepack có sẵn)
corepack enable

# Node 25+ (corepack không còn đi kèm Node)
npm install -g pnpm@10.34.4
```

```bash
cp .env.example .env
pnpm install
pnpm run dev
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
