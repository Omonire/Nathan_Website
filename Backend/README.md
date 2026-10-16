# Nathan N.O — Flask Backend

SQLite-backed API for the portfolio frontend. No external services required.

## Setup

```powershell
cd Backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

Runs on `http://127.0.0.1:5000`. The Vite dev server proxies `/api/*` here, so the
frontend talks to it with same-origin requests (no CORS setup needed in dev).

The database (`portfolio.db`) is created and seeded automatically on first run.

## Endpoints

| Method | Path | Returns |
|---|---|---|
| GET | `/api/health` | `{ "ok": true }` |
| GET | `/api/site` | site content (see below) |
| GET | `/api/projects` | `Project[]` |
| GET | `/api/projects/<slug>` | `Project` or `404` |
| POST | `/api/contact` | `{ ok, id, reference }` or `400 { ok, errors }` |

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

## Admin (optional)

Set `ADMIN_TOKEN` to require the `X-Admin-Token` header on these routes.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/messages` | list submissions (newest first) |
| POST | `/api/admin/messages/<id>/status` | set `status` to `new` / `read` / `replied` / `archived` |

## Files

- `app.py` — Flask app + public API routes
- `sqlite.py` — DB connection, schema, `init_db`
- `seed.py` — placeholder content + `seed_all` / `reset_all`
- `admin.py` — admin blueprint for messages
- `postregsql.py` — reserved for a PostgreSQL variant (not wired up)
