// ===== Paperboys interactions =====
(function () {
  'use strict';

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Announcement bar — measure height dynamically so nav never overlaps
  var announce = document.getElementById('announce');
  var announceClose = document.getElementById('announceClose');
  var nav = document.getElementById('nav');

  function setBarHeight() {
    var h = (announce && !announce.classList.contains('is-gone'))
      ? announce.offsetHeight : 0;
    document.documentElement.style.setProperty('--bar-h', h + 'px');
    if (nav) nav.style.top = h + 'px';
  }

  function dismissBar() {
    if (!announce) return;
    announce.classList.add('is-gone');
    setBarHeight();
  }

  if (announceClose) announceClose.addEventListener('click', dismissBar);
  setBarHeight();
  window.addEventListener('resize', setBarHeight, { passive: true });

  // Sticky nav shadow
  var onScroll = function () {
    if (!nav) return;
    nav.classList.toggle('is-stuck', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var burger = document.getElementById('burger');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('menu-open');
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('menu-open'); });
    });
  }

  // Highlight today's hours
  var today = new Date().getDay();
  var li = document.querySelector('#hoursList li[data-day="' + today + '"]');
  if (li) li.classList.add('is-today');

  // Load gallery tiles from content.json so admin-uploaded images appear
  var tileClasses = ['tile--a', 'tile--b', 'tile--c', 'tile--d', 'tile--e'];
  var tileDelays  = [0, 80, 160, 120, 140];
  fetch('content.json?v=' + Date.now())
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var tiles = data.gallery && data.gallery.tiles;
      if (!tiles || !tiles.length) return;
      var grid = document.getElementById('galleryGrid');
      if (!grid) return;
      grid.innerHTML = tiles.map(function(tile, i) {
        var cls   = tileClasses[i % tileClasses.length];
        var delay = tileDelays[i % tileDelays.length];
        var delayAttr = delay ? ' data-delay="' + delay + '"' : '';
        return '<figure class="tile ' + cls + ' reveal"' + delayAttr + '>' +
          '<img src="' + tile.src + '" alt="' + (tile.alt || '') + '" loading="lazy" />' +
          '<figcaption>' + (tile.caption || '') + '</figcaption>' +
          '</figure>';
      }).join('');
      // Re-run reveal observer on new elements
      if ('IntersectionObserver' in window) {
        grid.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });
      } else {
        grid.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('is-in'); });
      }
    })
    .catch(function() { /* keep static fallback tiles */ });

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var d = e.target.getAttribute('data-delay') || 0;
          e.target.style.transitionDelay = d + 'ms';
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Button squish/bounce on click
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn');
    if (!btn) return;
    btn.classList.remove('btn--bounce');
    // force reflow so the animation can re-trigger on rapid clicks
    void btn.offsetWidth;
    btn.classList.add('btn--bounce');
    btn.addEventListener('animationend', function handler() {
      btn.classList.remove('btn--bounce');
      btn.removeEventListener('animationend', handler);
    });
  });

  // Menu prices "stamp" into place as they scroll into view.
  // Re-scans on a timer for the first few seconds since cms.js / the gallery
  // fetch above can replace the dish list markup asynchronously.
  var priceObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-stamped');
            priceObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 })
    : null;

  function observePrices() {
    document.querySelectorAll('.dish__price:not(.is-stamped)').forEach(function (el) {
      if (priceObserver) priceObserver.observe(el);
      else el.classList.add('is-stamped');
    });
  }
  observePrices();
  if (priceObserver) {
    [250, 800, 1800, 3000].forEach(function (ms) { setTimeout(observePrices, ms); });
  }

  // Scroll progress — coffee cup fill
  var cupfill = document.getElementById('cupfill');
  var cupfillLiquid = document.getElementById('cupfillLiquid');
  if (cupfill && cupfillLiquid) {
    var CUP_TOP = 16, CUP_BOTTOM = 39;
    var onScrollFill = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      var h = pct * (CUP_BOTTOM - CUP_TOP);
      cupfillLiquid.setAttribute('height', h.toFixed(1));
      cupfillLiquid.setAttribute('y', (CUP_BOTTOM - h).toFixed(1));
      cupfill.classList.toggle('is-visible', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScrollFill, { passive: true });
    onScrollFill();
  }

  // Bouncy hover text on every heading. Splits each heading's text nodes
  // into per-letter spans (preserving <em>/<br> structure) so CSS can
  // stagger a bounce animation across the letters on :hover.
  function wrapLetters(root) {
    var counter = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) { // text node
          var frag = document.createDocumentFragment();
          child.textContent.split('').forEach(function (ch) {
            if (ch === ' ') {
              frag.appendChild(document.createTextNode(' '));
            } else {
              var span = document.createElement('span');
              span.className = 'letter';
              span.style.setProperty('--i', counter++);
              span.textContent = ch;
              frag.appendChild(span);
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    }
    walk(root);
    root.classList.add('letters-ready');
  }

  function applyBouncyHeadings() {
    document.querySelectorAll('h1, h2, h3').forEach(function (h) {
      // Re-check for actual .letter children rather than trusting the
      // 'letters-ready' flag alone: cms.js sets heading textContent
      // directly (asynchronously, after our first pass), which wipes out
      // any spans we already added without removing the flag.
      if (!h.querySelector('.letter')) wrapLetters(h);
    });
  }
  applyBouncyHeadings();
  // Re-scan repeatedly since cms.js / the menu+gallery fetches above can
  // replace heading markup asynchronously, sometimes more than once.
  [250, 600, 1000, 1800, 3000, 5000].forEach(function (ms) { setTimeout(applyBouncyHeadings, ms); });

})();
