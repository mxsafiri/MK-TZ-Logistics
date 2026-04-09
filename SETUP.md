# MK-TZ Logistics OS — Setup

Production setup for the multi-tenant logistics platform. Follow these steps in order.

## 0. Rotate the leaked Neon password (do this first)

A `DATABASE_URL` containing a plaintext password was shared in chat during development. Before anything else, open the Neon console and rotate the password for the `neondb_owner` role. Treat the old credential as compromised.

- Neon Console → your project → **Roles** → `neondb_owner` → **Reset password**
- Copy the new connection strings from the **Connection Details** panel

## 1. Neon project & connection strings

From the Neon console, grab two connection strings:

| Variable                 | Which string              | Used for                          |
| ------------------------ | ------------------------- | --------------------------------- |
| `DATABASE_URL`           | Pooled (ends in `-pooler`) | App runtime (serverless HTTP)     |
| `DATABASE_URL_UNPOOLED`  | Direct (no `-pooler`)      | `drizzle-kit` migrations & studio |

## 2. Enable Neon Auth (Stack Auth)

Neon Auth provisions a managed Stack Auth project that syncs users into the `neon_auth.users_sync` table in your database — no foreign-key wiring needed on our side.

1. Neon Console → your project → **Auth** → **Enable Neon Auth**
2. Pick **Next.js** as the framework
3. Copy the three keys it shows into `.env.local`:
   - `NEXT_PUBLIC_STACK_PROJECT_ID`
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`

Neon automatically creates and maintains `neon_auth.users_sync`. Our `organization_members.user_id` references it by text id (not a DB-level FK, since it lives in a different schema managed by Neon).

## 3. `.env.local`

Copy `.env.example` → `.env.local` and fill in:

```bash
# Database
DATABASE_URL=postgresql://...-pooler...neon.tech/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://...neon.tech/neondb?sslmode=require

# Neon Auth (Stack)
NEXT_PUBLIC_STACK_PROJECT_ID=...
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=...
STACK_SECRET_SERVER_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:6006

# Optional — leave unset in dev
# NEXT_PUBLIC_SENTRY_DSN=
# SENTRY_ORG=
# SENTRY_PROJECT=
# SENTRY_AUTH_TOKEN=
# EXCHANGE_RATE_API_KEY=
```

`lib/env.ts` validates these at boot with zod. A missing required var will fail loudly with a clear error. Tooling that doesn't need real values (e.g. `drizzle-kit generate`) can set `SKIP_ENV_VALIDATION=1` — the `db:*` npm scripts already do this.

## 4. Apply the initial migration

```bash
npm install
npm run db:migrate
```

This runs `lib/db/migrations/0000_*.sql` against `DATABASE_URL_UNPOOLED` and creates 12 tables:

- **Auth/tenancy**: `organizations`, `organization_members`, `invitations`
- **Fleet**: `trucks`, `drivers`, `routes`, `clients`
- **Trips**: `trip_batches`, `trips`, `payments`
- **System**: `exchange_rates`, `audit_log`

All business tables carry `org_id` for multi-tenancy. Money is stored as `bigint` in minor units (cents/senti). `trips.total_minor` is a `GENERATED ALWAYS AS` column derived from advance + complete.

To regenerate after schema edits:

```bash
npm run db:generate   # produces a new SQL file under lib/db/migrations
npm run db:migrate    # applies it
npm run db:studio     # browse the DB in drizzle-kit studio
```

## 5. Run the app

```bash
npm run dev
```

Visit `http://localhost:6006`. Unauthenticated requests to `/dashboard`, `/onboarding`, or `/settings` redirect to `/handler/sign-in` (Stack Auth UI, mounted by `app/handler/[...stack]/page.tsx`). After sign-up, users land on `/onboarding` to create their organization.

## 6. Optional — Sentry

Set `NEXT_PUBLIC_SENTRY_DSN` (and the `SENTRY_*` build-time vars for sourcemap uploads) to turn on error tracking. Without a DSN, `sentry.*.config.ts` no-ops — safe for local dev.

---

## Roles

| Role         | Capabilities                                                  |
| ------------ | ------------------------------------------------------------- |
| `owner`      | Full control, billing, delete org                             |
| `admin`      | Manage members, fleet, trips, payments, financials            |
| `ops`        | Create/edit trips, mark offloaded, manage fleet               |
| `accountant` | Record payments, view financials, export reports              |
| `driver`     | View assigned trips, mark offloaded on own trips              |
| `viewer`     | Read-only dashboard                                           |

Capability checks live in `lib/auth/session.ts` under the `can` object — use these instead of scattering role string comparisons through the codebase.

## Architecture pointers

- **Schema**: `lib/db/schema/{auth,fleet,trips,system}.ts` — Drizzle tables with snake_case casing
- **DB client**: `lib/db/index.ts` — server-only Neon HTTP driver
- **Auth**: `lib/auth/stack.ts` (Stack server app), `lib/auth/session.ts` (`getSession`/`requireSession`/`requireRole`/`can`), `lib/auth/provision.ts` (org creation)
- **Route guard**: `middleware.ts` — cookie-based gate for protected routes
- **Env**: `lib/env.ts` — zod-validated, server/client split
- **Observability**: `instrumentation.ts` + `sentry.*.config.ts`

## Troubleshooting

- **`DATABASE_URL must be set`** from `db:generate` — the script passes `SKIP_ENV_VALIDATION=1`; if you still hit this, make sure you're using the npm script, not calling `drizzle-kit` directly.
- **Sign-in redirects loop** — check that all three `NEXT_PUBLIC_STACK_*` / `STACK_SECRET_SERVER_KEY` values are set and match the Neon Auth project.
- **Migration fails with `permission denied for schema neon_auth`** — expected. `neon_auth.users_sync` is managed by Neon; our migration never touches that schema.
