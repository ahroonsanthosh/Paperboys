// ===== Paperboys interactions =====
(function () {
  'use strict';

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ===== Announcement banner dismiss =====
  var announce = document.getElementById('announce');
  var announceClose = document.getElementById('announceClose');
  if (announce && announceClose) {
    // restore dismissed state across page loads
    if (sessionStorage.getItem('pb-announce-hidden')) {
      announce.classList.add('is-hidden');
    }
    announceClose.addEventListener('click', function () {
      announce.classList.add('is-hidden');
      sessionStorage.setItem('pb-announce-hidden', '1');
      // re-adjust nav top
      nav.style.top = '0';
    });
  }

  // ===== Sticky nav (offset by banner height) =====
  var nav = document.getElementById('nav');
  function getNavTop() {
    if (!announce || announce.classList.contains('is-hidden')) return 0;
    return announce.offsetHeight;
  }
  function positionNav() {
    if (!nav) return;
    nav.style.top = getNavTop() + 'px';
  }
  positionNav();
  window.addEventListener('resize', positionNav);

  var onScroll = function () {
    if (!nav) return;
    nav.classList.toggle('is-stuck', window.scrollY > 12);
    // slide nav up as banner scrolls away
    if (announce && !announce.classList.contains('is-hidden')) {
      var bannerH = announce.offsetHeight;
      var offset = Math.max(0, bannerH - window.scrollY);
      nav.style.top = offset + 'px';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Mobile menu =====
  var burger = document.getElementById('burger');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('menu-open');
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('menu-open'); });
    });
  }

  // ===== Highlight today's hours =====
  var today = new Date().getDay();
  var li = document.querySelector('#hoursList li[data-day="' + today + '"]');
  if (li) li.classList.add('is-today');

  // ===== Scroll reveal =====
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

  // ===== Contact form =====
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = (this.querySelector('#cName')    || {}).value || '';
      var email   = (this.querySelector('#cEmail')   || {}).value || '';
      var type    = (this.querySelector('#cType')    || {}).value || '';
      var message = (this.querySelector('#cMessage') || {}).value || '';
      var base    = this.dataset.mailto || 'mailto:hello@paperboys.ie';
      var subject = encodeURIComponent((type || 'Enquiry') + ' — Paperboys');
      var body    = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\nType: ' + type + '\n\nMessage:\n' + message);
      window.open(base + '?subject=' + subject + '&body=' + body);
      var btn  = this.querySelector('button[type=submit]');
      var orig = btn.textContent;
      btn.textContent = 'Sent ✓';
      setTimeout(function () { btn.textContent = orig; }, 3000);
    });
  }

  // ===== vhero cursor light =====
  var vheroEl = document.getElementById('vhero');
  if (vheroEl && !reduce) {
    var light = document.createElement('div');
    light.className = 'vhero__light';
    vheroEl.appendChild(light);
    vheroEl.addEventListener('mousemove', function (e) {
      var r = vheroEl.getBoundingClientRect();
      light.style.animation = 'none';
      light.style.left = (e.clientX - r.left) + 'px';
      light.style.top  = (e.clientY - r.top)  + 'px';
    });
    vheroEl.addEventListener('mouseleave', function () {
      light.style.animation = '';
      light.style.left = '50%';
      light.style.top  = '50%';
    });
  }

  // ===== evhero floating particles =====
  var evheroEl = document.getElementById('events');
  if (evheroEl && !reduce) {
    var cfg = [
      {lx:'12%',ty:'20%',dx:'-18px',dy:'-28px',sz:5,dur:'9s',del:'0s'},
      {lx:'80%',ty:'15%',dx:'22px', dy:'-20px',sz:7,dur:'11s',del:'-3s'},
      {lx:'65%',ty:'70%',dx:'-14px',dy:'24px', sz:4,dur:'8s', del:'-1.5s'},
      {lx:'25%',ty:'75%',dx:'18px', dy:'20px', sz:6,dur:'13s',del:'-5s'},
      {lx:'90%',ty:'50%',dx:'-20px',dy:'-16px',sz:3,dur:'10s',del:'-2s'},
      {lx:'45%',ty:'88%',dx:'12px', dy:'-22px',sz:5,dur:'7s', del:'-4s'},
    ];
    cfg.forEach(function (c) {
      var dot = document.createElement('span');
      dot.className = 'evhero__dot';
      dot.style.cssText = '--lx:'+c.lx+';--ty:'+c.ty+';--dx:'+c.dx+';--dy:'+c.dy+';--sz:'+c.sz+';--dur:'+c.dur+';--del:'+c.del;
      evheroEl.appendChild(dot);
    });
  }

  // ===== Story stat stagger =====
  var storyMeta = document.querySelector('.story__meta');
  if (storyMeta) {
    storyMeta.querySelectorAll('.story__stat').forEach(function (el) {
      el.classList.add('stat-reveal');
    });
    if ('IntersectionObserver' in window) {
      var statIO = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          storyMeta.querySelectorAll('.stat-reveal').forEach(function (el, i) {
            setTimeout(function () { el.classList.add('is-in'); }, i * 110);
          });
          statIO.disconnect();
        }
      }, { threshold: 0.2 });
      statIO.observe(storyMeta);
    } else {
      storyMeta.querySelectorAll('.stat-reveal').forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  // ===== Menu group reveal (dish stagger) =====
  var menuGroups = document.querySelectorAll('.menu__group');
  if ('IntersectionObserver' in window && menuGroups.length) {
    var menuIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); menuIO.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    menuGroups.forEach(function (g) { menuIO.observe(g); });
  }

  // ===== Hours list stagger =====
  function staggerHoursItems() {
    var hoursList = document.getElementById('hoursList');
    if (!hoursList) return;
    var items = hoursList.querySelectorAll('li');
    if (!items.length) return;
    items.forEach(function (li, i) {
      setTimeout(function () { li.classList.add('is-in'); }, i * 80 + 100);
    });
  }
  // Observe the hours section; once visible, stagger in the items
  var hoursSection = document.querySelector('.hours');
  if (hoursSection && 'IntersectionObserver' in window) {
    var hoursIO = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        staggerHoursItems();
        hoursIO.disconnect();
      }
    }, { threshold: 0.15 });
    hoursIO.observe(hoursSection);
  }
  // Also fire after CMS populates the list (CMS fetch may complete after IO fires)
  var hoursListEl = document.getElementById('hoursList');
  if (hoursListEl && window.MutationObserver) {
    var hoursObs = new MutationObserver(function () {
      hoursObs.disconnect();
      // If section already visible, stagger now; otherwise IO handles it
      if (hoursSection && hoursSection.getBoundingClientRect().top < window.innerHeight * 0.92) {
        staggerHoursItems();
      }
    });
    hoursObs.observe(hoursListEl, { childList: true });
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
      inset.style.clipPath = 'inset(0% 0% 0% 0% round 16px)';
      video.style.transform = 'scale(1)';
    } else {
      var ticking = false;
      var render = function () {
        ticking = false;
        var total = vhero.offsetHeight - window.innerHeight;
        var p = clamp01((window.scrollY - vhero.offsetTop) / (total || 1));
        var pv = clamp01(p / 0.8);
        video.style.transform = 'scale(' + lerp(0.7, 1, pv).toFixed(4) + ')';
        var insetPct = lerp(45, 0, pv).toFixed(3);
        var radius = lerp(1000, 16, p).toFixed(1);
        inset.style.clipPath = 'inset(' + insetPct + '% ' + insetPct + '% ' + insetPct + '% ' + insetPct + '% round ' + radius + 'px)';
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
