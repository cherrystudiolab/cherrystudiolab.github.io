(() => {
  const root = document.getElementById('shop-products');
  const origin = 'https://cherrystudiolab-shop.fourthwall.com';
  if (!root) return;
  async function load() {
    try {
      const response = await fetch(origin + '/collections/all.json', {signal: AbortSignal.timeout(12000)});
      if (!response.ok) return;
      const data = await response.json();
      if (!Array.isArray(data.products)) return;
      const cards = [];
      for (const product of data.products.slice(0, 4)) {
        const url = new URL(product.url, origin);
        const image = new URL(product.image);
        if (url.origin !== origin || image.protocol !== 'https:') continue;
        const card = document.createElement('a');
        card.className = 'shop-product';
        card.href = url.href; card.target = '_blank'; card.rel = 'noopener noreferrer';
        const img = document.createElement('img');
        img.src = image.href; img.alt = product.title; img.loading = 'lazy';
        const title = document.createElement('span');
        title.textContent = product.title;
        card.append(img, title); cards.push(card);
      }
      if (cards.length) { root.replaceChildren(...cards); root.hidden = false; }
    } catch { /* The permanent Visit Shop link stays available when the feed is offline. */ }
  }
  load();
})();
