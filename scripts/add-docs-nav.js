#!/usr/bin/env node
/* One-time pass: inject the shared docs/site.css link + nav bar into
 * demo.html and the ported archetype pages. Idempotent — running it again
 * on an already-navved file is a no-op (guarded by the docs-nav marker).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const docs = path.join(root, 'docs');

const archetypes = [
  ['how-to.html', 'How-to'],
  ['listicle.html', 'Listicle'],
  ['checklist.html', 'Checklist'],
  ['myth-vs-fact.html', 'Myth vs fact'],
  ['before-after.html', 'Before/after'],
  ['data-story.html', 'Data story'],
  ['problem-solution.html', 'Problem/solution'],
  ['case-study.html', 'Case study'],
];

function nav({ cssHref, indexHref, cheatsheetHref, demoHref, current, archetypeBase }) {
  const archetypeLinks = archetypeBase === null
    ? ''
    : `<span class="docs-nav__archetypes">` +
      archetypes.map(([file, label]) => {
        const href = archetypeBase + file;
        const isCurrent = current === file;
        return `<a href="${href}"${isCurrent ? ' aria-current="page"' : ''}>${label}</a>`;
      }).join('') +
      `</span>`;

  return `<link rel="stylesheet" href="${cssHref}">\n` +
`<nav class="docs-nav" aria-label="Docs">
  <a class="docs-nav__brand" href="${indexHref}">frond</a>
  <a href="${indexHref}"${current === 'index' ? ' aria-current="page"' : ''}>Gallery</a>
  <a href="${cheatsheetHref}"${current === 'cheatsheet' ? ' aria-current="page"' : ''}>Cheat sheet</a>
  <a href="${demoHref}"${current === 'demo' ? ' aria-current="page"' : ''}>Demo</a>
  <span class="docs-nav__sep">·</span>
  ${archetypeLinks}
</nav>\n`;
}

function inject(filePath, navHtml) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('docs-nav')) return; // already injected
  html = html.replace('</head>', navHtml.split('\n')[0] + '\n</head>');
  const navBody = navHtml.split('\n').slice(1).join('\n');
  html = html.replace('<body>', '<body>\n' + navBody);
  fs.writeFileSync(filePath, html);
}

// demo.html — root of docs/
inject(path.join(docs, 'demo.html'), nav({
  cssHref: 'site.css',
  indexHref: 'index.html',
  cheatsheetHref: 'cheatsheet.html',
  demoHref: 'demo.html',
  current: 'demo',
  archetypeBase: 'archetypes/',
}));

// archetypes/*.html — one level down
for (const [file] of archetypes) {
  inject(path.join(docs, 'archetypes', file), nav({
    cssHref: '../site.css',
    indexHref: '../index.html',
    cheatsheetHref: '../cheatsheet.html',
    demoHref: '../demo.html',
    current: file,
    archetypeBase: '',
  }));
}

console.log('Injected docs nav into demo.html and archetypes/*.html');
