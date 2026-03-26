/* ============================================================
   ACE_COLLECTION — script.js
   Premium Boutique Interactive Engine
   ============================================================ */

'use strict';

/* =========================================================
   0. PRODUCT DATABASE
   Images are mapped into categories with descriptive names.
   Prices assigned realistically in GH₵.
   ========================================================= */
/* =========================================================
   0. PRODUCT DATABASE
   Fetched dynamically from the backend API.
   ========================================================= */
let PRODUCTS = [];

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch('https://ace-collection.onrender.com/api/products');
    if (!response.ok) throw new Error('API down');
    PRODUCTS = await response.json();
    PRODUCTS = PRODUCTS.map(p => ({...p, id: p._id || p.id})); 
    renderProducts();
    initFeaturedCarousel();
    updateCartUI();
    console.log('Products fetched from backend successfully');
  } catch (error) {
    console.error('Error fetching products. Ensure backend is running.', error);
    showToast('Failed to load products', 'error');
  }
}


/* =========================================================
   1. STATE
   ========================================================= */
let cart = JSON.parse(localStorage.getItem('ace_cart') || '[]');
let currentFilter = 'all';
let currentPage = 'home';
let quickviewProduct = null;

/* =========================================================
   2. PRELOADER
   ========================================================= */
window.addEventListener('load', () => {
  setTimeout(() => {
    const pl = document.getElementById('preloader');
    pl.classList.add('hidden');
    initScrollReveal();
    initParticles('particleCanvas');
  }, 1800);
});

/* =========================================================
   3. CUSTOM CURSOR (desktop only)
   ========================================================= */
(function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.body.classList.add('desktop-cursor');
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let rx = 0, ry = 0, mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animateCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll('a,button,.product-card,.filter-btn,.carousel-dot,.social-link').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = '14px'; dot.style.height = '14px';
      ring.style.width = '54px'; ring.style.height = '54px';
      ring.style.borderColor = 'rgba(212,168,67,0.9)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = '8px'; dot.style.height = '8px';
      ring.style.width = '36px'; ring.style.height = '36px';
      ring.style.borderColor = 'rgba(212,168,67,0.6)';
    });
  });
})();

/* =========================================================
   4. NAVBAR SCROLL / PAGE NAVIGATION
   ========================================================= */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });
  currentPage = pageId;
  if (pageId === 'shop') {
    initParticles('shopCanvas');
    renderProducts();
  }
  closeMenu();
}

// Nav links
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(el.dataset.page);
  });
});

// Filter nav from footer
document.querySelectorAll('[data-filter-nav]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    navigateTo('shop');
    setTimeout(() => applyFilter(el.dataset.filterNav), 100);
  });
});

// Hero buttons
document.getElementById('heroShopBtn')?.addEventListener('click', () => navigateTo('shop'));
document.getElementById('heroExploreBtn')?.addEventListener('click', () => navigateTo('shop'));
document.getElementById('ctaShopBtn')?.addEventListener('click', () => navigateTo('shop'));
document.getElementById('cartShopBtn')?.addEventListener('click', () => { closeCart(); navigateTo('shop'); });

/* =========================================================
   5. HAMBURGER MENU
   ========================================================= */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.classList.toggle('menu-open');
});
function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
}

