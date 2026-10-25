# Streetwear storefront — HTML site + Shopify sections

A complete, animated storefront built from `reference/trial.html` and `reference/site-walkthrough.mp4`,
delivered two ways from the same CSS/JS:

| Folder | What it is |
| --- | --- |
| `html/` | Static multi-page site. Open `html/index.html` — no build step. Ideal for client demos. |
| `shopify/` | 10 theme sections + snippets + assets to drop into any Shopify theme. |
| `reference/` | The original `trial.html` rack section and the screen recording. |

## Pages (HTML version)

| Page | Highlights |
| --- | --- |
| `index.html` | Preloader → hero (split headline, floating cards, parallax, spinning badge) → marquee → **Rack showcase** → category tiles → **Hang Rail Pro** → sticky feature scroll → **Nike Orbit** wheel → trending grid with filter tabs → **Obsessed** → membership sign-up |
| `shop.html` | Category tabs with sliding pill, sort, 3/4-column toggle, search results (`?q=`), cards re-flow with FLIP animation, URL keeps filters (`?c=sneakers&sort=name`) |
| `product.html?id=…` | Gallery with thumbnails + click-to-zoom (swipe on phones), sizes with sold-out state, quantity, add to bag (image flies to the bag, drawer opens), size guide pop-up, accordions, related products, sticky mobile buy bar |
| `about.html` | Statement headline, parallax image band, story with drop cap, values cards with line-drawing icons, marquee, quote, CTA |
| `contact.html` | Floating-label form with validation and an animated success state, contact cards, animated map pin, FAQ accordion |
| `404.html` | Swinging hanger and big type |

**On every page:** header + footer from one config, live search (press `/`), bag drawer, full-screen mobile menu, page-transition curtain, custom cursor with "View / Drag / Shop" labels, scroll progress bar, back-to-top ring, footer wordmark reveal, newsletter form, `prefers-reduced-motion` support.

### Run it

Double-click `html/index.html`, or serve the folder (needed for nothing, but nicer URLs):

```bash
cd html && python3 -m http.server 8000   # http://localhost:8000
```

The bag lives in the browser (localStorage). Checkout, the newsletter and the contact form are front-end only in
the static demo — connect them to Shopify, Formspree or Netlify Forms for real use.

## Re-skin for a new client (about 15 minutes)

1. **`html/assets/brand.js`** — name, logo, navigation, utility links, marquee words, contact details, social links, footer columns, newsletter text.
2. **`html/assets/base.css`** (top of file) — colours (`--ink`, `--accent`, `--cream` …), fonts, radius, max width.
3. **`html/assets/data/catalog.js`** — products for the shop, product pages, search and the trending grid (name, category, price, images, sizes/variants).
4. **Images** — replace the placeholders in `html/assets/img/` (shoes, Hang Rail Pro landscape, lifestyle photos, logo). Garment photos currently load from the Shopify CDN.
5. Homepage copy lives directly in `index.html` (hero, categories, feature points, Hang Rail / Orbit JSON).

> The demo uses the Nike name and Nike product names from the store it was built for. When you show it to
> other clients, re-skin it with their brand first — those names and marks are trademarks.

## Shopify version

Copy into your theme (Online Store → Themes → ⋯ → Edit code, or `shopify theme push`):

- `shopify/sections/*.liquid` → `sections/`
- `shopify/snippets/*.liquid` → `snippets/`
- `shopify/assets/*` → `assets/`

Then **Add section** in the theme editor:

| Section | Notes |
| --- | --- |
| Rack showcase | One block per hanger (product + optional side/front/back images). |
| Hang Rail Pro | Background photo + garments; drift speed, sag and swing settings. |
| Nike Orbit | One block per shoe; quick-add uses the *Size* option. |
| Obsessed | Heading, text and photo strip blocks. |
| SX hero | Heading (`*word*` = italic accent), 3 card images, product chip, badge. |
| SX marquee | Word blocks, speed, colours, outlined second row. |
| SX category tiles | Collection blocks with image/colour. |
| SX feature scroll | Feature blocks (title, text, image) with a sticky image panel. |
| SX product grid | Any collection; filter tabs by product type; quick add pop-up. |
| SX newsletter | Real Shopify customer form (tags the customer `newsletter`). |

Add to cart posts to `/cart/add.js`, updates the theme's `#cart-icon-bubble` and publishes Dawn's `cartUpdate`
event so Dawn-style cart drawers refresh. The SX sections scope their styles under `.sx`, so they don't
touch the rest of the theme. Theme Check passes; its only warnings are for the Google Fonts link that loads the
italic accent font (remove it from `snippets/sx-assets.liquid` to use the theme's fonts instead).

Note: on the store the garment *Size* option is ordered **S, L, M, XL** — reorder it in Shopify admin so sizes show S, M, L, XL.

## Editing the shared code

`html/assets/` is the source of truth. After changing a shared file, copy it into the theme folder:

```bash
./scripts/sync-shopify-assets.sh
```

HTML-only files: `site.css`, `site.js` (shell), `brand.js`, `pages.css`, `pages.js`, `marquee.js`, `data/catalog.js`.
