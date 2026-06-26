(function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function set(id, text) {
    var el = document.getElementById(id);
    if (el && text != null) el.textContent = text;
  }
  function price(n) {
    var v = Number(n);
    return '€' + (v % 1 === 0 ? v : v.toFixed(2));
  }

  fetch('content.json?v=' + Date.now())
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var settings       = d.settings       || {};
      var hours          = d.hours          || {};
      var story          = d.story          || {};
      var menu           = d.menu           || {};
      var dishes         = d.dishes         || [];
      var gallery        = d.gallery        || [];
      var eventsHero     = d.eventsHero     || {};
      var hire           = d.hire           || {};
      var gallerySection = d.gallerySection || {};
      var newsletter     = d.newsletter     || {};

      // ── Site Settings ──────────────────────────────────────────────────────
      document.querySelectorAll('.cms-brand-name').forEach(function (el) {
        if (settings.businessName) el.textContent = settings.businessName;
      });
      set('heroEyebrow', settings.heroEyebrow);

      var addr = document.getElementById('visitAddress');
      if (addr && settings.businessName) {
        addr.innerHTML = esc(settings.businessName) + '<br>' +
          esc(settings.streetAddress) + '<br>' + esc(settings.locality);
      }
      document.querySelectorAll('.cms-instagram-link').forEach(function (el) {
        if (settings.instagramUrl) el.href = settings.instagramUrl;
      });
      var igBtn = document.getElementById('visitInstagramBtn');
      if (igBtn && settings.instagramHandle) igBtn.textContent = settings.instagramHandle;

      document.querySelectorAll('.cms-directions-link').forEach(function (el) {
        if (settings.directionsUrl) el.href = settings.directionsUrl;
      });
      var mapEl = document.getElementById('mapIframe');
      if (mapEl && settings.googleMapsUrl) mapEl.src = settings.googleMapsUrl;

      var copy = document.getElementById('footerCopyright');
      if (copy && settings.businessName) {
        copy.innerHTML = '&copy; ' + new Date().getFullYear() + ' ' +
          esc(settings.businessName) + ' &middot; ' + esc(settings.streetAddress);
      }

      // ── Opening Hours ──────────────────────────────────────────────────────
      if (hours.days && hours.days.length) {
        var list = document.getElementById('hoursList');
        if (list) {
          var dayIdx = {monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6,sunday:0};
          var todayNum = new Date().getDay();
          list.innerHTML = hours.days.map(function (d) {
            var idx = dayIdx[(d.dayName || '').toLowerCase()];
            var cls = [];
            if (d.closed) cls.push('closed');
            if (idx === todayNum) cls.push('is-today');
            var attrs = (idx !== undefined ? ' data-day="' + idx + '"' : '') +
                        (cls.length ? ' class="' + cls.join(' ') + '"' : '');
            var t = d.closed ? 'Closed' : esc(d.opens) + ' – ' + esc(d.closes);
            return '<li' + attrs + '><span>' + esc(d.dayName) + '</span><span>' + t + '</span></li>';
          }).join('');
        }
      }

      // ── Story ──────────────────────────────────────────────────────────────
      set('storyHeading',    story.heading);
      set('storyPara1',      story.paragraph1);
      set('storyPara2',      story.paragraph2);
      set('storefrontQuote', story.storefrontQuote);
      var track = document.getElementById('tickerTrack');
      if (track && story.tickerWords && story.tickerWords.length) {
        var words = story.tickerWords.concat(story.tickerWords);
        track.innerHTML = words.map(function (w) {
          return '<span>' + esc(w) + '</span><i>·</i>';
        }).join('');
      }

      // ── Menu Settings ──────────────────────────────────────────────────────
      set('menuIntro',    menu.introText);
      set('allergenNote', menu.allergenKey);
      var sidesList = document.getElementById('sidesList');
      if (sidesList && menu.sides) {
        sidesList.innerHTML = menu.sides.map(function (s) {
          return '<li><span>' + esc(s.name) + '</span><b>' + price(s.price) + '</b></li>';
        }).join('');
      }
      var drinksList = document.getElementById('drinksList');
      if (drinksList && menu.drinks) {
        drinksList.innerHTML = menu.drinks.map(function (s) {
          return '<li><span>' + esc(s.name) + '</span><b>' + price(s.price) + '</b></li>';
        }).join('');
      }

      // ── Dishes ─────────────────────────────────────────────────────────────
      var bycat = {};
      dishes.forEach(function (d) {
        var c = d.category || 'other';
        if (!bycat[c]) bycat[c] = [];
        bycat[c].push(d);
      });
      function renderDishes(id, items) {
        var el = document.getElementById(id);
        if (!el || !items || !items.length) return;
        el.innerHTML = items.map(function (d) {
          var al = d.allergens ? ' <em>(' + esc(d.allergens) + ')</em>' : '';
          return '<article class="dish"><div class="dish__row">' +
            '<h4>' + esc(d.name) + al + '</h4>' +
            '<span class="dot"></span>' +
            '<span class="dish__price">' + price(d.price) + '</span>' +
            '</div><p>' + esc(d.description) + '</p></article>';
        }).join('');
      }
      renderDishes('breakfastList',  bycat.breakfast);
      renderDishes('sandwichesList', bycat.sandwiches);

      // ── Events Hero ────────────────────────────────────────────────────────
      set('evheroPillText',   eventsHero.pillText);
      set('evheroTitleLine1', eventsHero.titleLine1);
      set('evheroTitleLine2', eventsHero.titleLine2);
      set('evheroSub',        eventsHero.subtitle);
      var cta1 = document.getElementById('evheroCta1');
      if (cta1) {
        if (eventsHero.cta1Label) cta1.textContent = eventsHero.cta1Label;
        if (eventsHero.cta1Href)  cta1.href        = eventsHero.cta1Href;
      }
      var cta2 = document.getElementById('evheroCta2');
      if (cta2) {
        if (eventsHero.cta2Label) cta2.innerHTML = esc(eventsHero.cta2Label) + '<span class="btn__arrow">→</span>';
        if (eventsHero.cta2Href)  cta2.href      = eventsHero.cta2Href;
      }

      // ── Private Hire ───────────────────────────────────────────────────────
      set('hireEyebrow', hire.eyebrow);
      set('hireHeading', hire.heading);
      set('hirePara',    hire.paragraph);
      set('hireDetails', hire.details);
      var hireCta = document.getElementById('hireCtaLink');
      if (hireCta) {
        if (hire.ctaLabel) hireCta.textContent = hire.ctaLabel;
        if (hire.ctaHref)  hireCta.href        = hire.ctaHref;
      }

      // ── Gallery Section Header ─────────────────────────────────────────────
      set('galleryEyebrow',    gallerySection.eyebrow);
      set('galleryHeading',    gallerySection.heading);
      set('gallerySocialText', gallerySection.socialText);
      var gallerySocialHandle = document.getElementById('gallerySocialHandle');
      if (gallerySocialHandle && settings.instagramHandle) {
        gallerySocialHandle.textContent = settings.instagramHandle;
      }

      // ── Newsletter ─────────────────────────────────────────────────────────
      set('newsletterLine1', newsletter.line1);
      set('newsletterLine2', newsletter.line2);
      set('newsletterSub',   newsletter.subtext);
      var nlCta = document.getElementById('newsletterCta');
      if (nlCta && newsletter.ctaLabel) nlCta.textContent = newsletter.ctaLabel;
      var nlForm = document.getElementById('newsletterForm');
      if (nlForm && newsletter.ctaMailto) nlForm.dataset.mailto = newsletter.ctaMailto;

      // ── Gallery ────────────────────────────────────────────────────────────
      var grid = document.getElementById('galleryGrid');
      if (grid && gallery.length) {
        var cls = ['tile--a','tile--b','tile--c','tile--d','tile--e'];
        grid.innerHTML = gallery.map(function (p, i) {
          return '<figure class="tile ' + (cls[i] || 'tile--f') + ' reveal">' +
            '<img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" loading="lazy" />' +
            '<figcaption>' + esc(p.caption) + '</figcaption></figure>';
        }).join('');
        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
            });
          }, {threshold: 0.1});
          grid.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
        }
      }
    })
    .catch(function () {});
})();
