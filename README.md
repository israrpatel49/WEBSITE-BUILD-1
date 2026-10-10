# Livarea — Hyderabad real estate site

## Deploy (the short version)
Recommended: **Cloudflare Pages** connected to this GitHub repo — build command empty, output directory `dist`. Every push then redeploys automatically.

Upload the **`dist/`** folder to any static host — Netlify, Vercel, Cloudflare Pages, GitHub Pages or cPanel — and point `www.livarea.in` at it. That's the production site: every page is pre-rendered HTML with clean URLs (`/project/palais/`, `/locality/kokapet/`), so Google, Bing, ChatGPT, Perplexity and other AI answer engines can read it all.

After deploying:
1. Submit `https://www.livarea.in/sitemap.xml` in **Google Search Console** and **Bing Webmaster Tools**.
2. Create/claim the **Google Business Profile** for Livarea with the same name, phone and address as the site.
3. Set up the lead Sheet (see *Leads* below) — until then, leads reach you only via WhatsApp.

## Rebuild after editing content
```
npm i -D playwright && npx playwright install chromium   # once
node tools/build.js
```
`index.html` + `assets/` is the editable source (it also runs as-is, with `#/` URLs, when opened locally). `tools/build.js` renders every page into `dist/`, and writes `sitemap.xml` (with image entries), `robots.txt`, `llms.txt` and `llms-full.txt`.

## What's built in for search & AI engines
- Unique title, description, canonical URL and social preview for every page
- schema.org JSON-LD: RealEstateAgent, WebSite (+ sitelinks search), ApartmentComplex, RealEstateListing with price, FAQPage, Place, ItemList, BreadcrumbList
- A factual one-paragraph summary and a Q&A section on every project and locality page — the content AI answer engines quote
- `llms.txt` / `llms-full.txt`: a plain-language fact sheet of every project for AI crawlers; `robots.txt` explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others
- Brochure PDFs are excluded from search (`robots.txt`, `X-Robots-Tag`) so the lead gate can't be bypassed from Google

## Editing content
Edit **`assets/js/data.js`** only. It holds:
- `LIVAREA`: phone, email, RERA number, and `leadEndpoint` (paste a Google Apps Script URL to also save every lead to a Sheet)
- `LOCALITIES`: price bands, outlook and map coordinates
- `PROJECTS`: one entry per project (fields are documented at the top of the array)
- `RESALE` / `RENTALS`: add verified listings here. While an array is empty, its page shows a requirement form instead of an empty list.
- `GUIDES` / `FAQ`: the FAQ schema for Google is generated from this array automatically

## Project photos
Add a `photos` list to a project in `data.js` (see Kohinoor, Pristinia and Olympus for examples):

```js
photos:[{ src:'assets/projects/kohinoor/01.jpg', cap:'The seven towers' }, …],
masterplan:'assets/projects/kohinoor/masterplan.jpg', floorplan:'assets/projects/kohinoor/floorplan.jpg',
```

The first photo is shown on the project card; all of them appear in the project page gallery and full-screen viewer. Keep each image under ~400 KB, about 1600 px wide. Projects without photos show a labelled illustration instead.

## Brochures (lead-gated)
PDFs live in `assets/brochures/` and are linked from each project's `brochure` field. A visitor must submit a valid name + WhatsApp number before the download starts; returning visitors confirm in one tap, and each download is logged as a lead for that project. Note: on any static site a determined person who already knows a PDF's exact URL can open it directly — the gate stops normal visitors and search engines, not someone sharing the file.

## Leads
Every form opens WhatsApp with the enquiry pre-filled — **but the visitor still has to press Send**. To capture every lead even when they don't, set up `tools/livarea-leads.gs` (instructions at the top of that file) and paste its URL into `leadEndpoint` in `data.js`. Each submission is then saved to a Google Sheet and emailed to you.

## Known trade-offs
- `dist/` must be rebuilt (`node tools/build.js`) after any content change, or the live site won't show it.
- Map pins sit at approximate locality centres, not at exact sites.
