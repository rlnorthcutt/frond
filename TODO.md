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
- [ ] **CDN / jsDelivr** — publish so `<link>` installs need nothing local (PLAN M5).

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

## Future enhancements

- [ ] Per-slide theme overrides via `.t-*` on a `.slide` — already possible, undocumented.
- [ ] Bento pillars variant worked example (`m-pillars--bento` exists, no template exercises
  it yet).
- [ ] Horizontal `m-process--h` worked example.
