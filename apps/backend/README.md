# Pulse Backend

API server built with Hono on Cloudflare Workers.

## Prerequisites

- Cloudflare account
- `.env` or `.dev.vars` with:
  ```
  CLOUDFLARE_API_TOKEN=
  CLOUDFLARE_ACCOUNT_ID=
  ```

## Commands

```bash
# Run with Wrangler (requires local D1 database)
bun run dev:cf

# Run with database migration
bun run dev:full

# Deploy to Cloudflare
bun run deploy

# Generate Cloudflare bindings types
bun run cf-typegen
```

## Database

```bash
# Run migrations (local)
bun run db:migrate:local

# Run migrations (remote)
bun run db:migrate:remote

# Fresh local database
bun run db:fresh:local
```

## Type Safety

Import `CloudflareBindings` in your Hono app:

```ts
import type { CloudflareBindings } from "./types";

const app = new Hono<{ Bindings: CloudflareBindings }>();
```
