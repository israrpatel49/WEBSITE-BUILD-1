#!/usr/bin/env node
/* =====================================================================
   LIVAREA — production build
   Pre-renders every page to static HTML so search engines and AI answer
   engines can read the full content without running JavaScript.

   Usage:   node tools/build.js
   Output:  dist/  — upload this folder to your web host (Netlify, Vercel,
            Cloudflare Pages, GitHub Pages, cPanel …).

   Needs Node 18+ and Playwright (npm i -D playwright, then
   npx playwright install chromium).
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const vm = require('vm');

let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) {
  try { ({ chromium } = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright'))); }
  catch (e2) { console.error('Playwright is required: npm i -D playwright && npx playwright install chromium'); process.exit(1); }
}

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// ---- load site data (same file the browser uses) ----
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8'), sandbox);
const { LIVAREA: C, PROJECTS, LOCALITIES, FAQ } = sandbox.window;
const SITE = (C.siteUrl || 'https://www.livarea.com').replace(/\/$/, '');
const TODAY = C.updated || new Date().toISOString().slice(0, 10);

// ---- routes to pre-render ----
const ROUTES = [
  { p: '/', pri: '1.0', freq: 'weekly' },
  { p: '/buy/', pri: '0.9', freq: 'weekly' },
  { p: '/commercial/', pri: '0.6', freq: 'monthly' },
  { p: '/rent/', pri: '0.6', freq: 'weekly' },
  { p: '/resale/', pri: '0.6', freq: 'weekly' },
  ...PROJECTS.map(pr => ({ p: `/project/${pr.id}/`, pri: '0.9', freq: 'weekly', images: (pr.photos || []).map(x => ({ src: x.src, cap: `${pr.name} by ${pr.builder} — ${x.cap}` })) })),
  { p: '/localities/', pri: '0.8', freq: 'monthly' },
  ...LOCALITIES.map(l => ({ p: `/locality/${l.slug}/`, pri: '0.7', freq: 'monthly' })),
  { p: '/builders/', pri: '0.6', freq: 'monthly' },
  ...['emi', 'afford', 'stamp', 'rentbuy', 'area'].map(t => ({ p: `/tools/${t}/`, pri: '0.6', freq: 'yearly' })),
  { p: '/upcoming/', pri: '0.6', freq: 'monthly' },
  { p: '/post/', pri: '0.7', freq: 'monthly' },
  { p: '/guides/', pri: '0.7', freq: 'monthly' },
  { p: '/about/', pri: '0.5', freq: 'yearly' },
  { p: '/partner/', pri: '0.4', freq: 'yearly' },
  { p: '/contact/', pri: '0.5', freq: 'yearly' },
  // not in sitemap (noindex), but pre-rendered so direct links load instantly
  { p: '/compare/', skipSitemap: true },
  { p: '/shortlist/', skipSitemap: true },
];

// ---- 1. fresh dist/ with source files ----
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), { recursive: true });
const template = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
  .replace('<html lang="en-IN">', '<html lang="en-IN" data-routing="path">')
  .replace(/(src|href)="assets\//g, '$1="/assets/');

// ---- 2. tiny static server: real files, else the app template ----
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(DIST, u);
  if (u.startsWith('/assets/') && f.startsWith(DIST) && fs.existsSync(f) && fs.statSync(f).isFile()) {
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    return fs.createReadStream(f).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': TYPES['.html'] }); res.end(template);
});

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const LOCAL = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  // Only the local site is needed to render; skip fonts, maps and other third parties.
  await ctx.route('**/*', r => r.request().url().startsWith(LOCAL) ? r.continue() : r.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  async function render(route, outFile) {
    await page.goto(LOCAL + route, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#app > *:not(noscript)', { timeout: 15000 });
    await page.waitForTimeout(150);
    const html = await page.evaluate(() => {
      // strip runtime-only state so the saved page is clean, deterministic HTML
      document.querySelectorAll('link[href*="leaflet"], script[src*="leaflet"], #modalBg, .lightbox').forEach(n => n.remove());
      document.querySelectorAll('.loc-map, #resultsMap').forEach(m => { m.innerHTML = ''; m.className = m.className.replace(/\s*leaflet\S*/g, ''); m.removeAttribute('tabindex'); m.removeAttribute('style'); });
      document.getElementById('app').classList.remove('fade-in');
      document.body.removeAttribute('style');
      const t = document.getElementById('toast'); if (t) { t.textContent = ''; t.className = 'toast'; }
      return '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
    });
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html);
  }

  for (const r of ROUTES) {
    await render(r.p, path.join(DIST, r.p, 'index.html'));
    process.stdout.write('.');
  }
  await render('/page-not-found/', path.join(DIST, '404.html'));
  console.log(`\nPre-rendered ${ROUTES.length + 1} pages`);
  await browser.close(); server.close();
  if (errors.length) { console.error('Page errors:\n  ' + [...new Set(errors)].join('\n  ')); process.exit(1); }

  // ---- 3. sitemap.xml (with image entries for project photos) ----
  const xe = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const sm = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...ROUTES.filter(r => !r.skipSitemap).map(r => `  <url><loc>${SITE}${r.p}</loc><lastmod>${TODAY}</lastmod><changefreq>${r.freq}</changefreq><priority>${r.pri}</priority>` +
      (r.images || []).map(i => `<image:image><image:loc>${SITE}/${i.src.replace(/^\//, '')}</image:loc><image:title>${xe(i.cap)}</image:title></image:image>`).join('') + '</url>'),
    '</urlset>', ''].join('\n');
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sm);

  // ---- 4. robots.txt — welcome search and AI crawlers, keep gated brochures out of search ----
  fs.writeFileSync(path.join(DIST, 'robots.txt'), [
    '# Livarea — all crawlers welcome, including AI answer engines.',
    'User-agent: *', 'Allow: /', 'Disallow: /assets/brochures/', 'Disallow: /compare/', 'Disallow: /shortlist/', '',
    ...['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot']
      .flatMap(b => [`User-agent: ${b}`, 'Allow: /', 'Disallow: /assets/brochures/', '']),
    `Sitemap: ${SITE}/sitemap.xml`, ''].join('\n'));

  // ---- 5. llms.txt / llms-full.txt — plain-language site summary for AI engines ----
  const locName = pr => (LOCALITIES.find(l => l.slug === pr.loc) || {}).name || pr.locality;
  const line = pr => `- [${pr.name} by ${pr.builder}](${SITE}/project/${pr.id}/): ${pr.bhkLabel}, ${pr.locality}, Hyderabad. ${pr.price}${pr.sqft ? `; ${pr.sqft[0]}–${pr.sqft[1]} sq.ft` : ''}${pr.rera ? `; ${pr.rera}` : ''}.`;
  const llms = [`# Livarea`, '',
    `> Livarea is a Hyderabad real estate advisory (15+ years) and authorised marketing associate for leading developers. TS RERA agent registration ${C.rera}. Contact: ${C.phoneDisplay} (call/WhatsApp), ${C.email}. Prices are indicative starting prices compiled from public listings as of ${C.pricesAsOf}; information last updated ${TODAY}.`, '',
    '## Projects', ...PROJECTS.map(line), '',
    '## Localities', ...LOCALITIES.map(l => `- [${l.name}, Hyderabad](${SITE}/locality/${l.slug}/): ${l.tag}.${l.band ? ` Price band ${l.band}; outlook ${l.appr}.` : ''}`), '',
    '## Guides and tools',
    `- [Buying property in Hyderabad — guides & FAQ](${SITE}/guides/): RERA, documents, stamp duty (~6% in urban Telangana), home loans, safety.`,
    `- [EMI calculator](${SITE}/tools/emi/), [Affordability](${SITE}/tools/afford/), [Stamp duty](${SITE}/tools/stamp/), [Rent vs buy](${SITE}/tools/rentbuy/), [Area converter](${SITE}/tools/area/)`,
    `- [List a property for sale or rent](${SITE}/post/)`, '',
    '## Optional', `- [Full project fact sheet](${SITE}/llms-full.txt)`, ''].join('\n');
  fs.writeFileSync(path.join(DIST, 'llms.txt'), llms);
  const full = [`# Livarea — full project fact sheet`, '', `Source: ${SITE}/ · Updated ${TODAY} · Prices indicative as of ${C.pricesAsOf}; confirm the official cost sheet before booking.`, '',
    ...PROJECTS.map(pr => [`## ${pr.name} by ${pr.builder}`, `URL: ${SITE}/project/${pr.id}/`,
      `- Location: ${pr.locality}, Hyderabad (${locName(pr)})`, `- Type: ${pr.type}`, `- Configuration: ${pr.bhkLabel}`,
      pr.sqft ? `- Size: ${pr.sqft[0]}–${pr.sqft[1]} sq.ft` : null, `- Price: ${pr.price} — ${pr.priceNote}`,
      pr.rera ? `- RERA: ${pr.rera}` : '- RERA: ask Livarea', pr.possession ? `- Possession: ${pr.possession}` : null,
      ...(pr.stats || []).map(s => `- ${s.l}: ${s.v}`), `- Units: ${pr.configs.map(c => `${c.c} (${c.a})`).join('; ')}`,
      ...(pr.highlights || []).map(h => `- ${h}`), '', pr.blurb, ''].filter(x => x !== null).join('\n')),
    '## Frequently asked questions', ...FAQ.flatMap(c => c.items.map(([q, a]) => `### ${q}\n${a}\n`))].join('\n');
  fs.writeFileSync(path.join(DIST, 'llms-full.txt'), full);

  // ---- 6. host helpers ----
  fs.writeFileSync(path.join(DIST, '.nojekyll'), '');
  // Apache / LiteSpeed hosts (Hostinger, cPanel): same rules as _headers, plus 404 page and canonical host.
  const host = new URL(SITE).hostname, bare = host.replace(/^www\./, '');
  fs.writeFileSync(path.join(DIST, '.htaccess'), [
    '# Livarea — server settings for Hostinger / Apache. Generated by tools/build.js.',
    'Options -Indexes', 'DirectoryIndex index.html', 'ErrorDocument 404 /404.html', 'AddDefaultCharset utf-8', '',
    '<IfModule mod_rewrite.c>', 'RewriteEngine On',
    '# Always use HTTPS (turn on the free SSL in hPanel first)', 'RewriteCond %{HTTPS} off', 'RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
    ...(host !== bare ? [`# ${bare} -> ${host}, so Google sees one site`, `RewriteCond %{HTTP_HOST} ^${bare.replace(/\./g, '\\.')}$ [NC]`, `RewriteRule ^ https://${host}%{REQUEST_URI} [L,R=301]`] : []),
    '</IfModule>', '',
    '<IfModule mod_headers.c>',
    '  # Keep gated brochures out of search results', '  <FilesMatch "\\.pdf$">', '    Header set X-Robots-Tag "noindex, nofollow"', '  </FilesMatch>',
    '  <FilesMatch "\\.(jpg|jpeg|png|pdf)$">', '    Header set Cache-Control "public, max-age=604800"', '  </FilesMatch>',
    '  # Short cache so price/content updates show up within the hour', '  <FilesMatch "\\.(js|css)$">', '    Header set Cache-Control "public, max-age=3600"', '  </FilesMatch>',
    '</IfModule>', '',
    '<IfModule mod_deflate.c>', '  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript text/plain application/xml image/svg+xml', '</IfModule>', ''].join('\n'));
  fs.writeFileSync(path.join(DIST, '_headers'), ['/assets/brochures/*', '  X-Robots-Tag: noindex, nofollow', '/assets/*', '  Cache-Control: public, max-age=604800', ''].join('\n'));
  console.log(`Wrote sitemap.xml (${ROUTES.filter(r => !r.skipSitemap).length} URLs), robots.txt, llms.txt, llms-full.txt → ${path.relative(ROOT, DIST)}/`);
})().catch(e => { console.error(e); server.close(); process.exit(1); });
