# Shopify Storefront — Next.js

A headless storefront for the `nike-makknzjs.myshopify.com` Shopify store, built with
**Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4** and **Motion** (Framer Motion) for animations.

It runs on a placeholder catalog out of the box and switches to the live Shopify products as soon as a
Storefront API token is added.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

## Connect the real Shopify products

1. In Shopify admin go to **Settings → Apps and sales channels → Develop apps** (or install the
   **Headless** channel) and create a **Storefront API access token** with product and cart read/write scopes.
2. Copy `.env.example` to `.env.local` and fill it in:

   ```env
   SHOPIFY_STORE_DOMAIN=nike-makknzjs.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
   SHOPIFY_API_VERSION=2025-10
   ```

3. Restart the dev server. Products, photos, prices, sizes and colours now come from Shopify
   (`lib/shopify.ts`), and the bag's **Checkout** button creates a real Shopify cart and redirects to checkout.

Product mapping notes:

- **Category** (Men / Women / Kids) is derived from the product type, tags or title.
- **Colours** come from a `Color`/`Colour` option (swatch colours are used when set in Shopify).
- **Sizes** come from a `Size` option.
- Tags `new` / `bestseller` and compare-at prices drive the badges.

## Pages

| Route | Description |
| --- | --- |
| `/` | Home: animated hero, marquees, new arrivals, category tiles, scroll-linked text, horizontal "Trending" showcase, counters, spotlight, newsletter |
| `/collections/[all\|men\|women\|kids]` | Product grid with search (`?q=`), price and sale filters, sorting, collapsible filter sidebar |
| `/products/[handle]` | Product page: gallery, colour switcher, size picker, add to bag, accordions, related products |
| `/api/checkout` | Creates a Shopify cart and returns its checkout URL |

## Animations

- Hero: staggered headline reveal, mouse-driven 3D tilt, scroll parallax, colourway switcher that
  slides the shoe out/in and morphs the background
- Header hides on scroll down, reappears on scroll up; badge pops when the bag count changes
- Rotating announcement bar, infinite marquees (solid and outlined)
- Product cards: hover lift/rotate, quick-add size picker slides up, live colour swatches
- Category tiles: hover zoom, rotate and moving background type
- Scroll-linked word-by-word text reveal
- Sticky section that scrolls the "Trending" cards horizontally with a progress bar
- Count-up stats, spinning "Limited drop" badge, parallax spotlight
- Cart drawer: spring slide-in, animated free-delivery progress bar, line items animate in/out
- Product page: animated gallery transitions, shake on missing size, "Added" button state
- Respects `prefers-reduced-motion`

## Customising

- `lib/site.ts`: brand name, tagline, announcements, nav, home-page stats, categories
- `lib/products.ts`: placeholder catalog (used when Shopify isn't connected)
- `app/globals.css`: colour tokens and fonts
- `components/ShoeArt.tsx`: vector shoe drawn when a product has no photos
