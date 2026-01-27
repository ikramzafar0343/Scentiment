# Home Page Redesign — Page Design Specification (Desktop-first)

## Layout

* System: Hybrid CSS Grid + Flexbox.

  * Use a centered container (max-width \~1200–1280px) with consistent horizontal padding.

  * Use Grid for multi-column feature/proof cards; Flex for alignment within components.

* Spacing: 8px baseline grid (8/16/24/32/48/64).

* Breakpoints (guidance):

  * Desktop: ≥ 1024px (primary design)

  * Tablet: 768–1023px

  * Mobile: ≤ 767px (stack columns, increase tap targets)

## Meta Information

* Title: "Scentiment — Premium fragrances, curated for you" (replace with final brand copy).

* Description: "Discover premium scents with a modern, guided experience." (benefit-led).

* Open Graph:

  * og:title, og:description aligned with hero copy.

  * og:image: high-quality, compressed share image.

## Global Styles (Design tokens)

* Background: near-white or deep-neutral (premium feel) with subtle gradients allowed.

* Primary color: high-contrast brand accent (used for primary CTA).

* Typography:

  * Display: 40–56px desktop (hero), 28–36px mobile.

  * Body: 16–18px, line-height 1.5–1.7.

  * Use consistent letter spacing for premium tone.

* Buttons:

  * Primary: solid fill, strong contrast; hover darken + subtle lift; active press.

  * Secondary: outline/ghost; hover background tint.

  * Focus: 2px–3px visible focus ring with sufficient contrast.

* Links: underlined on hover/focus; do not rely on color alone.

* Motion: respect `prefers-reduced-motion`; keep transitions 150–250ms.

## Page Structure

Single long-form page with clear section hierarchy:

1. Header (sticky) → 2) Hero → 3) How it works → 4) Features → 5) Social proof → 6) Stats → 7) CTA → 8) FAQ → 9) Footer

***

## Sections & Components

### 1) Header (Sticky)

* Elements:

  * Left: Brand logo (click scrolls to top).

  * Center/Right: Navigation links to in-page anchors (How it works, Features, FAQ).

  * Rightmost: Primary CTA button (same label as hero CTA).

* Behavior:

  * Sticky with subtle blur/solid background on scroll.

  * Provide "Skip to content" link visible on focus.

  * Mobile: collapse links into a menu; keep primary CTA visible or as top menu item.

### 2) Hero (Above-the-fold)

* Layout:

  * Desktop: 2-column (left copy + CTAs, right premium visual).

  * Mobile: stacked (visual below copy), keep CTA near top.

* Elements:

  * Eyebrow (optional): short credibility cue.

  * H1: value proposition (1 line preferred, 2 max).

  * Supporting paragraph: 1–2 lines, benefit-led.

  * CTA row: Primary CTA + Secondary CTA (e.g., "Learn how it works" anchor).

  * Trust microcopy row: short reassurance points (icons + text) if applicable.

* Accessibility:

  * CTAs are buttons/links with clear labels; no text-in-image for core message.

### 3) How it works

* Layout: 3–5 step cards in a row (desktop), stack on mobile.

* Elements:

  * Section heading + 1-sentence intro.

  * Step cards: number, title, 1–2 lines description, small icon.

* Interaction:

  * Optional: subtle hover highlight; no required interaction.

### 4) Features

* Layout: card grid (3-up desktop, 2-up tablet, 1-up mobile).

* Elements:

  * Feature cards: benefit title, short description, optional supporting icon.

  * Optional: one “highlight” feature with larger card (desktop) for premium emphasis.

### 5) Social proof

* Layout: testimonials in a horizontally scrollable row on mobile; grid on desktop.

* Elements:

  * Testimonial card: quote, name, source/role, optional rating.

  * Optional: brand/logo strip beneath (if applicable).

* Accessibility:

  * Ensure testimonial slider (if used) supports keyboard navigation and does not trap focus.

### 6) Stats

* Layout: 3–6 stat blocks in a row (desktop) with separators; stack on mobile.

* Elements:

  * Large stat number, short caption.

  * Keep claims realistic and consistent with your data.

### 7) Primary CTA section

* Layout:

  * Desktop: 2-column (left copy, right CTA card) or centered CTA band.

* Elements:

  * Headline restating value.

  * 1–2 supporting lines.

  * Primary CTA button (same destination as hero CTA).

  * Reassurance microcopy (returns/shipping/support) if applicable.

### 8) FAQ

* Component: accessible accordion.

* Requirements:

  * Keyboard: Enter/Space toggles; arrow keys optional.

  * ARIA: `aria-expanded`, `aria-controls`, unique IDs.

  * Motion: height animation disabled under reduced-motion.

* Content: 6–10 most common questions (prioritize objections that block conversion).

### 9) Footer

* Layout: 3–4 columns desktop; stacked lists mobile.

* Elements:

  * Brand mini-blurb.

  * Essential links (navigation, contact, policies).

  * Social links.

  * Optional: repeated primary CTA.

* Accessibility:

  * High contrast; clear link focus states; adequate spacing for touch.

***

## Responsive behavior (summary)

* Collapse multi-column grids into single-column stacks on mobile.

* Increase tap targets to ≥ 44px height; ensure spacing prevents mis-taps.

* Keep CTA persistent via sticky header and/or existing sticky mobile CTA component.

## Performance notes (design-driven)

* Prefer static imagery over heavy video in hero.

* Ensure image aspect ratios are reserved to prevent CLS.

* Avoid large blurred shadows and expensive filters on mobile; keep effects subtle.

