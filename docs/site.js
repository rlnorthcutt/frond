// Theme picker for the gallery — swaps the single theme <link> and remembers
// the choice, same pattern as ivy's docs/site.js palette picker.
(function () {
  const THEMES = [
    ['light', 'Light'],
    ['dark', 'Dark'],
    ['press-light', 'Press Light'],
    ['press-dark', 'Press Dark'],
  ];
  const link = document.getElementById('theme-link');
  const picker = document.getElementById('theme-picker');
  if (!link || !picker) return;

  let saved = null;
  try { saved = localStorage.getItem('frond-docs-theme'); } catch (e) {}
  const active = THEMES.some(([id]) => id === saved) ? saved : 'light';

  function apply(id) {
    link.setAttribute('href', 'themes/' + id + '.css');
    for (const btn of picker.querySelectorAll('button')) {
      btn.setAttribute('aria-pressed', String(btn.dataset.theme === id));
    }
    try { localStorage.setItem('frond-docs-theme', id); } catch (e) {}
  }

  for (const [id, label] of THEMES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.dataset.theme = id;
    btn.setAttribute('aria-pressed', String(id === active));
    btn.addEventListener('click', () => apply(id));
    picker.appendChild(btn);
  }
  apply(active);
})();

// Copy-to-clipboard for cheat sheet code blocks.
(function () {
  for (const btn of document.querySelectorAll('.cheat-item__copy')) {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.cheat-item').querySelector('pre');
      const text = pre ? pre.textContent : '';
      const done = () => { btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = 'Copy'; }, 1200); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        done();
      }
    });
  }
})();