/* =========================================================
   6. PARTICLE ENGINE (Canvas)
   ========================================================= */
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || canvas._initialized) return;
  canvas._initialized = true;
  const ctx = canvas.getContext('2d');

  let W, H, particles, animId;
  const GOLD = '212,168,67';
  const PURPLE = '124,92,252';

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 2.2 + 0.3;
      this.speed = Math.random() * 0.6 + 0.2;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = -(this.speed);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() < 0.6 ? GOLD : PURPLE;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      const t = this.life / this.maxLife;
      this.alpha = t < 0.1 ? t * 5 : t > 0.8 ? (1 - t) * 5 : 1;
      this.alpha *= 0.55;
      if (this.life >= this.maxLife || this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  // Lines between close particles
  function drawConnections() {
    const MAX_DIST = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const a = (1 - d / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${GOLD},${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  function init() {
    resize();
    const count = Math.min(Math.floor(W * H / 6000), 120);
    particles = Array.from({ length: count }, () => new Particle());
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  const ro = new ResizeObserver(() => { resize(); particles.forEach(p => p.reset(true)); });
  ro.observe(canvas.parentElement || canvas);
  init();
}

/* =========================================================
   7. SCROLL REVEAL
   ========================================================= */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings
        const siblings = Array.from(entry.target.parentElement?.querySelectorAll('.reveal-up, .reveal-left, .reveal-right') || []);
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

/* =========================================================
   8. FEATURED CAROUSEL
   ========================================================= */
function initFeaturedCarousel() {
  const featured = PRODUCTS.filter((_, i) => i < 8 || (i >= 54 && i < 60));
  const container = document.getElementById('featuredCarousel');
  const dotsEl = document.getElementById('featDots');
  if (!container) return;

  // Clear existing
  container.innerHTML = '';
  if (dotsEl) dotsEl.innerHTML = '';

  featured.slice(0, 8).forEach(p => {
    container.appendChild(createProductCard(p, true));
  });

  // Dots
  const total = featured.slice(0, 8).length;
  const visible = 3;
  const pages = total - visible + 1;
  for (let i = 0; i < pages; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsEl.appendChild(dot);
  }

  let current = 0;
  function goToSlide(idx) {
    current = idx;
    const cards = container.querySelectorAll('.product-card');
    const cardW = cards[0]?.offsetWidth + 24 || 304;
    container.scrollTo({ left: idx * cardW, behavior: 'smooth' });
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  document.getElementById('featPrev')?.addEventListener('click', () => {
    goToSlide(Math.max(0, current - 1));
  });
  document.getElementById('featNext')?.addEventListener('click', () => {
    goToSlide(Math.min(pages - 1, current + 1));
  });

  // Sync dots on scroll
  container.addEventListener('scroll', () => {
    const cards = container.querySelectorAll('.product-card');
    const cardW = cards[0]?.offsetWidth + 24 || 304;
    const scrollIdx = Math.round(container.scrollLeft / cardW);
    current = Math.min(pages - 1, Math.max(0, scrollIdx));
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }, { passive: true });

  // Auto play
  let autoPlay = setInterval(() => goToSlide(current + 1 >= pages ? 0 : current + 1), 5000);
  container.addEventListener('touchstart', () => clearInterval(autoPlay));
  container.addEventListener('mouseenter', () => clearInterval(autoPlay));
  container.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => goToSlide(current + 1 >= pages ? 0 : current + 1), 5000);
  });
}

/* =========================================================
   9. PRODUCTS RENDER & FILTER
   ========================================================= */
function createProductCard(product, forCarousel = false) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.category = product.category;
  card.dataset.id = product.id;

  const imgSrc = product.img;
  card.innerHTML = `
    <div class="product-img-wrap">
      <img src="${imgSrc}" alt="${product.name}" loading="lazy" onerror="this.style.display='none'"/>
      <div class="product-overlay">
        <button class="product-quick-view" data-id="${product.id}">Quick View</button>
      </div>
      <span class="product-category-badge">${product.category}</span>
    </div>
    <div class="product-info">
      <div class="product-name" title="${product.name}">${product.name}</div>
      <div class="product-price-row">
        <span class="product-price">GH₵ ${product.price}</span>
        <button class="add-to-cart-btn" data-id="${product.id}" aria-label="Add to cart">+</button>
      </div>
    </div>
  `;

  card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(product.id);
    const btn = card.querySelector('.add-to-cart-btn');
    btn.textContent = '✓';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = '+'; btn.classList.remove('added'); }, 1200);
  });

  card.querySelector('.product-quick-view')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openQuickview(product.id);
  });

  return card;
}

function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  const countEl = document.getElementById('productCount');
  if (!grid) return;

  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => (p.category || '').toLowerCase().trim() === filter.toLowerCase().trim());
  console.log(`Filtering by [${filter}] | Found: ${filtered.length} products`, filtered);
  countEl.textContent = filtered.length;

  // Animate out existing cards
  Array.from(grid.children).forEach(c => {
    c.classList.add('hiding');
    setTimeout(() => c.remove(), 300);
  });

  setTimeout(() => {
    filtered.forEach((p, i) => {
      const card = createProductCard(p);
      card.style.animationDelay = `${Math.min(i * 30, 400)}ms`;
      card.classList.add('showing');
      grid.appendChild(card);
    });
    initScrollReveal();
  }, 350);
}

