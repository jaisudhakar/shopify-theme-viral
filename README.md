# Nike store — homepage sections (HTML + Shopify)

The homepage from `reference/site-walkthrough.mp4`, built twice from the same CSS/JS:

| Folder | What it is |
| --- | --- |
| `html/` | Static site. Open `html/index.html` in a browser, no build step. |
| `shopify/` | Theme sections, snippet and assets to add to your Shopify theme. |
| `reference/` | The shared `trial.html` rack section and the screen recording. |

## Sections

1. **Header** (HTML version only, Shopify uses your theme's header): Find a Store · Help · Join Us · Sign In bar, logo, Home / Nike Orbit / Hand Rail Pro / Contact, search, account, bag with count.
2. **Rack showcase** (`rack-showcase`, from `trial.html`): garments drop onto the rod and swing, hover turns one to the front and changes the caption, click lifts it into a focus view (drag to turn, Front/Back, size + add to cart, image flies to the bag). Phones get an auto-sliding rail with dots.
3. **Hang Rail Pro** (`hang-rail-pro`): garments drift along a sagging rail over a full-width photo. Hover turns a piece and pauses the rail (name + price bottom left), click opens Quick view, drag or swipe to scrub.
4. **Nike Orbit** (`nike-orbit`): 7 sneakers on a big circle. Drag the shoes or the "Drag the wheel" dial, use arrow keys or scroll sideways. Name, price and "View details" on the left, size buttons bottom right add the front shoe to the bag ("… added to bag · View bag").
5. **Quick view** (shared): image + thumbnails, ← 03 / 07 → to step through products, size grid, "Select a size" → "Add to bag", "View full details".
6. **Obsessed** (`obsessed`): heading, text and an endless photo strip.

## Run the HTML version

Double-click `html/index.html`, or serve the folder:

```bash
cd html
python3 -m http.server 8000   # then open http://localhost:8000
```

The bag works in the browser (kept in localStorage). Checkout only exists on the Shopify store.
The garment photos load from `https://nike-makknzjs.myshopify.com/cdn/...`, so you need to be online.

### Replace the placeholder images

The shoes, the Hang Rail Pro landscape, the Obsessed photos and the logo are placeholders in `html/assets/img/`:

| Placeholder | Replace with |
| --- | --- |
| `img/shoes/shoe-01.svg` … `shoe-07.svg` | Shoe photos (transparent PNG/WebP, side view). Update the `"images"` paths in the `data-orbit-json` block in `index.html`; add up to 5 images per shoe for the Quick view thumbnails. |
| `img/hang-rail-bg.svg` | The landscape photo, set in `<div class="hr-bg" style="background-image: …">`. |
| `img/lifestyle/photo-1.svg` … `photo-4.svg` | Lifestyle photos in the `.obs-strip` (both `.obs-set` copies). |
| `img/logo.svg` | Your logo. |

Shoe names, prices and sizes live in the `data-orbit-json` block; garments for Hang Rail Pro in `data-hr-json`; the rack markup is the same as `trial.html`.

## Install the Shopify version

1. Copy the files into your theme (Online Store → Themes → ⋯ → Edit code, or `shopify theme push`):
   - `shopify/sections/*.liquid` → `sections/`
   - `shopify/snippets/site-product-json.liquid` → `snippets/`
   - `shopify/assets/*` → `assets/`
2. In the theme editor, **Add section** → *Rack showcase*, *Hang Rail Pro*, *Nike Orbit*, *Obsessed*.
3. Pick a product for each block. Images default to the product's media:
   - Rack / Hang Rail: image 1 = side (hanger at top, transparent), 2 = front, 3 = back. Each block also has image overrides.
   - Nike Orbit: the first 5 product images (or the block's Image 1–5).
4. Add to cart posts to `/cart/add.js`, updates the theme's `#cart-icon-bubble` and publishes Dawn's `cartUpdate` event, so cart drawers on Dawn-based themes refresh.

## Editing the shared code

`html/assets/` is the source of truth for the section CSS/JS. After changing a file there, copy it to the theme folder:

```bash
./scripts/sync-shopify-assets.sh
```

`site.css` and `site.js` (header, bag drawer, footer) are HTML-only.
