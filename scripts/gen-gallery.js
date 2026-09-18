#!/usr/bin/env node
/* Generates docs/index.html (gallery) and docs/cheatsheet.html (copy-paste
 * markup) from one shared data set, so the two pages — and the markup they
 * show — can never drift apart. Run after scripts/sync-docs.js.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const docs = path.join(root, 'docs');

const ICON_SPRITE = `<svg width="0" height="0" aria-hidden="true" style="position:absolute">
  <symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></symbol>
  <symbol id="i-cross" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></symbol>
</svg>`;

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Blurb text uses markdown-style `code` spans; render those as <code>.
function inlineCode(s) {
  return s.replace(/`([^`]+)`/g, '<code>$1</code>');
}

// ---------------------------------------------------------------------------
// Atoms — A1–A19
// ---------------------------------------------------------------------------
const ATOMS = [
  {
    id: 'A1', cls: 'c-title', title: 'Title',
    blurb: 'Headline voice. `mark` inside a title picks up the default highlight.',
    variants: '.c-title--cover (52px) · .c-title--xl (80px, statement weight) · .c-title--sm (38px)',
    html: `<h2 class="c-title">Reach is rented. A <mark class="c-hl--underline">save</mark> is owned.</h2>`,
  },
  {
    id: 'A2', cls: 'c-sub / c-body / c-caption', title: 'Subtitle / body / caption',
    blurb: 'Three text weights, one family — sub for the cover dek, body for slide copy, caption for fine print.',
    variants: '.c-body--muted',
    html: `<p class="c-sub">Nine slides on the difference between a post people scroll past and one they keep.</p>
<p class="c-body">Every answer is the next token, chosen from a distribution over the vocabulary.</p>
<p class="c-body c-body--muted">Impressions expire in a day. A saved carousel gets reopened for months.</p>
<p class="c-caption">Fig. 1 — the eight tokens a theme sets.</p>`,
  },
  {
    id: 'A3', cls: 'c-badge', title: 'Badge / kicker',
    blurb: 'The small label at the top of a slide head.',
    variants: '.c-badge--outline · .c-badge--ghost · .c-badge--num',
    html: `<span class="c-badge">Playbook</span>
<span class="c-badge c-badge--outline">Numbers</span>
<span class="c-badge c-badge--ghost">The premise</span>
<span class="c-badge c-badge--num">01</span>`,
  },
  {
    id: 'A4', cls: 'c-stat', title: 'StatBox',
    blurb: 'A big number with a label underneath.',
    variants: '.c-stat--ink (ink color instead of accent) · .c-stat--sm · .c-stat--boxed',
    html: `<div class="c-stat">
  <span class="c-stat__value">278%</span>
  <span class="c-stat__label">more engagement than a plain video post</span>
</div>`,
  },
  {
    id: 'A5', cls: 'c-check', title: 'CheckItem',
    blurb: 'Icon column + text, baseline aligned. Lives inside .m-checklist.',
    variants: '.c-check--dot / .c-check--dash (icon-free fallback, no SVG needed)',
    html: `<ul class="m-checklist">
  <li class="c-check c-check--yes"><span class="c-check__i"><svg><use href="#i-check"/></svg></span><span>Cover headline reads in under two seconds</span></li>
  <li class="c-check c-check--no"><span class="c-check__i"><svg><use href="#i-cross"/></svg></span><span>More than four bullets anywhere</span></li>
</ul>`,
  },
  {
    id: 'A6', cls: 'c-num', title: 'NumberedItem',
    blurb: 'Lives inside .m-list.',
    variants: '.c-num--circle · .c-num--ring · .c-num--ghost (watermark numeral behind the text)',
    html: `<ol class="m-list">
  <li class="c-num"><span class="c-num__n">01</span><span class="c-num__text">A cover that promises something, not just names the topic.</span></li>
  <li class="c-num c-num--circle"><span class="c-num__n">02</span><span class="c-num__text">Circle variant — quieter emphasis.</span></li>
</ol>`,
  },
  {
    id: 'A7', cls: 'c-cta', title: 'CTABox',
    blurb: 'The ask, on the accent ground.',
    variants: '.c-cta--outline · .c-cta--plain (no box, just color)',
    html: `<div class="c-cta">
  <p class="c-cta__title">Save slide 5</p>
  <p class="c-cta__action">@rlnorthcutt · frond on GitHub</p>
</div>`,
  },
  {
    id: 'A8', cls: 'c-quote', title: 'QuoteMark / PullQuote',
    blurb: 'A giant translucent quote glyph behind the text.',
    variants: '.c-quote--bar · .c-quote--plain',
    html: `<blockquote class="c-quote">
  <span class="c-quote__mark" aria-hidden="true">&ldquo;</span>
  <p>Design is the art of deciding what to leave out, one thousand times.</p>
  <footer><span class="c-avatar c-avatar--ring">RN</span><span>Ron Northcutt &middot; Product</span></footer>
</blockquote>`,
  },
  {
    id: 'A9', cls: 'c-icon-bullet', title: 'IconBullet',
    blurb: 'A list where the icon carries the meaning, not a numeral.',
    variants: '',
    html: `<ul class="m-list">
  <li class="c-icon-bullet"><span class="c-icon-bullet__i"><svg><use href="#i-check"/></svg></span><span>Fixed canvas — no responsive surprises</span></li>
  <li class="c-icon-bullet"><span class="c-icon-bullet__i"><svg><use href="#i-arrow"/></svg></span><span>Closed vocabulary — nineteen atoms, sixteen molecules</span></li>
</ul>`,
  },
  {
    id: 'A10', cls: 'c-avatar', title: 'Avatar',
    blurb: 'Initials-only circle used in the footer and on quote/profile slides.',
    variants: '.c-avatar--lg · .c-avatar--ring',
    html: `<span class="c-avatar">RN</span>
<span class="c-avatar c-avatar--lg c-avatar--ring">RN</span>`,
  },
  {
    id: 'A11', cls: 'c-hl', title: 'Highlight',
    blurb: 'The highlight mechanism inside a title or body — also works as a bare `mark`.',
    variants: '.c-hl--underline · .c-hl--box · .c-hl--italic',
    html: `<p class="c-body">A <mark class="c-hl--underline">save</mark> is owned. A <mark class="c-hl--box">reach</mark> is rented.</p>`,
  },
  {
    id: 'A12', cls: 'c-bignum', title: 'BigNumeral',
    blurb: 'One digit, as large as the canvas allows. Powers .m-number.',
    variants: '.c-bignum--ghost',
    html: `<span class="c-bignum">1</span>`,
  },
  {
    id: 'A13', cls: 'c-step', title: 'ProcessStep',
    blurb: 'Lives inside .m-process.',
    variants: '.c-step--h (horizontal, for column layouts)',
    html: `<ol class="m-process">
  <li class="c-step"><span class="c-step__n">1</span><span class="c-step__text">Write the last slide first — the ask sets the argument.</span></li>
  <li class="c-step"><span class="c-step__n">2</span><span class="c-step__text">Write the cover second, as a promise you can keep.</span></li>
</ol>`,
  },
  {
    id: 'A14', cls: 'c-decor', title: 'Decoration',
    blurb: 'Sits behind content (cv-stage/.slide are position:relative already). Clip to a band with --top / --bottom / --right.',
    variants: '.c-decor--dots · .c-decor--lines · .c-decor--glow · .c-decor--mesh',
    html: `<div class="c-decor c-decor--dots c-decor--top"></div>
<p class="c-body">Decoration sits behind content, clipped to a band.</p>`,
  },
  {
    id: 'A15', cls: 'c-img', title: 'ImageFrame',
    blurb: 'Fixed aspect ratios so a swapped image never breaks the layout.',
    variants: '.c-img--rounded · .c-img--framed · .c-img--bleed (escapes slide padding) · .c-img--43 / --11 / --169',
    html: `<figure class="c-img c-img--framed c-img--43">
  <img src="placeholder.svg" alt="">
  <figcaption>Fig. 2 — a framed 4:3 slot.</figcaption>
</figure>`,
  },
  {
    id: 'A16', cls: 'c-device / c-code', title: 'DeviceMockup',
    blurb: 'Browser, phone, or code frame.',
    variants: '.c-device--code · .c-device--phone · .c-device--flush',
    html: `<div class="c-device c-device--code">
  <div class="c-device__bar"><span class="c-device__dot"></span><span class="c-device__dot"></span><span class="c-device__dot"></span><span class="c-device__url">prompt.txt</span></div>
  <pre class="c-code"><code>You are a careful editor.
Return exactly three bullets.</code></pre>
</div>`,
  },
  {
    id: 'A17', cls: 'c-repo', title: 'RepoCard',
    blurb: 'A project listing — the one legitimate boxed item outside .c-stat--boxed.',
    variants: '',
    html: `<div class="c-repo">
  <p class="c-repo__name"><span class="c-repo__owner">rlnorthcutt/</span>frond</p>
  <p class="c-repo__desc">A CSS component library for fixed-canvas sheets, on ivy, lattice and stapler.</p>
  <div class="c-repo__meta"><span><i class="c-repo__lang"></i>CSS</span><span>MIT</span></div>
</div>`,
  },
  {
    id: 'A18', cls: 'c-decide', title: 'DecisionGrid',
    blurb: 'If / then rows. Lives inside .m-decide.',
    variants: '',
    html: `<dl class="c-decide">
  <div class="c-decide__row"><dt class="c-decide__if">You need current facts</dt><span class="c-decide__arrow">&rarr;</span><dd class="c-decide__then">Give it sources</dd></div>
  <div class="c-decide__row"><dt class="c-decide__if">You need one exact format</dt><span class="c-decide__arrow">&rarr;</span><dd class="c-decide__then">Show one example</dd></div>
</dl>`,
  },
  {
    id: 'A19', cls: 'c-table', title: 'DataTable',
    blurb: 'A real HTML table — rows by N columns, native column sizing. For genuinely tabular content `.c-decide` is too narrow (two columns) for.',
    variants: '',
    html: `<table class="c-table">
  <thead><tr><th>Layer</th><th>Owns</th><th>Ships as</th></tr></thead>
  <tbody>
    <tr><td>ivy</td><td>Classless defaults</td><td>ivy.full.min.css</td></tr>
    <tr><td>lattice</td><td>Grid utilities</td><td>lattice.full.min.css</td></tr>
    <tr><td>frond</td><td>Slides &amp; canvas</td><td>frond.full.min.css</td></tr>
  </tbody>
</table>`,
  },
];

// ---------------------------------------------------------------------------
// Molecules — M1–M16, each a full slide
// ---------------------------------------------------------------------------
const FOOT = `<footer class="c-foot"><div class="c-foot__author"><span class="c-foot__handle">@rlnorthcutt</span></div><span class="c-pagenum">3 / 8</span></footer>`;
const COVER_FOOT = `<footer class="c-foot"><div class="c-foot__author"><span class="c-avatar">RN</span><span class="c-foot__id"><span class="c-foot__name">Ron Northcutt</span><span class="c-foot__handle">@rlnorthcutt</span></span></div><span class="c-swipe"><span class="c-swipe__arrow"><svg width="22" height="22"><use href="#i-arrow"/></svg></span>Swipe</span></footer>`;

function slide({ id, cls = '', badge, bodyCls, bodyHtml, foot = FOOT, label }) {
  return `<section class="slide${cls ? ' ' + cls : ''}" data-screen-label="${label}">
  <header class="slide__head"><span class="c-badge${badge.mod || ''}">${badge.text}</span></header>
  <div class="slide__body${bodyCls ? ' ' + bodyCls : ''}">
    ${bodyHtml}
  </div>
  ${foot}
</section>`;
}

const MOLECULES = [
  {
    id: 'M1', cls: 'slide', title: 'Slide (the canvas shell)',
    blurb: '.slide__head, .slide__body, .c-foot — every molecule below sits inside this shell. Maps 1:1 to a stapler <s-page>.',
    slide: slide({ badge: { text: 'Shell' }, bodyHtml: `<h2 class="c-title">Every molecule is this shell plus one body class.</h2>`, label: '01 Shell' }),
  },
  {
    id: 'M2', cls: 'm-cover', title: 'CoverSlide',
    blurb: '',
    slide: slide({ badge: { text: 'Playbook' }, bodyCls: 'm-cover', bodyHtml: `<h1 class="c-title c-title--cover">Nobody saves your carousel. <mark class="c-hl--box">Here is why.</mark></h1>
    <hr class="c-divider">
    <p class="c-sub">Nine slides on the difference between a post people scroll past and one they keep.</p>`, foot: COVER_FOOT, label: '01 Cover' }),
  },
  {
    id: 'M3', cls: 'm-list', title: 'ListSlide',
    blurb: 'Body class is optional — .m-list styles the &lt;ol&gt;/&lt;ul&gt; directly.',
    slide: slide({ badge: { text: 'Four failures' }, bodyHtml: `<h2 class="c-title">Where carousels lose the reader</h2>
    <ol class="m-list">
      <li class="c-num"><span class="c-num__n">01</span><span class="c-num__text">A cover that describes the topic instead of promising something.</span></li>
      <li class="c-num"><span class="c-num__n">02</span><span class="c-num__text">Two ideas fighting on one slide, so neither lands.</span></li>
      <li class="c-num"><span class="c-num__n">03</span><span class="c-num__text">Body type below 26px — unreadable in the feed.</span></li>
    </ol>`, label: '04 List' }),
  },
  {
    id: 'M4', cls: 'm-checklist', title: 'ChecklistSlide',
    blurb: '',
    slide: slide({ badge: { text: 'Audit', mod: ' c-badge--outline' }, bodyHtml: `<h2 class="c-title">Run this before you publish</h2>
    <ul class="m-checklist">
      <li class="c-check c-check--yes"><span class="c-check__i"><svg><use href="#i-check"/></svg></span><span>Cover headline reads in under two seconds</span></li>
      <li class="c-check c-check--yes"><span class="c-check__i"><svg><use href="#i-check"/></svg></span><span>One idea per slide, no exceptions</span></li>
      <li class="c-check c-check--no"><span class="c-check__i"><svg><use href="#i-cross"/></svg></span><span>More than four bullets anywhere</span></li>
    </ul>`, label: '05 Checklist' }),
  },
  {
    id: 'M5', cls: 'm-stats', title: 'StatsSlide',
    blurb: 'Modifiers: .m-stats--1/2/3/4 (column count) · .m-stats--rows (stacked rows instead).',
    slide: slide({ badge: { text: 'Numbers', mod: ' c-badge--outline' }, bodyHtml: `<h2 class="c-title">What the format actually buys you</h2>
    <div class="m-stats m-stats--3">
      <div class="c-stat"><span class="c-stat__value">278%</span><span class="c-stat__label">more engagement than a plain video post</span></div>
      <div class="c-stat c-stat--ink"><span class="c-stat__value">8.1s</span><span class="c-stat__label">median dwell time per slide sequence</span></div>
      <div class="c-stat c-stat--ink"><span class="c-stat__value">3&times;</span><span class="c-stat__label">save rate versus a single image</span></div>
    </div>`, label: '03 Stats' }),
  },
  {
    id: 'M6', cls: 'm-quote', title: 'QuoteSlide',
    blurb: '',
    slide: slide({ badge: { text: 'Breather', mod: ' c-badge--ghost' }, bodyCls: 'm-quote', bodyHtml: `<blockquote class="c-quote">
      <span class="c-quote__mark" aria-hidden="true">&ldquo;</span>
      <p>Design is the art of deciding what to leave out, one thousand times.</p>
      <footer><span class="c-avatar c-avatar--ring">RN</span><span>Ron Northcutt &middot; Product</span></footer>
    </blockquote>`, label: '09 Quote' }),
  },
  {
    id: 'M7', cls: 'm-cta', title: 'CTASlide',
    blurb: 'Usually paired with .slide--accent.',
    slide: slide({ cls: 'slide--accent', badge: { text: 'One ask' }, bodyCls: 'm-cta', bodyHtml: `<h2 class="c-title c-title--cover">Keep the checklist. <mark>Not the post.</mark></h2>
    <div class="c-cta"><p class="c-cta__title">Save slide 5</p><p class="c-cta__action">@rlnorthcutt &middot; frond on GitHub</p></div>`, foot: COVER_FOOT, label: '10 CTA' }),
  },
  {
    id: 'M8', cls: 'm-statement', title: 'StatementSlide',
    blurb: 'Modifier: .m-statement--center.',
    slide: slide({ badge: { text: 'The premise', mod: ' c-badge--ghost' }, bodyCls: 'm-statement', bodyHtml: `<h2 class="c-title c-title--xl">Reach is rented. A <mark class="c-hl--underline">save</mark> is owned.</h2>
    <p class="c-body c-body--muted">Impressions expire in a day. A saved carousel gets reopened for months.</p>`, label: '02 Statement' }),
  },
  {
    id: 'M9', cls: 'm-process', title: 'ProcessSlide',
    blurb: 'Modifier: .m-process--h (horizontal, for column layouts).',
    slide: slide({ badge: { text: 'Method' }, bodyHtml: `<h2 class="c-title">Four passes, in order</h2>
    <ol class="m-process">
      <li class="c-step"><span class="c-step__n">1</span><span class="c-step__text">Write the last slide first — the ask sets the argument.</span></li>
      <li class="c-step"><span class="c-step__n">2</span><span class="c-step__text">Write the cover second, as a promise you can keep.</span></li>
      <li class="c-step"><span class="c-step__n">3</span><span class="c-step__text">Fill the middle with one idea per sheet.</span></li>
    </ol>`, label: '06 Process' }),
  },
  {
    id: 'M10', cls: 'm-compare', title: 'CompareSlide',
    blurb: 'Modifiers: .m-compare--vs (two columns + "vs") · .m-compare--boxed.',
    slide: slide({ badge: { text: 'Before / after', mod: ' c-badge--outline' }, bodyHtml: `<h2 class="c-title">Same content, two covers</h2>
    <div class="m-compare m-compare--vs">
      <div class="m-compare__col m-compare__col--muted"><span class="c-badge c-badge--outline">Before</span><p class="c-body">&ldquo;A guide to LinkedIn carousels&rdquo;</p></div>
      <span class="m-compare__vs">vs</span>
      <div class="m-compare__col"><span class="c-badge">After</span><p class="c-body">&ldquo;Nobody saves your carousel. Here is why.&rdquo;</p></div>
    </div>`, label: '07 Comparison' }),
  },
  {
    id: 'M11', cls: 'm-pillars', title: 'PillarsSlide',
    blurb: 'Modifiers: .m-pillars--2/3/4 · .m-pillars--bento (first card spans full width).',
    slide: slide({ badge: { text: 'Framework' }, bodyHtml: `<h2 class="c-title">Three things a saved slide has</h2>
    <div class="m-pillars m-pillars--3">
      <article class="m-pillar"><span class="m-pillar__i">&#10022;</span><h3 class="m-pillar__title">A number</h3><p class="m-pillar__desc">Something specific enough to quote in a meeting.</p></article>
      <article class="m-pillar"><span class="m-pillar__i">&#9670;</span><h3 class="m-pillar__title">A rule</h3><p class="m-pillar__desc">A line the reader can apply tomorrow without you.</p></article>
      <article class="m-pillar"><span class="m-pillar__i">&#9679;</span><h3 class="m-pillar__title">A checklist</h3><p class="m-pillar__desc">The reason people screenshot slides in the first place.</p></article>
    </div>`, label: '08 Pillars' }),
  },
  {
    id: 'M12', cls: 'm-split', title: 'SplitSlide',
    blurb: 'Modifiers: .m-split--flip (media left) · .m-split--wide-text / --wide-img · .m-split--overlay (full-bleed image, text on a gradient). For a stacked list (e.g. quotes) instead of one image, add `.m-split__media--list` to the media column, not the root — 3 short items max, it\'s a fixed sheet.',
    slide: slide({ badge: { text: 'Two-up' }, bodyCls: 'm-split', bodyHtml: `<div class="m-split__text">
      <h2 class="c-title">Text one side, visual the other.</h2>
      <p class="c-body c-body--muted">.m-split__media keeps its own aspect ratio, so a late image swap never reflows the text.</p>
    </div>
    <div class="m-split__media"><img src="placeholder.svg" alt=""></div>`, label: '12 Split' }),
  },
  {
    id: 'M13', cls: 'm-number', title: 'NumberSlide',
    blurb: 'One giant digit. Modifier: .m-number--ghost.',
    slide: slide({ badge: { text: 'Data story' }, bodyHtml: `<span class="c-bignum">1</span>
    <h2 class="c-title c-title--sm">idea per slide — the whole rule.</h2>`, label: '13 Number' }),
  },
  {
    id: 'M14', cls: 'm-profile', title: 'ProfileSlide',
    blurb: '',
    slide: slide({ badge: { text: 'Who fixed it', mod: ' c-badge--outline' }, bodyCls: 'm-profile', bodyHtml: `<div class="m-profile__id">
      <span class="c-avatar c-avatar--lg c-avatar--ring">RN</span>
      <span><span class="m-profile__name">Ron Northcutt</span><br><span class="m-profile__role">Product &middot; open source tooling</span></span>
    </div>
    <p class="m-profile__bio">Fifteen years shipping developer tools. Currently building small CSS libraries that do one thing.</p>`, label: '14 Profile' }),
  },
  {
    id: 'M15', cls: 'm-decide', title: 'DecideSlide',
    blurb: 'Layout wrapper for the .c-decide atom.',
    slide: slide({ badge: { text: 'Cheat sheet' }, bodyCls: 'm-decide', bodyHtml: `<h2 class="c-title c-title--sm">Which move, when</h2>
    <dl class="c-decide">
      <div class="c-decide__row"><dt class="c-decide__if">You need current facts</dt><span class="c-decide__arrow">&rarr;</span><dd class="c-decide__then">Give it sources</dd></div>
      <div class="c-decide__row"><dt class="c-decide__if">You need one exact format</dt><span class="c-decide__arrow">&rarr;</span><dd class="c-decide__then">Show one example</dd></div>
    </dl>`, label: '15 Decide' }),
  },
  {
    id: 'M16', cls: 'm-mockup', title: 'MockupSlide',
    blurb: 'A device frame as the visual.',
    slide: slide({ badge: { text: 'Before / after', mod: ' c-badge--outline' }, bodyCls: 'm-mockup', bodyHtml: `<div class="c-device c-device--code">
      <div class="c-device__bar"><span class="c-device__dot"></span><span class="c-device__dot"></span><span class="c-device__dot"></span><span class="c-device__url">prompt.txt</span></div>
      <pre class="c-code"><code>You are a careful editor.
Return exactly three bullets.</code></pre>
    </div>`, label: '16 Mockup' }),
  },
];

const GROUNDS = [
  { cls: 'slide--light', title: 'Light ground', blurb: 'Swaps to a light ground regardless of the active theme. Under a light theme this is the unmodified default — switch the picker above to Dark or Press Dark to see it actually invert.' },
  { cls: 'slide--dark', title: 'Dark ground', blurb: 'Swaps to a dark ground regardless of the active theme. Under a dark theme this is the unmodified default — switch the picker above to Light or Press Light to see it actually invert.' },
  { cls: 'slide--accent', title: 'Accent ground', blurb: 'Inverts onto the accent color — used for the CTA. Re-points atoms explicitly rather than remapping --accent.' },
  { cls: 'slide--surface', title: 'Surface ground', blurb: 'Sits the slide on the card surface instead of the page background. Not part of the closed light/dark/accent axis — an extra.' },
];

const TEXTURES = ['dots', 'lines', 'glow', 'mesh'];
const MATRIX_GROUNDS = ['slide--light', 'slide--dark', 'slide--accent'];

module.exports = { ATOMS, MOLECULES, GROUNDS, TEXTURES, MATRIX_GROUNDS, ICON_SPRITE, esc, inlineCode };
