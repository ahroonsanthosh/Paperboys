# Paperboys — Cork City Brunch

A single-page marketing site for **Paperboys**, Cork's old-school newsprint brunch joint on Tobin Street.

## Identity
- **Look:** old-school newspaper / classic diner — cream paper stock, bold blue wordmark, warm earthy accents (terracotta, mustard, brown), a spinning disco-ball touch.
- **Type:** Anton (wordmark), DM Serif Display (headings), Spectral (body), Oswald (labels).
- **Mascot:** custom SVG paperboy (`assets/mascot.svg`).

## Stack
Plain HTML, CSS and vanilla JS — no build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Features
- Responsive layout (desktop → mobile) with a mobile nav.
- Scroll-reveal animations, marquees, animated disco ball, mascot bob + parallax.
- Today's opening hours auto-highlighted.
- `prefers-reduced-motion` respected; accessible labels and an embedded map.

Menu items and prices are placeholders for illustration.
