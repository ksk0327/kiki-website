/**
 * KIKI Coffee — 在庫表示モジュール
 */
(function () {
  const SERVER = window.KIKI_INVENTORY_URL || 'http://localhost:3001';
  const PRODUCT_MAP = {
    'ethiopia':   'ETH-001',
    'colombia':   'COL-001',
    'blend':      'BLD-001',
    'giftbox':    'GIFT-001',
  };
  function createBadge(available) {
    const badge = document.createElement('span');
    badge.className = 'kiki-stock-badge';
    if (available <= 0) { badge.textContent = '品切れ'; badge.classList.add('badge--out'); }
    else if (available <= 3) { badge.textContent = `残り ${available} 個`; badge.classList.add('badge--low'); }
    else { badge.textContent = '在庫あり'; badge.classList.add('badge--in'); }
    return badge;
  }
  function applyStockState(el, available) {
    el.querySelectorAll('[data-buy-btn]').forEach(btn => {
      if (available <= 0) { btn.textContent = '現在品切れ中'; btn.style.pointerEvents = 'none'; btn.style.opacity = '0.4'; btn.removeAttribute('href'); }
    });
    const priceEl = el.querySelector('[data-price]');
    if (priceEl) priceEl.insertAdjacentElement('afterend', createBadge(available));
  }
  async function loadInventory() {
    let inventory;
    try {
      const res = await fetch(`${SERVER}/api/inventory`);
      if (!res.ok) throw new Error('fetch failed');
      inventory = (await res.json()).inventory;
    } catch (e) {
      console.warn('KIKI: 在庫サーバーに接続できません。');
      return;
    }
    document.querySelectorAll('[data-product-key]').forEach(el => {
      const productId = PRODUCT_MAP[el.dataset.productKey];
      if (!productId) return;
      const info = inventory.find(p => p.productId === productId);
      if (info) applyStockState(el, info.available);
    });
  }
  const style = document.createElement('style');
  style.textContent = `.kiki-stock-badge{display:inline-block;font-family:'Inter',sans-serif;font-size:9px;letter-spacing:.2em;text-transform:uppercase;padding:3px 10px;border-radius:12px;margin-bottom:16px;}.badge--in{background:rgba(100,180,80,.15);color:#7ecf6a;border:1px solid rgba(100,180,80,.3);}.badge--low{background:rgba(220,140,30,.15);color:#e8a83c;border:1px solid rgba(220,140,30,.3);}.badge--out{background:rgba(200,60,60,.12);color:#e07070;border:1px solid rgba(200,60,60,.25);}`;
  document.head.appendChild(style);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadInventory);
  else loadInventory();
})();