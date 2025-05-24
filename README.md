# TODO

# Workshop

- Clone repository

- nmp install

This downloads the sql from a github release "binary"

- npm run dev:db-up

- Create src/schema.ts

Open docker/seed.sql

add table('artist', ...)

export createSchema

- npm run dev:zero-cache

- Add Zero to index.tsx
- ssr: false

- Create a basic query

- `alter table album add column votes int default 0;`

## Deploy

For details see [the official docs](https://zero.rocicorp.dev/docs/deployment#guide-single-node-on-flyio).

### Supabase

We have deployed this database to Supabase already.

Change the `ZERO_UPSTREAM_DB` connection string in `.env`.

### Fly.io

Install fly command line.

```sh
INITIALS=arv
CACHE_APP_NAME=$INITIALS-local-first-berlin-2025
fly app create $CACHE_APP_NAME
fly secrets set ZERO_UPSTREAM_DB="postgresql:..."
```

## Deploy to Vercel

Set VITE_PUBLIC_SERVER="https://arv-local-first-berlin-2025.fly.dev"
Set ZERO_UPSTREAM_DB="..."
