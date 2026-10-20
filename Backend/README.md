# Nathan N.O — Flask Backend

PostgreSQL-backed API for the portfolio frontend (with an optional SQLite mode
for offline development).

## Setup

```powershell
cd Backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
copy .env.example .env   # then set DATABASE_URL
.\.venv\Scripts\python.exe app.py
```

Runs on `http://127.0.0.1:5000`. The Vite dev server proxies `/api/*` here, so the
frontend talks to it with same-origin requests (no CORS setup needed in dev).

Database selection is controlled by `SQLITE`:

- `SQLITE=0` (or unset) — PostgreSQL via `DATABASE_URL` (required). Fails to
  start or returns `503` if it is unset or unreachable.
- `SQLITE=1` — local SQLite file (`DATABASE_PATH`, defaults to `./portfolio.db`).

The schema is created and seeded automatically on first run.

## Endpoints

| Method | Path | Returns |
|---|---|---|
| GET | `/api/health` | `{ "ok": true }` |
| GET | `/api/site` | site content (see below) |
| GET | `/api/projects` | `Project[]` |
| GET | `/api/projects/<slug>` | `Project` or `404` |
| POST | `/api/contact` | `{ ok, id, reference }` or `400 { ok, errors }` |
| GET | `/api/bookings` | `Booking[]` (newest first, max 100) |
| POST | `/api/bookings` | `{ ok, reference, stored }` or `400 { error }` |

### `GET /api/site`
```json
{
  "brand":       { "name": "", "role": "", "positioning": "" },
  "showreel":    { "url": "", "caption": "", "length": "" },
  "about":       { "bio": "", "years": "", "tools": [], "clients": [] },
  "contact":     { "email": "", "location": "", "availability": "" },
  "socials":     [ { "label": "", "href": "" } ],
  "services":    [ { "index": "", "name": "", "description": "", "detail": "" } ],
  "testimonials":[ { "quote": "", "name": "", "role": "" } ]
}
```

### `Project`
```json
{
  "slug": "", "title": "", "client": "", "year": "", "tag": "",
  "role": "", "videoUrl": "", "thumb": "", "description": "", "result": ""
}
```

### `POST /api/contact`
Request: `{ "name", "email", "message" }` (optional hidden `website` honeypot field).
Response `200`: `{ "ok": true, "id": 1, "reference": "NNO-XXXXXX" }`
Response `400`: `{ "ok": false, "errors": { "email": "..." } }`

### `POST /api/bookings`
Request: `{ "serviceId", "date", "time", "name", "contact", ... }` (optional
`serviceName`, `barberId`, `barberName`, `notes`, and a hidden `website` honeypot).
Response `200`: `{ "ok": true, "reference": "SLK-XXXXX", "stored": true }`
Response `400`: `{ "error": "..." }`

## Admin (optional)

Set `ADMIN_TOKEN` to require the `X-Admin-Token` header on these routes.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/messages` | list submissions (newest first) |
| POST | `/api/admin/messages/<id>/status` | set `status` to `new` / `read` / `replied` / `archived` |

## Files

- `app.py` — Flask app + public API routes
- `db.py` — database selector (`SQLITE` flag)
- `postregsql.py` — psycopg2 connection wrapper + schema
- `sqlite.py` — SQLite connection + schema (used when `SQLITE=1`)
- `seed.py` — placeholder content + `seed_all` / `reset_all`
- `admin.py` — admin blueprint for messages
