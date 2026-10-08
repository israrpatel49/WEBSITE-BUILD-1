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

## Real project photos
Each project card shows a generated skyline drawn from the project's own tower and floor counts, labelled "Illustration". To show official images on a project page, add:

```
assets/projects/{id}-elevation.jpg
assets/projects/{id}-floorplan.jpg
```

`{id}` is the project's `id` in `data.js`, for example `palais` or `olympus`. The images appear automatically.

## Known trade-offs
- Pages are rendered in the browser (hash routes such as `#/project/palais`). Google can index JavaScript-rendered pages, but more slowly and less reliably than plain static HTML. If organic search traffic matters, the next step is to pre-render one HTML file per project.
- Map pins sit at approximate locality centres, not at exact sites.
