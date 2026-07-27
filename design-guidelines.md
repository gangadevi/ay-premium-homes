# AY Premium Homes — Design Guidelines

Reference for anyone adding pages or components. The goal is a luxury
real-estate brochure feel, not a generic Bootstrap template: no flat white
surfaces, fully rounded gold CTAs, and every dark panel carries a subtle
gold texture. All values below are CSS custom properties defined once in
`assets/css/style.css` — never hard-code a hex value or magic number in
component rules; consume the token instead.

## Color

| Token | Value | Use |
|---|---|---|
| `--color-gold` | `#c8a44d` | Signature accent — CTAs, rules, marks |
| `--color-gold-light` | `#e7d39c` | Gold highlight / shimmer / hover text |
| `--color-gold-dim` | `#a6832e` | Gold hover/active state on filled buttons |
| `--color-emerald` | `#0b4a44` | Primary dark surface (header, footer, dark sections) |
| `--color-emerald-deep` | `#06302c` | Deeper emerald — gradient floor, heading text on gold |
| `--color-emerald-light` | `#146860` | Emerald hover accent on light surfaces |
| `--color-ivory` | `#f8f5ef` | Primary light surface (`--bg-body`) |
| `--color-champagne` | `#efe6d6` | Secondary light surface |
| `--color-stone` | `#e8ddca` | Travertine stone base |
| `--color-warm-white` | `#fcfbf8` | Cards, panels, modal |
| `--color-charcoal` | `#2b2620` | Body copy on light surfaces |
| `--color-charcoal-soft` | `#5b5344` | Muted/secondary copy |

Semantic aliases to prefer in new rules over the raw palette names:
`--bg-body`, `--bg-dark`, `--text-body`, `--text-muted`, `--text-inverse`,
`--text-inverse-muted`, `--border-hairline`, `--border-hairline-dark`,
`--border-gold`.

**Rule of thumb:** light sections sit on `--color-ivory` /
`--color-warm-white` with charcoal text; dark sections
(`.ay-section--dark`, `.ay-page-hero`, header, footer, `.bg-dark-emerald`)
sit on `--color-emerald` with `--text-inverse` and gold accents. Never put
charcoal text on emerald, or ivory text on a light surface.

## Typography

- **Display / headings** (`h1`–`h4`): `--font-display` → Cinzel, serif.
  Weight 600, `letter-spacing: 0.01em`, line-height 1.2.
- **Body / labels**: `--font-body` and `--font-label` → Outfit, sans-serif.
  Body copy is weight 300; labels (`.ay-eyebrow`, nav, buttons, `.ay-coord`)
  are weight 600, uppercase, letter-spacing 0.05–0.16em.
- Fluid heading sizes via `clamp()` — don't set fixed `px`/`rem` font sizes
  on headings, use the existing tokens:
  - `--fs-h1: clamp(2.25rem, 1.6rem + 2.6vw, 4rem)`
  - `--fs-h2: clamp(1.75rem, 1.4rem + 1.6vw, 2.75rem)`
  - `--fs-h3: clamp(1.25rem, 1.1rem + 0.6vw, 1.75rem)`
  - `--fs-body: 1rem`, `--fs-small: 0.875rem`, `--fs-eyebrow: 0.75rem`
- Body line-height is 1.7 site-wide; `.lead` paragraphs cap at `46ch`.

## Signature motifs

Reuse these rather than inventing new patterns:

- **`.ay-eyebrow`** — small uppercase label with a 22px hairline rule
  before it. Used above every section heading.
- **Section title rule** — any `h2` sitting directly in `.container-ay`
  automatically gets a 56px gold gradient underline (`::after`). No extra
  markup needed.
- **`.ay-coord`** — the "plot coordinate" reference tag (e.g. a
  project/page reference code) used in the footer and floating CTA. This
  is the site's recurring structural device — reach for it whenever a
  short reference/label needs the luxury-brochure treatment instead of
  plain text.
- **Shimmer sweep** on `.ay-btn` — a diagonal light sweep on hover,
  automatic via the shared `::after`. Don't re-implement per button.

## Buttons

- Base class `.ay-btn`: pill-shaped (`--radius-pill`), uppercase label
  type, `0.95rem 2.15rem` padding, shimmer-on-hover built in.
- `.ay-btn--primary`: gold gradient fill, `--color-emerald-deep` text,
  lifts `-3px` with a stronger gold shadow on hover.
- `.ay-btn--outline`: transparent with gold border on light surfaces;
  inverts to filled emerald/gold depending on context (dark-surface
  variants are handled automatically via `.ay-page-hero`,
  `.ay-section--dark`, `.bg-dark-emerald` descendant selectors — don't
  hand-write a "dark" button variant).
