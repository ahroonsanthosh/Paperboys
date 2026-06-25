# Paperboys — CMS Guide

## Studio URL
**https://paperboys.sanity.studio**

Log in with the Sanity account used to create the project (ahroonsanthosh8@gmail.com).

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
Use the **+** button to add items and the trash icon to remove them.

#### Menu Dishes
Each dish is a separate document in the left sidebar under **Menu Dishes**.
You can change name, price, allergen codes, description, and category (Breakfast or Sandwiches).
**Sort Order** controls display order within each category (lower = first).

#### Gallery Photos
Five photos in the room & plates section. Click a photo document, upload a new image,
update caption and alt text. **Sort Order** controls grid position.

### How publishing works
Click **Publish** on any document. Changes appear on the live website within seconds — no deploy needed.
Click **Discard changes** to undo unpublished edits without affecting the live site.

### Image uploads
Click any image field → **Upload** → choose a file from your computer.
Supported formats: JPG, PNG, WebP. Recommended width: 1200px or wider.

---

## Technical Reference

### Environment Variables

**Studio** (`studio/.env` — copy from `studio/.env.example`):
```
SANITY_STUDIO_PROJECT_ID=kbi1x7f8
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_HOST=paperboys
```

**Frontend** (`cms.js` lines 2–3):
```js
var PROJECT_ID = 'kbi1x7f8';
var DATASET    = 'production';
```

### GROQ Query (cms.js)
All content is fetched in a single query:
```groq
{
  "settings": *[_type == "siteSettings"][0],
  "hours":    *[_type == "openingHours"][0],
  "story":    *[_type == "storySection"][0],
  "menu":     *[_type == "menuSettings"][0],
  "dishes":   *[_type == "menuDish"] | order(category asc, sortOrder asc),
  "gallery":  *[_type == "galleryPhoto"] | order(sortOrder asc)
}
```

### Schema types
| Type | Kind | Purpose |
|---|---|---|
| `siteSettings` | Singleton | Business name, address, social links |
| `openingHours` | Singleton | Mon–Sun hours with closed toggle |
| `storySection` | Singleton | About text, storefront image, ticker words |
| `menuSettings` | Singleton | Intro text, allergen key, sides, drinks |
| `menuDish` | Collection | Individual menu dishes with category + price |
| `galleryPhoto` | Collection | Gallery images with caption + alt text |

### Deployment
- **Studio**: `cd studio && npx sanity@latest deploy`
- **Website**: push to `main` branch → GitHub Pages auto-deploys

### CORS
The Sanity CDN read API (`*.apicdn.sanity.io`) is public — no CORS configuration needed for the frontend.

---

## Reusing This Template for a New Client

**Time required: under 15 minutes**

### Step 1 — Clone the repo
```bash
git clone https://github.com/ahroonsanthosh/Paperboys.git new-client-name
cd new-client-name
```

### Step 2 — Create a new Sanity project
```bash
cd studio
npm install
npx sanity login
npx sanity projects create --name "New Client Name"
# Note the project ID printed (e.g. abc123xyz)
```

### Step 3 — Configure the new project ID
Edit two places:

**`cms.js`** (line 3):
```js
var PROJECT_ID = 'abc123xyz';  // ← new project ID
```

**`studio/.env`** (create from `.env.example`):
```
SANITY_STUDIO_PROJECT_ID=abc123xyz
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_HOST=new-client-hostname
```

### Step 4 — Update studio title
In `studio/sanity.config.js` change:
```js
title: 'Paperboys Studio'  →  title: 'New Client Studio'
```

### Step 5 — Seed initial content
```bash
# In studio/ directory
SANITY_TOKEN=<editor-token-from-manage> node seed.mjs
```
Or paste the browser console seed script at the new studio URL (see session notes).

### Step 6 — Deploy studio
```bash
npx sanity@latest deploy
# When prompted for hostname: enter new-client-hostname
```

### Step 7 — Push website to GitHub
Update `index.html` with the client's actual content (name, address, etc. — the CMS will
override these at runtime, but they serve as static fallback).

```bash
git add -A && git commit -m "init: new client" && git push origin main
```

That's it. The new client can now edit all content at `new-client-hostname.sanity.studio`.