function applyFilter(cat) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === cat));
  renderProducts(cat);
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
});

/* =========================================================
   10. CART SYSTEM
   ========================================================= */
function saveCart() {
  localStorage.setItem('ace_cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(`${product.name} added to bag`, 'cart');
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) { removeFromCart(productId); return; }
  saveCart();
  updateCartUI();
  renderCartItems();
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const p = PRODUCTS.find(p => p.id === item.id);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  const countEl = document.getElementById('cartCount');
  countEl.textContent = total;
  countEl.classList.toggle('show', total > 0);
  document.getElementById('cartItemCount').textContent = `(${total})`;
  const totalFormatted = `GH₵ ${getCartTotal().toLocaleString()}`;
  if (document.getElementById('cartTotal')) document.getElementById('cartTotal').textContent = totalFormatted;
  const footer = document.getElementById('cartFooter');
  const empty = document.getElementById('cartEmpty');
  if (footer && empty) {
    footer.style.display = cart.length ? 'block' : 'none';
    empty.style.display = cart.length ? 'none' : 'flex';
  }
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  // Remove existing items (keep empty state)
  container.querySelectorAll('.cart-item').forEach(el => el.remove());

  cart.forEach(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (!p) return;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img class="cart-item-img" src="${p.img}" alt="${p.name}" onerror="this.style.opacity='0.3'"/>
      <div class="cart-item-details">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-price">GH₵ ${p.price}</div>
        <div class="cart-item-controls">
          <button class="qty-btn qty-minus" data-id="${p.id}">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn qty-plus" data-id="${p.id}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${p.id}" aria-label="Remove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></button>
    `;
    el.querySelector('.qty-minus').addEventListener('click', () => updateQty(p.id, -1));
    el.querySelector('.qty-plus').addEventListener('click', () => updateQty(p.id, 1));
    el.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(p.id));
    container.appendChild(el);
  });
}

// Cart open / close
function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('show');
  document.body.classList.add('modal-open');
  renderCartItems();
}
function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('show');
  document.body.classList.remove('modal-open');
}

document.getElementById('cartBtn')?.addEventListener('click', openCart);
document.getElementById('cartClose')?.addEventListener('click', closeCart);
document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

/* =========================================================
   11. QUICKVIEW MODAL
   ========================================================= */
function openQuickview(productId) {
  quickviewProduct = PRODUCTS.find(p => p.id === productId);
  if (!quickviewProduct) return;
  document.getElementById('qvImg').src = quickviewProduct.img;
  document.getElementById('qvImg').alt = quickviewProduct.name;
  document.getElementById('qvName').textContent = quickviewProduct.name;
  document.getElementById('qvPrice').textContent = `GH₵ ${quickviewProduct.price}`;
  document.getElementById('qvCategory').textContent = quickviewProduct.category.toUpperCase();
  document.getElementById('quickviewOverlay').classList.add('show');
  document.body.classList.add('modal-open');
}
function closeQuickview() {
  document.getElementById('quickviewOverlay').classList.remove('show');
  document.body.classList.remove('modal-open');
}
document.getElementById('quickviewClose')?.addEventListener('click', closeQuickview);
document.getElementById('quickviewOverlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('quickviewOverlay')) closeQuickview();
});
document.getElementById('qvAddBtn')?.addEventListener('click', () => {
  if (quickviewProduct) {
    addToCart(quickviewProduct.id);
    closeQuickview();
    openCart();
  }
});

/* =========================================================
   12. CHECKOUT MODAL
   ========================================================= */
function openCheckout() {
  const summary = document.getElementById('checkoutSummary');
  summary.innerHTML = '';
  cart.forEach(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (!p) return;
    const row = document.createElement('div');
    row.className = 'summary-item';
    row.innerHTML = `<span class="summary-item-name">${p.name} × ${item.quantity}</span><span class="summary-item-price">GH₵ ${p.price * item.quantity}</span>`;
    summary.appendChild(row);
  });
  document.getElementById('checkoutTotal').textContent = `GH₵ ${getCartTotal().toLocaleString()}`;
  document.getElementById('checkoutOverlay').classList.add('show');
  document.body.classList.add('modal-open');
}
function closeCheckout() {
  document.getElementById('checkoutOverlay').classList.remove('show');
  document.body.classList.remove('modal-open');
}

document.getElementById('checkoutBtn')?.addEventListener('click', () => { closeCart(); openCheckout(); });
document.getElementById('checkoutClose')?.addEventListener('click', closeCheckout);
document.getElementById('checkoutOverlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('checkoutOverlay')) closeCheckout();
});

// Checkout form submit
document.getElementById('checkoutForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('checkoutName').value.trim();
  const phone = document.getElementById('checkoutPhone').value.trim();
  const location = document.getElementById('checkoutLocation').value.trim();

  let valid = true;
  ['checkoutName', 'checkoutPhone', 'checkoutLocation'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.toggle('error', !el.value.trim());
    if (!el.value.trim()) valid = false;
  });
  if (!valid) { showToast('Please fill all fields', 'success'); return; }

  // Submit order to API
  const orderData = {
    customer_name: name,
    customer_phone: phone,
    customer_location: location,
    items: cart.map(item => {
      const p = PRODUCTS.find(pr => pr.id === item.id);
      return { id: item.id, name: p?.name, quantity: item.quantity, subtotal: p ? p.price * item.quantity : 0 };
    }),
    total: getCartTotal(),
    timestamp: new Date().toISOString()
  };

  // Fallback WhatsApp logic in case API fails (e.g. GitHub Pages)
  const sendWhatsApp = () => {
    const message = encodeURIComponent(
      `🛍️ *ACE_COLLECTION Order*\n\n` +
      `*Customer:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Location:* ${location}\n\n` +
      `*Order Items:*\n${cart.map(item => {
        const p = PRODUCTS.find(pr => pr.id === item.id);
        const imgUrl = p?.img?.startsWith('http') ? p.img : window.location.origin + '/' + p?.img;
        return p ? `• ${p.name} × ${item.quantity} = GH₵ ${p.price * item.quantity}\n  🖼️ Image: ${imgUrl}` : '';
      }).filter(Boolean).join('\n\n')}\n\n` +
      `*Total: GH₵ ${getCartTotal().toLocaleString()}*\n\n` +
      `_Sent via ACE_COLLECTION website_`
    );
    window.open(`https://wa.me/233201941596?text=${message}`, '_blank');
    closeCheckout();
    cart = [];
    saveCart();
    updateCartUI();
    showToast('Order received! Redirecting to WhatsApp...', 'success');
    document.getElementById('checkoutForm').reset();
  };

  // Submit order to API (Optional - will fail on static hosts like GitHub)
  fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
  .then(res => {
    if(!res.ok) throw new Error('API not available');
    return res.json();
  })
  .then(data => {
    console.log('Order saved to backend:', data);
    sendWhatsApp();
  })
  .catch(err => {
    console.warn('Backend order storage failed (expected on static hosts):', err);
    // Continue to WhatsApp anyway
    sendWhatsApp();
  });
});

/* =========================================================
   13. TOAST NOTIFICATION
   ========================================================= */
let toastTimer;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

/* =========================================================
   14. KEYBOARD & ESC
   ========================================================= */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCart();
    closeCheckout();
    closeQuickview();
    closeMenu();
  }
});

/* =========================================================
   15. INITIALIZE
   ========================================================= */
// Initialize
fetchProducts();

// Preload shop products lazily
document.querySelector('#shop')?.addEventListener('transitionend', () => { if (PRODUCTS.length > 0) renderProducts(); }, { once: true });

console.log('%c ACE_COLLECTION 🔥 ', 'background:#d4a843;color:#000;font-size:18px;font-weight:bold;padding:8px 16px;border-radius:4px;');
console.log('%c #ace your drip ', 'color:#d4a843;font-size:12px;letter-spacing:4px;');
