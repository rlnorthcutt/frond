#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ATOMS, MOLECULES, GROUNDS, ICON_SPRITE, esc } = require('./gen-gallery');

const root = path.join(__dirname, '..');
const docs = path.join(root, 'docs');

const NAV = `<link rel="stylesheet" href="site.css">
<nav class="docs-nav" aria-label="Docs">
  <a class="docs-nav__brand" href="index.html">frond</a>
  <a href="index.html" id="nav-gallery">Gallery</a>
  <a href="cheatsheet.html" id="nav-cheatsheet">Cheat sheet</a>
  <a href="demo.html">Demo</a>
  <a href="archetypes/how-to.html">Archetypes</a>
  <span class="docs-nav__sep">·</span>
  <a href="https://github.com/rlnorthcutt/frond">GitHub</a>
</nav>`;

const HEAD_CSS = `<link rel="stylesheet" href="vendor/ivy.full.min.css">
<link rel="stylesheet" href="vendor/lattice.full.min.css">
<link rel="stylesheet" href="frond.full.css">
<link id="theme-link" rel="stylesheet" href="themes/light.css">`;

function page({ title, description, bodyClass, extraHead = '', content, extraScripts = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
${HEAD_CSS}
${NAV}
${extraHead}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${ICON_SPRITE}
${content}
<script src="site.js"></script>
${extraScripts}
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Gallery — docs/index.html
// ---------------------------------------------------------------------------
function atomCard(a) {
  return `<div class="atom-card">
  <div class="atom-card__head">
    <span class="atom-card__id">${a.id}</span><span class="atom-card__title">${a.title}</span>
    <span class="atom-card__cls">.${a.cls.replace(/ \/ /g, ' · .')}</span>
  </div>
  ${a.blurb ? `<p class="atom-card__blurb">${a.blurb}</p>` : ''}
  <div class="atom-card__stage"><div class="cv-stage">${a.html}</div></div>
</div>`;
}

function moleculeCard(m) {
  return `<div class="molecule-card">
  <div class="m-frame"><div class="m-frame__inner">${m.slide}</div></div>
  <div class="molecule-card__head">
    <span class="molecule-card__id">${m.id}</span><span class="molecule-card__title">${m.title}</span>
    <span class="molecule-card__cls">.${m.cls}</span>
  </div>
  ${m.blurb ? `<p class="molecule-card__blurb">${m.blurb}</p>` : ''}
</div>`;
}

function groundCard(g) {
  const s = MOLECULES[1].slide.replace('<section class="slide', `<section class="slide ${g.cls}`);
  return `<div class="ground-card">
  <div class="m-frame"><div class="m-frame__inner">${s}</div></div>
  <div class="molecule-card__head">
    <span class="molecule-card__title">${g.title}</span>
    <span class="molecule-card__cls">.${g.cls}</span>
  </div>
  <p class="molecule-card__blurb">${g.blurb}</p>
</div>`;
}

const TEXTURES = ['dots', 'lines', 'glow', 'mesh'];
function textureCard(t) {
  return `<div class="texture-card">
  <div class="cv-stage" style="position:relative">
    <div class="c-decor c-decor--${t} c-decor--top"></div>
    <p class="c-body" style="position:relative">The quick fox.</p>
  </div>
  <div class="texture-card__label">.c-decor--${t}</div>
</div>`;
}

const galleryContent = `<main class="docs-main">
  <div class="docs-hero">
    <h1>Frond</h1>
    <p>Eighteen content atoms and sixteen slide layouts on a fixed 1080&times;1350 canvas, on top of ivy, lattice, and stapler. Every component below is real markup, rendered live — switch themes to see the eight-token contract hold.</p>
    <div class="docs-hero__meta">
      <span class="theme-picker" id="theme-picker"></span>
      <a href="../frond.json">frond.json</a>
      <a href="../README.md">README</a>
      <a href="cheatsheet.html">Cheat sheet &rarr;</a>
    </div>
  </div>

  <section class="docs-section" id="atoms">
    <h2>Atoms</h2>
    <p class="docs-section__lede">Eighteen content primitives. Shown at their default size inside a .cv-stage — the same box a molecule's .slide__body provides.</p>
    <div class="gallery-grid">
      ${ATOMS.map(atomCard).join('\n      ')}
    </div>
  </section>

  <section class="docs-section" id="molecules">
    <h2>Molecules</h2>
    <p class="docs-section__lede">Sixteen full-slide layouts, each the .slide shell (M1) plus one body class. Previews are scaled 1080&times;1350 renders, not screenshots.</p>
    <div class="gallery-grid">
      ${MOLECULES.map(moleculeCard).join('\n      ')}
    </div>
  </section>

  <section class="docs-section" id="grounds">
    <h2>Grounds</h2>
    <p class="docs-section__lede">Ground-level modifiers on .slide. Neither introduces a color outside the eight theme tokens. .slide--light / .slide--dark are planned — see TODO.md.</p>
    <div class="gallery-grid">
      ${GROUNDS.map(groundCard).join('\n      ')}
    </div>
  </section>

  <section class="docs-section" id="textures">
    <h2>Textures</h2>
    <p class="docs-section__lede">A14 .c-decor's four background textures, plus "none" (the default — no .c-decor element at all).</p>
    <div class="texture-grid">
      ${TEXTURES.map(textureCard).join('\n      ')}
    </div>
  </section>
</main>`;

fs.writeFileSync(path.join(docs, 'index.html'), page({
  title: 'Frond — a CSS library for fixed-canvas carousel sheets',
  description: 'Frond: eighteen content atoms and sixteen slide layouts on a 1080x1350 canvas, built on ivy, lattice, and stapler.',
  content: galleryContent,
}));

// ---------------------------------------------------------------------------
// Cheat sheet — docs/cheatsheet.html
// ---------------------------------------------------------------------------
function cheatItem(id, cls, html, variants) {
  return `<div class="cheat-item">
  <div class="cheat-item__head"><span class="atom-card__id">${id}</span><strong>.${cls.replace(/ \/ /g, ' · .')}</strong></div>
  ${variants ? `<div class="cheat-item__variants">Modifiers: ${esc(variants)}</div>` : ''}
  <button type="button" class="cheat-item__copy">Copy</button>
  <pre><code>${esc(html)}</code></pre>
</div>`;
}

function moleculeCheatItem(m) {
  return cheatItem(m.id, m.cls, m.slide, '');
}

const cheatContent = `<main class="docs-main">
  <div class="docs-hero">
    <h1>Cheat sheet</h1>
    <p>Copy-paste markup for every atom and molecule. The full machine-readable index (every class, every variant) is <a href="../frond.json">frond.json</a>.</p>
  </div>

  <section class="docs-section cheat-section" id="atoms">
    <h2>Atoms</h2>
    ${ATOMS.map((a) => cheatItem(a.id, a.cls, a.html, a.variants)).join('\n    ')}
  </section>

  <section class="docs-section cheat-section" id="molecules">
    <h2>Molecules</h2>
    ${MOLECULES.map(moleculeCheatItem).join('\n    ')}
  </section>
</main>`;

fs.writeFileSync(path.join(docs, 'cheatsheet.html'), page({
  title: 'Cheat sheet — frond',
  description: 'Copy-paste markup for every frond atom and molecule.',
  content: cheatContent,
}));

console.log('Wrote docs/index.html and docs/cheatsheet.html');
