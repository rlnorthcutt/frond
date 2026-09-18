# Changelog

All notable changes to Frond are documented here.
Follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
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
  to `A1–A18` / `M1–M16` to match the actual (already-complete) vocabulary.
- Default font stack no longer references "Source Serif 4" (a Google Font with no local
  `@font-face`, so it silently fell back to Georgia/Palatino for anyone without it
  installed) — `--font-display` / `--font-body` now default straight to the
  widely-available fallback stack, still overridable per-theme.
