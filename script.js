// ===== Paperboys interactions =====
(function () {
  'use strict';

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Sticky nav shadow
  var nav = document.getElementById('nav');
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
  var today = new Date().getDay(); // 0 = Sunday
  var li = document.querySelector('#hoursList li[data-day="' + today + '"]');
  if (li) li.classList.add('is-today');

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
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // ===== Scroll-zoom video hero =====
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vhero = document.getElementById('vhero');
  var inset = document.getElementById('vheroInset');
  var video = document.getElementById('vheroVideo');
  var copy = document.getElementById('vheroCopy');
  var actions = document.getElementById('vheroActions');

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  if (vhero && inset && video) {
    if (reduce) {
      // Static, fully-revealed state
      inset.style.clipPath = 'inset(0% 0% 0% 0% round 16px)';
      video.style.transform = 'scale(1)';
    } else {
      var ticking = false;
      var render = function () {
        ticking = false;
        var total = vhero.offsetHeight - window.innerHeight;
        var p = clamp01((window.scrollY - vhero.offsetTop) / (total || 1));

        // Video scales 0.7 -> 1 over the first 80% of scroll
        var pv = clamp01(p / 0.8);
        video.style.transform = 'scale(' + lerp(0.7, 1, pv).toFixed(4) + ')';

        // Rounded inset opens out: inset 45% -> 0%, radius 1000px -> 16px
        var insetPct = lerp(45, 0, pv).toFixed(3);
        var radius = lerp(1000, 16, p).toFixed(1);
        inset.style.clipPath = 'inset(' + insetPct + '% ' + insetPct + '% ' + insetPct + '% ' + insetPct + '% round ' + radius + 'px)';

        // Headline lifts & fades slightly as the video takes over; CTAs ease up
        if (copy) { copy.style.transform = 'translateY(' + lerp(0, -40, p).toFixed(1) + 'px)'; copy.style.opacity = lerp(1, 0.55, clamp01((p - 0.4) / 0.5)).toFixed(3); }
        if (actions) { actions.style.transform = 'translateY(' + lerp(40, 0, clamp01(p / 0.6)).toFixed(1) + 'px)'; actions.style.opacity = clamp01(p / 0.5).toFixed(3); }
      };
      var onScrollV = function () { if (!ticking) { ticking = true; requestAnimationFrame(render); } };
      window.addEventListener('scroll', onScrollV, { passive: true });
      window.addEventListener('resize', render);
      render();
    }
  }
})();
