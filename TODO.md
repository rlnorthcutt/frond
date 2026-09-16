# TODO

Tracked against `PLAN.md`'s milestones. Not in priority order within a section.

---

## Before next release

- [x] **Docs site (M3)** — `docs/index.html` (gallery), `docs/cheatsheet.html`,
  `docs/demo.html`, `docs/archetypes/` (8 pages) built and self-contained under `docs/`
  (Pages serves that folder only). frond's own CSS synced via `scripts/sync-docs.js`;
  external companion libraries (ivy, lattice, stapler, dark-mode-toggle) fetched via
  `.github/workflows/doc-assets.yml`, same pattern as lattice. Not yet verified in an actual
  browser — see below.
- [ ] **Visual QA** — no browser tool was available while building the docs site; open
  `docs/index.html`, `docs/cheatsheet.html`, `docs/demo.html`, and at least one archetype
  locally (e.g. `python3 -m http.server` from the repo root) and check: all four component
  themes, the docs-chrome dark-mode-toggle, every molecule preview frame (1080×1350 scaled
  to 300×375 via `transform: scale()`), the texture strip, and the cheat sheet's copy
  button.
- [ ] **`docs/reference.pdf`** — regenerated component-reference PDF (PLAN's `docs/` tree),
  not built — needs an actual print pass, not just HTML.
- [ ] **Hero screenshot** — `image.png` + the linked-to-Pages header block in README, once
  Pages is actually live (repo is still local-only).
- [ ] **`frond.json` generation** — still hand-authored from the CSS; `scripts/gen-gallery.js`
  is the closer-to-source list now (it drives both docs pages) — worth generating
  `frond.json` from that same data instead of maintaining it a third time.
- [ ] **CDN / jsDelivr** — publish so `<link>` installs need nothing local (PLAN M5).
- [ ] **GitHub remote** — this repo is local-only for now; push once ready to publish.

## Grounds (M2)

- [ ] `.slide--light` / `.slide--dark` ground variants — only `.slide--accent` and
  `.slide--surface` exist today. Ground/ink remap only, no colours outside the eight tokens.
- [ ] Ground × texture matrix (3 grounds × 5 textures incl. "none") added to the gallery
  once it exists.

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
