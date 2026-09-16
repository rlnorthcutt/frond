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

### Changed
- `chrome.css` renamed to `frame.css` throughout (`frond.frame.css` shipped name, `.c-foot`
  etc. unchanged) — "chrome" collided with the renderer (Chrome) in every install
  instruction.
- Stale `A1–A15` / `M1–M13` file-banner comments in `atoms.css` / `molecules.css` corrected
  to `A1–A18` / `M1–M16` to match the actual (already-complete) vocabulary.
- Default font stack no longer references "Source Serif 4" (a Google Font with no local
  `@font-face`, so it silently fell back to Georgia/Palatino for anyone without it
  installed) — `--font-display` / `--font-body` now default straight to the
  widely-available fallback stack, still overridable per-theme.
