# Pulse

Open-source web analytics platform.

## Tech Stack

- **Frontend**: SvelteKit + Tailwind CSS
- **Backend**: Hono + Cloudflare Workers
- **SDK**: JavaScript tracking library
- **Runtime**: Bun
- **Monorepo**: Turbo

## Quick Start

```bash
# Install dependencies
bun install

# Run frontend (http://localhost:5173)
bun run dev:frontend

# Run backend (requires wrangler & local D1 database)
bun run dev:backend

# Build all apps
bun run build

# Typecheck all apps
bun run typecheck
```

## Project Structure

```
apps/
├── frontend/   # SvelteKit dashboard
├── backend/    # Hono API (Cloudflare Workers)
└── sdk/        # JavaScript analytics SDK
```

## Environment

Copy `.env.example` to `.dev.vars` and fill in your Cloudflare credentials:

```
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
```
