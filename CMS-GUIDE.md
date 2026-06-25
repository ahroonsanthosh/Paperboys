# Paperboys — CMS Editing Guide

Your studio URL is: `https://<your-studio-name>.sanity.studio`

Log in with the email address you used when setting up the project.

---

## What you can edit

### Site Settings
Business name, address, Instagram handle and link, Google Maps embed URL, directions URL, and the small eyebrow text in the hero ("Tobin Street · Cork City · Open daily 10–4").

### Opening Hours
Seven day entries. Flip the **Closed today** toggle to mark a day off — the website will show "Closed" automatically.

### Story & Ticker
The heading and two paragraphs in the "Who we are" section, the storefront photo, the quote below it, and the scrolling ticker words at the top of the page.

### Menu Settings (sides, drinks, allergens)
The menu intro line, the full allergen key, and the Sides & Add-ons and Drinks lists. To add or remove an item, use the + / trash icons beside each row.

### Menu Dishes
Each dish is a separate document. You can change the name, price, allergen numbers, description, and category (Breakfast or Sandwiches). Drag to reorder within a category using the **Sort Order** field (lower numbers appear first).

### Gallery Photos
Five (or more) photos in the room & plates section. Upload a new image, update the caption and alt text. Sort Order controls the grid position.

---

## How publishing works

Click **Publish** on any document to make it live. Changes appear on the website within a few seconds — there is no deploy step needed.

Click **Discard changes** to undo unpublished edits.

---

## How to add this CMS to a new client site (agency reuse)

1. Clone the Paperboys repo:  `git clone https://github.com/ahroonsanthosh/Paperboys.git new-client`
2. `cd new-client/studio && npm install`
3. `npx sanity login` (if not already logged in)
4. `npx sanity init --env` → choose **Create new project**, name it after the client
5. Replace `REPLACE_WITH_PROJECT_ID` in `cms.js`, `studio/sanity.config.js`, and `studio/sanity.cli.js` with the new project ID
6. Update `studio/sanity.config.js` → change `title: 'Paperboys Studio'` to the client name
7. `bash studio/setup-cors-and-deploy.sh https://client-domain.com`
8. `node studio/seed.js` (seeds placeholder content — editor replaces with real content)

Total time: under 10 minutes for a returning user.
