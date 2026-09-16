# Changelog

All notable changes to Frond are documented here.
Follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
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
- `<dark-mode-toggle>` in the docs nav, toggling the docs chrome's own light/dark mode
  (`docs/site.css` custom properties, `--docs-*`) — a separate axis from frond's own
  four-way component theme picker; the two share no variables.

### Changed
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
