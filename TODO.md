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

From a real deck build. All six items are now closed. The two layout ones (`m-split`,
`m-cta`) were deliberately left until an external harness could test them against a real
render — each of those passes also re-found (or in `m-cta`'s case, newly found) an
accent-ground contrast bug of the same class as Issue 1, confirming that class of bug is
worth specifically re-checking whenever a new atom/molecule touches `.slide--accent`:

- [x] **No data-table component** — added `.c-table` (A19), a real `<table>`-based atom.
  See CHANGELOG.md. Follow-up noticed while building it: `.c-decide` (A18) has never had
  `.slide--accent` repoints either (no entry in `molecules.css`'s `.slide--accent` block) —
  `.c-table` got them in this pass, `.c-decide` still doesn't. Worth closing that gap too.
- [x] **Icon sprite is undocumented infrastructure** — README gained an "Icons" section
  (the three required symbols, the canonical sprite, and open-slot guidance for
  `c-icon-bullet__i`/`m-pillar__i`); `frond.json` gained an `icons` key. See CHANGELOG.md.
- [x] **Brand-footer pattern hand-rolled per deck** — added `.c-brand`/`.c-brand--corner`
  to frame.css (bottom-left, the one corner `.c-logo--corner`/`.c-pagenum--corner` don't
  already claim), plus a worked example in README. See CHANGELOG.md.
- [x] **Split-with-list pattern undocumented** — tested against a real render (external
  harness, 2026-09-18): repro confirmed (`.m-split__media`'s default `flex-direction: row`
  clips a stacked list off the sheet), Candidate B (`.m-split__media--list { display: flex;
  flex-direction: column; gap: 44px; }`) won over an inline-styled wrapper — same geometry,
  but names the pattern and the 44px gap is now a deliberate, documented choice rather than
  copied by hand each time. Caveat, now documented in README: 3 short quotes fit, a 4th
  sentence-length one overflows the fixed 1350px sheet — that's a hard limit of the format,
  not something more CSS should paper over.
  The same test also re-found the Issue-1-class contrast bug on `.c-quote footer` — that
  was already fixed in this pass (`.slide--accent`'s muted group), just not yet pushed when
  the harness tested, so it was testing pre-fix CSS. No new fix needed there, but a reminder
  that this repo's local commits need pushing before an external harness's next run reflects
  them.
- [x] **`m-cta` fights full-width CTA boxes** — tested against a real render (external
  harness, 2026-09-18): the reported "footer misalignment" wasn't real (pixel-scanned box
  and footer edges land exactly on `--cv-pad` at both portrait-1350 and square — a vision
  pass misread a dark box against the blue ground). The real failure was only visible
  *without* an image inside: the box shrink-wraps to ~344px and left-anchors instead of
  reading as a full-width panel. `.m-cta--center` + `.c-cta--full` fixes it, verified to
  compose with `--outline`/`--plain`, with/without an image, at both canvas sizes. A
  `.c-cta--bleed` (edge-to-edge band) alternative was also tested and works but wasn't the
  better match for "full-width panel," so it isn't shipped.
  Same test found a real, previously-uncaught bug: `.c-cta__title` was invisible on
  `.slide--accent` (forced to `--accent-ink` by the generic full-color group, same as its
  own container's `--accent-ink` background) — reproduces on the shipped M7 gallery example.
  Fixed alongside the two new classes.
  Deferred, not blocking: long title/action text at the full-width measure reads sparse
  ("a small island in a large dark sea" per the vision pass) — a `max-width`/`margin-inline`
  constraint on the inner text was suggested but not verified; worth a follow-up render pass
  before shipping it.

## Future enhancements

- [ ] Per-slide theme overrides via `.t-*` on a `.slide` — already possible, undocumented.
- [ ] Bento pillars variant worked example (`m-pillars--bento` exists, no template exercises
  it yet).
- [ ] Horizontal `m-process--h` worked example.
