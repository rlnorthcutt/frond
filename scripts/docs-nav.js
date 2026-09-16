#!/usr/bin/env node
/* Single source of truth for the docs/ nav bar — shared by
 * scripts/build-docs-pages.js (index.html, cheatsheet.html) and
 * scripts/add-docs-nav.js (demo.html, archetypes/*.html), so the markup and
 * the aria-current logic can't drift between the two the way they did once
 * already (see CHANGELOG).
 */

const ARCHETYPES = [
  ['how-to.html', 'How-to'],
  ['listicle.html', 'Listicle'],
  ['checklist.html', 'Checklist'],
  ['myth-vs-fact.html', 'Myth vs fact'],
  ['before-after.html', 'Before/after'],
  ['data-story.html', 'Data story'],
  ['problem-solution.html', 'Problem/solution'],
  ['case-study.html', 'Case study'],
];

/* base: '' for pages that live in docs/ itself (index, cheatsheet, demo);
 *       '../' for pages one level down (archetypes/*.html).
 * current: which top-level link (or, for an archetype page, which archetype
 *       filename) is the current page — gets aria-current="page".
 * archetypeBase: null           -> a single "Archetypes" link (index, cheatsheet)
 *                'archetypes/'  -> the full sibling list, one dir down (demo.html)
 *                ''             -> the full sibling list, same dir (archetype pages)
 */
function renderNav({ base, current, archetypeBase }) {
  const link = (href, label, key) =>
    `<a href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`;

  const archetypesHtml = archetypeBase === null
    ? link(base + 'archetypes/how-to.html', 'Archetypes', 'archetypes')
    : `<span class="docs-nav__archetypes">` +
      ARCHETYPES.map(([file, label]) => link(archetypeBase + file, label, file)).join('') +
      `</span>`;

  return `<link rel="stylesheet" href="${base}site.css">
<nav class="docs-nav" aria-label="Docs">
  <a class="docs-nav__brand" href="${base}index.html">frond</a>
  ${link(base + 'index.html', 'Gallery', 'index')}
  ${link(base + 'cheatsheet.html', 'Cheat sheet', 'cheatsheet')}
  ${link(base + 'demo.html', 'Demo', 'demo')}
  <span class="docs-nav__sep">&middot;</span>
  ${archetypesHtml}
</nav>`;
}

module.exports = { renderNav, ARCHETYPES };
