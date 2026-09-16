#!/usr/bin/env node
/* Concatenates src/ into the two shipped, non-minified root bundles:
 *   src/base.css + src/atoms.css + src/molecules.css  -> frond.css
 *   src/frame.css                                     -> frond.frame.css
 * Minification into dist/ is a separate CI step (clean-css-cli), not this
 * script — this just fixes the authoring/shipping split described in
 * PLAN.md §2.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'src');

function read(name) {
  return fs.readFileSync(path.join(src, name), 'utf8');
}

const core = [read('base.css'), read('atoms.css'), read('molecules.css')].join('\n');
const frame = read('frame.css');

fs.writeFileSync(path.join(root, 'frond.css'), core);
fs.writeFileSync(path.join(root, 'frond.frame.css'), frame);

// Non-minified full bundle — CI also builds this into dist/, but a local
// unminified copy is what docs/ syncs from (see scripts/sync-docs.js) so
// the docs site doesn't depend on clean-css-cli being installed locally.
const distDir = path.join(root, 'dist');
fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'frond.full.css'), core + '\n' + frame);

console.log('Built frond.css, frond.frame.css, and dist/frond.full.css from src/');
