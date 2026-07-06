# Architecture

## Layer overview

```
src/
├── config/           # Env validation (Zod), feature flags
├── common/           # Exceptions, filters, interceptors, DTOs, decorators
├── infrastructure/   # Logger, health, swagger, crypto, throttler
└── modules/
    ├── app/          # Root controller (always on)
    └── _optional/    # Prisma, Redis, BullMQ, Auth — toggled via env
```

## Core (always enabled)

- **Config**: Zod validation at boot; fail fast on invalid env
- **Bootstrap**: Shared `configureApp()` used by `main.ts` and E2E tests (Helmet, CORS, ValidationPipe, Swagger)
- **Logging**: Pino structured JSON (pretty in dev)
- **Errors**: `GlobalExceptionFilter` → `{ success: false, error: { code, message } }` (500 details hidden in production)
- **Responses**: `TransformInterceptor` → `{ success: true, data, meta? }`
- **Health**: `GET /health` via Terminus (+ optional DB/Redis checks via registry pattern)
- **Security**: Helmet, CORS, global ValidationPipe, rate limiting (Redis-backed when `FEATURE_REDIS=true`); health excluded from throttling
- **Secrets**: Dev-only fallbacks for encryption; production requires `ENCRYPTION_SECRET` (min 32 chars)
- **Shutdown**: `enableShutdownHooks()` — Prisma/Redis disconnect on SIGTERM
- **Swagger**: `GET /docs` when `SWAGGER_ENABLED=true` (defaults off in production)
- **API prefix**: Optional `API_PREFIX` env (e.g. `api` → routes under `/api/*`); `/health` and `/docs` stay at root

## Health indicator registry

Optional modules register health checks via `HealthIndicatorRegistry` on module init — `HealthController` does not import Prisma/Redis directly. Add new infra checks by calling `registry.register()` in your module's `OnModuleInit`.

## Optional modules

Registered dynamically in `registerOptionalModules()` based on feature flags.

See [ENABLE_FEATURES.md](./ENABLE_FEATURES.md).

## Adding domain modules

1. Create `src/modules/your-feature/`
2. Follow NestJS module pattern: `module.ts`, `controller.ts`, `service.ts`, `dto/`
3. Import module in `app.module.ts` (not in `_optional/`)
4. Extend `AppException` for domain errors with machine-readable `code`

## Common conventions (for domain modules)

| File | Purpose |
|------|---------|
| `common/dto/api-response.dto.ts` | Swagger schemas for `{ success, data, error }` envelope |
| `common/dto/pagination.dto.ts` | `PaginationQueryDto` + `buildPaginationMeta()` for list endpoints |
| `common/constants/error-codes.ts` | Extend with domain-specific error codes |
| `common/constants/http.constants.ts` | Shared HTTP constants (`REQUEST_ID_HEADER`) |

## Swagger tags convention

| Tag | Purpose |
|-----|---------|
| `app` | Root / meta endpoints |
| `health` | Health checks |
| `auth` | Authentication |
| `users` | User profile |

Domain modules add their own tags (`words`, `sessions`, etc.).

## Request flow

```
HTTP Request
  → ThrottlerGuard
  → JwtAuthGuard (if FEATURE_AUTH)
  → Controller
  → Service
  → TransformInterceptor (success wrap)
  → Response
```

Errors bypass interceptor → `GlobalExceptionFilter`.

## Auth module (reference implementation)

When `FEATURE_AUTH=true`, JWT access + refresh cookie flow is provided as a **starting point**, not production-grade auth:

- No refresh-token revocation store (logout clears cookie only)
- No token rotation or device/session tracking
- Extend with your own `RefreshToken` model or Redis denylist before production

## BullMQ worker separation

With `FEATURE_BULLMQ=true`, the module only wires **connection + default queue**. Processors belong in domain modules. For production with background jobs:

1. Run API and worker as separate processes/containers when needed
2. Share `REDIS_URL` and queue names
3. API enqueues jobs; worker process imports processors without HTTP controllers
