(() => {
  'use strict';
  const hosts = {instagram: 'instagram.com', patreon: 'patreon.com'};
  function postLink(value, provider) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password &&
        (url.hostname === hosts[provider] || url.hostname.endsWith('.' + hosts[provider])) ? url.href : null;
    } catch { return null; }
  }
  async function render(provider) {
    const root = document.getElementById(provider + '-feed');
    try {
      const response = await fetch(provider + '.json', {cache: 'no-cache'});
      if (!response.ok) return;
      const data = await response.json();
      if (!Array.isArray(data.posts) || !data.posts.length) return;
      const grid = document.createElement('div');
      grid.className = 'post-grid';
      for (const post of data.posts.slice(0, 4)) {
        const href = postLink(post.url, provider);
        if (!href) continue;
        const link = document.createElement('a');
        link.className = 'post-preview'; link.href = href;
        link.target = '_blank'; link.rel = 'noopener noreferrer';
        if (typeof post.image === 'string' && /^assets\/feeds\/(instagram|patreon)\/[a-f0-9]{24}\.(jpg|png|webp)$/.test(post.image)) {
          const img = document.createElement('img');
          img.src = post.image; img.alt = ''; img.loading = 'lazy';
          img.addEventListener('error', () => img.remove(), {once: true});
          link.append(img);
        }
        const title = document.createElement('span');
        title.textContent = post.title || provider; link.append(title);
        const date = new Date(post.published_at);
        if (!Number.isNaN(date.valueOf())) {
          const time = document.createElement('time');
          time.dateTime = date.toISOString();
          time.textContent = date.toISOString().slice(0, 10); link.append(time);
        }
        grid.append(link);
      }
      if (grid.childElementCount) root.replaceChildren(grid);
    } catch { /* The static visit card stays visible when fetching fails. */ }
  }
  render('instagram'); render('patreon');
})();
