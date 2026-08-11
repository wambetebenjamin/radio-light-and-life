# Radio Light and Life — 107.3FM website

Full-stack website for Radio Light and Life, built with:

- **Frontend:** React + Vite + Tailwind CSS (`/frontend`)
- **Backend:** Node.js + Express + SQLite (`/backend`)

## What's included

- Home page with a live radio player, "on air now" + "coming up" widgets, real photography hero
- Schedule page (weekly timeline, pulled from the database)
- Presenters page (bios, roles, shows, photos)
- News/blog with individual article pages and cover images
- About page
- Contact page with a working form that saves messages to the database
- **A password-protected admin panel** at `/admin` — add, edit, and delete presenters, schedule entries, news articles, hero/about photos, applications, and Word of the Day entries, including uploading photos, directly from the browser. No code editing required for day-to-day content updates.
- **An Apply page** (`/apply`) for internship applications, advertising enquiries, and partnership requests — with an optional CV/document upload for applicants, no login required to submit. Submissions are viewable (and deletable) by admins in the "Applications" tab.
- **A "Word of the Day" feature** on the Home page — a short encouragement/reflection message from a presenter that changes daily. Manage entries ahead of time in the "Word of the Day" admin tab; the site automatically shows whichever entry matches today's date, falling back to the most recent past entry if nothing's set for today.
- Simple REST API powering all of the above, ready to plug into a real database later (currently SQLite — easy to swap for Postgres/MySQL if you outgrow it)

## Using the admin panel

1. Go to `/admin` on the site (redirects to `/admin/login` if you're not signed in)
2. Log in with the username/password set in `backend/.env` (`ADMIN_USERNAME` / `ADMIN_PASSWORD` — **change these from the defaults before deploying anywhere public**)
3. Use the Presenters / Schedule / News tabs to add, edit, or delete content, including uploading photos (JPG/PNG/WEBP, up to 5MB)

Uploaded images are stored in `backend/uploads/` and served at `/uploads/...` — make sure this folder persists across deploys (most hosts wipe local disk on redeploy, so for production you may eventually want to point uploads at S3/Cloudinary instead; fine to leave as local disk for now).

## Going live with the radio player

The player is fully built and wired up — it just needs a stream URL. Once you
have hosting from a provider like Zeno FM, Radio.co, Shoutcast, Icecast, or
Azuracast:

1. Copy `backend/.env.example` to `backend/.env`
2. Paste your stream URL into `STREAM_URL`
3. Restart the backend

The "Stream offline" message on the site will automatically switch to a
working Play button — no code changes needed.

## Running locally

**Backend**
```bash
cd backend
npm install
cp .env.example .env
npm start
```
Runs on http://localhost:4000. The database (SQLite file) is created and
seeded with sample presenters, a weekly schedule, and news articles the
first time you run it. From then on, edit content either through the
`/admin` panel (recommended) or by editing the database/seed file directly.

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173 and talks to the backend automatically in dev mode.

## Deploying

- **Frontend:** `npm run build` in `/frontend` produces a static `dist/` folder — deploy to Vercel, Netlify, or any static host.
- **Backend:** deploy `/backend` to any Node host (Render, Railway, a VPS, etc). Set the environment variables from `.env.example` in your host's dashboard, especially `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `JWT_SECRET`.
- Point the frontend's API calls at your deployed backend URL (update the proxy/base URL in `frontend/src/lib/api.js` for production, or set up a reverse proxy so `/api` and `/uploads` route to the backend).

### Free-tier deployment, step by step (Vercel + Render)

This gets you a real, live, shareable link at no cost (a `*.vercel.app` / `*.onrender.com` address — see the note on custom domains below).

**1. Push the code to GitHub**
- Create a new repository on github.com (don't initialize it with a README, since this project already has one)
- From inside the `radio-light-and-life` folder, run:
  ```
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
  git push -u origin main
  ```
  (No `git` command available? Install Git from git-scm.com, or use GitHub Desktop instead and drag the folder in.)

**2. Deploy the backend on Render**
- Sign in to render.com with GitHub, click **New → Web Service**, pick this repo
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables (from `backend/.env.example`): `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `STATION_NAME`, etc.
- **Important:** Render's free tier wipes local files (including the SQLite database and any uploaded photos) whenever the service restarts or redeploys. For anything beyond a demo/testing link, add a paid persistent disk (Render's dashboard → Disks) mounted at `/opt/render/project/src/backend/data` and `/opt/render/project/src/backend/uploads`, or this data will periodically disappear.
- Once deployed, copy the live URL Render gives you (e.g. `https://radio-light-and-life-api.onrender.com`)

**3. Deploy the frontend on Vercel**
- Sign in to vercel.com with GitHub, click **Add New → Project**, pick the same repo
- Root directory: `frontend`
- Build command: `npm run build`, Output directory: `dist`
- Add an environment variable: `VITE_API_BASE_URL` = your Render backend URL from step 2 (no trailing slash)
- Deploy — Vercel gives you a live link like `https://radio-light-and-life.vercel.app`

**4. Share the link**
That Vercel URL is your real, live, shareable website. Anyone can open it.

**5. Custom domain (optional, costs money)**
A free custom domain name (like `radiolightandlife.co.ke`) doesn't really exist safely — free TLDs are unreliable for a real business. Buy the domain (~KES 1,500/year, see the quotation), then add it in Vercel's project settings under Domains, and follow their DNS instructions with your registrar.

## Design system

- Fonts: **Oswald** (display/headings, italic, bold, condensed uppercase), **Open Sans** (body), **Space Mono** (timestamps)
- Colors: brand palette from the actual station logo — blue `#1A3FA0`, yellow `#FFD400`, red `#D32F2F`, black `#0D0D0D`
- The real station logo (`frontend/public/logo.png`) is used in the nav bar and footer — replace this file directly to update it everywhere at once
- The Home page hero rotates through 3 background photos with a smooth crossfade every 6 seconds, plus mouse-tracked parallax depth and clickable dot indicators to jump between them
- A floating pulsing "Listen Live" button with real 3D perspective tilt on hover is the actual play control
- A sticky three-panel bar underneath: **Playing Now** (live schedule data), **Up Next** (live schedule data), and **Request a Song** (a real working form — submissions land in the "Song Requests" admin tab)
- Every page background uses a subtle brand-colored gradient instead of a flat solid color
- Cards use a 3D tilt-on-hover effect (`TiltCard`) plus layered shadows for real depth; most pages now have scroll-triggered entrance animations on their content (About's images/stats, Schedule's timeline entries, Apply/Contact forms)
- Navigation uses Framer Motion (`layoutId` morphing underline between pages, page fade-transitions)
- About page photography is real, freely-licensed (Unsplash) placeholders — swap for actual studio/Kericho photos via the admin panel's Site Images tab
