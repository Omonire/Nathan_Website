# Nathan N.O — Portfolio

Editorial portfolio for Nathan N.O (video editor & post-production). React + Vite
frontend backed by a small Flask + SQLite API.

## Structure

```
Frontend/   React + Vite + Tailwind v4 (SPA)
Backend/    Flask + SQLite API (see Backend/README.md)
```

## Local development

```powershell
# Backend (http://127.0.0.1:5000)
cd Backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py

# Frontend (http://localhost:5173) — proxies /api to the backend
cd Frontend
npm install
npm run dev
```

If the API is unreachable the frontend falls back to the static content in
`Frontend/src/data/site.ts`, so the site renders either way.

## Deployment

Two services: the **frontend on Vercel**, the **API on Render**.

### 1. Backend → Render

1. Render Dashboard → **New +** → **Blueprint** → select this repo.
2. Render reads the root `render.yaml` and creates `nathan-portfolio-api`.
3. Confirm `https://nathan-portfolio-api.onrender.com/api/health` returns `{"ok": true}`.

Notes: the free plan's SQLite file is ephemeral (messages clear on redeploy —
uncomment the `disk:` block in `render.yaml` to persist). The API sleeps after
~15 min idle.

### 2. Frontend → Vercel

1. Vercel → **Add New… → Project** → import this repo.
2. Set **Root Directory** to `Frontend`.
3. Add env var **`VITE_API_URL`** = `https://nathan-portfolio-api.onrender.com`
   (Production, and Preview if you want). No trailing slash.
4. **Deploy**. `Frontend/vercel.json` adds the SPA rewrite for `/work/:slug`.

`VITE_API_URL` is baked in at build time — redeploy after changing it.

## Admin

Set `ADMIN_TOKEN` on the API (Render generates one) to access `/api/admin/messages`
with the `X-Admin-Token` header. Admin routes return `401` when no token is set
outside of local debug mode.
