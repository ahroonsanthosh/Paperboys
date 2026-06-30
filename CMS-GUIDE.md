# Paperboys — CMS Guide

## Admin URL
**`/admin`** on the live site (e.g. `https://paperboys.vercel.app/admin`).

Log in with the admin password (the `ADMIN_SECRET` value set in the Vercel dashboard).

---

## Client Editing Guide

### What you can edit (no code required)

#### Site Settings
Business name, street address, locality, Instagram handle and link, Google Maps embed URL,
directions URL, and the eyebrow text in the hero section.

#### Opening Hours
Seven day entries (Monday–Sunday). Each row has an **Opens**, **Closes**, and **Closed today** toggle.
Flip the toggle to mark a day as closed — the website shows "Closed" automatically.

#### Story & Ticker
The heading and two body paragraphs in the "Who we are" section, the storefront photo,
the pull-quote below it, and the scrolling ticker words at the top of the page.

#### Menu Settings
The menu intro line, the full allergen key, the **Sides & Add-ons** list, and the **Drinks** list.

#### Menu Dishes
Name, price, allergen codes, description, and category (Breakfast or Sandwiches) for each dish.
**Sort Order** controls display order within each category (lower = first).

#### Gallery Photos
Photos in the room & plates section — caption, alt text, and **Sort Order** (grid position).

### How publishing works
Click **Save** in the admin panel. This writes the updated content straight to `content.json`
in the GitHub repo via the GitHub API, which triggers a Vercel redeploy — changes go live in
roughly 30–60 seconds.

### Image uploads
The admin panel uploads images straight to the repo (via the GitHub API) and updates the
relevant content field to point at the new file.

---

## Technical Reference

### Architecture
Plain client-side rendering, no external CMS service:

- `content.json` — single source of truth for all site text, menu items, hours, etc.
- `index.html` — static shell with empty/placeholder elements (`id="heroTitle"`, `id="menuIntro"`, etc.)
  and hardcoded fallback text
- `cms.js` — runs in the browser, fetches `/api/content`, and injects the values into the
  named elements
- `api/content.js` — Vercel serverless function that returns the bundled `content.json`
- `admin/index.html` — password-gated editor UI; fetches `/api/content` to populate the form,
  POSTs edits to `/api/save`
- `api/save.js` — Vercel serverless function; verifies the admin password, then writes the
  updated `content.json` (and any uploaded images) directly to the `main` branch via the
  GitHub Contents API

### Data flow
```
Reading:  browser → cms.js → /api/content → content.json (bundled in the function) → DOM

Writing:  admin → /api/save (password + new content)
              → GitHub Contents API → content.json updated on `main`
              → GitHub push triggers Vercel redeploy
              → /api/content now serves the new data
```

### Environment Variables (Vercel dashboard)
| Variable | Purpose |
|---|---|
| `ADMIN_SECRET` | Password required to use `/admin` and call `/api/save` |
| `GITHUB_TOKEN` | GitHub PAT with `repo` scope, used by `api/save.js` to commit to `content.json` |

### Deployment
Push to `main` → Vercel auto-deploys (`vercel.json`: `outputDirectory: "."`, no build framework).

---

## Reusing This Template for a New Client

### Step 1 — Clone the repo
```bash
git clone https://github.com/ahroonsanthosh/Paperboys.git new-client-name
cd new-client-name
```

### Step 2 — Replace content
Edit `content.json` with the new client's business name, address, hours, menu, etc.
`index.html`'s hardcoded text is just a static fallback — the CMS overrides it at runtime,
but update it too so the page looks right before the first fetch resolves.

### Step 3 — Set up Vercel
Create a new Vercel project pointing at the new repo, and set `ADMIN_SECRET` and
`GITHUB_TOKEN` (a PAT scoped to the new repo) in the project's environment variables.

### Step 4 — Push
```bash
git add -A && git commit -m "init: new client" && git push origin main
```

The new client can now edit content at `/admin` on their deployed site.
