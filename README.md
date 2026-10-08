# Livarea — Hyderabad real estate site

A static property portal. There is no build step: upload the folder to any static host (Netlify, Vercel, GitHub Pages, cPanel) and open `index.html`.

## What's in it
- **Search** across projects, localities and builders, with autocomplete
- **Results** with filters (budget, BHK, locality, builder, RERA, brochure), sorting, and grid, list and map views. Every filter is saved in the URL, so a search can be shared as a link.
- **Project pages**: overview, configuration table, price-per-sq.ft position within the corridor band, location map, EMI estimate, other projects by the same developer, similar projects, and enquiry, site-visit and brochure forms
- **Compare** up to 3 projects side by side (also shareable by link), plus a **Shortlist**
- **Tools**: EMI, affordability, stamp duty (Telangana), rent vs buy, area converter
- **Rent / Resale**, **Pre-launch**, **List your property**, **Localities**, **Builders**, **Guides & FAQ**, **For developers**, **Contact**

Every form opens WhatsApp (+91 70200 39986) with a pre-filled message.

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

## Leads
Every form opens WhatsApp with the enquiry pre-filled — **but the visitor still has to press Send**. To capture every lead even when they don't, set up `tools/livarea-leads.gs` (instructions at the top of that file) and paste its URL into `leadEndpoint` in `data.js`. Each submission is then saved to a Google Sheet and emailed to you.

## Known trade-offs
- Pages are rendered in the browser (hash routes such as `#/project/palais`). Google can index JavaScript-rendered pages, but more slowly and less reliably than plain static HTML. If organic search traffic matters, the next step is to pre-render one HTML file per project.
- Map pins sit at approximate locality centres, not at exact sites.
