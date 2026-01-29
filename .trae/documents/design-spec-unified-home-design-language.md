# Unified Design Language Spec (Home-Aligned)

## Purpose
Unify all pages to match the Home page’s design language by standardizing:
- Shared theme tokens (colors, type, spacing, radii, elevation, etc.)
- Reusable layout + UI components
- Icon rules (library, sizing, stroke/filled usage)
- Motion patterns (durations, easing, transitions)

## Design Principles (source of truth)
1. **Home-first consistency**: If a page introduces a new visual pattern, it must be justified; default to Home patterns.
2. **Token-driven UI**: No “one-off” colors/spacing/radius/shadows in components.
3. **Reusable shells**: Pages should be composed from a small set of layout primitives.
4. **Accessible by default**: Contrast, focus, reduced motion, and keyboard interaction are non-negotiable.

---

## 1) Theme Tokens (desktop-first)
All values below should be implemented as **design tokens** (e.g., CSS variables / design system config) and referenced by name.

### 1.1 Color tokens
Define semantic tokens (preferred) instead of hard-coding brand hex values.

- **Base**
  - `color.bg` (app background)
  - `color.surface` (cards/panels)
  - `color.surfaceAlt` (subtle panels)
  - `color.border` (default border)
- **Text**
  - `color.text` (primary)
  - `color.textMuted`
  - `color.textInverse`
- **Brand / Accent** (aligned to Home)
  - `color.primary`
  - `color.primaryHover`
  - `color.primaryActive`
  - `color.primarySubtle` (tinted background)
- **States**
  - `color.success`, `color.warning`, `color.danger`, `color.info`
  - `color.focusRing`
- **Overlays**
  - `color.scrim` (modal backdrop)

**Rules**
- Text must meet WCAG contrast; use `textMuted` only for secondary content.
- Borders should be subtle; use elevation for separation before thick borders.

### 1.2 Typography tokens
- Font families:
  - `font.sans` (primary UI)
  - `font.display` (optional: hero headings, if used on Home)
- Type scale:
  - `type.h1`, `type.h2`, `type.h3`, `type.body`, `type.bodySm`, `type.caption`
- Weights:
  - `weight.regular`, `weight.medium`, `weight.semibold`
- Line heights:
  - `leading.tight`, `leading.normal`

**Rules**
- One heading style per hierarchy level across pages.
- Links and buttons must not rely on color alone to convey interactivity.

### 1.3 Spacing + layout tokens
- Spacing scale (example names): `space.1,2,3,4,6,8,12,16`
- Container:
  - `layout.pageMaxWidth`
  - `layout.pagePaddingX` (desktop)
  - `layout.sectionGap`
- Grid:
  - `layout.gridGap`
  - `layout.columns` (12-col for desktop)

**Rules**
- Pages should use a consistent **PageContainer** width/padding.
- Prefer section-based vertical rhythm: consistent `sectionGap` between major blocks.

### 1.4 Radius, border, elevation
- Radii:
  - `radius.sm`, `radius.md`, `radius.lg`
- Border width:
  - `border.thin`
- Shadow/elevation:
  - `shadow.sm`, `shadow.md`, `shadow.lg`

**Rules**
- Cards/panels should use a consistent radius (Home’s default).
- Use `shadow.md` for primary cards; avoid custom shadows.

### 1.5 Interaction tokens
- Focus ring:
  - `focus.ringWidth`, `focus.ringOffset`, `color.focusRing`
- Disabled:
  - `opacity.disabled`

---

## 2) Reusable Layout Components (page composition)
These are structural primitives used to rebuild every page to “feel like Home.”

1. **AppShell**
   - Owns global background, top-level layout, and primary navigation placement.
2. **HeaderBar**
   - Left: logo/home link; center: optional page title/breadcrumb; right: primary actions/user menu.
3. **SideNav** (optional)
   - Used only where Home already sets the pattern; otherwise keep navigation light.
