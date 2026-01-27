# Page Design — Premium, Animated, Immersive Upgrade (Desktop-first)

## Global styles (all pages)
- Layout system: Hybrid CSS Grid (page sections) + Flexbox (toolbars/cards). Container width ~1200–1280px, 24px gutters; responsive breakpoints at ~1024/768/480.
- Design tokens:
  - Background: near-white + subtle grain (CSS-only), avoid large raster textures.
  - Text: high contrast; serif accent for brand moments; sans for UI.
  - Accent: deep black + one highlight (e.g., red) for promos; limit simultaneous accents.
  - Buttons: solid primary + outlined secondary; hover = subtle lift + shadow; focus ring always visible.
- Motion language (Framer Motion):
  - Default: 180–260ms UI transitions; section reveals 400–700ms.
  - Easing: standard ease-out; avoid spring on critical layout.
  - `prefers-reduced-motion`: disable parallax/scroll transforms, replace with fade/none.
- 3D/video constraints:
  - 3D is “hero-only” or “editorial-only”; never required to understand content.
  - Provide poster image + static fallback; avoid WebGL on low memory devices.
  - Video: muted loop allowed; no autoplay audio; max ~3–6s loop; use `preload="metadata"` and pause when offscreen.
- SEO/meta (all pages): unique Title/Description, canonical, OG/Twitter image; real text overlays (not baked into images).

---

## Home (/)
- Meta: Title “Scentiment — Premium Home Fragrance”; Description emphasizing key categories + promos.
- Structure (stacked sections):
  1) Header (existing): sticky; promos + nav + cart icon.
  2) Hero: two-column grid (copy/CTA left; immersive media right). Media can be: image (default) / short muted loop / optional 3D.
  3) Featured products: 4-up grid cards; hover micro-interactions.
  4) Collections slider: horizontal cards with snap; subtle parallax optional.
  5) Social proof + stats: two blocks with restrained motion.
  6) How it works + use cases: icon rows.
  7) FAQ: accordion.
  8) Newsletter + CTA + Footer.

## Shop (/shop, /category/:slug)
- Meta: Title “Shop — Scentiment”; Description includes category keywords when `:slug` present.
- Structure (left-right):
  - Left: Filter sidebar (sticky within viewport; collapses to drawer on smaller screens).
  - Right: Sort bar + product grid (3–4 columns desktop) + empty/loading states.
- Components:
  - ProductCard: fixed aspect ratio media box; price/name; “Add” action; motion limited to hover.
  - Cart feedback: toast-like micro confirmation + option to open cart drawer.

## New Arrivals / Sale / Collection Landing (/new, /sale, /collections/* mapped)
- Meta: Title includes collection name; Description includes promo text.
- Structure (stacked): Collection hero (headline + supporting copy + optional short loop) → product grid → trust strip.

## Candles (/candles, /collections/candles) & Perfumes (/perfumes, /collections/perfumes)
- Meta: category-specific titles/descriptions.
- Structure: Category hero + curated grid; keep refinement controls consistent with Shop.

## Scent Voyage (/collection/voyage and aliases)
- Meta: editorial title/description.
- Structure (immersive editorial):
  - Hero (image/video/optional 3D) + story intro.
  - Scroll sections: alternating media/text; optional parallax (disabled for reduced-motion).
  - Product highlights: 2–4 cards with clear add-to-cart.

## Contact (/contact)
- Meta: “Contact — Scentiment”.
- Structure: two-column layout: contact form + business/contact details; include success/error states; motion limited to feedback.
