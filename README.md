# ขณะ · KHANA — website

Static website for KHANA longan honey (Phayao). Plain HTML/CSS/JS — no build step.

## Photo framing — how it carries over to the live site

When you drag inside a photo placeholder to choose which part shows (and
double-click to pan/zoom), that crop — and the image itself — is saved into
**`.image-slots.state.json`** (included in this folder). The site reads that file
on any web server, so your deployed visitors see the exact same framing. On the
live site it's read-only: visitors can't drag it, which is what you want.

Two things make this work on **GitHub Pages**:
1. Keep **`.image-slots.state.json`** in the same folder as the HTML (it's here).
2. Keep the empty **`.nojekyll`** file at the repo root (it's here). Without it,
   GitHub Pages hides any file beginning with a dot — and your images wouldn't load.
   Note: both files start with a dot, so they may be hidden in Finder/Explorer
   (press Cmd+Shift+. on Mac to reveal). Make sure they get uploaded.

To re-frame later, come back here, drag the image, and re-download the folder —
the updated `.image-slots.state.json` carries the new crop.

## Prefer real image files instead? (optional)

The approach above embeds images as data inside the JSON. If you'd rather manage
real image files, replace each `<image-slot ...></image-slot>` with:

    <div style="aspect-ratio:16/7; overflow:hidden; border-radius:20px;">
      <img src="images/phayao-dawn.jpg" alt="Phayao at dawn"
           style="width:100%; height:100%; object-fit:cover; object-position:50% 30%;">
    </div>

`object-position: X% Y%` is the framing — lower the second number to show more of
the top, raise it to show more of the bottom. (Tell me and I can convert your
already-framed images to this for you.)

## Files
- `index.html` · `story.html` · `buy.html` · `faq.html` — the four pages
- `khana.css` — all styles (palette, type, layout, the Tweaks "feel" controls)
- `khana.js` — language toggle, mobile nav, scroll reveals, "coming soon" popup
- `image-slot.js` — drag-and-drop photo placeholders
- `tweaks-panel.jsx` — the Tweaks panel on the Home page
- `.image-slots.state.json` — your photos + their framing crops
- `.nojekyll` — tells GitHub Pages to serve the dotfile above

## Publish with GitHub Pages
1. Create a new repository on GitHub (e.g. `khana-site`).
2. Upload the contents of this folder to the repo (drag the files into GitHub's
   "Add file → Upload files", or push with git). Keep `index.html` at the root.
3. In the repo: **Settings → Pages → Build and deployment**.
   Set **Source: Deploy from a branch**, **Branch: main /(root)**, then **Save**.
4. Wait ~1 minute. Your site is live at
   `https://<your-username>.github.io/khana-site/`

(For a custom domain like khana.life, add it under Settings → Pages → Custom domain
 and point your DNS at GitHub Pages.)

## Before going live
- **Photos** are handled by drag-and-drop placeholders. See "Photo framing" below
  for how your dropped images + crops ship with the site via
  `.image-slots.state.json`. (Or switch to real `<img>` files — also below.)
- **Social links.** In every footer, LINE works. Facebook / TikTok / Instagram are
  intentionally greyed out and show a "Coming soon" popup when clicked. To enable one:
  in the footer of each HTML page, find its `<a ... data-soon="true" href="#">`,
  replace `#` with your real profile URL, and delete `data-soon="true"`. That single
  change un-greys the icon and removes the popup.
- Optional: set a real **price** on `buy.html` (currently shows `฿—`).
