#!/usr/bin/env node
/* One-time pass: inject the shared docs/site.css link + nav bar into
 * demo.html and the ported archetype pages. Idempotent — running it again
 * on an already-navved file is a no-op (guarded by the docs-nav marker).
 */
const fs = require('fs');
const path = require('path');
const { renderNav, ARCHETYPES } = require('./docs-nav');

const root = path.join(__dirname, '..');
const docs = path.join(root, 'docs');

function inject(filePath, navHtml) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('docs-nav')) return; // already injected
  const [linkLine, ...navLines] = navHtml.split('\n');
  html = html.replace('</head>', linkLine + '\n</head>');
  html = html.replace('<body>', '<body>\n' + navLines.join('\n'));
  fs.writeFileSync(filePath, html);
}

// demo.html — root of docs/, full archetype list one dir down
inject(path.join(docs, 'demo.html'), renderNav({
  base: '',
  current: 'demo',
  archetypeBase: 'archetypes/',
}));

// archetypes/*.html — one level down, full sibling list in the same dir
for (const [file] of ARCHETYPES) {
  inject(path.join(docs, 'archetypes', file), renderNav({
    base: '../',
    current: file,
    archetypeBase: '',
  }));
}

console.log('Injected docs nav into demo.html and archetypes/*.html');
