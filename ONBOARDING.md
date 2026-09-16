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
- **`docs/`** — not built yet. Planned: a gallery (every atom/molecule, four-theme switch),
  a cheat sheet (copy-paste markup), a ten-slide demo, and eight archetype carousels, served
  via GitHub Pages. See TODO.md.
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
3. Edit `src/*.css`, then run `node scripts/build.js` to regenerate `frond.css` /
   `frond.frame.css` before committing.
4. Check `frond.json` for the full class/variant vocabulary rather than grepping the CSS.
5. Check `TODO.md` before starting anything — it tracks what's left against `PLAN.md`'s
   milestones (M2 grounds, M3 docs site, M4 CI overflow check, M5 v1.0.0).
