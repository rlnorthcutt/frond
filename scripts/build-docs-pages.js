#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { ATOMS, MOLECULES, GROUNDS, TEXTURES, MATRIX_GROUNDS, ICON_SPRITE, esc, inlineCode } = require('./gen-gallery');
const { renderNav } = require('./docs-nav');

const root = path.join(__dirname, '..');
const docs = path.join(root, 'docs');

const HEAD_CSS = `<link rel="stylesheet" href="vendor/ivy.full.min.css">
<link rel="stylesheet" href="vendor/lattice.full.min.css">
<link rel="stylesheet" href="frond.full.css">
<link id="theme-link" rel="stylesheet" href="themes/light.css">`;

function page({ title, description, current, content, extraScripts = '' }) {
  const nav = renderNav({ base: '', current });
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${esc(description)}">
${HEAD_CSS}
${nav.headLink}
</head>
<body>
${nav.header}
${ICON_SPRITE}
<main id="content">
${content}
</main>
<footer class="text-center">
  <p class="muted">Frond &middot; MIT License &middot; <a href="https://github.com/rlnorthcutt/frond" target="_blank" rel="noopener">GitHub &#8599;</a></p>
</footer>
<script src="site.js"></script>
${nav.script}
${extraScripts}
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Gallery — docs/gallery.html
// ---------------------------------------------------------------------------
function atomCard(a) {
  return `<div class="atom-card">
  <div class="atom-card__head">
    <span class="atom-card__id">${a.id}</span><span class="atom-card__title">${a.title}</span>
    <span class="atom-card__cls">.${a.cls.replace(/ \/ /g, ' · .')}</span>
  </div>
  ${a.blurb ? `<p class="atom-card__blurb">${inlineCode(a.blurb)}</p>` : ''}
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
  ${m.blurb ? `<p class="molecule-card__blurb">${inlineCode(m.blurb)}</p>` : ''}
</div>`;
}

function groundCard(g) {
  const cover = MOLECULES.find((m) => m.id === 'M2');
  const s = cover.slide.replace('<section class="slide', `<section class="slide ${g.cls}`);
  return `<div class="ground-card">
  <div class="m-frame"><div class="m-frame__inner">${s}</div></div>
  <div class="molecule-card__head">
    <span class="molecule-card__title">${g.title}</span>
    <span class="molecule-card__cls">.${g.cls}</span>
  </div>
  <p class="molecule-card__blurb">${inlineCode(g.blurb)}</p>
</div>`;
}

function textureCard(t) {
  return `<div class="texture-card">
  <div class="cv-stage" style="position:relative">
    <div class="c-decor c-decor--${t} c-decor--top"></div>
    <p class="c-body" style="position:relative">The quick fox.</p>
  </div>
  <div class="texture-card__label">.c-decor--${t}</div>
</div>`;
}

function matrixCard(groundCls, texture) {
  const decor = texture === 'none' ? '' : `<div class="c-decor c-decor--${texture} c-decor--top"></div>`;
  return `<div class="texture-card">
  <div class="cv-stage ${groundCls}" style="position:relative; min-height:7rem">
    ${decor}
    <p class="c-body" style="position:relative">The quick fox.</p>
  </div>
  <div class="texture-card__label">.${groundCls} &middot; ${texture === 'none' ? 'none' : '.c-decor--' + texture}</div>
</div>`;
}

const galleryContent = `<div class="page-title">
  <h1>Gallery</h1>
  <p class="lede">Every atom and molecule, rendered live from real markup &mdash; switch themes to see the eight-token contract hold.</p>
  <div class="d-flex items-center gap-3" style="flex-wrap:wrap">
    <div class="btn-group" role="group" aria-label="Theme" id="theme-picker"></div>
    <a href="frond.json">frond.json</a>
    <a href="cheatsheet.html">Cheat sheet &rarr;</a>
  </div>
</div>

<div class="shell">
  <nav aria-label="On this page">
    <p class="eyebrow">On this page</p>
    <ul>
      <li><a href="#atoms">Atoms</a></li>
      <li><a href="#molecules">Molecules</a></li>
      <li><a href="#grounds">Grounds</a></li>
      <li><a href="#textures">Textures</a></li>
      <li><a href="#matrix">Ground &times; texture</a></li>
    </ul>
  </nav>

  <div>
  <article>

  <section id="atoms">
    <h2>Atoms</h2>
    <p>Eighteen content primitives. Shown at their default size inside a <code>.cv-stage</code> &mdash; the same box a molecule's <code>.slide__body</code> provides.</p>
    <div class="gallery-grid">
      ${ATOMS.map(atomCard).join('\n      ')}
    </div>
  </section>

  <section id="molecules">
    <h2>Molecules</h2>
    <p>Sixteen full-slide layouts, each the <code>.slide</code> shell (M1) plus one body class. Previews are scaled 1080&times;1350 renders, not screenshots.</p>
    <div class="gallery-grid">
      ${MOLECULES.map(moleculeCard).join('\n      ')}
    </div>
  </section>

  <section id="grounds">
    <h2>Grounds</h2>
    <p>Ground-level modifiers on <code>.slide</code>. <code>.slide--light</code> and <code>.slide--dark</code> swap the <code>--bg</code>/<code>--ink</code> pair (theme-relative, so which one is the visible change depends on the active theme &mdash; try the picker above); <code>.slide--accent</code> re-points atoms onto the accent color explicitly, since <code>--accent</code> can't be safely swapped the same way. None introduces a color outside the eight theme tokens.</p>
    <div class="gallery-grid">
      ${GROUNDS.map(groundCard).join('\n      ')}
    </div>
  </section>

  <section id="textures">
    <h2>Textures</h2>
    <p>A14 <code>.c-decor</code>'s four background textures, plus "none" (the default &mdash; no <code>.c-decor</code> element at all).</p>
    <div class="texture-grid">
      ${TEXTURES.map(textureCard).join('\n      ')}
    </div>
  </section>

  <section id="matrix">
    <h2>Ground &times; texture</h2>
    <p>The closed ground axis (<code>light</code> / <code>dark</code> / <code>accent</code> &mdash; <code>.slide--surface</code> isn't part of it) crossed with all five textures, including none. Fifteen combinations, no color outside the eight tokens in any of them.</p>
    <div class="texture-grid">
      ${MATRIX_GROUNDS.flatMap((g) => ['none', ...TEXTURES].map((t) => matrixCard(g, t))).join('\n      ')}
    </div>
  </section>

  </article>
  </div>
</div>`;

fs.writeFileSync(path.join(docs, 'gallery.html'), page({
  title: 'Gallery — frond',
  description: 'Frond: every atom and molecule, rendered live, with a four-theme switcher.',
  current: 'gallery',
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

const cheatContent = `<div class="page-title">
  <h1>Cheat sheet</h1>
  <p class="lede">Copy-paste markup for every atom and molecule. The full machine-readable index (every class, every variant) is <a href="frond.json">frond.json</a>.</p>
</div>

<section id="atoms">
  <h2>Atoms</h2>
  ${ATOMS.map((a) => cheatItem(a.id, a.cls, a.html, a.variants)).join('\n  ')}
</section>

<section id="molecules">
  <h2>Molecules</h2>
  ${MOLECULES.map(moleculeCheatItem).join('\n  ')}
</section>`;

fs.writeFileSync(path.join(docs, 'cheatsheet.html'), page({
  title: 'Cheat sheet — frond',
  description: 'Copy-paste markup for every frond atom and molecule.',
  current: 'cheatsheet',
  content: cheatContent,
}));

// ---------------------------------------------------------------------------
// Landing page — docs/index.html
// ---------------------------------------------------------------------------
const heroSlide = MOLECULES.find((m) => m.id === 'M2').slide;
const heroSource = heroSlide
  .split('\n')
  .map((line) => '  ' + line)
  .join('\n');

const indexContent = `<section class="hero py-5 grid md-col-2 gap-5 items-center" id="top">
  <div>
    <p class="kicker">v0.2.0 &mdash; MIT License</p>
    <h1>Fixed-canvas sheets,<br>already designed.</h1>
    <p class="lede">Eighteen content atoms and sixteen slide layouts on a 1080&times;1350 canvas, on top of <a href="https://github.com/rlnorthcutt/ivy">ivy</a>, <a href="https://github.com/rlnorthcutt/lattice">lattice</a>, and <a href="https://github.com/rlnorthcutt/stapler">stapler</a>. A closed vocabulary, not a framework &mdash; the whole library is these thirty-four components.</p>
    <div class="btn-group">
      <a role="button" data-variant="primary" href="#install">Get started</a>
      <a role="button" data-variant="outline" href="gallery.html">See the gallery</a>
    </div>
  </div>

  <div>
    <div class="d-flex items-center justify-between gap-3 mb-2" style="flex-wrap:wrap">
      <p class="eyebrow" style="margin:0">One molecule, real markup</p>
      <div class="btn-group" role="group" aria-label="Show preview or source">
        <button id="btn-preview" type="button" data-size="sm" data-variant="primary" aria-pressed="true">Preview</button>
        <button id="btn-source" type="button" data-size="sm" data-variant="ghost" aria-pressed="false">Source</button>
      </div>
    </div>

    <div class="box" style="padding:0">
      <div id="hero-preview" class="m-frame" style="border-radius:var(--radius)">
        <div class="m-frame__inner">${heroSlide}</div>
      </div>
      <pre id="hero-source" hidden style="margin:0"><code>${esc(heroSource)}</code></pre>
    </div>
  </div>
</section>

<div class="shell">
  <nav aria-label="On this page">
    <p class="eyebrow">On this page</p>
    <ul>
      <li><a href="#why">Why frond</a></li>
      <li><a href="#layers">Two layers</a></li>
      <li><a href="#install">Installation</a></li>
      <li><a href="#quickstart">Quick start</a></li>
      <li><a href="#canvas">Canvas &amp; sizes</a></li>
      <li><a href="#tokens">Themes &amp; tokens</a></li>
      <li><a href="#components">Components</a></li>
      <li><a href="#printing">Printing</a></li>
      <li><a href="#support">Browser support</a></li>
      <li><a href="#files">Files &amp; builds</a></li>
    </ul>
  </nav>

  <div>
  <article>

  <section id="why">
    <h2>Why frond</h2>
    <p>Most LinkedIn-carousel CSS is either a framework's worth of options, or one project's hand-rolled slides copy-pasted into the next. Frond is neither: a closed vocabulary &mdash; eighteen atoms, sixteen molecules &mdash; on a fixed pixel canvas, so a slide that looks right on screen looks identical in the printed PDF. Nothing here reasons about your content; frond describes what a component <em>is</em>, not how to use it well.</p>
    <div class="grid col-1 sm-col-2 gap-3">
      <div class="callout" data-tone="info">
        <strong>Fixed canvas</strong>
        <p>Every sheet is a known size in px. No responsive layout, no surprises between screen and print.</p>
      </div>
      <div class="callout" data-tone="info">
        <strong>Closed vocabulary</strong>
        <p>Eighteen atoms, sixteen molecules. Nothing else &mdash; that's the whole library, by design.</p>
      </div>
      <div class="callout" data-tone="info">
        <strong>Eight-token theming</strong>
        <p>A theme sets eight custom properties and nothing else. Four reference themes ship; write your own.</p>
      </div>
      <div class="callout" data-tone="info">
        <strong>Built on ivy + lattice</strong>
        <p>Frond only builds what they don't: canvas, atoms, molecules, page furniture.</p>
      </div>
    </div>
  </section>

  <section id="layers">
    <h2>Two layers</h2>
    <p>Frond ships in two files, same split as ivy's core/extra.</p>
    <div class="grid col-1 sm-col-2 gap-3">
      <div class="card">
        <header><h3>Core &mdash; <code>frond.css</code></h3></header>
        <p>Canvas, tokens, print setup, the eighteen atoms, the sixteen molecules.</p>
        <footer><a href="gallery.html">Browse the gallery &rarr;</a></footer>
      </div>
      <div class="card">
        <header><h3>Frame &mdash; <code>frond.frame.css</code></h3></header>
        <p>Page furniture &mdash; footer, page number, logo, swipe, divider, progress. A single-image sheet needs none of it, so it's genuinely optional.</p>
        <footer><a href="cheatsheet.html">Browse the cheat sheet &rarr;</a></footer>
      </div>
    </div>
  </section>

  <section id="install">
    <h2>Installation</h2>
    <p><strong>CDN, for authoring</strong> &mdash; no download, no build step. jsDelivr serves straight from the repo, but a final render still needs Option 2 below; see <a href="#printing">Printing</a>.</p>
    <pre><code>&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rlnorthcutt/ivy/dist/ivy.full.min.css"&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rlnorthcutt/lattice/dist/lattice.full.min.css"&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rlnorthcutt/frond/dist/frond.full.min.css"&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rlnorthcutt/frond/themes/light.css"&gt;
&lt;script src="https://cdn.jsdelivr.net/gh/rlnorthcutt/stapler/dist/stapler.min.js"&gt;&lt;/script&gt;</code></pre>
    <p><strong>Vendored, for rendering</strong> &mdash; load order matters: ivy/lattice before frond, <code>frond.css</code> before <code>frond.frame.css</code>, theme and size last. No network dependencies in the render pipeline.</p>
    <pre><code>&lt;link rel="stylesheet" href="vendor/ivy.full.min.css"&gt;
&lt;link rel="stylesheet" href="vendor/lattice.full.min.css"&gt;
&lt;link rel="stylesheet" href="frond.css"&gt;
&lt;link rel="stylesheet" href="frond.frame.css"&gt;
&lt;link rel="stylesheet" href="themes/light.css"&gt;
&lt;script src="vendor/stapler.min.js"&gt;&lt;/script&gt;</code></pre>
    <p>Or the pre-combined bundle instead of the two frond files:</p>
    <pre><code>&lt;link rel="stylesheet" href="dist/frond.full.min.css"&gt;</code></pre>
  </section>

  <section id="quickstart">
    <h2>Quick start</h2>
    <pre><code>&lt;stapled-doc mode="explicit" page-width="1080px" page-height="1350px" page-gap="40px"&gt;
  &lt;s-page&gt;
    &lt;s-page-body&gt;
      &lt;section class="slide"&gt;
        &lt;header class="slide__head"&gt;&lt;span class="c-badge"&gt;Playbook&lt;/span&gt;&lt;/header&gt;
        &lt;div class="slide__body m-statement"&gt;
          &lt;h2 class="c-title c-title--xl"&gt;One idea per slide.&lt;/h2&gt;
        &lt;/div&gt;
      &lt;/section&gt;
    &lt;/s-page-body&gt;
  &lt;/s-page&gt;
&lt;/stapled-doc&gt;</code></pre>
  </section>

  <section id="canvas">
    <h2>Canvas &amp; sizes</h2>
    <p>One token pair drives every fixed size; <code>@page</code> can't read custom properties, so it's the one place a raw value is unavoidable.</p>
    <pre><code>:root { --cv-w: 1080px; --cv-h: 1350px; }
@page { size: 1080px 1350px; margin: 0; }</code></pre>
    <p>Four presets in <code>sizes/</code> set the canvas pair, the <code>@page</code> rule, and the type sizes that move on a different sheet &mdash; load one after <code>frond.css</code>.</p>
    <table>
      <thead><tr><th>File</th><th>Canvas</th></tr></thead>
      <tbody>
        <tr><td><code>sizes/portrait-1350.css</code></td><td>1080&times;1350 (default)</td></tr>
        <tr><td><code>sizes/square.css</code></td><td>1080&times;1080</td></tr>
        <tr><td><code>sizes/portrait-1200.css</code></td><td>1200&times;1500</td></tr>
        <tr><td><code>sizes/widescreen.css</code></td><td>1920&times;1080</td></tr>
      </tbody>
    </table>
  </section>

  <section id="tokens">
    <h2>Themes &amp; tokens</h2>
    <p>A theme sets exactly these eight tokens and nothing else. <strong>Themes are reference implementations, not a palette library</strong> &mdash; copy one and change the eight values; no component CSS is touched.</p>
    <table>
      <thead><tr><th>Token</th><th>Role</th></tr></thead>
      <tbody>
        <tr><td><code>--bg</code></td><td>Sheet ground</td></tr>
        <tr><td><code>--surface</code></td><td>Card / box fill</td></tr>
        <tr><td><code>--ink</code></td><td>Primary text</td></tr>
        <tr><td><code>--ink-muted</code></td><td>Secondary text</td></tr>
        <tr><td><code>--accent</code></td><td>Brand spot &mdash; highlights, badges, numerals</td></tr>
        <tr><td><code>--accent-ink</code></td><td>Text on accent</td></tr>
        <tr><td><code>--font-display</code></td><td>Headlines</td></tr>
        <tr><td><code>--font-body</code></td><td>Body copy</td></tr>
      </tbody>
    </table>
    <p>Four themes ship: <code>light</code> / <code>dark</code> (cyan spot), <code>press-light</code> / <code>press-dark</code> (magenta, proving the contract holds on a palette that isn't cyan). See every one on the <a href="gallery.html">gallery</a>'s theme switcher.</p>
  </section>

  <section id="components">
    <h2>Components</h2>
    <p>Eighteen atoms, sixteen molecules, frozen. The full A1&ndash;A18 / M1&ndash;M16 index, rendered live with a theme switcher, is on the <a href="gallery.html">gallery</a>. Copy-paste markup for every one of them is on the <a href="cheatsheet.html">cheat sheet</a>. A machine-readable index is <a href="frond.json">frond.json</a>.</p>
    <p>See it assembled into real carousels: a <a href="demo.html">ten-slide demo</a> exercising one of each molecule, and <a href="archetypes/how-to.html">eight archetypes</a> &mdash; complete carousels, all on one subject, so the layouts can be compared without the copy getting in the way.</p>
  </section>

  <section id="printing">
    <h2>Printing</h2>
    <p>Open a page in Chrome &rarr; Print &rarr; Save as PDF, with margins <strong>None</strong> and background graphics <strong>on</strong>. <code>@page { size: 1080px 1350px }</code> (or your chosen preset) does the rest.</p>
  </section>

  <section id="support">
    <h2>Browser support</h2>
    <p>Modern evergreen browsers &mdash; the same feature tier as ivy/lattice: <code>color-mix()</code>, <code>@layer</code>, <code>:focus-visible</code>. No JavaScript required beyond <a href="https://github.com/rlnorthcutt/stapler">stapler</a> itself, which builds the pagination and drives print.</p>
  </section>

  <section id="files">
    <h2>Files &amp; builds</h2>
    <p>CI minifies and bundles <code>src/</code> into <code>dist/</code> on every push to <code>main</code>.</p>
    <table>
      <thead><tr><th>File</th><th>Contents</th></tr></thead>
      <tbody>
        <tr><td><code>dist/frond.min.css</code></td><td>Core only</td></tr>
        <tr><td><code>dist/frond.frame.min.css</code></td><td>Frame only (requires core)</td></tr>
        <tr><td><code>dist/frond.full.css</code></td><td>Core + Frame (unminified)</td></tr>
        <tr><td><code>dist/frond.full.min.css</code></td><td>Core + Frame combined</td></tr>
      </tbody>
    </table>
  </section>

  </article>
  </div>
</div>`;

const indexExtraScripts = `<script>
  // Hero preview/source toggle
  const btnPreview = document.getElementById('btn-preview');
  const btnSource = document.getElementById('btn-source');
  const heroPreview = document.getElementById('hero-preview');
  const heroSource = document.getElementById('hero-source');
  function showPane(pane) {
    const isPreview = pane === 'preview';
    heroPreview.hidden = !isPreview;
    heroSource.hidden = isPreview;
    btnPreview.setAttribute('aria-pressed', String(isPreview));
    btnPreview.setAttribute('data-variant', isPreview ? 'primary' : 'ghost');
    btnSource.setAttribute('aria-pressed', String(!isPreview));
    btnSource.setAttribute('data-variant', !isPreview ? 'primary' : 'ghost');
  }
  btnPreview.addEventListener('click', () => showPane('preview'));
  btnSource.addEventListener('click', () => showPane('source'));
</script>`;

fs.writeFileSync(path.join(docs, 'index.html'), page({
  title: 'Frond — a CSS library for fixed-canvas carousel sheets',
  description: 'Frond: eighteen content atoms and sixteen slide layouts on a 1080x1350 canvas, built on ivy, lattice, and stapler.',
  current: 'index',
  content: indexContent,
  extraScripts: indexExtraScripts,
}));

console.log('Wrote docs/index.html, docs/gallery.html, and docs/cheatsheet.html');
