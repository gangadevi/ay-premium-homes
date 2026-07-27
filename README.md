# AY Premium Homes — Project Architecture

Scaffold only: folder structure, semantic markup, and the shared-component
system. No page content, imagery, or copy has been finalized — every
content block is marked with an HTML comment (`<!-- TODO: ... -->`).

## Folder structure

Directory-based routing: every page is `<slug>/index.html`, so it's served
at the clean URL `/<slug>/` on any static host (GitHub Pages, Hostinger,
etc.) with zero rewrite rules — the web server's default "serve
`index.html` for a directory request" behavior does all the work. Only the
homepage lives at the true root (`index.html` → `/`).

```
ay-premium-homes/
├── index.html                 # → /
├── about/index.html           # → /about/
├── projects/index.html        # → /projects/
├── project-details/index.html # → /project-details/
├── nri/index.html             # → /nri/
├── careers/index.html         # → /careers/
├── contact/index.html         # → /contact/
├── privacy-policy/index.html  # → /privacy-policy/
├── terms/index.html           # → /terms/
├── partials/                 # shared markup, injected at runtime
│   ├── header.html
│   ├── footer.html
│   ├── enquiry-modal.html
│   └── floating-buttons.html
└── assets/
    ├── css/
    │   ├── style.css         # design tokens + base + shared components
    │   └── responsive.css    # breakpoint overrides only
    ├── js/
    │   ├── main.js            # partial loader + nav/modal/back-to-top/AOS
    │   ├── swiper.js           # all Swiper instance config, site-wide
    │   └── email.js            # EmailJS wiring for every form
    └── images/
```

**All internal links, and every asset/partial reference (`<link>`,
`<script>`, `main.js`'s `fetch()` calls), are root-relative (`/about/`,
`/assets/css/style.css`, `/partials/header.html`)** rather than page-relative
— that's what lets one shared `header.html`/`footer.html` partial render
correctly whether it's injected into the root `index.html` or a nested
`about/index.html`. It assumes the site is served from the domain root:

- **Hostinger:** works as-is — upload the folder to `public_html/`.
- **GitHub Pages:** works as-is on a user/org page (`username.github.io`)
  or a project page with a custom domain attached (`CNAME` file). On a
  project page served under a repo subpath with no custom domain
  (`username.github.io/repo-name/`), the leading-`/` paths will 404 —
  attach a custom domain (recommended for a production business site
  regardless) or rename the repo to `username.github.io`.

## Why a `partials/` folder

The brief calls for one shared header, footer, enquiry modal, and floating
button stack across every page, with no build step (no React/Vue, no
templating engine). Copy-pasting that markup into all nine pages would
immediately drift out of sync, so instead:

- Each page contains four empty mount points:
  `#site-header`, `#site-footer`, `#enquiry-modal-root`, `#floating-buttons-root`.
- `assets/js/main.js` fetches `partials/*.html` on `DOMContentLoaded` and
  injects them into those mounts, then wires up navigation, the modal
  triggers, back-to-top, the footer year, and AOS — all after injection,
  driven by data-attributes rather than inline handlers.
- A `body[data-page="..."]` attribute on every page tells `main.js` which
  nav link to mark `is-active`, so the header itself needn't be duplicated
  or hand-edited per page.

**Local dev note:** `fetch()` of local files is blocked under `file://` by
browser CORS rules. Serve the folder over HTTP to preview it, e.g.:
`python3 -m http.server 8080` from the project root, then open
`http://localhost:8080/index.html`.

## Design tokens (assets/css/style.css)

All color, type, spacing, and radius values are defined once as CSS custom
properties at the top of `style.css` and consumed everywhere else — no
hard-coded hex values or magic numbers in component rules. The system is
built to read as a luxury real-estate brochure rather than a Bootstrap
template: no flat white surfaces, fully rounded gold CTAs, and every dark
panel carries a subtle gold texture.

- **Palette:** gold `#c8a44d` (signature accent), deep emerald `#0b4a44`
  (the brand's dark surface), warm ivory `#f8f5ef`, champagne `#efe6d6`,
  stone `#e8ddca`, warm white `#fcfbf8` (cards).
- **Type:** Cinzel (display/serif headings), Outfit (body copy and the
  label register used for eyebrows, nav, and the recurring "plot
  coordinate" reference tag — e.g. `.ay-coord` — the site's signature
  structural device).
- **Radius:** fully rounded — pill buttons (`--radius-pill`), 18–28px on
  cards/panels (`--radius-md` / `--radius-lg`) — deliberately soft and
  premium rather than architectural.
- **Textured backgrounds:** `assets/css/style.css` defines CSS-only
  (no images) texture utilities — `.bg-warm-ivory`, `.bg-champagne-beige`,
  `.bg-marble`, `.bg-linen`, `.bg-travertine`, `.bg-handmade-paper`,
  `.bg-soft-gold-gradient` — intended to be alternated across a page's
  `.ay-section` elements instead of repeating one flat background. Dark
  sections (`.ay-section--dark`, `.ay-page-hero`, header, footer) use the
  `--texture-emerald-gold` gradient stack: deep emerald with a soft gold
  glow and hairline texture.

`responsive.css` holds only breakpoint overrides (nav collapse, footer grid
reflow, spacing scale-down) — no new components are introduced there.

## Component conventions

- **No inline CSS or JS anywhere.** All styling is class-based; all
  behavior binds via `data-*` attributes and `addEventListener` in
  `assets/js/*.js`.
- **Buttons/links that open the enquiry modal** just need
  `data-enquiry-trigger` — `main.js` finds every instance of that attribute
  on the page (header CTA, floating button, in-page CTAs) and wires it to
  the same Bootstrap modal instance.
- **Forms** (`#enquiryForm` in the shared modal, `#contactForm` on
  `contact.html`) follow an identical markup pattern — `.ay-form__group` /
  `.ay-form__label` / `.ay-form__control`, a `[data-submit-btn]`, and a
  `[data-form-status]` element — so `assets/js/email.js` can bind both with
  one shared function.
- **Sliders** only need a container class hook (`.js-hero-slider`,
  `.js-project-gallery`, `.js-detail-gallery`, `.js-testimonial-slider`);
  all configuration lives centrally in `assets/js/swiper.js`.
- **Semantic HTML:** `<header>`, `<nav>`, `<main>`, `<section>`,
  `<article>`, `<footer>`, `<address>`, `<dl>` are used per their intended
  meaning rather than generic `<div>`s; headings step down in order
  (`h1` → `h2` → `h3`) within each page.

## Before this goes live

- Replace the EmailJS placeholder IDs in `assets/js/email.js`
  (`YOUR_EMAILJS_*`) with real account values.
- Fill in the `<!-- TODO -->` content blocks per page.
- Add real imagery to `assets/images/` (referenced paths are currently
  placeholders).
- Confirm RERA/legal copy on `privacy-policy/index.html`, `terms/index.html`,
  and the footer bottom bar with legal counsel before publishing.
