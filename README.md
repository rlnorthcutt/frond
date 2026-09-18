<p align="center">
  <img alt="CSS Only" src="https://img.shields.io/badge/CSS-Only-0?style=flat&color=0aa" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-000?style=flat&color=333" />
</p>

<!-- Hero screenshot + GitHub Pages link land here once docs/ ships — see TODO.md -->

# Frond

**A CSS component library for fixed-canvas sheets.** Eighteen content atoms and sixteen
slide layouts on a 1080×1350 canvas, rendered to PDF by
[stapler](https://github.com/rlnorthcutt/stapler).

* **Fixed canvas.** Every sheet is a known size in px — no responsive layout, no surprises
  between screen and print.
* **Closed vocabulary.** Eighteen atoms, sixteen molecules. Nothing else — that's the whole
  library, by design.
* **Eight-token theming.** A theme sets eight custom properties and nothing else.
* **Built on ivy + lattice.** Frond only builds what they don't: canvas, atoms, molecules,
  page furniture.

Sibling to [ivy](https://github.com/rlnorthcutt/ivy) and
[lattice](https://github.com/rlnorthcutt/lattice); same conventions, same release process.

---

## Files

Frond ships in two layers, same split as ivy's core/extra:

| File               | Purpose                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| `frond.css`        | **Core:** canvas, tokens, print setup, the eighteen atoms, the sixteen molecules. |
| `frond.frame.css`  | **Frame:** page furniture — footer, page number, logo, swipe, divider, progress. |

Authored as four files in `src/` (`base.css`, `atoms.css`, `molecules.css`, `frame.css`) and
concatenated into the two files above by `scripts/build.js`. CI minifies both into `dist/`:
`frond.min.css` (core only), `frond.frame.min.css` (frame only), and `frond.full.min.css` /
`frond.full.css` (core + frame combined — the simplest option if you don't need to ship the
two separately).

The core/frame split is real, not cosmetic: a single-image sheet needs no footer, page
number, or progress bar, so the furniture layer is genuinely optional.

---

## Install

### Option 1 — CDN, for authoring

No download, no build step — jsDelivr serves straight from this repo:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rlnorthcutt/ivy/dist/ivy.full.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rlnorthcutt/lattice/dist/lattice.full.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rlnorthcutt/frond/dist/frond.full.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rlnorthcutt/frond/themes/light.css" />
<script src="https://cdn.jsdelivr.net/gh/rlnorthcutt/stapler/dist/stapler.min.js"></script>
```

Fine for drafting; **not** for a final render. See [Printing](#printing) — a reproducible PDF
needs zero network dependencies, which means vendored files (Option 2), not a CDN.

### Option 2 — Vendored, for rendering

```html
<!-- 1. base stack -->
<link rel="stylesheet" href="vendor/ivy.full.min.css" />
<link rel="stylesheet" href="vendor/lattice.full.min.css" />
<!-- 2. frond -->
<link rel="stylesheet" href="frond.css" />
<link rel="stylesheet" href="frond.frame.css" />
<!-- 3. exactly one theme -->
<link rel="stylesheet" href="themes/light.css" />
<!-- 4. exactly one size (optional — 1080×1350 is the default) -->
<link rel="stylesheet" href="sizes/square.css" />
<!-- 5. stapler -->
<script src="vendor/stapler.min.js"></script>
```

Load order matters: ivy/lattice before frond, `frond.css` before `frond.frame.css`, theme
and size last. Everything ships local — there are no network dependencies in the render
pipeline.

Or link the pre-combined bundle instead of `frond.css` + `frond.frame.css`:

```html
<link rel="stylesheet" href="dist/frond.full.min.css" />
```

---

## Quick start

```html
<stapled-doc mode="explicit" page-width="1080px" page-height="1350px" page-gap="40px">
  <s-page>
    <s-page-body>
      <section class="slide">
        <header class="slide__head">
          <span class="c-badge">Playbook</span>
        </header>
        <div class="slide__body m-statement">
          <h2 class="c-title c-title--xl">One idea per slide.</h2>
        </div>
        <footer class="c-foot">
          <span class="c-foot__author">
            <span class="c-avatar">RN</span>
          </span>
          <span class="c-pagenum">1 / 8</span>
        </footer>
      </section>
    </s-page-body>
  </s-page>
</stapled-doc>
```

---

## What's in core vs frame

### Core (`frond.css`)

* Canvas tokens, fixed px type scale, print setup (`print-color-adjust`, pinned
  `color-scheme`, the `@page` rule).
* Eighteen atoms — title, body copy, badges, stats, checks, numerals, CTA, quote, icon
  bullets, avatar, highlight, big numeral, process step, decoration, image, device/code
  frame, repo card, decision row.
* Sixteen molecules — the slide shell plus fifteen body layouts (cover, list, checklist,
  stats, quote, CTA, statement, process, compare, pillars, split, number, profile, decide,
  mockup).

### Frame (`frond.frame.css`)

* Page furniture applied at slide level — footer, author, page number, logo, swipe
  affordance, divider, progress bar. Every piece is its own node, so "turning it off" is
  simply omitting it — no state classes needed.

---

## Canvas

```css
:root { --cv-w: 1080px; --cv-h: 1350px; }
@page { size: 1080px 1350px; margin: 0; }   /* @page cannot read variables */
```

Four presets in `sizes/` set the canvas pair, the `@page` rule, and the handful of type
sizes that need to move on a different sheet — load one **after** `frond.css`:

```html
<link rel="stylesheet" href="sizes/portrait-1350.css" /> <!-- 1080×1350, the default -->
<link rel="stylesheet" href="sizes/square.css" />        <!-- 1080×1080 -->
<link rel="stylesheet" href="sizes/portrait-1200.css" /> <!-- 1200×1500 -->
<link rel="stylesheet" href="sizes/widescreen.css" />    <!-- 1920×1080 -->
```

Other knobs: `--cv-pad` (slide padding, default 72px — keep ≥ 50px), `--cv-gap`,
`--cv-radius`, `--cv-rule`.

The type scale is fixed px throughout — no `clamp()`, no viewport units, nothing that can
shift between screen and print. `print-color-adjust: exact` is set on `:root` and inside
every slide; `color-scheme` is pinned to light so an OS dark-mode preference can never leak
into a PDF.

---

## Themes & tokens

A theme sets **eight tokens and nothing else**:

| Token             | Role                                          |
| ----------------- | ---------------------------------------------- |
| `--bg`            | sheet ground                                   |
| `--surface`       | card / box fill                                |
| `--ink`           | primary text                                   |
| `--ink-muted`     | secondary text                                 |
| `--accent`        | brand spot — highlights, badges, numerals      |
| `--accent-ink`    | text on accent                                 |
| `--font-display`  | headlines                                      |
| `--font-body`     | body copy                                      |

`--accent` and `--accent-ink` must clear **4.5:1 contrast** (WCAG AA, body text) — `.slide--accent`
sets full body copy in `--accent-ink` on an `--accent` ground, and its muted classes point
straight at `--accent-ink` rather than mixing toward `--accent`, since that pair has no
contrast headroom to spare for a lighter derivative. A theme whose accent pair falls short of
4.5:1 is non-conformant.

Four themes ship: `themes/light.css` and `themes/dark.css` (cyan spot), and
`themes/press-light.css` / `themes/press-dark.css` (magenta). The second pair exists to
prove the eight-token contract holds on a palette that isn't cyan — which is why it's
magenta. **Themes are reference implementations, not a palette library** — the expected path
is that you copy one and change those eight values; no component CSS is touched.

Each theme scopes to `:root, .t-<name>`, so a docs page can load several and switch per
element with a class.

Two tokens are derived on `.slide` and `.cv-stage` — `--accent-soft`, `--hairline` — and
recomputed from the eight above. Never set them in a theme.

`--font-display` / `--font-body` default to a widely-available serif stack (no downloads
required) so the library renders consistently with nothing to fetch; override either to
point at your own display or body face.

Prefer the host page's ivy palette instead of a frond theme? Put `.cv-inherit-ivy` on the
wrapper and the eight tokens map onto ivy's `--color-*`.

---

## Grounds

The closed ground axis: `.slide--light`, `.slide--dark`, `.slide--accent`. None introduces a
colour outside the eight tokens above.

`.slide--light` / `.slide--dark` swap the `--bg`/`--ink` pair — a real swap, not a new
colour, so which one actually changes anything depends on the theme you've loaded: under a
light theme, `.slide--light` is the unmodified default and `.slide--dark` is the one that
does something; under a dark theme it's the other way round. Because `--bg`/`--ink` have no
other entanglements, each theme file implements only the swap it needs (a light theme only
needs `.slide--dark`, a dark theme only needs `.slide--light`) by reading from a frozen copy
of its own pair — reassigning `--bg`/`--ink` from each other directly would create a
custom-property cycle, which CSS resolves by making both compute to invalid, not by
swapping them. `--ink-muted` is re-derived alongside them at the same 72%/28% ratio
`.slide--accent` uses below.

`.slide--accent` inverts a slide onto the accent ground, for a CTA slide. It re-points atoms
explicitly rather than remapping `--accent`, for the same cycle reason — but `--accent` is
also used independently of ground elsewhere (badges, stat values), so a full repoint is the
correct fix there, not just a workaround.

`.slide--surface` sits a slide on the card surface instead of the page ground — an extra,
not part of the closed three-value axis above.

See every ground crossed with every texture (15 combinations, `.c-decor`'s four textures
plus none) on the [gallery](./docs/gallery.html)'s Ground × texture section.

`.slide--start`, `--between` and `--end` control vertical rhythm inside `.slide__body`
(centred by default) — these aren't grounds, just alignment.

---

## Components

**Atoms** — A1 `.c-title` · A2 `.c-sub`/`.c-body`/`.c-caption` · A3 `.c-badge` ·
A4 `.c-stat` · A5 `.c-check` · A6 `.c-num` · A7 `.c-cta` · A8 `.c-quote` ·
A9 `.c-icon-bullet` · A10 `.c-avatar` · A11 `.c-hl` · A12 `.c-bignum` · A13 `.c-step` ·
A14 `.c-decor` · A15 `.c-img` · A16 `.c-device`/`.c-code` · A17 `.c-repo` · A18 `.c-decide`

**Molecules** — M1 `.slide` · M2 `.m-cover` · M3 `.m-list` · M4 `.m-checklist` ·
M5 `.m-stats` · M6 `.m-quote` · M7 `.m-cta` · M8 `.m-statement` · M9 `.m-process` ·
M10 `.m-compare` · M11 `.m-pillars` · M12 `.m-split` · M13 `.m-number` · M14 `.m-profile` ·
M15 `.m-decide` · M16 `.m-mockup`

M1 is the canvas itself: `.slide__head`, `.slide__body`, `.c-foot`. Each molecule maps 1:1
to a stapler `<s-page>`. The full machine-readable index — every class, every variant — is
in [`frond.json`](./frond.json).

Icons are inline SVG (`<use href="#i-check">` from a sprite) — no icon font, so they survive
print without a font-loading race.

---

## Printing

Open your page in Chrome → Print → Save as PDF, with margins **None** and background
graphics **on**. `@page { size: 1080px 1350px }` (or your chosen preset) does the rest.

---

## Examples

`docs/` is the GitHub Pages site — every page is self-contained (own copy of the CSS,
themes, and vendored libs, since Pages only serves `docs/`), built on ivy + lattice for its
own chrome, same as ivy's and lattice's own docs sites:

* `docs/index.html` — the landing page.
* `docs/gallery.html` — every atom and molecule, rendered live, with a theme switcher.
* `docs/cheatsheet.html` — copy-paste markup for every component.
* `docs/demo.html` — a ten-slide carousel exercising one of each molecule.
* `docs/archetypes/` — eight complete carousels, all on one subject, so the layouts can be
  compared without the copy getting in the way.

Regenerate the landing page/gallery/cheat sheet from source with
`node scripts/build-docs-pages.js` (data lives in `scripts/gen-gallery.js`, shared nav in
`scripts/docs-nav.js`) after running `scripts/build.js` and `scripts/sync-docs.js` — see
[ONBOARDING.md](./ONBOARDING.md).

---

## Browser support

Modern evergreen browsers. Requires the same feature tier as ivy/lattice:
`color-mix()`, `@layer`, `:focus-visible`. No JavaScript required beyond stapler itself,
which builds the pagination and drives print.

---

## Philosophy

* **Fixed canvas, closed vocabulary.** Eighteen atoms, sixteen molecules — the test for
  anything new is whether it describes what a component **is**, not how to use it well.
* **Small layers.** ivy + lattice → frond core → frond frame → your theme.
* **No lock-in, no runtime.** Pure CSS; stapler handles pagination, Chrome handles print.

---

## Versioning & License

* **SemVer** for releases. See [CHANGELOG.md](./CHANGELOG.md).
* **MIT License.** © 2026 Ron Northcutt.

---

## Contributing

PRs welcome! Please:

* Keep diffs focused and maintain the tight single-line formatting.
* Preserve license banners (`/*! … */`) so they survive minification.
* Never add a colour outside the eight tokens, and never add a component outside the
  eighteen atoms / sixteen molecules — extend a molecule's variants instead.
* Test changes in every theme, and confirm nothing overflows 1080×1350 (or your target size)
  at the safe margin.
