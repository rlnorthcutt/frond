# Changelog

All notable changes to Frond are documented here.
Follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- **`.m-cta--center` + `.c-cta--full`**: full-width CTA panel, as an alternative to the
  default left-anchored shrink-wrapped `.c-cta` box. Verified against a real render: composes
  cleanly with `.c-cta--outline`/`.c-cta--plain`, with and without an image inside, at both
  the default canvas and `sizes/square.css` (box edges land on `--cv-pad` exactly, same as
  `.c-foot` below it, at both sizes — nothing hardcoded to one canvas). A `.c-cta--bleed`
  (edge-to-edge band) was also prototyped and works, but wasn't the better match for "full
  width panel" and isn't shipped. Worked example in README's Components section.
- **`.m-split__media--list`**: modifier for `.m-split`'s media column so it can hold a
  stacked list (several `.c-quote--bar`, say) instead of the one image/mockup it's sized for
  by default — the bare column's `flex-direction: row` fights multiple children and clips
  them off the sheet. Verified against a real render (see TODO.md): 3 short items fit, a 4th
  sentence-length item overflows the fixed 1350px sheet — documented as a hard limit, not
  solved with more CSS. Worked example in README's Components section.
- **`.c-brand`** (frame.css): a persistent per-slide text mark (domain, handle) as a real
  furniture piece instead of a hand-rolled class per deck. `.c-brand--corner` bottom-left
  anchors it — the one corner `.c-logo--corner` (top-right) and `.c-pagenum--corner`
  (bottom-right) leave free. Accent-ground repoint included. Documented with a worked
  example in README's "core vs frame" section.
- **Icons documented**: README gained an "Icons" section spelling out the three sprite
  symbols (`i-check`, `i-cross`, `i-arrow`) that `.c-check` and `.c-swipe__arrow` hard-depend
  on, with the canonical copy-paste sprite (previously "copy verbatim from demo.html" — now
  one citable source), plus guidance for registering custom icons in the open
  `.c-icon-bullet__i` / `.m-pillar__i` slots. `frond.json` gained an `icons` key
  (`required`/`open`) so this is machine-readable too.
- **A19 `.c-table`**: a real `<table>`-based data table (rows × N columns, native column
  sizing — no `.m-stats`-style count modifier needed). Closes a real gap surfaced by a
  feedback pass: `.c-decide` is strictly two-column and had no substitute for genuinely
  tabular content. Accent-ground repoints added alongside it in the same pass as the fix
  below.
- **Grounds M2**: `.slide--light` / `.slide--dark`, completing the closed ground axis
  (`light` / `dark` / `accent`) from PLAN.md. Each swaps the `--bg`/`--ink` pair; implemented
  per theme file (each theme only needs the one that's the opposite of its own default
  ground) since CSS can't tell which of the two is "the light one" on its own. `--ink-muted`
  re-derives alongside them. No color outside the eight tokens in any of it.
- Ground × texture matrix in the gallery (`docs/gallery.html#matrix`) — all 3 grounds ×
  5 textures (including "none") = 15 combinations, generated from `scripts/gen-gallery.js`.
- `frond.json`'s `grounds` list now includes `light` and `dark`.
- CDN install option in README (jsDelivr's `/gh/` mode, no publish step required — verified
  live against the pushed repo) — authoring only, vendored files stay the documented path
  for an actual render.
- Initial port from the prototype: `src/` (base, atoms, molecules, frame), four themes,
  four size presets (`portrait-1350`, `square`, `portrait-1200`, `widescreen`), vendored
  ivy/lattice/stapler in `vendor/`.
- `scripts/build.js` concatenates `src/` into the shipped `frond.css` / `frond.frame.css`.
- `frond.json` — generated vocabulary index (atoms, molecules, grounds, textures, sizes).
- `.github/workflows/minify-css.yml` — CI build + minify to `dist/`, now also syncing
  `docs/`.
- `docs/` — GitHub Pages site: gallery (`index.html`), cheat sheet (`cheatsheet.html`), a
  ten-slide demo (`demo.html`), and eight archetype carousels (`archetypes/`), plus its own
  self-contained copy of the CSS/themes/vendor (Pages serves `docs/` only). Gallery and
  cheat sheet are generated from one shared data set (`scripts/gen-gallery.js`) so they
  can't drift from each other.
- `sizes/portrait-1350.css` — the default canvas made an explicit, swappable preset.
- `sizes/widescreen.css` (1920×1080) — new size, not in the prototype.
- `.github/workflows/doc-assets.yml` — fetches ivy, lattice, stapler, and dark-mode-toggle
  fresh from their own repos into `docs/vendor/` and `docs/dark-mode-toggle.min.js` on
  demand, same pattern as lattice's own `doc-assets.yml`. Decouples `docs/`'s copies of
  those companion libraries from frond's root `vendor/` (which stays a separate, pinned
  snapshot for the shipped library — see ONBOARDING.md).
- `<dark-mode-toggle>` in the docs header, toggling the docs chrome's own light/dark mode
  via ivy's own theming — a separate axis from frond's own four-way component theme picker
  (which now lives only on `docs/gallery.html`); the two share no variables.
