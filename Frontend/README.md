# Nathan N.O — Video Editor Portfolio

Marketing site for **Nathan Nkuma O.**, a video editor & post-production specialist
("Video editor for YouTube creators"), based in Benin City, Edo State, Nigeria.

Built with React + TypeScript + Vite and Tailwind CSS.

## Sections

- **Hero** — brand, tagline, showreel video background
- **Services & Rates** — editing, color grading, sound design, motion graphics, shorts, thumbnails
- **Selected Work** — gallery + raw/graded before-after slider
- **Featured Projects** — case studies that can be pre-selected in the inquiry form
- **Reviews** — client testimonials
- **Start a Project** — inquiry form (posts to the backend, falls back to local storage)
- **Contact** — details, socials and a message form

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` to configure the booking API (optional — sensible
defaults are baked in).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run lint` — run Oxlint
- `npm run preview` — preview the production build

## Booking / inquiry API

The inquiry form posts JSON to the Flask backend at
`https://nathan-portfolio-backend-api.onrender.com/api/bookings`
(overridable with `VITE_BOOKINGS_API_URL`, or disabled with
`VITE_BOOKINGS_API=false`). See `../Backend` for the server.

## Admin

A lightweight client-side admin area lives at `/admin` (`/admin/login`). It reads
bookings from the same API endpoint.

## Notes

- Terms are pulled from `src/data/site-content.ts` and `src/lib/cms.ts`.
- Gallery imagery uses Pexels URLs in `src/data/images.ts` — swap for real frames.
