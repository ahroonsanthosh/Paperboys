(function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el && text != null) el.textContent = text;
  }
  function price(n) {
    var v = Number(n);
    return isNaN(v) ? '' : '€' + (v % 1 === 0 ? v : v.toFixed(2));
  }

  fetch('content.json?v=' + Date.now())
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var settings     = d.settings       || {};
      var hero         = d.hero           || {};
      var story        = d.story          || {};
      var hours        = d.hours          || {};
      var menu         = d.menu           || {};
      var gallery      = d.gallery        || {};
      var whatson      = d.whatson        || {};
      var soundtrack   = d.soundtrack     || {};
      var planYourEvent = d.planYourEvent || {};

      // ── Hero ─────────────────────────────────────────────────────────────────
      setText('heroTitle', hero.title);
      setText('heroSub',   hero.subheading);
      var cta1 = document.getElementById('heroCta1');
      if (cta1) {
        if (hero.cta1Label) cta1.textContent = hero.cta1Label;
        if (hero.cta1Href)  cta1.href = hero.cta1Href;
      }
      var cta2 = document.getElementById('heroCta2');
      if (cta2) {
        if (hero.cta2Label) cta2.innerHTML = esc(hero.cta2Label) + ' <span class="btn__arrow">→</span>';
        if (hero.cta2Href)  cta2.href = hero.cta2Href;
      }

      // ── Story ─────────────────────────────────────────────────────────────────
      if (story.heading) {
        var sh = document.getElementById('storyHeading');
        if (sh) {
          var accent = story.headingAccent || '';
          var plain  = story.heading.replace(accent, '').trim();
          sh.innerHTML = esc(plain) + (accent ? '<br/><em>' + esc(accent) + '</em>' : '');
        }
      }
      setText('storyPara1',      story.paragraph1);
      setText('storyPara2',      story.paragraph2);
      setText('storefrontQuote', story.storefrontQuote);

      // ── Opening Hours ────────────────────────────────────────────────────────
      if (hours.days && hours.days.length) {
        var list = document.getElementById('hoursList');
        if (list) {
          var dayIdx = { monday:1, tuesday:2, wednesday:3, thursday:4, friday:5, saturday:6, sunday:0 };
          var todayNum = new Date().getDay();
          list.innerHTML = hours.days.map(function (day) {
            var idx  = dayIdx[(day.dayName || '').toLowerCase()];
            var cls  = [];
            if (day.closed)        cls.push('closed');
            if (idx === todayNum)  cls.push('is-today');
            var attrs = (idx !== undefined ? ' data-day="' + idx + '"' : '') +
                        (cls.length       ? ' class="' + cls.join(' ') + '"' : '');
            var time  = day.closed ? 'Closed' : esc(day.opens) + ' – ' + esc(day.closes);
            return '<li' + attrs + '><span>' + esc(day.dayName) + '</span><span>' + time + '</span></li>';
          }).join('');
        }
      }

      // ── Menu ─────────────────────────────────────────────────────────────────
      setText('menuIntro',   menu.introText);
      setText('allergenNote', menu.allergenKey);

      var dishes = menu.dishes || [];
      var bycat  = {};
      dishes.forEach(function (dish) {
        var c = dish.category || 'other';
        if (!bycat[c]) bycat[c] = [];
        bycat[c].push(dish);
      });

      function renderDishes(id, items) {
        var el = document.getElementById(id);
        if (!el || !items || !items.length) return;
        el.innerHTML = items.sort(function(a,b){ return (a.sortOrder||0)-(b.sortOrder||0); })
          .map(function (dish) {
            var al = dish.allergens ? ' <em>(' + esc(dish.allergens) + ')</em>' : '';
            return '<article class="dish"><div class="dish__row">' +
              '<h4>' + esc(dish.name) + al + '</h4>' +
              '<span class="dot"></span>' +
              '<span class="dish__price">' + price(dish.price) + '</span>' +
              '</div><p>' + esc(dish.description) + '</p></article>';
          }).join('');
      }
      renderDishes('breakfastList',  bycat.breakfast);
      renderDishes('sandwichesList', bycat.sandwiches);

      var sides = menu.sides || [];
      var sidesList = document.getElementById('sidesList');
      if (sidesList && sides.length) {
        sidesList.innerHTML = sides.map(function (s) {
          return '<li><span>' + esc(s.name) + '</span><b>' + price(s.price) + '</b></li>';
        }).join('');
      }

      var drinks = menu.drinks || [];
      var drinksList = document.getElementById('drinksList');
      if (drinksList && drinks.length) {
        drinksList.innerHTML = drinks.map(function (s) {
          return '<li><span>' + esc(s.name) + '</span><b>' + price(s.price) + '</b></li>';
        }).join('');
      }

      // ── Gallery ───────────────────────────────────────────────────────────────
      var tiles = gallery.tiles || [];
      var grid  = document.getElementById('galleryGrid');
      if (grid && tiles.length) {
        var cls    = ['tile--a', 'tile--b', 'tile--c', 'tile--d', 'tile--e'];
        var delays = [0, 80, 160, 120, 140];
        grid.innerHTML = tiles.sort(function(a,b){ return (a.sortOrder||0)-(b.sortOrder||0); })
          .map(function (tile, i) {
            var delay = delays[i % delays.length];
            var delayAttr = delay ? ' data-delay="' + delay + '"' : '';
            return '<figure class="tile ' + (cls[i % cls.length] || '') + ' reveal"' + delayAttr + '>' +
              '<img src="' + esc(tile.src) + '" alt="' + esc(tile.alt || '') + '" loading="lazy" />' +
              '<figcaption>' + esc(tile.caption || '') + '</figcaption></figure>';
          }).join('');
        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
            });
          }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
          grid.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
        } else {
          grid.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
        }
      }

      // ── What's On ─────────────────────────────────────────────────────────────
      setText('whatsonNote', whatson.note);
      var events = whatson.events || [];
      var whatsonCards = document.getElementById('whatsonCards');
      if (whatsonCards && events.length) {
        whatsonCards.innerHTML = events.map(function (ev, i) {
          var delay = i > 0 ? ' data-delay="' + (i * 100) + '"' : '';
          return '<article class="wcard reveal"' + delay + '>' +
            '<span class="wcard__day">' + esc(ev.day) + '</span>' +
            '<h3>' + esc(ev.title) + '</h3>' +
            '<p>' + esc(ev.description) + '</p>' +
            '<span class="wcard__tag">' + esc(ev.tag) + '</span>' +
            '</article>';
        }).join('');
        if ('IntersectionObserver' in window) {
          var io2 = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) { e.target.classList.add('is-in'); io2.unobserve(e.target); }
            });
          }, { threshold: 0.12 });
          whatsonCards.querySelectorAll('.reveal').forEach(function (el) { io2.observe(el); });
        } else {
          whatsonCards.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
        }
      }
      // ── Soundtrack / Spotify ──────────────────────────────────────────────────
      setText('soundtrackPara1', soundtrack.paragraph1);
      setText('soundtrackPara2', soundtrack.paragraph2);
      if (soundtrack.heading) {
        var sh2 = document.getElementById('soundtrackHeading');
        if (sh2) sh2.innerHTML = '<em>' + esc(soundtrack.heading) + '</em>';
      }
      var sdCta = document.getElementById('soundtrackCta');
      if (sdCta && soundtrack.ctaLabel) sdCta.textContent = soundtrack.ctaLabel;
      var spotifyId = soundtrack.spotifyPlaylistId || (d.settings && d.settings.spotifyPlaylistId);
      if (spotifyId) {
        var embed = document.getElementById('spotifyEmbed');
        if (embed) embed.src = 'https://open.spotify.com/embed/playlist/' + spotifyId + '?utm_source=generator&theme=0';
      }

      // ── Plan Your Event cards ─────────────────────────────────────────────────
      var cards = planYourEvent.cards || [];
      var cardsEl = document.getElementById('planEventCards');
      if (cardsEl && cards.length) {
        cardsEl.innerHTML = cards.map(function (card, i) {
          var styleClass = 'ecard--' + (card.style || 'warm');
          var delay = i > 0 ? ' data-delay="120"' : '';
          return '<article class="ecard ' + styleClass + ' reveal"' + delay + '>' +
            '<div class="ecard__inner">' +
            '<h2><em>' + esc(card.heading) + '</em></h2>' +
            '<p>' + esc(card.paragraph) + '</p>' +
            '<p class="ecard__sub">' + esc(card.sub) + '</p>' +
            '<a href="' + esc(card.ctaHref) + '" class="btn btn--fill btn--dark">' + esc(card.ctaLabel) + '</a>' +
            '</div></article>';
        }).join('');
        if ('IntersectionObserver' in window) {
          var io3 = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) { e.target.classList.add('is-in'); io3.unobserve(e.target); }
            });
          }, { threshold: 0.12 });
          cardsEl.querySelectorAll('.reveal').forEach(function (el) { io3.observe(el); });
        } else {
          cardsEl.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
        }
      }
    })
    .catch(function () {});
})();