- `docs/index.html` — a real landing page (hero, "why frond", two layers, install, quick
  start, canvas/tokens/components/printing/support/files, all in ivy's classless style with
  lattice's grid utilities), matching ivy's and lattice's own homepages. The former
  `docs/index.html` (the atom/molecule gallery) moved to `docs/gallery.html`.

### Fixed
- `.c-decor--glow`/`.c-decor--mesh` invisible on `.slide--accent`: both tint their gradient
  toward `--accent`, which is a no-op when the ground they're painted on is already
  `--accent` (alpha-blending a color over an identical-hue backdrop doesn't change it) —
  confirmed by pixel-sampling identical color with and without the decoration present, in an
  external render test of the full docs site. Re-points just the `--accent`-tinted gradient
  stops to `--accent-ink` on `.slide--accent`; `--decor--mesh`'s other (`--ink`-tinted) stop
  was already a different hue from the ground and didn't need it. Same bug family as the
  `.c-cta__title`/`<mark>`/`.c-quote footer` fixes above.
- `docs/site.css`'s `.gallery-grid` used `minmax(300px, 1fr)` columns, but `.m-frame__inner`
  (the scaled slide preview inside each card) is a fixed 1080×1350 box at a hardcoded
  `scale(0.2778)` = exactly 300×375 — whenever a row didn't divide evenly, the `1fr` stretched
  `.m-frame` wider than that, and since the inner box doesn't grow with it, the extra space
  rendered as a black letterboxed gutter on every affected card. Pinned the column width to a
  fixed `300px` to match.
- `.c-cta__title` invisible on `.slide--accent` (accent-ink text forced by the generic
  full-color group, on top of `.c-cta`'s own accent-ink background — the same bug class as
  the `<mark>`-in-chip fix above, just not caught in that pass because `.c-cta__title` was
  bundled into the generic group instead of recognized as always living inside the `.c-cta`
  chip). Found by an external render test against the shipped M7 gallery example, which
  reproduced it. Now points at `--accent` alongside `.c-cta__action`, which was already
  correct.
- Stale "eighteen atoms" / `A1–A18` prose left over from adding A19 `.c-table` — README,
  PLAN.md, and the generated docs pages (`docs/index.html`, `docs/gallery.html`) all now say
  nineteen / `A1–A19` / thirty-five components.
- Accent-ground contrast: `themes/light.css` and `src/base.css`'s `--accent` darkened
  (`#0088b0` → `#00789c`) so it clears WCAG AA's 4.5:1 body-text threshold against
  `--accent-ink` (was 4.08:1). `.slide--accent`'s muted-text classes (`.c-sub`, `.c-caption`,
  etc.) no longer color-mix 72% toward `--accent` — that formula assumes headroom the
  accent/accent-ink pair doesn't have, and was landing muted text as low as ~2.6:1
  regardless of the base pair. Also fixed `<mark>`/`.c-hl` going invisible (accent-ink text on
  an accent-ink chip) when nested inside an already-inverted `.c-badge`/`.c-cta`/etc. Added
  an explicit 4.5:1 contrast rule to the theme contract in PLAN.md/README so future themes
  have something to test against.

### Changed
- Rebuilt the entire docs chrome to match ivy's/lattice's own docs sites instead of a
  bespoke design: header (logo, nav, GitHub icon, `<dark-mode-toggle>`), hero/page-title
  typography, and the `.shell` on-page-nav layout now reuse ivy's classless elements and
  lattice's grid utilities, with `docs/site.css` reduced to a lean brand-color override
  (cyan) plus the handful of things ivy/lattice have no opinion on — same shape as lattice's
  own `docs.css`. Dropped the bespoke `--docs-*` dark-mode token scheme entirely; the chrome
  now gets dark mode for free from ivy's own `--color-*` tokens.
- Archetype pages gained a `.subnav` sub-navigation strip (all 8 archetypes), matching ivy's
  own `docs/example-*.html` pattern, replacing the full archetype list that used to be
  crammed into the main header.
- `scripts/docs-nav.js` reworked around this: `renderNav()` now returns
  `{ headLink, header, subnav, script }` (was `{ headLink, navBar, script }`).
- `scripts/sync-docs.js` no longer copies `vendor/` into `docs/vendor/` — that's now
  `doc-assets.yml`'s job (see above).
- `scripts/docs-nav.js` now returns `{ headLink, navBar, script }` instead of one combined
  string. Fixes a real bug: the combined string was being inserted before `</head>` in
  `scripts/build-docs-pages.js`, so `docs/index.html` and `docs/cheatsheet.html` had `<nav>`
  sitting inside `<head>` (browsers silently relocate it, but it was invalid HTML).
- `scripts/add-docs-nav.js` rewritten to replace its own `<!-- docs-nav:* -->`-marked
  blocks in place instead of skipping files that already had a nav — a nav-markup change
  now propagates on rerun instead of silently no-op'ing.
- `chrome.css` renamed to `frame.css` throughout (`frond.frame.css` shipped name, `.c-foot`
  etc. unchanged) — "chrome" collided with the renderer (Chrome) in every install
  instruction.
- Stale `A1–A15` / `M1–M13` file-banner comments in `atoms.css` / `molecules.css` corrected
  to `A1–A19` / `M1–M16` to match the actual vocabulary (A19 `.c-table` added since).
- Default font stack no longer references "Source Serif 4" (a Google Font with no local
  `@font-face`, so it silently fell back to Georgia/Palatino for anyone without it
  installed) — `--font-display` / `--font-body` now default straight to the
  widely-available fallback stack, still overridable per-theme.
