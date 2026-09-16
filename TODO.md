# TODO

Tracked against `PLAN.md`'s milestones. Not in priority order within a section.

---

## Before next release

- [ ] **Docs site (M3)** — build `docs/`: gallery (every atom/molecule, four-theme switch),
  cheat sheet (copy-paste markup), a ten-slide demo, and the eight archetype carousels.
  Source material (HTML/CSS/templates, `_gen.js`) is in `mockups/` on disk — not committed
  to this repo, kept as reference for this pass.
- [ ] **Hero screenshot** — `image.png` + the linked-to-Pages header block in README, once
  `docs/` is live.
- [ ] **`frond.json` generation** — currently hand-authored from the CSS; write a script to
  generate it in CI so gallery/cheat-sheet and the JSON can't drift from source.
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
  `.slide__body`, or on text inside the safe margin. Depends on `docs/` existing first.

## v1.0.0 (M5)

- [ ] Tag, CHANGELOG entry, Pages live, repo topics set.

## Future enhancements

- [ ] Per-slide theme overrides via `.t-*` on a `.slide` — already possible, undocumented.
- [ ] Bento pillars variant worked example (`m-pillars--bento` exists, no template exercises
  it yet).
- [ ] Horizontal `m-process--h` worked example.
