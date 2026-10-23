/* Static-site only: mobile menu, active nav link, search and the bag drawer.
   Inside Shopify the theme provides all of this. */
(function () {
  'use strict';

  /* ---------- mobile menu ---------- */
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var scrim = document.querySelector('.nav-scrim');
  function setMenu(open) {
    document.body.classList.toggle('nav-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(!document.body.classList.contains('nav-open')); });
  if (scrim) scrim.addEventListener('click', function () { setMenu(false); });
  [].forEach.call(document.querySelectorAll('.site-nav a'), function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* ---------- active nav link follows the section in view ---------- */
  var links = [].slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  if ('IntersectionObserver' in window && links.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute('href') === '#' + en.target.id) a.setAttribute('aria-current', 'page');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) {
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if (t) io.observe(t);
    });
  }

  /* ---------- search: opens the first product whose name matches ---------- */
  var search = document.querySelector('[data-site-search]');
  if (search) {
    search.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = search.querySelector('input');
      var q = (input && input.value || '').trim().toLowerCase();
      var all = window.SiteProducts || [];
      if (!q && input && getComputedStyle(input).display === 'none') {
        q = (window.prompt('Search products') || '').trim().toLowerCase();
      }
      if (!q) return;
      var hits = all.filter(function (p) { return String(p.name).toLowerCase().indexOf(q) > -1; });
      if (hits.length && window.QuickView) window.QuickView.open({ items: hits, index: 0 });
      else if (input) {
        input.value = '';
        input.placeholder = 'No match';
        setTimeout(function () { input.placeholder = 'Search'; }, 1600);
      }
    });
  }

  /* ---------- bag drawer ---------- */
  var bag = document.querySelector('[data-bag]');
  if (!bag || !window.SiteCart) return;
  var list = bag.querySelector('[data-bag-list]');
  var total = bag.querySelector('[data-bag-total]');
  var checkout = bag.querySelector('[data-bag-checkout]');
  var lastFocus = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function render(cart) {
    cart = cart || window.SiteCart.get();
    if (!cart.items.length) {
      list.innerHTML = '<li class="bag-empty">Your bag is empty.</li>';
    } else {
      list.innerHTML = cart.items.map(function (l) {
        return '<li class="bag-line" data-key="' + esc(l.key) + '">' +
          (l.image ? '<img src="' + esc(l.image) + '" alt="">' : '<span></span>') +
          '<div><h3>' + esc(l.title) + '</h3>' +
          (l.variant ? '<p>Size ' + esc(l.variant) + '</p>' : '') +
          '<div class="bag-qty"><button type="button" data-qty="-1" aria-label="Decrease">−</button>' +
          '<span>' + l.quantity + '</span>' +
          '<button type="button" data-qty="1" aria-label="Increase">+</button></div></div>' +
          '<div class="bag-line-price">' + esc(window.SiteCart.money(l.price * l.quantity)) + '</div></li>';
      }).join('');
    }
    total.textContent = window.SiteCart.money(cart.total);
    checkout.disabled = !cart.items.length;
  }
  function open() {
    render();
    lastFocus = document.activeElement;
    bag.classList.add('bag-open');
    bag.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var c = bag.querySelector('[data-bag-close]');
    if (c) c.focus({ preventScroll: true });
  }
  function close() {
    bag.classList.remove('bag-open');
    bag.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    if (location.hash === '#cart') history.replaceState(null, '', location.pathname + location.search);
  }

  document.addEventListener('site:cart', function (e) { if (bag.classList.contains('bag-open')) render(e.detail); });
  document.addEventListener('site:cart-open', open);
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#cart"], [data-bag-open]');
    if (a) { e.preventDefault(); open(); return; }
    if (e.target.closest('[data-bag-close]')) { close(); return; }
    var q = e.target.closest('[data-qty]');
    if (q && bag.contains(q)) {
      var line = q.closest('[data-key]');
      var key = line.getAttribute('data-key');
      var item = window.SiteCart.get().items.filter(function (l) { return l.key === key; })[0];
      if (item) window.SiteCart.setQuantity(key, item.quantity + (+q.getAttribute('data-qty')));
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && bag.classList.contains('bag-open')) close();
  });
  checkout.addEventListener('click', function () {
    var note = bag.querySelector('[data-bag-note]');
    if (note) note.textContent = 'Checkout runs on your Shopify store. This static page keeps the bag in your browser only.';
  });
  if (location.hash === '#cart') open();
})();
