# Nathan N.O — Portfolio

Portfolio for Nathan N.O (video editor & post-production). React + Vite + Tailwind
frontend backed by a Flask API (PostgreSQL in production).

## Structure

```
Frontend/   React + Vite + Tailwind v4 (SPA)
Backend/    Flask API — bookings, contact, admin (see Backend/README.md)
render.yaml Render blueprint: Postgres + Flask API
```

## Local development

```powershell
# Backend (http://127.0.0.1:5000)
cd Backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
$env:SQLITE=1; .\.venv\Scripts\python.exe app.py   # SQLite for local dev

# Frontend (http://localhost:5173)
cd Frontend
npm install
npm run dev
```

The inquiry form posts to the API. Copy `Frontend/.env.example` to `.env` to
override the endpoint (`VITE_BOOKINGS_API_URL`) or disable it (`VITE_BOOKINGS_API=false`).
Site copy and defaults live in `Frontend/src/data/site-content.ts` and
`Frontend/src/lib/cms.ts`.

## Deployment

Two services: the **frontend on Vercel**, the **API on Render**.

### 1. Backend → Render

1. Render Dashboard → **New +** → **Blueprint** → select this repo.
2. Render reads the root `render.yaml` and creates `nathan-portfolio-db` and
   `nathan-portfolio-api`.
3. Confirm `https://nathan-portfolio-api.onrender.com/api/health` returns `{"ok": true}`.

Notes: `SQLITE=0` pins the API to PostgreSQL (hard-fails if `DATABASE_URL` is
missing). The free plan's API sleeps after ~15 min idle.

### 2. Frontend → Vercel

1. Vercel → **Add New… → Project** → import this repo.
2. **Root Directory** → `Frontend`.
3. Optional env var **`VITE_BOOKINGS_API_URL`** =
   `https://nathan-portfolio-backend-api.onrender.com/api/bookings`
   (the default is already baked in). Set `VITE_BOOKINGS_API=false` to demo offline.
4. **Deploy**. `Frontend/vercel.json` adds SPA rewrites for `/admin/*`.

`VITE_*` vars are baked in at build time — redeploy after changing them.

## Admin

A client-side admin area lives at `/admin` (`/admin/login`). Set `ADMIN_TOKEN`
on the API (Render generates one) to protect `/api/admin/*`.
