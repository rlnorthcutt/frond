#!/usr/bin/env node
/* GitHub Pages serves docs/ only, so every asset a docs page loads has to
 * live inside docs/ — this copies frond's own build output (the CSS,
 * frond.json, themes, sizes) in. Run after scripts/build.js.
 *
 * docs/vendor/{ivy,lattice,stapler} and docs/dark-mode-toggle.min.js are
 * NOT copied here — those are external companion libraries, fetched fresh
 * from their own repos by .github/workflows/doc-assets.yml (same pattern as
 * lattice's docs/ivy.full.min.css). frond's own root vendor/ stays a
 * separate, deliberately pinned snapshot used by the shipped library itself
 * (PLAN.md: "no network at render time" for the actual product) — the two
 * are unrelated copies with different freshness goals.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

copy(path.join(root, 'dist', 'frond.full.css'), path.join(root, 'docs', 'frond.full.css'));
copy(path.join(root, 'frond.json'), path.join(root, 'docs', 'frond.json'));

for (const dir of ['themes', 'sizes']) {
  const files = fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith('.css'));
  for (const f of files) {
    copy(path.join(root, dir, f), path.join(root, 'docs', dir, f));
  }
}

console.log('Synced frond.full.css, frond.json, themes/, and sizes/ into docs/');
