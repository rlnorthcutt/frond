#!/usr/bin/env node
/* GitHub Pages serves docs/ only, so every asset a docs page loads has to
 * live inside docs/ — this copies the built CSS, themes, sizes, and vendor
 * libs in. Same reasoning as ivy's "copy minified full to docs" CI step.
 * Run after scripts/build.js.
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

for (const f of ['ivy.full.min.css', 'lattice.full.min.css', 'stapler.min.js']) {
  copy(path.join(root, 'vendor', f), path.join(root, 'docs', 'vendor', f));
}

console.log('Synced frond.full.css, frond.json, themes/, sizes/, and vendor/ into docs/');
