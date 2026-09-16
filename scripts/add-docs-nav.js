#!/usr/bin/env node
/* One-time-per-template pass: inject the shared docs/site.css link + nav bar
 * + dark-mode-toggle into demo.html and the ported archetype pages. Must be
 * run immediately after scripts/port-docs-templates.js, which overwrites
 * those files from scratch and knows nothing about the nav.
 *
 * Idempotent by replacement, not by skipping: every injected block is
 * wrapped in an HTML comment marker, so re-running this after a docs-nav.js
 * change updates the markup in place instead of leaving stale content.
 */
const fs = require('fs');
const path = require('path');
const { renderNav, ARCHETYPES } = require('./docs-nav');

const root = path.join(__dirname, '..');
const docs = path.join(root, 'docs');

function replaceOrInsert(html, marker, block, anchor, position) {
  const start = `<!-- docs-nav:${marker} -->`;
  const end = `<!-- /docs-nav:${marker} -->`;
  const wrapped = `${start}\n${block}\n${end}`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (re.test(html)) return html.replace(re, wrapped);
  return position === 'after'
    ? html.replace(anchor, anchor + '\n' + wrapped)
    : html.replace(anchor, wrapped + '\n' + anchor);
}

function inject(filePath, nav) {
  let html = fs.readFileSync(filePath, 'utf8');
  html = replaceOrInsert(html, 'head', nav.headLink, '</head>', 'before');
  html = replaceOrInsert(html, 'bar', nav.navBar, '<body>', 'after');
  html = replaceOrInsert(html, 'script', nav.script, '</body>', 'before');
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
