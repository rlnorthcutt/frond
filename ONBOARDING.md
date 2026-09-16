# frond — Onboarding Guide

## Purpose

Frond is a CSS component library for fixed-canvas sheets — eighteen content atoms and
sixteen slide layouts on a 1080×1350 canvas (plus three alternate size presets), rendered to
PDF via Chrome's print pipeline and paginated by
[stapler](https://github.com/rlnorthcutt/stapler), a zero-dependency web component. It sits
on top of [ivy](https://github.com/rlnorthcutt/ivy) (classless element defaults) and
[lattice](https://github.com/rlnorthcutt/lattice) (layout utilities), building only what
those two don't. See [PLAN.md](./PLAN.md) for the full scope and rationale.

**This repo is a CSS library and its documentation. Nothing else.** No skills, no agent
tooling, no editorial rules (sheet counts, word limits, layout selection), no generators —
those live in separate "pack" repos that consume frond from the outside, exactly as a user
would.

## Architecture

- **`src/`** — the four authored source files: `base.css` (tokens, canvas, print setup),
  `atoms.css` (A1–A18), `molecules.css` (M1–M16), `frame.css` (page furniture). This is the
  real source of truth.
- **`frond.css` / `frond.frame.css`** (repo root) — the two *shipped* files, produced by
  `scripts/build.js` concatenating `src/`. Committed so a consumer can `<link>` directly
  without a build step; regenerate after any `src/` edit.
- **`themes/`** — four reference palettes (`light`, `dark`, `press-light`, `press-dark`),
  each setting exactly the eight contract tokens described in the README.
- **`sizes/`** — four canvas presets. `portrait-1350.css` restates the base default in full
  (so switching *back* to it resets everything a prior preset touched); the other three only
  override the deltas from that default.
- **`vendor/`** — local copies of `ivy.full.min.css`, `lattice.full.min.css`, and
  `stapler.min.js`, so the render pipeline has zero network dependencies.
- **`frond.json`** — a generated, machine-readable index of the vocabulary (every atom,
  molecule, variant, ground, texture, size). Hand-authored today from the actual CSS; the
  plan is to generate it in CI so it can't drift — see TODO.md.
- **`dist/`** — CI output only (`frond.min.css`, `frond.frame.min.css`, `frond.full.min.css`,
  `frond.full.css`). Empty except for `.hold` until the workflow runs.
- **`docs/`** — the GitHub Pages site: `index.html` (gallery), `cheatsheet.html`,
  `demo.html`, `archetypes/` (8 pages). Self-contained on purpose — Pages serves `docs/`
  only, so it holds its own synced copy of `frond.full.css`, `themes/`, `sizes/`, and
  `vendor/` (via `scripts/sync-docs.js`), never a `../` reference back to the repo root.
  The gallery and cheat sheet are generated from `scripts/gen-gallery.js` (one shared data
  set, so the two pages' markup can't drift apart) by `scripts/build-docs-pages.js`.
  `demo.html` and `archetypes/` were ported once from `mockups/` via
  `scripts/port-docs-templates.js` + `scripts/add-docs-nav.js` — those two are one-shot
  tools, not part of the regular build.
- **`mockups/`** — the prototype this repo was ported from (HTML/CSS/templates + the
  `_gen.js` generator for the eight archetypes). Kept on disk, not committed to this repo,
  as reference material for building `docs/` — see TODO.md.

## Key patterns

**Eight-token theming.** Every theme sets exactly `--bg`, `--surface`, `--ink`,
`--ink-muted`, `--accent`, `--accent-ink`, `--font-display`, `--font-body` — nothing else.
`--accent-soft` and `--hairline` are *derived* on `.slide`/`.cv-stage`; a theme must never
set them directly.

**Closed vocabulary.** Eighteen atoms, sixteen molecules, frozen. The test for any addition:
does it describe what a component **is** (belongs here) or how to use it **well** (belongs
in a downstream pack)?

**Authoring vs. shipping shape.** `src/` is four files for maintainability; `frond.css` /
`frond.frame.css` at the root are the two-file shape consumers actually install, matching
ivy's `ivy.css` / `ivy.extra.css` core/extra split. Never hand-edit the root `.css` files —
edit `src/` and rerun `node scripts/build.js`.

**Fixed-px everywhere.** No `clamp()`, no viewport units, in the type scale — screen and
print must render identically.

## Getting started

1. Read `README.md` for the install flow, token reference, and component tables.
2. Read `PLAN.md` for the why behind the scope, the milestone list, and open questions.
3. Edit `src/*.css`, then run, in order: `node scripts/build.js` (rebuilds `frond.css`,
   `frond.frame.css`, `dist/frond.full.css`) → `node scripts/sync-docs.js` (copies that CSS
   plus `themes/`/`sizes/`/`vendor/` into `docs/`) → `node scripts/build-docs-pages.js`
   (regenerates `docs/index.html` and `docs/cheatsheet.html` from `scripts/gen-gallery.js`
   if you touched a component's markup there too). Commit the results.
4. Check `frond.json` for the full class/variant vocabulary rather than grepping the CSS.
5. Check `TODO.md` before starting anything — it tracks what's left against `PLAN.md`'s
   milestones (M2 grounds, M4 CI overflow check, M5 v1.0.0), plus a visual-QA pass on
   `docs/` that hasn't happened yet (no browser tool was available when it was built).
