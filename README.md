# Kira Scripts — God-Level Execution Hub

A cinematic, single-page hub for a Roblox script community, built to deploy on **Vercel** with zero build step.

## What's in here

- `index.html` — the full site (HTML + CSS + JS inline). Edit branding, games, stats, links & sounds from the **Admin Panel** (click the hexagon floating button, bottom-right → password `kira`).
- `api/youtube.js` — a Vercel Serverless Function that fetches your **3 most recent YouTube videos + thumbnails** via the public YouTube RSS feed (no API key needed).
- `vercel.json` — tells Vercel the function config.
- `package.json` — handy `npm run dev` (`vercel dev`) / `npm start` (`serve`) scripts.

## Sections

Home · About · Features · Games (with per-game script features) · Discord Community (live widget) · YouTube (recent 3 videos) · Get Key · Loader.

Stats shown: **number of scripts, detection rate, total executions, active users, uptime.**

## Deploy to Vercel

### Option A — Vercel Dashboard (easiest)
1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Framework Preset: **Other** · Build Command: *(none)* · Output Directory: `.` (root).
4. Click **Deploy**. The `/api/youtube` route works automatically.

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel            # deploy (preview)
vercel --prod     # production
```

### Local dev with the API working
```bash
npm install
npm run dev       # runs `vercel dev` — serves index.html AND the /api/youtube function at http://localhost:3000
```
(Without Vercel, opening `index.html` directly still works — the YouTube section just shows a graceful fallback linking to your channel.)

## Configure your content

Open the **Admin Panel** (hexagon button, bottom-right → password `kira`):

- **Links** → set your Discord invite, YouTube URL, **YouTube handle** (e.g. `@kira_scripts_forever`), **YouTube Channel ID** (optional but faster/reliable), and **Discord Server ID** (enables the live community widget — also enable "Server Widget" in Discord → Server Settings → Widget).
- **Stats** → number of scripts, detection rate, total executions, users, uptime.
- **Branding** → hub name, tagline, quotes, and an optional **logo image URL**.
- **Games** → add/edit supported games, their scripts, features, status, and images.
- **Data** → export/import a full JSON backup, or factory reset.

> The YouTube API tries to resolve your channel from the handle you set. For best reliability, paste your **Channel ID** (looks like `UC...`) into Links → YouTube Channel ID. The function caches results for 30 minutes.

## Notes
- All site settings are stored in the visitor's browser `localStorage` (per-device). Use **Admin → Data → Export** to back up, and re-import on a fresh browser. The YouTube feed is fetched live from the serverless function.
- Change the admin password by editing the `HASH` constant in `index.html` (it's the SHA-256 of the password).
