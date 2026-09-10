# Aryan Engineers - Website

Modern, customer-engagement-focused website for **Aryan Engineers**, an industrial machinery manufacturer based in Pimpri-Chinchwad, Pune, India (established 2016).

## Tech
Plain, dependency-free **HTML + CSS + JavaScript** (no build step). Loads fast and hosts anywhere (GitHub Pages, Netlify, any static host or existing cPanel).

## Structure
```
index.html        Single-page site (all sections)
css/styles.css    Brand styling (Aryan blue #15499B + red #E1251B)
js/main.js        Products, video gallery, counters, carousel, form -> WhatsApp
```

## Features
- Video-led hero with brand messaging and animated stat counters
- Full product catalogue (16 machines) with category filters; every card opens a pre-filled WhatsApp enquiry
- "Machines in Action" video gallery with full-screen lightbox (real footage)
- Industries grid, why-us section, testimonials carousel
- Quote form that composes a WhatsApp message (no backend needed)
- Floating WhatsApp button, click-to-call, back-to-top, mobile menu
- Fully responsive and SEO-tagged

## Assets
Logo loads from `aryanengineers.net.in`. Photos and videos are served from the
CDN path `https://images.hungama.com/008/7D5/001/`. To self-host, download those
files into an `assets/` folder and update the URLs in `index.html` and `js/main.js`.

## Run locally
```
python3 -m http.server 8080
# open http://localhost:8080
```

## Customise
- **Products:** edit the `PRODUCTS` array in `js/main.js`.
- **Gallery videos:** edit the `VIDEOS` array in `js/main.js`.
- **Phone / WhatsApp:** change `WA_NUMBER` in `js/main.js` and the `tel:` links in `index.html`.
- **Testimonials:** placeholder quotes in `index.html` (`.testi` section) - replace with real client quotes.

---
Maintained for Aryan Engineers - Ajit More.

## Local design study (September 2026)

Run `python3 -m http.server 4177` from this folder.

- Redesigned site: http://localhost:4177/
- Original repository design: http://localhost:4177/original/

The redesign adds custom conceptual engineering artwork, application-based machinery search, accessible product detail dialogs, a multi-machine shortlist that fills the enquiry form, and a four-stage engineering process section in place of placeholder testimonials. Existing product descriptions, contact details and workshop media remain from the supplied repository. The illustration is conceptual, not a product specification. External photos, video and fonts still require an internet connection.

The enquiry button opens WhatsApp with a draft; visitors must send the message themselves. No enquiry is sent by this site directly.