- Any element that should open the enquiry modal just needs
  `data-enquiry-trigger` — `main.js` wires it up; never bind modal opens
  by hand.

## Surfaces & texture

Flat, untextured backgrounds are the one thing to avoid — every section
background should come from one of these CSS-only (no images) texture
utility classes, alternated across a page's `.ay-section` blocks:

`.bg-warm-ivory`, `.bg-champagne-beige`, `.bg-marble`, `.bg-linen`,
`.bg-travertine`, `.bg-handmade-paper`, `.bg-soft-gold-gradient`,
`.bg-dark-emerald` (or the equivalent `.ay-section--dark` /
`.ay-page-hero` / header / footer, which use `--texture-emerald-gold`).

Cards (`.ay-card`, and any `.row.g-4 > [class*="col-"]` grid item) sit on
`--color-warm-white` with a 1px hairline border, `--shadow-soft`, and a
3px gold gradient top edge — lift `-6px` with `--shadow-card-hover` on
hover. Don't invent a new card shadow/radius combo; reuse these.

## Radius, spacing, elevation

- **Radius:** `--radius-sm` 10px (inputs, chips) · `--radius-md` 18px
  (cards, panels) · `--radius-lg` 28px (modal, hero panels) ·
  `--radius-pill` 999px (buttons). Everything is soft/rounded —
  never a sharp corner on an interactive or card element.
- **Spacing scale:** `--space-xs` 0.5rem · `--space-sm` 1rem ·
  `--space-md` 1.75rem · `--space-lg` 3rem · `--space-xl` 5rem ·
  `--space-2xl` 8rem. Use the scale for margins/padding/gaps instead of
  arbitrary values.
- **Elevation:** `--shadow-soft` (default card), `--shadow-panel` (modal),
  `--shadow-gold` (gold CTA), `--shadow-card-hover` (card hover state).
- **Motion:** `--ease-standard` (`cubic-bezier(0.4, 0, 0.2, 1)`) with
  `--duration-fast` 180ms / `--duration-standard` 320ms / `--duration-slow`
  600ms. `prefers-reduced-motion: reduce` is already handled globally in
  `responsive.css` — don't add per-component reduced-motion overrides.
- **Container:** `--container-max` 1320px via `.container-ay`.
- **Header height:** `--header-height` 80px (≥992px), 70px (<992px).

## Layout & breakpoints

Breakpoints follow Bootstrap 5.3 grid tiers for consistency with the
utility classes used across markup — don't introduce a custom breakpoint.
All overrides live in `assets/css/responsive.css` (mobile-first cascades
downward); `style.css` stays breakpoint-free.

| Tier | Max-width | Notes |
|---|---|---|
| Tablet & below | 991.98px | Header height 70px, desktop nav hidden in favor of hamburger + overlay, footer grid → 2 columns |
| Mobile | 767.98px | Sections use `--space-lg` padding, footer → 1 column |
| Small phones | 575.98px | Tighter header brand size |

## Component & markup conventions

- **No inline CSS or JS anywhere** — all styling is class-based; all
  behavior binds via `data-*` attributes and `addEventListener` in
  `assets/js/*.js`.
- **Forms** follow one shared pattern so `assets/js/email.js` can bind
  any of them with the same function: `.ay-form__group` /
  `.ay-form__label` / `.ay-form__control`, a `[data-submit-btn]`, and a
  `[data-form-status]` element.
- **Sliders** only need a container class hook (`.js-hero-slider`,
  `.js-project-gallery`, `.js-detail-gallery`, `.js-testimonial-slider`);
  all Swiper config lives centrally in `assets/js/swiper.js`.
- **Semantic HTML**: `<header>`, `<nav>`, `<main>`, `<section>`,
  `<article>`, `<footer>`, `<address>`, `<dl>` per their intended meaning,
  not generic `<div>`s. Headings step down in order (`h1` → `h2` → `h3`)
  within each page.
- **Accessibility:** keyboard focus is never suppressed —
  `:focus-visible` gets a 2px gold outline everywhere by default; don't
  add `outline: none` on interactive elements.

## Adding a new component — checklist

1. Pull color, type, spacing, radius, shadow, and motion values from the
   existing tokens above — never a new hex/px literal.
2. Pick a light or dark treatment per the surfaces rule and use the
   matching texture utility rather than a flat background.
3. If it's interactive, give it the shimmer/lift hover language already
   used by `.ay-btn` / `.ay-card`, not a new hover pattern.
4. Wire behavior with a `data-*` hook and bind it in the relevant
   `assets/js/*.js` file — no inline `onclick`/`<style>`.
5. Add any new breakpoint-only adjustments to `responsive.css`, never a
   new `@media` block inside `style.css`.
