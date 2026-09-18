# rlnorthcutt/frond

**A CSS component library for fixed-canvas sheets.** Nineteen atoms and sixteen slide
layouts on a 1080×1350 canvas, on top of ivy and lattice, rendered to PDF by stapler.

**This repo is a CSS library and its documentation. Nothing else.** No skills, no agent
tooling, no editorial rules, no generators. Those live in separate pack repos and consume
frond from the outside, exactly as a user would.

Sibling to [ivy](https://github.com/rlnorthcutt/ivy) and
[lattice](https://github.com/rlnorthcutt/lattice); same conventions, same release process,
same shape of README.

---

## 1 · Scope

**In:** the CSS, the themes, the size presets, a published index of the vocabulary, docs
pages that demonstrate every component, and CI that minifies and checks them.

**Out:** skills, prompts, editorial rules (sheet counts, word limits, layout selection),
brand files for specific users, hosted generators, anything that reasons about *content*.

The test: frond describes what the components **are**. Anything describing how to use them
**well** belongs in a pack.

## 2 · Mirroring ivy

| ivy | frond |
|---|---|
| `ivy.css` — core classless defaults | `frond.css` — canvas, tokens, print setup, atoms, molecules |
| `ivy.extra.css` — optional polish | `frond.frame.css` — page furniture: footer, page number, logo, brand mark, swipe, divider, progress |
| `themes/` | `themes/` — light, dark, press-light, press-dark |
| — | `sizes/` — canvas presets |
| `dist/` built by CI | same: `frond.min.css`, `frond.frame.min.css`, `frond.full.min.css`, `frond.full.css` |
| `docs/` → GitHub Pages | same: gallery, cheat sheet, archetypes |
| CHANGELOG / ONBOARDING / TODO / README | same |
| SemVer, MIT, `/*! … */` banners preserved | same |

The core/extra split is real here, not cosmetic: a single-image sheet needs no footer, page
number, or progress bar, so the furniture layer is genuinely optional. If the four existing
source files (`base`, `atoms`, `molecules`, `chrome`) are easier to maintain separately,
keep them and have CI concatenate — the two-file layout above is the shipping shape, not
necessarily the authoring shape.

`chrome.css` → `frame.css` either way. The renderer is Chrome, and the collision shows up in
every install instruction.

## 3 · Layout

```
frond/
├── .github/workflows/      minify → dist, render check
├── dist/                   built bundles (CI)
├── docs/                   GitHub Pages site
│   ├── index.html          gallery — every atom and molecule, four-theme switch
│   ├── cheatsheet.html     copy-paste markup for every component
│   ├── demo.html           10 slides, one of each molecule
│   ├── archetypes/         eight complete carousels on how LLMs work
│   └── reference.pdf       printed component reference (regenerated each minor)
├── themes/                 light, dark, press-light, press-dark
├── sizes/                  portrait-1350, square, portrait-1200, og, widescreen
├── vendor/                 ivy, lattice, stapler (local copies for the docs pages)
├── frond.css               canvas, tokens, print setup, atoms, molecules
├── frond.frame.css         page furniture
├── frond.json              published vocabulary index — see §6
├── image.png               hero screenshot, links to Pages
├── README.md  CHANGELOG.md  ONBOARDING.md  TODO.md  LICENSE
```

## 4 · The contract

### Eight tokens

A theme sets these and nothing else.

| Token | Role |
|---|---|
| `--bg` | sheet ground |
| `--surface` | card / box fill |
| `--ink` | primary text |
| `--ink-muted` | secondary text |
| `--accent` | brand spot |
| `--accent-ink` | text on accent |
| `--font-display` | headlines |
| `--font-body` | body copy |

`--accent-soft` and `--hairline` are derived on `.slide` and `.cv-stage`. Never set them in
a theme.

**Contrast rule:** `--accent` vs `--accent-ink` must clear 4.5:1 (WCAG AA, body text) —
`.slide--accent` sets full-size body copy (`.c-title`, `.c-body`, `.c-quote p`, …) directly
in `--accent-ink` on an `--accent` ground, so the pair has to carry body text on its own, not
just large text/UI at 3:1. There's no headroom to spare for a lighter "muted" derivative on
top of that pair — `.slide--accent`'s muted classes therefore point straight at
`--accent-ink` rather than mixing toward `--accent`, and a theme should not assume it can
mix either. A theme that ships an `--accent`/`--accent-ink` pair below 4.5:1 is non-conformant.

**Themes are reference implementations, not a palette library.** As with ivy, the expected
path is that users write their own override file. The four shipped themes exist to prove the
eight-token contract holds on more than one palette — which is why two of them are magenta.

### Canvas

```css
:root { --cv-w: 1080px; --cv-h: 1350px; }
@page { size: 1080px 1350px; margin: 0; }   /* @page cannot read variables */
```

Size presets each set the canvas pair, the `@page` rule, and the handful of type sizes that
move on a different sheet. Other knobs: `--cv-pad` (default 72px, keep ≥ 50px), `--cv-gap`,
`--cv-radius`, `--cv-rule`.

The type scale is fixed px throughout — no `clamp()`, no viewport units, nothing that can
shift between screen and print. `print-color-adjust: exact` on `:root` and inside every
slide; `color-scheme` pinned to light so an OS dark-mode preference cannot leak into a PDF.

### Grounds

Two closed axes, giving variety without opening the palette:

| Axis | Values |
|---|---|
| Ground | `.slide--light`, `.slide--dark`, `.slide--accent` |
| Texture | none, plus A14's dots, lines, glow, mesh |

Each ground remaps the ground/ink pair only. **No ground introduces a colour outside the
eight tokens** — that is what stops a numbered list of background variants from becoming a
second palette. `.slide--accent` re-points atoms explicitly rather than remapping `--accent`,
which would create a custom-property cycle.

## 5 · Vocabulary

18 atoms and 16 molecules as of v0.2; A19 `.c-table` added in v0.3 to close a real gap (a
tabular payoff slide had no atom to reach for beside the two-column `.c-decide`). The
vocabulary is closed by default, not literally frozen — a new atom is a deliberate,
justified addition, not a place to bend on scope. The A/M numbering is complete and correct —
only the old `A1–A15` / `M1–M13` file comments are stale. Keep the IDs: they are the
unambiguous way to name a component.

**Atoms** — A1 `.c-title` · A2 `.c-sub`/`.c-body`/`.c-caption` · A3 `.c-badge` · A4 `.c-stat` ·
A5 `.c-check` · A6 `.c-num` · A7 `.c-cta` · A8 `.c-quote` · A9 `.c-icon-bullet` ·
A10 `.c-avatar` · A11 `.c-hl` · A12 `.c-bignum` · A13 `.c-step` · A14 `.c-decor` ·
A15 `.c-img` · A16 `.c-device`/`.c-code` · A17 `.c-repo` · A18 `.c-decide` · A19 `.c-table`

**Molecules** — M1 `.slide` · M2 `.m-cover` · M3 `.m-list` · M4 `.m-checklist` · M5 `.m-stats` ·
M6 `.m-quote` · M7 `.m-cta` · M8 `.m-statement` · M9 `.m-process` · M10 `.m-compare` ·
M11 `.m-pillars` · M12 `.m-split` · M13 `.m-number` · M14 `.m-profile` · M15 `.m-decide` ·
M16 `.m-mockup`

M1 is the canvas itself: `.slide__head`, `.slide__body`, `.c-foot`. Each molecule maps 1:1
to a stapler `<s-page>`.

## 6 · frond.json

The one addition beyond the ivy pattern: a small generated file listing the vocabulary, so
consumers can read it instead of scraping the CSS or hardcoding class names.

```json
{
  "frond": "1.0.0",
  "atoms":     { "A1": { "class": "c-title", "variants": ["hl-a","hl-b","hl-c","hl-d"] } },
  "molecules": { "M2": { "class": "m-cover" } },
  "grounds":   ["light", "dark", "accent"],
  "textures":  ["none", "dots", "lines", "glow", "mesh"],
  "sizes":     ["portrait-1350", "square", "portrait-1200", "og", "widescreen"],
  "icons":     { "required": { "i-check": ".c-check__i" }, "open": ["c-icon-bullet__i"] }
}
```

It is a description of the CSS, so it changes when the CSS changes and belongs here rather
than downstream. Generated in CI and used to build the gallery and cheat sheet, so the docs
cannot drift from the source. If keeping frond strictly ivy-shaped matters more, this could
move to the packs — at the cost of every pack maintaining its own copy.

## 7 · README outline

Follow ivy's section order so the three repos read the same:

badges → hero screenshot linking to Pages → tagline → principles → **Files** (the layer
table) → **Install** (link order: ivy, lattice, frond, one theme, one size, stapler) →
**Quick start** (one slide, complete) → **What's in core vs frame** → **Canvas** →
**Themes & tokens** (eight-token table, full reference) → **Grounds** → **Components**
(A/M tables) → **Printing** (Chrome → Print, margins None, backgrounds on) → **Examples**
(docs pages) → **Browser support** → **Philosophy** → **Versioning & License** →
**Contributing**

## 8 · Milestones

**M0 · Port**
- [ ] Repo created from the prototype, history preserved
- [ ] `chrome.css` → `frame.css`; settle the two-file vs four-file authoring shape
- [ ] Stale `A1–A15` / `M1–M13` comments corrected
- [ ] `sizes/portrait-1350.css` added so the default canvas is a preset like the others
- [ ] `sizes/widescreen.css` (1920×1080) added now, so it exists before anything needs it
- [ ] Fonts vendored as `.woff2` — the last remaining network dependency

**M1 · Build**
- [ ] CI minify → `dist/`, matching ivy's workflow and license-banner handling
- [ ] `frond.json` generated from the CSS
- [ ] Gallery and cheat sheet generated from `frond.json`

**M2 · Grounds**
- [ ] `.slide--light` / `--dark` / `--accent`, ground/ink remap only, no new colours
- [ ] Ground × texture matrix added to the gallery

**M3 · Docs**
- [ ] GitHub Pages: gallery, cheat sheet, demo, eight archetypes
- [ ] Component reference PDF regenerated and committed
- [ ] README written to the §7 outline
- [ ] Hero screenshot

**M4 · CI check**
- [ ] Headless Chrome renders every docs page and fails on overflow
      (`scrollHeight > clientHeight` on any `.slide` or `.slide__body`) or on text inside
      the safe margin. This is library CI, proving the CSS lays out — not a shipped tool.

**M5 · v1.0.0**
- [ ] Tag, CHANGELOG, Pages live, repo topics set
- [ ] Published to jsDelivr so `<link>` installs need nothing local

## 9 · Non-goals

No runtime JS in output · no network at render time (CDN is fine for authoring; vendored
copies for reproducible renders) · no arbitrary user CSS — the vocabulary is closed by
design · no skills, prompts, or content rules in this repo.

## 10 · Open

1. Two source files or four? Shipping shape is settled; authoring shape is not.
2. Does `frond.json` stay here or move to the packs?
3. Where do images come from at author time? A15 holds a fixed 4:3 slot and M12 keeps its
   column's aspect ratio, so a late swap cannot break a validated layout — but the slot
   still has to be filled by someone.
