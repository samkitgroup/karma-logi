# Vercel deployment — Karma Logi

Karma Logi stores players and scores in **Postgres** (Neon via Vercel is recommended). Sessions use an **httpOnly cookie** (`karma_player_id`) so the scorecard page can load the signed-in player server-side.

## 1. Create the database

1. Open your Vercel project → **Storage** → **Create Database** → **Postgres** (Neon).
2. Connect the database to the project. Vercel injects connection strings automatically.

## 2. Environment variables

Ensure these exist in **Project → Settings → Environment Variables** (Production & Preview):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Pooled connection for Route Handlers at runtime |
| `DATABASE_URL_NON_POOLING` | Direct connection for migrations (DDL) |

Vercel Neon integration usually sets both. For local dev, copy them into `.env.local`.

Example `.env.local`:

```env
DATABASE_URL=postgresql://...
DATABASE_URL_NON_POOLING=postgresql://...
```

## 3. Run database migrations

Migrations live in `drizzle/`. Apply them **once** against the production database:

```bash
# From your machine with .env.local pointing at the Vercel/Neon DB
npm run db:migrate
```

Or add a one-off deploy step / CI job that runs `npm run db:migrate` using `DATABASE_URL_NON_POOLING`.

Tables created:

- `players` — unique `mobile`, `name`
- `game_scores` — one row per `(player_id, game_id)`; enforces **one play per game per mobile**

## 4. Deploy

```bash
git push
```

Vercel builds with `npm run build`. No extra config is required for the App Router API routes under `src/app/api/`.

## 5. After deploy — smoke test

1. Open `/` → register with name + mobile.
2. Play a game → score should save at time-up.
3. Try the same game again → blocked (already played).
4. Open `/scorecard` → total score, per-game rows, leaderboard.

Health check (DB connectivity): `GET /api/health`

## Notes

- **Sessions**: Cookie is `httpOnly`, `sameSite: lax`, `secure` in production. Clearing cookies requires registering again (same mobile reuses the same player record).
- **Leaderboard**: Mobile numbers are masked in the UI (`98******10`).
- **Local dev without DB**: Registration and score APIs return 500 until `DATABASE_URL` is set.
