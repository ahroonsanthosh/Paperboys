(function () {
  var PROJECT_ID = 'kbi1x7f8';
  var DATASET = 'production';
  var API_VERSION = '2024-01-01';

  // Exit silently if project ID hasn't been set yet
  if (PROJECT_ID === 'REPLACE_WITH_PROJECT_ID') return;

  // Build a Sanity CDN image URL from an asset reference object
  // ref format: "image-<id>-<WxH>-<ext>"  e.g. "image-abc123-1200x800-jpg"
  function imgUrl(asset, width) {
    if (!asset || !asset._ref) return null;
    var ref = asset._ref;
    var withoutPrefix = ref.slice(6); // strip "image-"
    var lastDash = withoutPrefix.lastIndexOf('-');
    var filename = withoutPrefix.slice(0, lastDash) + '.' + withoutPrefix.slice(lastDash + 1);
    var url = 'https://cdn.sanity.io/images/' + PROJECT_ID + '/' + DATASET + '/' + filename;
    return width ? url + '?w=' + width + '&auto=format' : url;
  }

  // Safe text: create a text node value (no HTML injection)
  function txt(str) {
    return str != null ? String(str) : '';
  }

  // Escape for innerHTML contexts
  function esc(str) {
    return txt(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Format price: whole numbers without decimals, e.g. 15 → "€15", 14.5 → "€14.50"
  function price(n) {
    var num = Number(n);
    return '€' + (num % 1 === 0 ? num : num.toFixed(2));
  }

  function set(id, text) {
    var el = document.getElementById(id);
    if (el && text != null) el.textContent = text;
  }

  var QUERY = [
    '{',
    '"settings": *[_type == "siteSettings"][0],',
    '"hours": *[_type == "openingHours"][0],',
    '"story": *[_type == "storySection"][0],',
    '"menu": *[_type == "menuSettings"][0],',
    '"dishes": *[_type == "menuDish"] | order(category asc, sortOrder asc),',
    '"gallery": *[_type == "galleryPhoto"] | order(sortOrder asc)',
    '}'
  ].join('');

  var API_URL =
    'https://' + PROJECT_ID + '.apicdn.sanity.io/v' + API_VERSION +
    '/data/query/' + DATASET + '?query=' + encodeURIComponent(QUERY);

  fetch(API_URL)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var r = data.result || {};
      var settings = r.settings;
      var hours    = r.hours;
      var story    = r.story;
      var menu     = r.menu;
      var dishes   = r.dishes || [];
      var gallery  = r.gallery || [];

      // ── Site Settings ─────────────────────────────────────────────────────
      if (settings) {
        // Brand name: nav + footer
        document.querySelectorAll('.cms-brand-name').forEach(function (el) {
          if (settings.businessName) el.textContent = settings.businessName;
        });

        // Hero eyebrow
        set('heroEyebrow', settings.heroEyebrow);

        // Visit address
        var addr = document.getElementById('visitAddress');
        if (addr && settings.businessName) {
          addr.innerHTML =
            esc(settings.businessName) + '<br>' +
            esc(settings.streetAddress) + '<br>' +
            esc(settings.locality);
        }

        // Instagram links — href only (footer nav, mobile bar)
        document.querySelectorAll('.cms-instagram-link').forEach(function (el) {
          if (settings.instagramUrl) el.href = settings.instagramUrl;
        });

        // Visit section Instagram button — also update visible handle text
        var igBtn = document.getElementById('visitInstagramBtn');
        if (igBtn && settings.instagramHandle) igBtn.textContent = settings.instagramHandle;

        // Directions links
        document.querySelectorAll('.cms-directions-link').forEach(function (el) {
          if (settings.directionsUrl) el.href = settings.directionsUrl;
        });

        // Map iframe
        var mapEl = document.getElementById('mapIframe');
        if (mapEl && settings.googleMapsUrl) mapEl.src = settings.googleMapsUrl;

        // Footer copyright
        var copyright = document.getElementById('footerCopyright');
        if (copyright && settings.businessName) {
          copyright.innerHTML =
            '&copy; ' + new Date().getFullYear() + ' ' +
            esc(settings.businessName) + ' &middot; ' +
            esc(settings.streetAddress);
        }
      }

      // ── Opening Hours ──────────────────────────────────────────────────────
      if (hours && Array.isArray(hours.days) && hours.days.length) {
        var list = document.getElementById('hoursList');
        if (list) {
          list.innerHTML = hours.days.map(function (d) {
            var timeStr = d.closed
              ? 'Closed'
              : esc(d.opens) + ' – ' + esc(d.closes);
            return '<li' + (d.closed ? ' class="closed"' : '') + '>' +
              '<span>' + esc(d.dayName) + '</span>' +
              '<span>' + timeStr + '</span>' +
              '</li>';
          }).join('');
        }
      }

      // ── Story Section ──────────────────────────────────────────────────────
      if (story) {
        set('storyHeading', story.heading);
        set('storyPara1',   story.paragraph1);
        set('storyPara2',   story.paragraph2);
        set('storefrontQuote', story.storefrontQuote);

        var sImg = document.getElementById('storefrontImg');
        var sUrl = imgUrl(story.storefrontImage && story.storefrontImage.asset, 800);
        if (sImg && sUrl) sImg.src = sUrl;

        // Ticker — rebuild with CMS words (doubled for seamless loop)
        var track = document.getElementById('tickerTrack');
        if (track && Array.isArray(story.tickerWords) && story.tickerWords.length) {
          var words = story.tickerWords.concat(story.tickerWords);
          track.innerHTML = words.map(function (w) {
            return '<span>' + esc(w) + '</span><i>·</i>';
          }).join('');
        }
      }

      // ── Menu Settings (sides, drinks, allergens) ───────────────────────────
      if (menu) {
        set('menuIntro',    menu.introText);
        set('allergenNote', menu.allergenKey);

        var sidesList = document.getElementById('sidesList');
        if (sidesList && Array.isArray(menu.sides) && menu.sides.length) {
          sidesList.innerHTML = menu.sides.map(function (s) {
            return '<li><span>' + esc(s.name) + '</span><b>' + price(s.price) + '</b></li>';
          }).join('');
        }

        var drinksList = document.getElementById('drinksList');
        if (drinksList && Array.isArray(menu.drinks) && menu.drinks.length) {
          drinksList.innerHTML = menu.drinks.map(function (d) {
            return '<li><span>' + esc(d.name) + '</span><b>' + price(d.price) + '</b></li>';
          }).join('');
        }
      }

      // ── Menu Dishes ────────────────────────────────────────────────────────
      if (dishes.length) {
        var byCategory = {};
        dishes.forEach(function (d) {
          var cat = d.category || 'other';
          if (!byCategory[cat]) byCategory[cat] = [];
          byCategory[cat].push(d);
        });

        function renderDishes(listId, items) {
          var el = document.getElementById(listId);
          if (!el || !items || !items.length) return;
          el.innerHTML = items.map(function (d) {
            var allergenStr = d.allergens ? ' <em>(' + esc(d.allergens) + ')</em>' : '';
            return '<article class="dish">' +
              '<div class="dish__row">' +
                '<h4>' + esc(d.name) + allergenStr + '</h4>' +
                '<span class="dot"></span>' +
                '<span class="dish__price">' + price(d.price) + '</span>' +
              '</div>' +
              '<p>' + esc(d.description) + '</p>' +
              '</article>';
          }).join('');
        }

        renderDishes('breakfastList',   byCategory.breakfast);
        renderDishes('sandwichesList',  byCategory.sandwiches);
      }

      // ── Gallery ────────────────────────────────────────────────────────────
      if (gallery.length) {
        var grid = document.getElementById('galleryGrid');
        if (grid) {
          var tileClasses = ['tile--a', 'tile--b', 'tile--c', 'tile--d', 'tile--e'];
          grid.innerHTML = gallery.map(function (photo, i) {
            var cls = tileClasses[i] || ('tile--' + String.fromCharCode(97 + i));
            var src = imgUrl(photo.image && photo.image.asset, 1200) || '';
            return '<figure class="tile ' + cls + ' reveal">' +
              '<img src="' + src + '" alt="' + esc(photo.alt) + '" loading="lazy" />' +
              '<figcaption>' + esc(photo.caption) + '</figcaption>' +
              '</figure>';
          }).join('');

          // Re-observe newly inserted .reveal tiles for scroll animation
          if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
              entries.forEach(function (e) {
                if (e.isIntersecting) {
                  e.target.classList.add('is-visible');
                  io.unobserve(e.target);
                }
              });
            }, { threshold: 0.1 });
            grid.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
          }
        }
      }
    })
    .catch(function () {
      // Sanity unavailable — static HTML fallback remains visible as-is
    });
})();
