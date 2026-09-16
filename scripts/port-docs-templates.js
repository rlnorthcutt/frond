#!/usr/bin/env node
/* One-time port of the mockups/ prototype templates into docs/. Not part of
 * the regular build — run once, by hand, when pulling a new template out of
 * mockups/. Rewrites the four-file css/ links down to the single synced
 * docs/frond.full.css, and re-bases mockups/ ("../vendor", "../css") onto
 * docs/'s own layout.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const templates = path.join(root, 'mockups', 'templates');

const CSS_LINKS_RE = /<link rel="stylesheet" href="\.\.\/css\/base\.css">\n<link rel="stylesheet" href="\.\.\/css\/atoms\.css">\n<link rel="stylesheet" href="\.\.\/css\/molecules\.css">\n<link rel="stylesheet" href="\.\.\/css\/chrome\.css">/;

function rewrite(html, sourceFile) {
  if (!CSS_LINKS_RE.test(html)) {
    throw new Error(
      `${sourceFile}: the four-file css/ <link> block didn't match the expected shape — ` +
      `refusing to write a page whose CSS paths weren't actually rewritten. ` +
      `Update CSS_LINKS_RE in scripts/port-docs-templates.js to match the current mockups/ markup.`
    );
  }
  return html
    .replace(CSS_LINKS_RE, '<link rel="stylesheet" href="../frond.full.css">')
    .replace(/\.\.\/css\/themes\//g, '../themes/')
    .replace(/carousel-lib/g, 'frond');
}

// Archetypes: one directory deeper than mockups/templates/ was under mockups/,
// so the existing "../vendor" / "../css" (now "../themes") paths already
// point at the right place relative to docs/archetypes/.
const archetypeFiles = [
  'how-to.html', 'listicle.html', 'checklist.html', 'myth-vs-fact.html',
  'before-after.html', 'data-story.html', 'problem-solution.html', 'case-study.html',
];

const archetypeDir = path.join(root, 'docs', 'archetypes');
fs.mkdirSync(archetypeDir, { recursive: true });

for (const file of archetypeFiles) {
  const html = fs.readFileSync(path.join(templates, file), 'utf8');
  fs.writeFileSync(path.join(archetypeDir, file), rewrite(html, file));
}

// Demo: lives directly in docs/, one level shallower than templates/ was —
// strip the leading "../" from every asset path.
let demo = fs.readFileSync(path.join(templates, 'demo-carousel.html'), 'utf8');
demo = rewrite(demo, 'demo-carousel.html').replace(/(href|src)="\.\.\//g, '$1="');
fs.writeFileSync(path.join(root, 'docs', 'demo.html'), demo);

console.log(`Ported ${archetypeFiles.length} archetypes + demo.html into docs/`);
