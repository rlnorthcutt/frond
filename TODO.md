# TODO

Tracked against `PLAN.md`'s milestones. Not in priority order within a section.

---

## Before next release

- [x] **Docs site (M3)** — `docs/index.html` (landing page, ivy/lattice-styled chrome),
  `docs/gallery.html`, `docs/cheatsheet.html`, `docs/demo.html`, `docs/archetypes/`
  (8 pages), self-contained under `docs/` (Pages serves that folder only). frond's own CSS
  synced via `scripts/sync-docs.js`; external companion libraries (ivy, lattice, stapler,
  dark-mode-toggle) fetched via `.github/workflows/doc-assets.yml`, same pattern as lattice.
  Not yet verified in an actual browser — see below.
- [ ] **Visual QA** — no browser tool was available while building the docs site; open
  `docs/index.html`, `docs/gallery.html`, `docs/cheatsheet.html`, `docs/demo.html`, and at
  least one archetype locally (e.g. `python3 -m http.server` from the repo root) and check:
  the header/hero/on-page-nav shell against ivy's and lattice's own docs sites, the
  `<dark-mode-toggle>` in the header (toggles ivy's own light/dark, via `docs/site.css`'s
  cyan brand override), the gallery's separate four-theme picker (component previews only),
  every molecule preview frame (1080×1350 scaled to 300×375 via `transform: scale()`), the
  texture strip, the archetypes sub-nav, the cheat sheet's copy button, and — highest
  priority, since it was implemented without a browser — the Grounds and Ground × texture
  sections: switch the theme picker and confirm `.slide--light`/`.slide--dark` actually
  invert (not just "look unchanged," which is also what a silently-broken cyclic custom
  property would look like).
- [ ] **`docs/reference.pdf`** — regenerated component-reference PDF (PLAN's `docs/` tree),
  not built — needs an actual print pass, not just HTML.
- [ ] **Hero screenshot** — `image.png` + the linked-to-Pages header block in README, once
  Pages is actually live (repo is still local-only).
- [ ] **`frond.json` generation** — still hand-authored from the CSS; `scripts/gen-gallery.js`
  is the closer-to-source list now (it drives both docs pages) — worth generating
  `frond.json` from that same data instead of maintaining it a third time.
- [x] **CDN / jsDelivr** — no publish step needed; jsDelivr's `/gh/` mode already serves any
  public GitHub repo directly (verified: `cdn.jsdelivr.net/gh/rlnorthcutt/frond/dist/
  frond.full.min.css` returns 200 now that the repo is pushed). Documented in README as
  Option 1 (authoring only — Option 2, vendored, stays the recommended path for an actual
  render, per PLAN's "no network at render time" rule).

## Grounds (M2) — done

- [x] `.slide--light` / `.slide--dark` — each swaps the `--bg`/`--ink` pair, implemented per
  theme (each theme only needs the one that's the opposite of its own default ground) since
  CSS can't detect which of the two is "the light one" on its own. Reads from a frozen
  `--gnd-bg`/`--gnd-ink` copy rather than reassigning `--bg`/`--ink` from each other directly
  — that looks like a swap but is actually a reference cycle (both compute to invalid, per
  spec) since custom properties don't resolve sequentially within a rule. See
  `themes/light.css`'s `.slide--dark` comment for the full reasoning — worth (re-)reading
  before touching this again, the wrong-but-plausible-looking version is a real trap.
- [x] Ground × texture matrix (3 grounds × 5 textures incl. "none" = 15) added to the
  gallery (`#matrix` section).
- [ ] **Verify in an actual browser** — this entire ground mechanism was implemented and
  reasoned through without one (see Visual QA below); the cycle bug was caught by re-deriving
  the CSS custom-property cascade model by hand, not by seeing it fail. High priority to
  actually check before calling M2 done-done.

## Sizes

- [ ] `sizes/og.css` (1200×630, Open Graph) — listed in `PLAN.md`'s target file tree but not
  in the M0 milestone checklist; not built in this pass.

## CI (M4)

- [ ] Headless-Chrome render check: fail on `scrollHeight > clientHeight` on any `.slide` /
  `.slide__body`, or on text inside the safe margin. `docs/` exists now, so this is unblocked.

## v1.0.0 (M5)

- [ ] Tag, CHANGELOG entry, Pages live, repo topics set.

## User feedback backlog (2026-09-18)

From a real deck build. Issue 1 (accent-ground contrast) is fixed — see `PLAN.md`'s theme
contract and `src/molecules.css`'s `.slide--accent` muted rule. The rest are open:

- [x] **No data-table component** — added `.c-table` (A19), a real `<table>`-based atom.
  See CHANGELOG.md. Follow-up noticed while building it: `.c-decide` (A18) has never had
  `.slide--accent` repoints either (no entry in `molecules.css`'s `.slide--accent` block) —
  `.c-table` got them in this pass, `.c-decide` still doesn't. Worth closing that gap too.
- [ ] **Icon sprite is undocumented infrastructure** — the demo sprite (`i-check`, `i-cross`,
  `i-arrow`) is "copy verbatim from demo.html"; nothing in `frond.json` or the docs says what
  symbols exist or how an author registers a custom one for `m-pillar__i` / `c-icon-bullet`.
  Needs a small named icon set plus a docs section (or explicit sign-off that custom inline
  SVG is the intended path and just needs saying so).
- [ ] **Split-with-list pattern undocumented** — "text left, stack of quotes right" needed
  `m-split--wide-text`, but `m-split` still reserves the media column, which looks broken
  when it's empty. Working pattern: a flex column of `.c-quote--bar` at 44px gaps with icon
  footers. Worth a docs worked example, or a real `m-split--list` variant.
- [ ] **Brand-footer pattern hand-rolled per deck** — "domain bottom-left on every slide"
  needed a custom `.brand-mark` class each time. Worth a documented footer pattern, or a
  `c-foot__brand` addition to frame.css.
- [ ] **`m-cta` fights full-width CTA boxes** — centering/width/padding all needed inline
  overrides to align with footer margins and host a screenshot. Worth a worked example or
  `m-cta` modifiers.

## Future enhancements

- [ ] Per-slide theme overrides via `.t-*` on a `.slide` — already possible, undocumented.
- [ ] Bento pillars variant worked example (`m-pillars--bento` exists, no template exercises
  it yet).
- [ ] Horizontal `m-process--h` worked example.
