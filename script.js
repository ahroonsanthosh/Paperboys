// ===== Paperboys interactions =====
(function () {
  'use strict';

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Announcement bar close
  var announce = document.getElementById('announce');
  var announceClose = document.getElementById('announceClose');
  var nav = document.getElementById('nav');
  var BAR_H = 38; // px — matches CSS top offset

  function dismissBar() {
    if (!announce) return;
    announce.classList.add('is-gone');
    if (nav) nav.classList.add('bar-gone');
  }

  if (announceClose) {
    announceClose.addEventListener('click', dismissBar);
  }

  // Sticky nav
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

})();
