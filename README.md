# Will You Be My Valentine? — interactive site

A pixel-accurate, one-screen-at-a-time recreation of the source PowerPoint
deck (10 slides), built with plain HTML5, CSS3, and vanilla JavaScript.
No frameworks, no build step.

## Run it

Just open `index.html` in a browser, or serve the folder with any static
file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

It also works out of the box on **GitHub Pages**, **Netlify**, and
**Cloudflare Pages** — deploy the folder as-is.

## How it's built

- **Pixel-perfect scaling stage** — every slide is a fixed 960×540px
  "stage" (the deck's native 10in × 5.625in at 96dpi) with every image,
  button, and text block positioned with the exact pixel coordinates
  converted from the original `.pptx` EMU values. The whole stage is then
  uniformly scaled with a CSS `transform: scale()` to fit any viewport —
  phone, tablet, or desktop — so the layout never reflows or breaks; it
  just gets bigger or smaller while staying identical to the original.
- **One screen at a time** — all 10 slides live in the DOM at once but
  only the active one is visible (`display`/`opacity` toggling), matching
  the deck's slide-by-slide flow. No scrolling, no URL/hash navigation.
- **Faithful interactions** — each slide's YES/NO-style buttons link to
  the same targets the original PowerPoint hyperlinks pointed to (YES
  always jumps to the final "yes" screen; the changing "no" button walks
  through the escalating slides; RETRY loops back to slide 1).
- **Runaway button** — the "no" button dodges on hover/tap, just like the
  classic version of this joke, while staying fully reachable by keyboard
  (Tab + Enter) for accessibility.
- **PWA** — installable with an offline-capable service worker, app icons,
  and a manifest so it can be added to a phone's home screen.

## File structure

```
/project
  index.html
  style.css
  script.js
  manifest.json
  service-worker.js
  assets/
    images/     — extracted slide artwork (image1–9.png)
    icons/      — generated PWA icons
  README.md
```

## Browser support

Latest Chrome, Edge, Safari, Firefox, and Android Chrome.