4. **PageContainer**
   - Standard max-width and horizontal padding. Eliminates per-page container drift.
5. **PageHeader**
   - Title + short description + primary/secondary actions.
6. **Section**
   - Standard section spacing; supports optional section title and “view all” action.
7. **Card / Panel**
   - Default surface styling aligned to Home (radius, border/shadow, padding).
8. **Grid / Stack**
   - `Stack` for vertical rhythm; `Grid` for card collections.

**Page layout rules**
- Every page must start with: `HeaderBar` + `PageContainer` + `PageHeader` (unless Home omits header on the hero; then the page may omit for parity).
- Card-based content should snap to the same grid/gaps as Home.

---

## 3) Reusable UI Components (behavior + styling)
Standardize appearance, states, and interactions.

### 3.1 Buttons
- Variants: `Primary`, `Secondary`, `Tertiary/Ghost`, `Danger`
- Sizes: `sm`, `md`, `lg`
- States: `default`, `hover`, `active`, `disabled`, `loading`, `focus`

### 3.2 Form controls
- **TextField**, **TextArea**, **Select**, **Checkbox**, **Radio**, **Switch**
- Validation: inline message + optional helper text; error state uses semantic `danger`.
- Labeling: label above input (desktop-first), consistent spacing.

### 3.3 Navigation & wayfinding
- **Tabs**, **Breadcrumbs**, **Pagination**, **Link**
- Active states must match Home’s active indicator style.

### 3.4 Feedback
- **Toast** (non-blocking), **AlertBanner** (page-level), **InlineAlert** (component-level)
- **Modal / Dialog** with scrim and focus trap
- **Tooltip** for icon-only controls

### 3.5 Data display
- **Table** (dense + comfortable), **Badge**, **Avatar**, **EmptyState**, **Skeleton**

**Component rules**
- Components consume tokens only (no embedded raw values).
- Interactive components must have visible focus states consistent across the app.

---

## 4) Icon System Standardization

### 4.1 Library + style
- Use **one icon library** across the app.
- Pick **one dominant style**: either *outline* (preferred for UI clarity) or *filled*.

### 4.2 Sizing grid
- Standard sizes: `16` (dense), `20` (default), `24` (prominent)
- All icons align to the same pixel grid; avoid arbitrary sizes.

### 4.3 Stroke/weight rules (if outline)
- Single stroke width across all icons.
- Rounded or squared caps must be consistent.

### 4.4 Naming & usage
- Use semantic names: `IconSearch`, `IconSettings`, `IconChevronRight`.
- Icon-only buttons must include accessible labels.

---

## 5) Motion & Micro-interactions
Standardize motion so the app feels cohesive (and “Home-like”).

### 5.1 Motion tokens
- Durations:
  - `motion.fast` (100–150ms)
  - `motion.base` (180–220ms)
  - `motion.slow` (240–320ms)
- Easing:
  - `motion.easeInOut` (default)
  - `motion.easeOut` (entrances)

### 5.2 Where to animate
- Hover/press states: opacity/translate/shadow changes (subtle)
- Modals/Drawers: fade + slight scale/slide
- Toasts: slide + fade
- Page transitions: minimal; avoid large sweeping animations

### 5.3 Reduced motion
- Honor user preference: provide a no-motion or reduced-motion mode.

**Motion rules**
- Motion should communicate hierarchy and feedback, not decoration.
- Avoid animating large layouts; animate small deltas only.

---

## 6) Rollout Checklist (per page)
For each page, confirm:
1. Uses **AppShell + PageContainer + PageHeader** conventions.
2. Uses only **tokenized** colors/spacing/radii/shadows.
3. Uses standardized **buttons/forms/feedback** components.
4. Uses standardized **icon sizes** + library.
5. Uses standardized **motion tokens** and honors reduced motion.

## 7) Ownership & Governance
- Home page design language is the baseline; changes require updating tokens/components first.
- New UI patterns must be added to the reusable component set before page-specific use.
