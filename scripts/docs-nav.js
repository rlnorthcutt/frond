#!/usr/bin/env node
/* Single source of truth for the docs/ header + (on archetype pages) the
 * archetypes sub-nav — shared by scripts/build-docs-pages.js (gallery,
 * cheatsheet) and scripts/add-docs-nav.js (demo, archetypes/*). Markup
 * mirrors ivy's/lattice's own docs header exactly (same classes: .container,
 * d-flex/items-center/justify-between/gap-3 from lattice, classless <nav><ul>
 * from ivy) rather than a bespoke frond-only header, and the archetypes
 * sub-nav mirrors ivy's docs/example-*.html .subnav pattern.
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

const GITHUB_ICON = `<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.07-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"></path></svg>`;

// Three stacked, offset rounded sheets — frond's mark: fixed-canvas slides.
const FROND_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" style="color:var(--color-primary); flex:none"><rect x="3" y="7" width="14" height="14" rx="2"></rect><path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"></path></svg>`;

/* base: '' for pages in docs/ itself (index, gallery, cheatsheet, demo);
 *       '../' for pages one level down (archetypes/*.html).
 * current: 'index' | 'gallery' | 'cheatsheet' | 'demo' | 'archetypes'
 *
 * Returns { headLink, header, subnav, script }. header/subnav belong right
 * after <body>; subnav is '' except on archetype pages.
 */
function renderNav({ base, current, archetypeFile }) {
  const navLink = (href, label, key) =>
    `<li><a href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a></li>`;

  const headLink = `<link rel="stylesheet" href="${base}site.css">`;

  const header = `<header role="banner">
  <div class="container d-flex items-center justify-between gap-3">
    <a href="${base}index.html" style="display:flex; align-items:center; gap:.5rem; text-decoration:none; color:var(--color-text); font-weight:600; letter-spacing:-.01em">
      ${FROND_ICON}
      <span>Frond</span>
    </a>
    <nav aria-label="Primary">
      <ul>
        ${navLink(base + 'gallery.html', 'Gallery', 'gallery')}
        ${navLink(base + 'cheatsheet.html', 'Cheat sheet', 'cheatsheet')}
        ${navLink(base + 'demo.html', 'Demo', 'demo')}
        ${navLink(base + 'archetypes/how-to.html', 'Archetypes', 'archetypes')}
        <li><a href="https://github.com/rlnorthcutt/frond" target="_blank" rel="noopener" aria-label="Frond on GitHub" title="Frond on GitHub" style="display:inline-flex; align-items:center">${GITHUB_ICON}</a></li>
        <li><dark-mode-toggle></dark-mode-toggle></li>
      </ul>
    </nav>
  </div>
</header>`;

  const subnav = current === 'archetypes' ? `<nav class="subnav" aria-label="Archetypes">
  <ul>
    ${ARCHETYPES.map(([file, label]) =>
      `<li><a href="${file}"${archetypeFile === file ? ' aria-current="page"' : ''}>${label}</a></li>`
    ).join('\n    ')}
  </ul>
</nav>` : '';

  const script = `<script type="module" src="${base}dark-mode-toggle.min.js"></script>`;

  return { headLink, header, subnav, script };
}

module.exports = { renderNav, ARCHETYPES };
