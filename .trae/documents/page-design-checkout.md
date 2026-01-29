# Page Design — Checkout

## Global (applies to all pages in this spec)
### Layout
- Desktop-first: use a 12-column CSS Grid for the main content container.
- Spacing and sizing MUST use existing design tokens (spacing, radius, typography, color, shadow).
- Class naming MUST follow your established convention (do not introduce a new naming scheme).

### Meta Information
- Title: “Checkout”
- Description: “Complete your purchase securely.”
- Open Graph: title mirrors page title; description mirrors page description; URL and image follow existing site defaults.

### Global Styles
- Reuse existing tokens for:
  - Background surfaces (page background, card background)
  - Typography scale (page title, section headers, body, helper text)
  - Form states (default, hover, focus ring, error)
  - Button variants (primary, secondary, disabled, loading)
- Links: follow existing link color + hover/underline behavior.

---

## Page: Checkout (/checkout)
### Page Structure
- Overall: two-column checkout layout.
  - Left (primary): checkout form (stacked sections).
  - Right (secondary): order summary card.
- Use a max-width container consistent with existing pages.

### Layout (desktop)
- Grid: 12-column.
  - Form column: 7–8 columns.
  - Summary column: 4–5 columns.
  - Gap: tokenized column gap.
- Summary card should be visually distinct using existing “card” styles.

### Layout (responsive collapse)
- Collapse breakpoint: align with your existing breakpoint system.
- On collapse:
  - Switch to single column.
  - Order summary becomes:
    - Either an accordion/summary drawer at top, OR
    - A stacked card above the form.
  - Primary action becomes a sticky bottom action bar.

### Sections & Components
1. Top navigation / header (if present on existing pages)
   - Reuse existing header component and spacing.

2. Checkout title row
   - Title: “Checkout”
   - Optional brief helper text (single line) using existing typography token.

3. Left column — Checkout form
   - Section pattern: card or bordered sections using existing tokens.
   - Typical section blocks (order depends on your current business rules):
     - Contact details
     - Shipping / delivery address
     - Billing details (if different)
     - Payment inputs
   - Field styling:
     - Default: existing input border/background.
     - Focus: existing focus ring.
     - Error: apply existing error token styling (border + message text + icon if already used elsewhere).
   - Validation messaging:
     - Field-level message under input.
     - Form-level error summary at top after failed submit; each entry anchors/focuses the related field.
   - Interaction:
     - Validate on blur and on submit.
     - Disable inputs and show inline loading state during submit.

4. Right column — Order summary
   - Card contents:
     - Item list with thumbnail (if existing), name, quantity, price.
     - Cost breakdown rows: subtotal, shipping/tax (if available), total.
   - Sticky behavior (desktop):
     - Keep the primary action and total visible by making the summary card (or its CTA region) `position: sticky` within the viewport.
     - Ensure sticky offset accounts for any fixed header.

5. Sticky primary action
   - Desktop:
     - Primary CTA placed near total (in summary) and remains visible via sticky summary region.
   - Mobile:
     - Sticky bottom bar containing:
       - Total (short format)
       - Primary CTA button
     - Must not cover form fields when keyboard is open; respect safe-area insets.
   - States:
     - Default: enabled.
     - Disabled: when required fields missing or while submitting.
     - Loading: show spinner and “Processing…” text (or existing loading pattern).

6. Legal / helper text
   - Under CTA: concise terms/consent text using existing caption style.

### Accessibility & States
- Keyboard:
  - Logical tab order (form first, then summary) on desktop.
  - Sticky bottom bar must be reachable and not trap focus.
- Errors:
  - Error summary uses `aria-live` polite; fields use `aria-invalid` and `aria-describedby`.
- Contrast: rely on existing tokens; do not introduce new colors.

---

## Page: Order Confirmation (/checkout/success)
### Page Structure
- Single-column centered content container (desktop-first).

### Sections & Components
1. Confirmation hero
   - Success heading, short confirmation message.

2. Key order details
   - Order reference, total, and essential summary details.

3. Next actions
   - Primary button: “Continue shopping” (or your existing equivalent).
   - Secondary link: “View order” (only if such destination already exists).

### Responsive behavior
- Maintain readable spacing; avoid dense tables on small screens (stack label/value rows).