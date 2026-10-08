/* =====================================================================
   LIVAREA — application
   Hash-routed single-page app. All content comes from data.js.
   ===================================================================== */
(function(){
  'use strict';

  const C = window.LIVAREA, PROJECTS = window.PROJECTS, LOCS = window.LOCALITIES;
  const RESALE = window.RESALE || [], RENTALS = window.RENTALS || [];
  const app = document.getElementById('app');

  /* ---------------- helpers ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  const slugify = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const LOC = Object.fromEntries(LOCS.map(l => [l.slug, l]));
  const PBYID = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
  const BUILDERS = (() => {
    const m = new Map();
    PROJECTS.forEach(p => {
      const k = slugify(p.builder);
      if(!m.has(k)) m.set(k, { slug:k, name:p.builder, projects:[] });
      m.get(k).projects.push(p);
    });
    return Array.from(m.values());
  })();
  const BBY = Object.fromEntries(BUILDERS.map(b => [b.slug, b]));
  const budgetOf = p => p.minCr != null ? p.minCr : (p.budgetBand != null ? p.budgetBand : null);
  const projectsIn = slug => PROJECTS.filter(p => p.loc === slug);

  function inr(n){ return '₹' + Math.round(n).toLocaleString('en-IN'); }
  function words(n){
    if(!isFinite(n) || n <= 0) return '';
    if(n >= 1e7) return '₹' + (n/1e7).toLocaleString('en-IN', { maximumFractionDigits:2 }) + ' Cr';
    if(n >= 1e5) return '₹' + (n/1e5).toLocaleString('en-IN', { maximumFractionDigits:2 }) + ' L';
    return inr(n);
  }
  function crLabel(v){ return v >= 1 ? '₹' + v + ' Cr' : '₹' + Math.round(v*100) + ' L'; }
  function sqftLabel(p){ return p.sqft ? p.sqft[0].toLocaleString('en-IN') + ' – ' + p.sqft[1].toLocaleString('en-IN') + ' sq.ft' : 'On request'; }
  function emi(P, annual, years){
    const r = annual/12/100, n = years*12;
    if(P <= 0 || n <= 0) return 0;
    if(r === 0) return P/n;
    return P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  }

  /* ---------------- storage (per-viewer conveniences only) ---------------- */
  const store = {
    get(k, d){ try{ const v = localStorage.getItem('lv_' + k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
    set(k, v){ try{ localStorage.setItem('lv_' + k, JSON.stringify(v)); }catch(e){} }
  };
  const valid = ids => (Array.isArray(ids) ? ids : []).filter(id => PBYID[id]);
  let shortlist = valid(store.get('shortlist', []));
  let compare = valid(store.get('compare', [])).slice(0, 3);
  let recent = valid(store.get('recent', []));

  /* ---------------- leads ---------------- */
  function saveLead(source, d){
    try{
      if(!C.leadEndpoint) return;
      const body = JSON.stringify(Object.assign({ source:source, page:location.href, at:new Date().toISOString() }, d));
      if(navigator.sendBeacon) navigator.sendBeacon(C.leadEndpoint, new Blob([body], { type:'text/plain' }));
      else fetch(C.leadEndpoint, { method:'POST', mode:'no-cors', body:body, keepalive:true });
    }catch(e){}
  }
  const waLink = text => 'https://wa.me/' + C.phone + '?text=' + encodeURIComponent(text);
  function openWA(text){
    // In-app browsers (Instagram, Facebook) often block popups; fall back to the same tab
    // so the enquiry is never silently lost.
    const url = waLink(text), w = window.open(url, '_blank');
    if(w) { try{ w.opener = null; }catch(e){} } else location.href = url;
  }
  const telLink = 'tel:+' + C.phone;

  /* ---------------- icons ---------------- */
  const I = {
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2.5a7 7 0 017 7C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20.5S3.5 15.3 3.5 9.2A4.7 4.7 0 0112 6.6a4.7 4.7 0 018.5 2.6c0 6.1-8.5 11.3-8.5 11.3z"/></svg>',
    phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/></svg>',
    wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.83 14.12c-.24.68-1.39 1.3-1.92 1.38-.49.08-1.1.11-1.78-.11-.41-.13-.94-.3-1.61-.6-2.84-1.23-4.69-4.1-4.83-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.37.26-.28.57-.35.76-.35.19 0 .38 0 .54.01.17.01.4-.07.63.48.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.6-.07.17-.19.71-.82.9-1.1.19-.28.38-.23.63-.14.26.09 1.65.78 1.93.92.28.14.47.21.53.33.07.12.07.68-.17 1.36z"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    building:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 21V5l8-3v19M12 21V8l8 3v10M2 21h20M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"/></svg>',
    home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/></svg>',
    key:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/></svg>',
    briefcase:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 13h18"/></svg>',
    bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/></svg>',
    crown:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 18h18l-1.5-10-4.5 4-3-7-3 7-4.5-4z"/></svg>',
    calc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6.5h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18h4"/></svg>',
    wallet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 7H5a2 2 0 010-4h13v4M3 5v14a2 2 0 002 2h15V7"/><circle cx="16" cy="14" r="1.3"/></svg>',
    doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    ruler:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/></svg>',
    scale:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3v18M5 21h14M4 7h16M7 7l-3 7a3 3 0 006 0zM17 7l-3 7a3 3 0 006 0z"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>',
    x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    filter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
    grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>',
    list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
    share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/></svg>',
    compare:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/></svg>',
    menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 7M21.5 20a6.5 6.5 0 00-4-6"/></svg>',
    spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/></svg>'
  };

  /* ---------------- procedural project illustration ----------------
     Each project gets a deterministic skyline drawn from its own numbers
     (towers, floors). It is labelled "Illustration" everywhere — real
     elevations come from assets/projects/{id}-elevation.jpg. */
  let artSeq = 0;
  function rng(seed){
    let h = 2166136261;
    for(let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
    return function(){ h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  }
  const SKIES = [['#2a0f18','#6E2438','#d68a92'],['#1d1430','#4e2a56','#e09a83'],['#132030','#33506a','#e2b088'],['#24101a','#7b3346','#f0b9a0']];
  const WARM = ['#c9785a','#d9a274','#b5624b','#e4bc92','#a8573f','#cf8e66'];
  function art(p){
    const r = rng(p.id), id = 'ar' + (++artSeq), W = 640, H = 400;
    const cfg = p.art || {}, n = Math.max(1, Math.min(cfg.towers || 2, 7)), floors = cfg.floors || 32;
    const sky = SKIES[Math.floor(r()*SKIES.length)], ground = H - (p.lake ? 74 : 54);
    let s = `<svg class="art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of ${esc(p.name)}"><defs>`+
      `<linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset=".62" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/></linearGradient>`+
      `<linearGradient id="${id}t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${cfg.office ? '#9fb3c4' : '#f3ebe6'}"/><stop offset="1" stop-color="${cfg.office ? '#6f8597' : '#cdbdb6'}"/></linearGradient>`+
      `<pattern id="${id}w" width="12" height="11" patternUnits="userSpaceOnUse">${cfg.office ? '<rect x="0" y="0" width="10" height="11" fill="rgba(22,40,58,.45)"/>' : '<rect x="2" y="3" width="7" height="5" rx="1" fill="rgba(45,30,36,.42)"/>'}</pattern>`+
      `<linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[2]}" stop-opacity=".55"/><stop offset="1" stop-color="#1c2b3a"/></linearGradient></defs>`;
    s += `<rect width="${W}" height="${H}" fill="url(#${id}s)"/>`;
    s += `<circle cx="${Math.round(80 + r()*480)}" cy="${Math.round(70 + r()*70)}" r="${Math.round(20 + r()*14)}" fill="#fff3e8" opacity=".55"/>`;
    for(let i = 0; i < 18; i++){
      const bw = 18 + r()*34, bh = 30 + r()*110, bx = i*(W/17) - 10 + r()*12;
      s += `<rect x="${bx.toFixed(1)}" y="${(ground - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="#fff" opacity=".07"/>`;
    }
    const span = Math.min(W*0.78, 140 + n*80), gap = n > 1 ? Math.min(26, span*0.06) : 0;
    const tw = Math.min(n === 1 ? 96 : 84, (span - gap*(n-1))/n);
    const x0 = (W - (tw*n + gap*(n-1)))/2 + (r()-.5)*30;
    const maxH = ground - 36, baseH = 120 + (Math.min(floors, 65)/65)*(maxH - 120);
    const tops = [];
    for(let i = 0; i < n; i++){
      const th = Math.max(90, Math.min(maxH, baseH*(0.9 + r()*0.12) - (n > 3 ? Math.abs(i - (n-1)/2)*10 : 0)));
      const tx = x0 + i*(tw + gap), ty = ground - th;
      tops.push({ tx, ty, th });
      const fill = cfg.warm ? WARM[i % WARM.length] : `url(#${id}t)`;
      s += `<rect x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" width="${tw.toFixed(1)}" height="${th.toFixed(1)}" fill="${fill}"/>`;
      s += `<rect x="${(tx + tw*0.7).toFixed(1)}" y="${ty.toFixed(1)}" width="${(tw*0.3).toFixed(1)}" height="${th.toFixed(1)}" fill="#000" opacity=".16"/>`;
      s += `<rect x="${(tx + 5).toFixed(1)}" y="${(ty + 12).toFixed(1)}" width="${(tw - 10).toFixed(1)}" height="${(th - 20).toFixed(1)}" fill="url(#${id}w)"/>`;
      s += `<rect x="${(tx - 3).toFixed(1)}" y="${(ty - 6).toFixed(1)}" width="${(tw + 6).toFixed(1)}" height="7" fill="${cfg.warm ? '#7a3a2a' : '#3b2a30'}" opacity=".85"/>`;
      if(!cfg.office){
        const cols = Math.floor((tw - 10)/12), rows = Math.floor((th - 20)/11);
        for(let k = 0; k < 9; k++){
          const c = Math.floor(r()*cols), rr = Math.floor(r()*rows);
          const wx = Math.ceil((tx + 5)/12)*12 + c*12 + 2, wy = Math.ceil((ty + 12)/11)*11 + rr*11 + 3;
          if(wx + 7 < tx + tw - 4 && wy + 5 < ground - 8) s += `<rect x="${wx}" y="${wy}" width="7" height="5" rx="1" fill="#ffd89a" opacity=".9"/>`;
        }
      }
    }
    if(cfg.bridge && tops.length > 1){
      const by = Math.max(...tops.map(t => t.ty)) + 14;
      s += `<rect x="${(tops[0].tx + tw).toFixed(1)}" y="${by.toFixed(1)}" width="${(tops[tops.length-1].tx - tops[0].tx - tw).toFixed(1)}" height="12" fill="#efe4de" opacity=".95"/>`;
    }
    if(p.lake){
      s += `<rect x="0" y="${ground}" width="${W}" height="${H - ground}" fill="url(#${id}l)"/>`;
      for(let i = 0; i < 7; i++) s += `<rect x="${(r()*W).toFixed(0)}" y="${(ground + 10 + r()*(H - ground - 16)).toFixed(0)}" width="${(30 + r()*80).toFixed(0)}" height="2" fill="#fff" opacity=".18"/>`;
      s += `<rect x="0" y="${ground - 6}" width="${W}" height="8" fill="#1f2a22"/>`;
    } else {
      s += `<rect x="0" y="${ground}" width="${W}" height="${H - ground}" fill="#22151a"/>`;
      s += `<rect x="${(x0 - 20).toFixed(1)}" y="${ground - 10}" width="${(tw*n + gap*(n-1) + 40).toFixed(1)}" height="12" fill="#3a2a2f"/>`;
    }
    for(let i = 0; i < 16; i++){
      const cx = r()*W, rad = 7 + r()*9;
      s += `<circle cx="${cx.toFixed(0)}" cy="${(ground - rad*0.5).toFixed(0)}" r="${rad.toFixed(0)}" fill="#1f3a2c" opacity=".92"/>`;
    }
    return s + '</svg>';
  }

  /* ---------------- real photos & lightbox ---------------- */
  function cover(p){
    return p.photos ? `<img src="${esc(p.photos[0].src)}" alt="${esc(p.name + ' — ' + p.photos[0].cap)}" loading="lazy" decoding="async">` : art(p);
  }
  function planSlides(p){
    return [p.masterplan && { src:p.masterplan, cap:'Master plan', plan:true }, p.floorplan && { src:p.floorplan, cap:'Typical floor plan', plan:true }].filter(Boolean);
  }
  function photoGallery(p){
    const all = p.photos.concat(planSlides(p)), side = all.slice(1, 3), more = all.length - 3;
    return `<div class="gallery photos">
      <button type="button" data-lb="0"><img src="${esc(all[0].src)}" alt="${esc(p.name + ' — ' + all[0].cap)}"><span class="g-label tag dark">Developer render</span></button>
      ${side.map((s, i) => `<button type="button" data-lb="${i + 1}"><img src="${esc(s.src)}" alt="${esc(p.name + ' — ' + s.cap)}" class="${s.plan ? 'contain' : ''}" loading="lazy">${i === 1 && more > 0 ? `<span class="g-more">+${more} more</span>` : `<span class="g-label tag">${esc(s.cap)}</span>`}</button>`).join('')}
    </div>`;
  }
  let lb = null;
  function openLightbox(slides, start, title){
    if(!lb){
      lb = document.createElement('div'); lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
      lb.innerHTML = `<div class="lb-top"><span class="lb-title"></span><span class="lb-count"></span><button class="lb-x" aria-label="Close">${I.x}</button></div>
        <div class="lb-stage"><button class="lb-nav prev" aria-label="Previous">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-nav next" aria-label="Next">›</button></div>
        <div class="lb-thumbs"></div>`;
      document.body.appendChild(lb);
      lb.addEventListener('click', e => {
        if(e.target.closest('.lb-x') || e.target === lb || e.target.classList.contains('lb-stage')) closeLb();
        else if(e.target.closest('.prev')) lb.go(-1);
        else if(e.target.closest('.next')) lb.go(1);
        else { const t = e.target.closest('[data-i]'); if(t) lb.show(+t.dataset.i); }
      });
      let x0 = null;
      lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive:true });
      lb.addEventListener('touchend', e => { if(x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if(Math.abs(dx) > 45) lb.go(dx < 0 ? 1 : -1); x0 = null; });
      document.addEventListener('keydown', e => {
        if(!lb.classList.contains('open')) return;
        if(e.key === 'ArrowRight') lb.go(1); else if(e.key === 'ArrowLeft') lb.go(-1); else if(e.key === 'Escape') closeLb();
      });
    }
    let i = start;
    lb.show = n => {
      i = (n + slides.length) % slides.length;
      const s = slides[i], img = $('figure img', lb);
      img.src = s.src; img.alt = title + ' — ' + s.cap; img.classList.toggle('plan', !!s.plan);
      $('figcaption', lb).textContent = s.cap + (s.plan ? '' : ' · developer render');
      $('.lb-count', lb).textContent = (i + 1) + ' / ' + slides.length;
      $$('.lb-thumbs button', lb).forEach((b, k) => b.classList.toggle('on', k === i));
      const on = $('.lb-thumbs .on', lb); if(on) on.scrollIntoView({ block:'nearest', inline:'center' });
    };
    lb.go = d => lb.show(i + d);
    $('.lb-title', lb).textContent = title;
    $('.lb-thumbs', lb).innerHTML = slides.map((s, k) => `<button data-i="${k}" aria-label="${esc(s.cap)}"><img src="${esc(s.src)}" alt="" loading="lazy"></button>`).join('');
    lb.classList.add('open'); document.body.style.overflow = 'hidden';
    lb.show(start); $('.lb-x', lb).focus();
  }
  function closeLb(){ if(lb){ lb.classList.remove('open'); document.body.style.overflow = ''; } }
  window.addEventListener('hashchange', closeLb);

  /* ---------------- shared fragments ---------------- */
  function reraTag(p){ return p.rera ? `<span class="tag ok">${I.shield}RERA</span>` : ''; }
  function heartBtn(id){
    const on = shortlist.includes(id);
    return `<button class="icon-btn${on ? ' on' : ''}" data-heart="${id}" aria-pressed="${on}" aria-label="${on ? 'Remove from' : 'Add to'} shortlist">${I.heart}</button>`;
  }
  function priceSub(p){
    if(p.psf) return '~' + inr(p.psf) + '/sq.ft';
    return '';
  }
  function card(p){
    const l = LOC[p.loc];
    return `<article class="p-card">
      <a class="p-media" href="#/project/${p.id}" aria-label="${esc(p.name)} details">${cover(p)}
        <span class="p-tags">${p.type === 'commercial' ? '<span class="tag dark">Commercial</span>' : ''}${reraTag(p)}${p.brochure ? '<span class="tag">Brochure</span>' : ''}</span>
        ${p.photos ? `<span class="illus-note">${p.photos.length} photo${p.photos.length > 1 ? 's' : ''}</span>` : '<span class="illus-note">Illustration</span>'}</a>
      <span class="p-heart">${heartBtn(p.id)}</span>
      <div class="p-body">
        <div class="p-price"><b>${esc(p.price)}</b><small>${priceSub(p)}</small></div>
        <h3 class="p-title"><a href="#/project/${p.id}">${esc(p.name)}</a></h3>
        <p class="p-sub">by ${esc(p.builder)}</p>
        <p class="p-sub">${I.pin}${esc(l ? l.name : p.locality)}, Hyderabad</p>
        <p class="p-desc">${esc(p.blurb)}</p>
        <div class="p-facts">
          <div><span>Config</span><b>${esc(p.bhkLabel)}</b></div>
          <div><span>Size</span><b>${p.sqft ? (p.sqft[0]/1000).toFixed(1).replace('.0','') + 'k–' + (p.sqft[1]/1000).toFixed(1).replace('.0','') + 'k sq.ft' : 'On request'}</b></div>
        </div>
        <label class="cmp-check"><input type="checkbox" data-cmp="${p.id}" ${compare.includes(p.id) ? 'checked' : ''}> Compare</label>
        <div class="p-actions">
          <a class="btn btn-ghost btn-sm" href="#/project/${p.id}">View details</a>
          <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink("Hi Livarea, I'm interested in " + p.wa + '.')}">${I.wa}Contact</a>
        </div>
      </div>
    </article>`;
  }
  function listingCard(x, kind){
    const l = LOC[x.loc];
    const media = x.img
      ? `<div class="p-media"><img src="${esc(x.img)}" alt="${esc(x.title)}" loading="lazy"></div>`
      : `<div class="p-media">${art({ id:x.id, name:x.title, art:{ towers:1, floors:20 } })}<span class="illus-note">Illustration</span></div>`;
    return `<article class="p-card">${media}
      <div class="p-body">
        <div class="p-price"><b>${esc(x.price)}</b></div>
        <h3 class="p-title">${esc(x.title)}</h3>
        <p class="p-sub">${I.pin}${esc(l ? l.name : x.loc)}, Hyderabad</p>
        <div class="p-facts"><div><span>Area</span><b>${esc(x.area || '—')}</b></div><div><span>Floor</span><b>${esc(x.floor || '—')}</b></div><div><span>${kind === 'rent' ? 'Deposit' : 'Age'}</span><b>${esc((kind === 'rent' ? x.deposit : x.age) || '—')}</b></div></div>
        <p class="p-sub">${esc([x.facing && x.facing + ' facing', x.furnishing].filter(Boolean).join(' · '))}</p>
        <div class="p-actions"><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink("Hi Livarea, I'm interested in the " + x.title + ' (' + (kind === 'rent' ? 'rental' : 'resale') + ').')}">${I.wa}Enquire on WhatsApp</a></div>
      </div></article>`;
  }
  function locCard(l){
    const c = projectsIn(l.slug).length;
    return `<a class="loc-card" href="#/locality/${l.slug}">
      <h3>${esc(l.name)}${c ? `<span class="loc-count">${c} project${c > 1 ? 's' : ''}</span>` : ''}</h3>
      <span class="lc-tag">${esc(l.tag)}</span>
      <p>${esc(l.blurb)}</p>
      ${l.band ? `<div class="loc-metrics"><div><span>Price band</span><b>${esc(l.band)}</b></div><div><span>Outlook</span><b>${esc(l.appr)}</b></div></div>` : ''}
    </a>`;
  }
  function emptyState(icon, title, text, actions){
    return `<div class="empty-state"><div class="e-ico">${icon}</div><h3>${title}</h3><p>${text}</p>${actions || ''}</div>`;
  }
  const leadNote = '<p class="form-note">Your details are used by Livarea only to respond to your enquiry — never sold or shared.</p>';
  const timeOpts = '<option>Morning (9 am – 12 pm)</option><option>Afternoon (12 – 4 pm)</option><option>Evening (4 – 8 pm)</option><option>Anytime</option>';
  const typeOpts = '<option>Flat / Apartment</option><option>Villa</option><option>Plot / Land</option><option>Independent House</option><option>Commercial / Retail</option><option>Not sure yet</option>';
  const budgetOpts = '<option>Under ₹1 Cr</option><option>₹1–2 Cr</option><option>₹2–4 Cr</option><option>₹4–7 Cr</option><option>₹7 Cr+</option><option>Not sure yet</option>';
  const locDatalist = () => '<datalist id="locList">' + LOCS.map(l => `<option value="${esc(l.name)}">`).join('') + ['Madhapur','Manikonda','Miyapur','Bachupally','Jubilee Hills','Banjara Hills','Secunderabad','Kompally','Shamshabad'].map(n => `<option value="${n}">`).join('') + '</datalist>';

  /* ---------------- typeahead ---------------- */
  const SUGGEST_INDEX = [].concat(
    LOCS.map(l => ({ kind:'Locality', label:l.name, sub:(projectsIn(l.slug).length || 'No') + ' listed projects · ' + (l.band || 'West Hyderabad'), go:'#/buy?loc=' + l.slug, icon:I.pin, key:(l.name + ' ' + l.group).toLowerCase() })),
    PROJECTS.map(p => ({ kind:'Project', label:p.name, sub:p.builder + ' · ' + (LOC[p.loc] ? LOC[p.loc].name : p.locality) + ' · ' + p.price, go:'#/project/' + p.id, icon:I.building, key:(p.name + ' ' + p.builder + ' ' + p.locality).toLowerCase() })),
    BUILDERS.map(b => ({ kind:'Builder', label:b.name, sub:b.projects.length + ' project' + (b.projects.length > 1 ? 's' : '') + ' with Livarea', go:'#/buy?builder=' + b.slug, icon:I.users, key:b.name.toLowerCase() }))
  );
  function attachSuggest(input, box, onSubmit){
    let hl = -1, items = [];
    function render(){
      const q = input.value.trim().toLowerCase();
      if(!q){
        items = SUGGEST_INDEX.filter(x => x.kind === 'Locality' && projectsIn(LOCS.find(l => l.name === x.label).slug).length).slice(0, 6);
      } else {
        const terms = q.split(/\s+/);
        items = SUGGEST_INDEX.filter(x => terms.every(t => x.key.includes(t)))
          .sort((a, b) => (b.key.startsWith(q) - a.key.startsWith(q)))
          .slice(0, 8);
      }
      hl = -1;
      box.innerHTML = (!q ? '<div class="suggest-empty" style="padding:8px 10px 4px">Popular localities</div>' : '') +
        (items.length ? items.map((x, i) => `<div class="suggest-item" role="option" data-i="${i}"><span class="s-ico">${x.icon}</span><span><b>${esc(x.label)}</b><small>${esc(x.sub)}</small></span><span class="s-kind">${x.kind}</span></div>`).join('')
          : `<div class="suggest-empty">No exact match for “${esc(input.value)}”. Press Enter to search all projects, or <a class="inline-link" href="#/contact">ask us</a> — we cover more of Hyderabad than is listed.</div>`);
      box.classList.add('open');
    }
    function close(){ box.classList.remove('open'); }
    function pick(i){ const x = items[i]; if(!x) return; close(); input.blur(); location.hash = x.go; }
    input.setAttribute('autocomplete', 'off');
    input.addEventListener('focus', render);
    input.addEventListener('input', render);
    input.addEventListener('keydown', e => {
      const els = $$('.suggest-item', box);
      if(e.key === 'ArrowDown'){ e.preventDefault(); hl = Math.min(hl + 1, els.length - 1); }
      else if(e.key === 'ArrowUp'){ e.preventDefault(); hl = Math.max(hl - 1, 0); }
      else if(e.key === 'Enter'){ e.preventDefault(); if(hl >= 0) pick(hl); else { close(); onSubmit(input.value.trim()); } return; }
      else if(e.key === 'Escape'){ close(); return; }
      else return;
      els.forEach((el, i) => el.classList.toggle('hl', i === hl));
      if(els[hl]) els[hl].scrollIntoView({ block:'nearest' });
    });
    box.addEventListener('mousedown', e => { const it = e.target.closest('.suggest-item'); if(it){ e.preventDefault(); pick(+it.dataset.i); } });
    const outside = e => { if(!document.body.contains(box)){ document.removeEventListener('click', outside); return; } if(!box.contains(e.target) && e.target !== input) close(); };
    document.addEventListener('click', outside);
  }

  /* ---------------- map (Leaflet, lazy-loaded) ---------------- */
  let leafletP = null;
  function loadLeaflet(){
    if(window.L) return Promise.resolve(window.L);
    if(leafletP) return leafletP;
    leafletP = new Promise((res, rej) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(css);
      const js = document.createElement('script');
      js.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      js.onload = () => res(window.L); js.onerror = () => { leafletP = null; rej(new Error('map failed')); };
      document.head.appendChild(js);
    });
    return leafletP;
  }
  // Projects share (or sit beside) locality centres; nudge pins apart so none overlap.
  const PIN_POS = (() => {
    const pts = PROJECTS.map(p => {
      const l = LOC[p.loc], same = projectsIn(p.loc), a = same.indexOf(p)/same.length*Math.PI*2 + 0.6;
      return same.length > 1 ? [l.lat + Math.sin(a)*0.006, l.lng + Math.cos(a)*0.006] : [l.lat, l.lng];
    });
    // Price pins are ~2.6x wider than tall, so separation is measured on a stretched axis.
    const MIN = 0.0105, SX = 2.6;
    for(let it = 0; it < 200; it++){
      for(let i = 0; i < pts.length; i++) for(let j = i + 1; j < pts.length; j++){
        const dy = pts[j][0] - pts[i][0], dx = (pts[j][1] - pts[i][1])/SX, d = Math.hypot(dx, dy) || 1e-6;
        if(d < MIN){ const k = (MIN - d)/2/d; pts[i][0] -= dy*k; pts[i][1] -= dx*k*SX; pts[j][0] += dy*k; pts[j][1] += dx*k*SX; }
      }
    }
    return Object.fromEntries(PROJECTS.map((p, i) => [p.id, pts[i]]));
  })();
  const pinPos = p => PIN_POS[p.id];
  function drawMap(el, list, opts){
    opts = opts || {};
    return loadLeaflet().then(L => {
      if(!document.body.contains(el)) return;
      const map = L.map(el, { scrollWheelZoom:false, zoomControl:true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:18, attribution:'&copy; OpenStreetMap contributors' }).addTo(map);
      const pts = [];
      list.forEach(p => {
        const pos = pinPos(p); pts.push(pos);
        const short = p.minCr != null ? crLabel(p.minCr) : (p.psf ? '₹' + (p.psf/1000) + 'k/sqft' : 'POR');
        const icon = L.divIcon({ className:'', html:`<div class="price-pin">${esc(short)}</div>`, iconSize:[0,0] });
        L.marker(pos, { icon:icon, title:p.name, riseOnHover:true }).addTo(map)
          .bindPopup(`<div class="map-pop"><b>${esc(p.name)}</b><span>${esc(p.builder)} · ${esc(p.price)}</span><span>${esc(p.bhkLabel)}</span><a href="#/project/${p.id}">View project →</a></div>`);
      });
      (opts.extra || []).forEach(l => {
        pts.push([l.lat, l.lng]);
        L.circle([l.lat, l.lng], { radius:900, color:'#6E2438', weight:1.5, fillOpacity:.08 }).addTo(map).bindTooltip(l.name);
      });
      if(pts.length > 1) map.fitBounds(pts, { padding:[40, 40], maxZoom:14 });
      else if(pts.length) map.setView(pts[0], opts.zoom || 14);
      else map.setView([17.42, 78.36], 11);
    }).catch(() => {
      el.innerHTML = '<div class="empty-state" style="border:0;height:100%;display:flex;flex-direction:column;justify-content:center"><h3>Map couldn\'t load</h3><p>Check your connection — the list view has every project.</p></div>';
    });
  }

  /* =====================================================================
     PAGES
     ===================================================================== */
  const ROUTES = {};

  /* ---------------- HOME ---------------- */
  ROUTES[''] = function home(){
    const recentHtml = recent.length ? `<section class="section" style="padding-bottom:0"><div class="wrap">
        <div class="sec-head"><div><h2>Recently viewed</h2><p>Pick up where you left off.</p></div></div>
        <div class="scroller four">${recent.slice(0, 8).map(id => card(PBYID[id])).join('')}</div></div></section>` : '';
    const featured = PROJECTS.filter(p => p.type === 'residential').slice().sort((a, b) => (!!b.rera - !!a.rera) || ((b.stats ? 1 : 0) - (a.stats ? 1 : 0)));
    const bands = [['Under ₹2 Cr', 0, 2], ['₹2 – 3 Cr', 2, 3], ['₹3 – 5 Cr', 3, 5], ['₹5 Cr +', 5, 99]].map(([t, lo, hi]) => {
      const c = PROJECTS.filter(p => { const b = budgetOf(p); return b != null && b >= lo && b < hi; }).length;
      return `<a class="cat-tile" href="#/buy?min=${lo}${hi < 99 ? '&max=' + hi : ''}"><span class="c-ico">${I.wallet}</span><b>${t}</b><span>${c} project${c === 1 ? '' : 's'} starting in this range</span></a>`;
    }).join('');
    const withProjects = LOCS.filter(l => projectsIn(l.slug).length).concat(LOCS.filter(l => !projectsIn(l.slug).length && l.band));
    return `
    <section class="hero"><div class="wrap">
      <span class="hero-eyebrow">${I.shield}TS RERA Agent · ${esc(C.rera)}</span>
      <h1>Find a home in Hyderabad <em>worth the paperwork.</em></h1>
      <p class="hero-sub">Verified new projects from the city's most reputed developers — with honest pricing, side-by-side comparison and one advisor from shortlist to keys. No spam calls, ever.</p>
      <div class="search-box" id="heroSearch">
        <div class="search-tabs" role="tablist">
          <button class="search-tab active" data-mode="buy" role="tab">Buy</button>
          <button class="search-tab" data-mode="rent" role="tab">Rent</button>
          <button class="search-tab" data-mode="resale" role="tab">Resale</button>
          <button class="search-tab" data-mode="commercial" role="tab">Commercial</button>
          <button class="search-tab" data-mode="prelaunch" role="tab">Pre-launch<span class="new">NEW</span></button>
        </div>
        <form class="search-row" id="heroForm">
          <label class="search-input">${I.search}<span class="sr-only">Search</span><input id="heroQ" type="search" placeholder="Search locality, project or builder — e.g. Kokapet, Godrej"></label>
          <select class="search-budget" id="heroBudget" aria-label="Budget"><option value="">Any budget</option><option value="0-2">Under ₹2 Cr</option><option value="2-3">₹2 – 3 Cr</option><option value="3-5">₹3 – 5 Cr</option><option value="5-99">₹5 Cr +</option></select>
          <button class="btn btn-primary" type="submit">${I.search}Search</button>
        </form>
        <div class="suggest" id="heroSuggest" role="listbox"></div>
      </div>
      <div class="pop-searches"><span>Popular:</span>
        <a href="#/buy?loc=kokapet">Kokapet</a><a href="#/buy?loc=financial-district,nanakramguda,puppalaguda">Financial District</a><a href="#/buy?bhk=4,5">4 BHK +</a><a href="#/buy?max=2">Under ₹2 Cr</a><a href="#/buy?rera=1">RERA-listed</a>
      </div>
    </div></section>

    <div class="wrap trust-strip"><div class="trust-grid">
      <div><span class="t-ico">${I.spark}</span><div><b>15+ years</b><span>in Hyderabad real estate</span></div></div>
      <div><span class="t-ico">${I.building}</span><div><b>${PROJECTS.length} projects</b><span>across ${BUILDERS.length} reputed developers</span></div></div>
      <div><span class="t-ico">${I.shield}</span><div><b>RERA registered</b><span>Agent reg. ${esc(C.rera)}</span></div></div>
      <div><span class="t-ico">${I.bell}</span><div><b>Zero spam</b><span>Your number never goes to 20 brokers</span></div></div>
    </div></div>

    <section class="section"><div class="wrap">
      <div class="sec-head"><div><p class="eyebrow">Explore</p><h2>What are you looking for?</h2></div></div>
      <div class="cat-grid">
        <a class="cat-tile" href="#/buy"><span class="c-ico">${I.building}</span><b>New Projects</b><span>${PROJECTS.filter(p => p.type === 'residential').length} residential launches</span></a>
        <a class="cat-tile" href="#/resale"><span class="c-ico">${I.home}</span><b>Resale Homes</b><span>Ready-to-move, owner-listed</span></a>
        <a class="cat-tile" href="#/rent"><span class="c-ico">${I.key}</span><b>Rent</b><span>Verified rentals, West Hyderabad</span></a>
        <a class="cat-tile" href="#/commercial"><span class="c-ico">${I.briefcase}</span><b>Commercial</b><span>Grade-A office investment</span></a>
        <a class="cat-tile" href="#/upcoming"><span class="c-ico">${I.bell}</span><b>Pre-launch</b><span>Priority access before public launch</span></a>
        <a class="cat-tile" href="#/buy?bhk=4,5&sort=price-desc"><span class="c-ico">${I.crown}</span><b>Luxury 4 BHK+</b><span>${PROJECTS.filter(p => p.bhk.some(k => k >= 4)).length} ultra-premium projects</span></a>
      </div>
    </div></section>

    ${recentHtml}

    <section class="section"><div class="wrap">
      <div class="sec-head"><div><p class="eyebrow">Handpicked</p><h2>Projects we're actively representing</h2><p>Every one visited, vetted on delivery record, and priced from public listings as of ${esc(C.pricesAsOf)}.</p></div><a class="see-all" href="#/buy">See all ${PROJECTS.length} ${I.arrow}</a></div>
      <div class="scroller four">${featured.slice(0, 8).map(card).join('')}</div>
    </div></section>

    <section class="section alt"><div class="wrap">
      <div class="sec-head"><div><p class="eyebrow">By budget</p><h2>Shop by starting price</h2></div><a class="see-all" href="#/tools/afford">What can I afford? ${I.arrow}</a></div>
      <div class="cat-grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">${bands}</div>
    </div></section>

    <section class="section"><div class="wrap">
      <div class="sec-head"><div><p class="eyebrow">Localities</p><h2>Where Hyderabad is headed next</h2><p>Price bands and outlook from Knight Frank, CREDAI and ANAROCK reports — indicative, mid-2026.</p></div><a class="see-all" href="#/localities">All localities ${I.arrow}</a></div>
      <div class="scroller four">${withProjects.slice(0, 8).map(locCard).join('')}</div>
    </div></section>

    <section class="section alt"><div class="wrap">
      <div class="sec-head"><div><p class="eyebrow">Developers</p><h2>Builders we represent</h2></div><a class="see-all" href="#/builders">All builders ${I.arrow}</a></div>
      <div class="builder-grid">${BUILDERS.map(b => `<a class="builder-tile" href="#/buy?builder=${b.slug}"><span class="b-mono">${esc(b.name.replace(/[^A-Za-z ]/g,'').split(' ').filter(Boolean).slice(0,2).map(w => w[0]).join(''))}</span><b>${esc(b.name)}</b><span>${b.projects.length} project${b.projects.length > 1 ? 's' : ''}</span></a>`).join('')}</div>
    </div></section>

    <section class="section"><div class="wrap">
      <div class="sec-head"><div><p class="eyebrow">Tools</p><h2>Do the maths before the site visit</h2></div><a class="see-all" href="#/tools">All tools ${I.arrow}</a></div>
      <div class="cat-grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
        <a class="cat-tile" href="#/tools/emi"><span class="c-ico">${I.calc}</span><b>EMI Calculator</b><span>Monthly EMI, interest and payoff chart</span></a>
        <a class="cat-tile" href="#/tools/afford"><span class="c-ico">${I.wallet}</span><b>Affordability</b><span>The real budget your income supports</span></a>
        <a class="cat-tile" href="#/tools/stamp"><span class="c-ico">${I.doc}</span><b>Stamp Duty</b><span>Telangana registration cost, itemised</span></a>
        <a class="cat-tile" href="#/tools/rentbuy"><span class="c-ico">${I.scale}</span><b>Rent vs Buy</b><span>Which leaves you wealthier in 10 years</span></a>
        <a class="cat-tile" href="#/tools/area"><span class="c-ico">${I.ruler}</span><b>Area Converter</b><span>Sq.ft, sq.yd, gunta, acre, cent</span></a>
      </div>
    </div></section>

    <section class="section alt"><div class="wrap">
      <div class="sec-head"><div><p class="eyebrow">How it works</p><h2>From shortlist to keys, in four steps</h2></div></div>
      <div class="steps">
        <div><h3>Understand</h3><p>A short conversation on budget, preferred corridor and must-haves — no generic listings.</p></div>
        <div><h3>Shortlist</h3><p>A curated set of matching projects with the honest trade-offs explained.</p></div>
        <div><h3>Visit</h3><p>Accompanied site visits and direct introductions to developer sales teams.</p></div>
        <div><h3>Close</h3><p>Guidance through booking, documentation and registration — nothing catches you off guard.</p></div>
      </div>
    </div></section>

    <section class="section"><div class="wrap">
      <div class="cta-band">
        <div><h2>Not sure where to start?</h2><p>Tell us your budget and corridor once. We reply with a shortlist that actually fits — usually within a day.</p></div>
        <div class="btns"><a class="btn btn-light" target="_blank" rel="noopener" href="${waLink("Hi Livarea, I'd like help shortlisting a home in Hyderabad.")}">${I.wa}Chat on WhatsApp</a><a class="btn btn-ghost" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.4)" href="${telLink}">${I.phone}${esc(C.phoneDisplay)}</a></div>
      </div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="wrap split">
      <div><p class="eyebrow">Common questions</p><h2 style="font-size:clamp(24px,3vw,32px)">Before you reach out</h2><p>Plain answers on RERA, costs, loans and staying safe.</p><a class="btn btn-ghost" href="#/guides">Read all guides &amp; FAQs ${I.arrow}</a></div>
      <div>${window.FAQ[0].items.slice(0, 4).concat(window.FAQ[2].items.slice(0, 1)).map(([q, a]) => `<details class="acc"><summary>${esc(q)}</summary><div class="acc-body"><p>${esc(a)}</p></div></details>`).join('')}</div>
    </div></section>`;
  };
  ROUTES[''].after = function(){
    let mode = 'buy';
    const tabs = $$('.search-tab'), q = $('#heroQ'), budget = $('#heroBudget');
    tabs.forEach(t => t.addEventListener('click', () => {
      mode = t.dataset.mode;
      tabs.forEach(x => x.classList.toggle('active', x === t));
      budget.style.display = (mode === 'buy' || mode === 'commercial') ? '' : 'none';
      q.placeholder = mode === 'rent' ? 'Where do you want to rent? e.g. Gachibowli, Kondapur' : mode === 'prelaunch' ? 'Which area? We\'ll alert you to pre-launches there' : 'Search locality, project or builder — e.g. Kokapet, Godrej';
      q.focus();
    }));
    function go(text){
      if(mode === 'prelaunch'){ location.hash = '#/upcoming' + (text ? '?area=' + encodeURIComponent(text) : ''); return; }
      const params = new URLSearchParams();
      const match = text && LOCS.find(l => l.name.toLowerCase() === text.toLowerCase());
      if(match) params.set('loc', match.slug); else if(text) params.set('q', text);
      const b = budget.value;
      if(b && (mode === 'buy' || mode === 'commercial')){ const [lo, hi] = b.split('-'); if(+lo) params.set('min', lo); if(+hi < 99) params.set('max', hi); }
      location.hash = '#/' + mode + (params.toString() ? '?' + params : '');
    }
    $('#heroForm').addEventListener('submit', e => { e.preventDefault(); go(q.value.trim()); });
    attachSuggest(q, $('#heroSuggest'), go);
  };

  /* ---------------- SEARCH / RESULTS ---------------- */
  const BUDGET_STEPS = [0, 1, 1.5, 2, 2.5, 3, 4, 5, 7, 10];
  let searchState = null;

  function readState(mode, params){
    const list = k => (params.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
    return {
      mode:mode,
      q:params.get('q') || '',
      loc:list('loc').filter(s => LOC[s]),
      builder:list('builder').filter(s => BBY[s]),
      bhk:list('bhk').map(Number).filter(n => n >= 1 && n <= 6),
      min:parseFloat(params.get('min')) || 0,
      max:parseFloat(params.get('max')) || 0,
      rera:params.get('rera') === '1',
      brochure:params.get('brochure') === '1',
      sort:params.get('sort') || 'relevance',
      view:['grid','list','map'].includes(params.get('view')) ? params.get('view') : 'grid'
    };
  }
  function stateToHash(s){
    const p = new URLSearchParams();
    if(s.q) p.set('q', s.q);
    if(s.loc.length) p.set('loc', s.loc.join(','));
    if(s.builder.length) p.set('builder', s.builder.join(','));
    if(s.bhk.length) p.set('bhk', s.bhk.join(','));
    if(s.min) p.set('min', s.min);
    if(s.max) p.set('max', s.max);
    if(s.rera) p.set('rera', '1');
    if(s.brochure) p.set('brochure', '1');
    if(s.sort !== 'relevance') p.set('sort', s.sort);
    if(s.view !== 'grid') p.set('view', s.view);
    const qs = p.toString();
    return '#/' + s.mode + (qs ? '?' + qs : '');
  }
  function filterProjects(s, ignore){
    ignore = ignore || '';
    const terms = s.q.toLowerCase().split(/\s+/).filter(Boolean);
    let out = PROJECTS.filter(p => {
      if(s.mode === 'commercial' && p.type !== 'commercial') return false;
      if(terms.length){ const hay = (p.name + ' ' + p.builder + ' ' + p.locality + ' ' + (LOC[p.loc] ? LOC[p.loc].group : '') + ' ' + p.blurb).toLowerCase(); if(!terms.every(t => hay.includes(t))) return false; }
      if(ignore !== 'loc' && s.loc.length && !s.loc.includes(p.loc)) return false;
      if(ignore !== 'builder' && s.builder.length && !s.builder.includes(slugify(p.builder))) return false;
      if(s.bhk.length && !s.bhk.some(k => k >= 5 ? p.bhk.some(b => b >= 5) : p.bhk.includes(k))) return false;
      if(s.min || s.max){ const b = budgetOf(p); if(b == null) return false; if(s.min && b < s.min) return false; if(s.max && b >= s.max) return false; }
      if(s.rera && !p.rera) return false;
      if(s.brochure && !p.brochure) return false;
      return true;
    });
    const pr = p => budgetOf(p) == null ? Infinity : budgetOf(p);
    if(s.sort === 'price-asc') out.sort((a, b) => pr(a) - pr(b));
    else if(s.sort === 'price-desc') out.sort((a, b) => (pr(b) === Infinity ? -1 : pr(b)) - (pr(a) === Infinity ? -1 : pr(a)));
    else if(s.sort === 'psf-asc') out.sort((a, b) => (a.psf || Infinity) - (b.psf || Infinity));
    else if(s.sort === 'size-desc') out.sort((a, b) => (b.sqft ? b.sqft[1] : 0) - (a.sqft ? a.sqft[1] : 0));
    return out;
  }

  function searchPage(mode){
    return function(params){
      if(mode === 'rent' || mode === 'resale') return listingsPage(mode, params);
      searchState = readState(mode, params);
      const s = searchState;
      return `
      <div class="results-top"><div class="wrap">
        <nav class="mode-seg" aria-label="Category"><a href="#/buy" class="${mode === 'buy' ? 'active' : ''}">Buy</a><a href="#/rent">Rent</a><a href="#/resale">Resale</a><a href="#/commercial" class="${mode === 'commercial' ? 'active' : ''}">Commercial</a></nav>
        <div class="rt-search"><label class="search-input">${I.search}<span class="sr-only">Search</span><input id="rtQ" type="search" value="${esc(s.q)}" placeholder="Locality, project or builder"></label><div class="suggest" id="rtSuggest"></div></div>
        <button class="btn btn-ghost btn-sm filter-btn" id="openFilters">${I.filter}Filters<span class="count-badge" id="fCount" style="position:static;margin-left:2px"></span></button>
      </div></div>
      <div class="wrap results-layout">
        <aside class="filters" id="filters" aria-label="Filters"></aside>
        <div>
          <div class="res-bar">
            <h1 id="resTitle"></h1>
            <div class="res-controls">
              <label class="sr-only" for="sortSel">Sort</label>
              <select id="sortSel">
                <option value="relevance">Sort: Relevance</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="psf-asc">₹/sq.ft: Low to High</option><option value="size-desc">Size: Largest first</option>
              </select>
              <div class="view-seg" role="group" aria-label="View">
                <button data-view="grid" aria-label="Grid view">${I.grid}<span>Grid</span></button><button data-view="list" aria-label="List view">${I.list}<span>List</span></button><button data-view="map" aria-label="Map view">${I.map}<span>Map</span></button>
              </div>
            </div>
          </div>
          <div class="active-chips" id="activeChips"></div>
          <div id="results"></div>
          <p class="disclaimer">*Prices are indicative starting estimates compiled from public listings as of ${esc(C.pricesAsOf)}. Floor-rise, GST and availability are set by each developer and change often — confirm with us before deciding.</p>
        </div>
      </div>`;
    };
  }
  function renderFilters(){
    const s = searchState, el = $('#filters');
    const base = Object.assign({}, s);
    const locCounts = {}; filterProjects(base, 'loc').forEach(p => locCounts[p.loc] = (locCounts[p.loc] || 0) + 1);
    const bCounts = {}; filterProjects(base, 'builder').forEach(p => { const k = slugify(p.builder); bCounts[k] = (bCounts[k] || 0) + 1; });
    const locOpts = LOCS.filter(l => projectsIn(l.slug).length);
    const sel = (v, cur, lbl) => `<option value="${v}" ${cur === v ? 'selected' : ''}>${lbl}</option>`;
    el.innerHTML = `
      <div class="filters-head"><b>Filters</b><span style="display:flex;gap:10px"><button data-f="reset">Clear all</button><button data-f="close" class="filter-btn" aria-label="Close filters" style="color:var(--ink)">${I.x}</button></span></div>
      <div class="f-scroll">
      <div class="f-group"><h4>Budget (starting price)</h4>
        <div class="range-row">
          <select id="fMin" aria-label="Minimum budget">${sel(0, s.min, 'No min')}${BUDGET_STEPS.slice(1).map(v => sel(v, s.min, crLabel(v))).join('')}</select>
          <span class="muted">to</span>
          <select id="fMax" aria-label="Maximum budget">${sel(0, s.max, 'No max')}${BUDGET_STEPS.slice(1).map(v => sel(v, s.max, crLabel(v))).join('')}</select>
        </div></div>
      <div class="f-group"><h4>BHK</h4><div class="chips">${[2,3,4,5].map(k => `<button class="chip${s.bhk.includes(k) ? ' on' : ''}" data-bhk="${k}">${k === 5 ? '5+ BHK' : k + ' BHK'}</button>`).join('')}</div></div>
      <div class="f-group"><h4>Locality</h4><div class="chk-list">${locOpts.map(l => `<label><input type="checkbox" data-loc="${l.slug}" ${s.loc.includes(l.slug) ? 'checked' : ''}>${esc(l.name)}<span class="cnt">${locCounts[l.slug] || 0}</span></label>`).join('')}</div></div>
      <div class="f-group"><h4>Builder</h4><div class="chk-list">${BUILDERS.map(b => `<label><input type="checkbox" data-builder="${b.slug}" ${s.builder.includes(b.slug) ? 'checked' : ''}>${esc(b.name)}<span class="cnt">${bCounts[b.slug] || 0}</span></label>`).join('')}</div></div>
      <div class="f-group"><h4>More</h4>
        <label class="toggle-row"><input type="checkbox" id="fRera" ${s.rera ? 'checked' : ''}>RERA number listed</label>
        <label class="toggle-row" style="margin-top:8px"><input type="checkbox" id="fBro" ${s.brochure ? 'checked' : ''}>Brochure available</label>
      </div>
      </div>
      <div class="filters-apply"><button class="btn btn-primary btn-block" data-f="close">Show results</button></div>`;
  }
  function renderResults(){
    const s = searchState, list = filterProjects(s);
    const locNames = s.loc.map(k => LOC[k].name);
    const what = (s.mode === 'commercial' ? 'commercial project' : 'project') + (list.length === 1 ? '' : 's');
    $('#resTitle').innerHTML = `${list.length} ${what} ${locNames.length ? 'in ' + esc(locNames.slice(0, 3).join(', ')) + (locNames.length > 3 ? ' +' + (locNames.length - 3) : '') : 'in Hyderabad'}<small>Verified by Livarea · updated ${esc(C.pricesAsOf)}</small>`;
    $('#sortSel').value = s.sort;
    $$('.view-seg button').forEach(b => b.classList.toggle('on', b.dataset.view === s.view));
    const chips = [];
    if(s.q) chips.push(['q', '', '“' + s.q + '”']);
    s.loc.forEach(k => chips.push(['loc', k, LOC[k].name]));
    s.builder.forEach(k => chips.push(['builder', k, BBY[k].name]));
    s.bhk.forEach(k => chips.push(['bhk', k, k >= 5 ? '5+ BHK' : k + ' BHK']));
    if(s.min || s.max) chips.push(['budget', '', (s.min ? crLabel(s.min) : '₹0') + ' – ' + (s.max ? crLabel(s.max) : 'any')]);
    if(s.rera) chips.push(['rera', '', 'RERA listed']);
    if(s.brochure) chips.push(['brochure', '', 'Has brochure']);
    $('#activeChips').innerHTML = chips.map(([k, v, l]) => `<span class="chip">${esc(l)}<button data-rm="${k}" data-v="${esc(v)}" aria-label="Remove ${esc(l)}">${I.x}</button></span>`).join('');
    const fc = $('#fCount'); if(fc) fc.textContent = chips.length || '';
    const box = $('#results');
    if(!list.length){
      box.innerHTML = emptyState(I.search, 'No projects match all of those filters', 'Try removing a filter — or tell us exactly what you want. New phases and pre-launch projects open through the year, often before they are listed anywhere.',
        `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn btn-ghost" data-f="reset">Clear filters</button><a class="btn btn-primary" href="#/upcoming">Get notified of matches</a></div>`);
      return;
    }
    if(s.view === 'map'){
      box.innerHTML = `<div class="map-wrap"><div id="resultsMap"></div><p class="map-note">Pins are placed at approximate locality centres, not exact plot locations. Tap a pin for details.</p></div>`;
      drawMap($('#resultsMap'), list);
    } else {
      box.innerHTML = `<div class="${s.view === 'list' ? 'results-list' : 'results-grid'}">${list.map(card).join('')}</div>`;
    }
  }
  function updateSearch(rerenderFilters){
    history.replaceState(null, '', stateToHash(searchState));
    if(rerenderFilters !== false) renderFilters();
    renderResults();
  }
  function searchAfter(){
    if(!searchState || !$('#filters')) return;
    const s = searchState;
    renderFilters(); renderResults();
    const fEl = $('#filters');
    fEl.addEventListener('change', e => {
      const t = e.target;
      if(t.id === 'fMin'){ s.min = +t.value; if(s.max && s.min >= s.max) s.max = 0; }
      else if(t.id === 'fMax'){ s.max = +t.value; if(s.max && s.min >= s.max) s.min = 0; }
      else if(t.dataset.loc){ s.loc = t.checked ? s.loc.concat(t.dataset.loc) : s.loc.filter(x => x !== t.dataset.loc); }
      else if(t.dataset.builder){ s.builder = t.checked ? s.builder.concat(t.dataset.builder) : s.builder.filter(x => x !== t.dataset.builder); }
      else if(t.id === 'fRera') s.rera = t.checked;
      else if(t.id === 'fBro') s.brochure = t.checked;
      else return;
      updateSearch();
    });
    fEl.addEventListener('click', e => {
      const b = e.target.closest('[data-bhk]');
      if(b){ const k = +b.dataset.bhk; s.bhk = s.bhk.includes(k) ? s.bhk.filter(x => x !== k) : s.bhk.concat(k); updateSearch(); }
    });
    $('#sortSel').addEventListener('change', e => { s.sort = e.target.value; updateSearch(false); });
    $$('.view-seg button').forEach(b => b.addEventListener('click', () => { s.view = b.dataset.view; updateSearch(false); }));
    $('#openFilters').addEventListener('click', () => fEl.classList.add('open'));
    attachSuggest($('#rtQ'), $('#rtSuggest'), text => { s.q = text; updateSearch(); });
  }
  document.addEventListener('click', searchDocClick);
  function searchDocClick(e){
    if(!searchState || !$('#filters')) return;
    const s = searchState;
    const rm = e.target.closest('[data-rm]');
    if(rm){
      const k = rm.dataset.rm, v = rm.dataset.v;
      if(k === 'q'){ s.q = ''; const q = $('#rtQ'); if(q) q.value = ''; }
      else if(k === 'loc') s.loc = s.loc.filter(x => x !== v);
      else if(k === 'builder') s.builder = s.builder.filter(x => x !== v);
      else if(k === 'bhk') s.bhk = s.bhk.filter(x => String(x) !== v);
      else if(k === 'budget'){ s.min = 0; s.max = 0; }
      else s[k] = false;
      updateSearch(); return;
    }
    const f = e.target.closest('[data-f]');
    if(f && f.dataset.f === 'reset'){ Object.assign(s, { q:'', loc:[], builder:[], bhk:[], min:0, max:0, rera:false, brochure:false }); const q = $('#rtQ'); if(q) q.value = ''; updateSearch(); }
    if(f && f.dataset.f === 'close') $('#filters').classList.remove('open');
  }
  ROUTES['buy'] = searchPage('buy'); ROUTES['buy'].after = searchAfter;
  ROUTES['commercial'] = searchPage('commercial'); ROUTES['commercial'].after = searchAfter;

  /* ---------------- RENT / RESALE ---------------- */
  function listingsPage(kind, params){
    const data = kind === 'rent' ? RENTALS : RESALE;
    const loc = (params.get('loc') || '').split(',').filter(k => LOC[k]);
    const list = data.filter(x => !loc.length || loc.includes(x.loc));
    const title = kind === 'rent' ? 'Homes for rent' : 'Resale homes';
    const grid = list.length ? `<div class="results-grid">${list.map(x => listingCard(x, kind)).join('')}</div>` :
      emptyState(kind === 'rent' ? I.key : I.home,
        kind === 'rent' ? 'No rentals listed right now — but we can still find you one' : 'No resale homes listed right now',
        kind === 'rent' ? 'Good rentals in West Hyderabad usually go within days, so we match most tenants directly. Tell us your area, budget and move-in date and we\'ll send matching homes to your WhatsApp.'
          : 'New resale inventory reaches us weekly and often sells before it is listed. Tell us what you want and we\'ll match you directly — or list your own home for free.',
        `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="#reqForm" data-scroll="reqForm">Tell us what you need</a><a class="btn btn-ghost" href="#/post">List your property free</a></div>`);
    const form = kind === 'rent' ? `
      <form class="form-card" id="reqForm" data-form="rent">
        <h3>Rental requirement</h3><p class="sub">Under a minute. We reply on WhatsApp with matching homes.</p>
        <div class="two"><div class="field"><label for="rq-name">Name</label><input id="rq-name" name="name" required autocomplete="name"></div><div class="field"><label for="rq-phone">WhatsApp number</label><input id="rq-phone" name="phone" type="tel" required placeholder="+91" autocomplete="tel"></div></div>
        <div class="field"><span class="lbl">Preferred areas</span><div class="chips" data-multi="areas">${['Kokapet','Financial District','Gachibowli','HITEC City','Kondapur','Kukatpally','Narsingi','Anywhere West'].map(a => `<button type="button" class="chip">${a}</button>`).join('')}</div></div>
        <div class="two"><div class="field"><label for="rq-type">Home type</label><select id="rq-type" name="type"><option>Flat / Apartment</option><option>Villa</option><option>Independent House</option><option>Commercial / Office</option></select></div>
        <div class="field"><label for="rq-bhk">BHK</label><select id="rq-bhk" name="bhk"><option>1 BHK</option><option>2 BHK</option><option selected>3 BHK</option><option>4 BHK+</option></select></div></div>
        <div class="two"><div class="field"><label for="rq-rent">Monthly budget</label><select id="rq-rent" name="budget"><option>Under ₹25,000</option><option>₹25,000 – ₹40,000</option><option selected>₹40,000 – ₹60,000</option><option>₹60,000 – ₹1,00,000</option><option>₹1,00,000+</option></select></div>
        <div class="field"><label for="rq-move">Move-in</label><select id="rq-move" name="movein"><option>Immediately</option><option>Within 1 month</option><option>1 – 3 months</option><option>Just exploring</option></select></div></div>
        <div class="two"><div class="field"><label for="rq-furn">Furnishing</label><select id="rq-furn" name="furnishing"><option>Any</option><option>Fully furnished</option><option>Semi-furnished</option><option>Unfurnished</option></select></div>
        <div class="field"><label for="rq-role">Occupation</label><input id="rq-role" name="role" placeholder="e.g. Software engineer"></div></div>
        <button class="btn btn-primary btn-block" type="submit">${I.wa}Find my rental</button>${leadNote}
      </form>` : `
      <form class="form-card" id="reqForm" data-form="resale">
        <h3>Resale requirement</h3><p class="sub">We'll match you with verified ready-to-move homes.</p>
        <div class="two"><div class="field"><label for="rq-name">Name</label><input id="rq-name" name="name" required autocomplete="name"></div><div class="field"><label for="rq-phone">WhatsApp number</label><input id="rq-phone" name="phone" type="tel" required placeholder="+91" autocomplete="tel"></div></div>
        <div class="field"><span class="lbl">Preferred areas</span><div class="chips" data-multi="areas">${['Kokapet','Financial District','Gachibowli','HITEC City','Kondapur','Kukatpally','Narsingi','Anywhere West'].map(a => `<button type="button" class="chip">${a}</button>`).join('')}</div></div>
        <div class="two"><div class="field"><label for="rq-bhk">BHK</label><select id="rq-bhk" name="bhk"><option>2 BHK</option><option selected>3 BHK</option><option>4 BHK+</option></select></div>
        <div class="field"><label for="rq-budget">Budget</label><select id="rq-budget" name="budget">${budgetOpts}</select></div></div>
        <div class="field"><label for="rq-when">Timeline</label><select id="rq-when" name="timeline"><option>Ready to buy now</option><option>Within 1–3 months</option><option>Within 3–6 months</option><option>Just exploring</option></select></div>
        <button class="btn btn-primary btn-block" type="submit">${I.wa}Match me with resale homes</button>${leadNote}
      </form>`;
    return `
      <div class="results-top"><div class="wrap">
        <nav class="mode-seg" aria-label="Category"><a href="#/buy">Buy</a><a href="#/rent" class="${kind === 'rent' ? 'active' : ''}">Rent</a><a href="#/resale" class="${kind === 'resale' ? 'active' : ''}">Resale</a><a href="#/commercial">Commercial</a></nav>
      </div></div>
      <div class="wrap" style="padding-top:24px;padding-bottom:56px">
        <div class="res-bar"><h1>${list.length ? list.length + ' ' : ''}${title} in ${loc.length ? esc(loc.map(k => LOC[k].name).join(', ')) : 'West Hyderabad'}<small>${kind === 'rent' ? 'Verified with owners and developers we work with directly' : 'Every listing verified by our team before it goes up'}</small></h1></div>
        <div class="split wide-left">
          <div>${grid}
            <div class="point-list">
              <div><span class="pi">${I.shield}</span><div><b>Verified, not scraped</b><span>We list only homes we've confirmed with the owner or developer.</span></div></div>
              <div><span class="pi">${I.bell}</span><div><b>One contact, not twenty</b><span>Your number stays with Livarea. No broker swarm.</span></div></div>
              <div><span class="pi">${I.calendar}</span><div><b>Matched to your move-in date</b><span>We prioritise homes ready when you are.</span></div></div>
            </div>
            <p class="disclaimer">${kind === 'rent' ? '*Rent is monthly and excludes maintenance unless stated. Deposit is typically 2–3 months in this market and set by the owner.' : '*Resale prices are set by individual owners and are negotiable. Registration, transfer charges and society dues are additional.'}</p>
          </div>
          <div>${form}</div>
        </div>
      </div>`;
  }
  ROUTES['rent'] = p => listingsPage('rent', p);
  ROUTES['resale'] = p => listingsPage('resale', p);

  /* ---------------- PROJECT DETAIL ---------------- */
  ROUTES['project'] = function(params, id){
    const p = PBYID[id];
    if(!p) return notFound();
    recent = [id].concat(recent.filter(x => x !== id)).slice(0, 8); store.set('recent', recent);
    const l = LOC[p.loc], builder = BBY[slugify(p.builder)];
    const others = builder.projects.filter(x => x.id !== p.id);
    const b = budgetOf(p);
    const similar = PROJECTS.filter(x => x.id !== p.id && x.type === p.type && !others.includes(x) &&
      ((l && LOC[x.loc] && LOC[x.loc].group === l.group) || (b != null && budgetOf(x) != null && Math.abs(budgetOf(x) - b)/b < 0.3))).slice(0, 4);
    const kv = [
      ['Starting price', p.price], ['Configuration', p.bhkLabel], ['Size range', sqftLabel(p)],
      ['Price / sq.ft', p.psf ? '~' + inr(p.psf) : 'On request'],
      ['Locality', l ? l.name : p.locality], ['Developer', p.builder],
      ['RERA', p.rera ? p.rera.replace(/^(TS|TG)?\s*RERA\s*/,'') : 'Ask us'], ['Possession', p.possession || 'As per RERA — ask us']
    ];
    let insight = '';
    if(l && l.band){
      if(p.psf && l.bandLo){
        const pct = Math.max(2, Math.min(98, (p.psf - l.bandLo)/(l.bandHi - l.bandLo)*100));
        const verdict = p.psf < l.bandLo + (l.bandHi - l.bandLo)*0.33 ? 'in the lower third of' : p.psf > l.bandLo + (l.bandHi - l.bandLo)*0.66 ? 'in the upper third of' : 'mid-way through';
        insight = `<p>At ~${inr(p.psf)}/sq.ft, ${esc(p.name)} sits <b>${verdict}</b> the ${esc(l.group)} price band.</p>
          <div class="compare-bar"><div class="cb-track"><span class="cb-mark" style="left:${pct}%">${esc(p.name)}</span><span class="cb-dot" style="left:${pct}%"></span></div>
          <div class="cb-ends"><span>${inr(l.bandLo)}/sq.ft</span><span>${inr(l.bandHi)}/sq.ft</span></div></div>`;
      } else {
        insight = `<p>The ${esc(l.group)} corridor trades at roughly <b>${esc(l.band)}</b>. The developer hasn't published a per-sq.ft rate for ${esc(p.name)} — we'll share the official cost sheet on request so you can compare like for like.</p>`;
      }
      insight += `<div class="kv-grid" style="grid-template-columns:repeat(3,1fr);margin-top:16px"><div><span>Corridor band</span><b>${esc(l.band)}</b></div><div><span>Outlook</span><b>${esc(l.appr)}</b></div><div><span>Listed here</span><b>${projectsIn(p.loc).length} project${projectsIn(p.loc).length > 1 ? 's' : ''}</b></div></div>
        <p class="fine">Indicative ranges from Knight Frank India, CREDAI Hyderabad and ANAROCK reports, mid-2026. Not a guarantee of future performance.</p>`;
    }
    const loan = b ? Math.round(b*1e7*0.8) : 8000000;
    const days = Array.from({ length:10 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; });
    const dname = d => d.toLocaleDateString('en-IN', { weekday:'short' }), dmon = d => d.toLocaleDateString('en-IN', { month:'short' });
    return `
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>›<a href="#/buy">${p.type === 'commercial' ? 'Commercial' : 'New projects'}</a>›${l ? `<a href="#/buy?loc=${l.slug}">${esc(l.name)}</a>›` : ''}<span>${esc(p.name)}</span></nav>
      <div class="pd-head">
        <div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">${p.rera ? `<span class="rera-pill">${I.shield}${esc(p.rera)}</span>` : ''}${p.type === 'commercial' ? '<span class="tag dark">Commercial</span>' : ''}</div>
          <h1>${esc(p.name)}</h1>
          <p class="by">by <a href="#/buy?builder=${builder.slug}">${esc(p.builder)}</a></p>
          <p class="loc">${I.pin}${esc(p.locality)}, Hyderabad</p>
        </div>
        <div class="pd-price"><b>${esc(p.price)}<sup style="font-size:.5em;color:var(--muted)">*</sup></b><span>${esc(p.priceNote)}</span>
          <div class="pd-tools">${heartBtn(p.id)}<button class="icon-btn" data-share="${p.id}" aria-label="Share">${I.share}</button><button class="icon-btn${compare.includes(p.id) ? ' on' : ''}" data-cmpbtn="${p.id}" aria-label="Add to compare">${I.compare}</button></div>
        </div>
      </div>
      ${p.photos ? photoGallery(p) : `<div class="gallery">
        <div>${art(p)}<span class="g-label tag dark">Illustration · not actual elevation</span></div>
        <div><img data-real="assets/projects/${p.id}-elevation.jpg" alt="${esc(p.name)} elevation" hidden><div class="g-ph">${I.building}<span>Official elevation<br>shared on request</span></div><span class="g-label tag">Elevation</span></div>
        <div><img data-real="assets/projects/${p.id}-floorplan.jpg" alt="${esc(p.name)} floor plan" hidden><div class="g-ph">${I.grid}<span>RERA-approved floor plan<br>shared on request</span></div><span class="g-label tag">Floor plan</span></div>
      </div>`}
      <div class="pd-layout">
        <div>
          <nav class="pd-tabs" id="pdTabs"><a href="#ov" data-scroll="ov" class="on">Overview</a><a href="#cfg" data-scroll="cfg">Configurations</a>${p.masterplan || p.floorplan ? '<a href="#plans" data-scroll="plans">Plans</a>' : ''}${insight ? '<a href="#ins" data-scroll="ins">Price insight</a>' : ''}<a href="#locn" data-scroll="locn">Location</a><a href="#emi" data-scroll="emi">EMI</a><a href="#bld" data-scroll="bld">Developer</a></nav>
          <section class="panel" id="ov"><h2>Overview</h2>
            <div class="kv-grid">${kv.map(([k, v]) => `<div><span>${k}</span><b>${esc(v)}</b></div>`).join('')}</div>
            ${p.stats ? `<div class="stat-row">${p.stats.map(st => `<div><b>${st.v.toLocaleString('en-IN', { maximumFractionDigits:st.d || 0 })}</b><span>${esc(st.l)}</span></div>`).join('')}</div>` : ''}
            <p style="margin-top:16px">${esc(p.blurb)}</p>
            ${p.highlights ? `<ul class="hl-list">${p.highlights.map(h => `<li>${I.check}<span>${esc(h)}</span></li>`).join('')}</ul>` : ''}
          </section>
          <section class="panel" id="cfg"><h2>Configurations &amp; sizes</h2>
            <div style="overflow-x:auto"><table class="cfg-table"><thead><tr><th>Unit type</th><th>Area</th><th style="text-align:right">Price</th></tr></thead><tbody>
              ${p.configs.map(c => `<tr><td><b>${esc(c.c)}</b></td><td>${esc(c.a)}</td><td><a class="inline-link" href="${waLink("Hi Livarea, please share the cost sheet for " + c.c + ' at ' + p.wa + '.')}" target="_blank" rel="noopener">Get cost sheet</a></td></tr>`).join('')}
            </tbody></table></div>
            <p class="fine">Areas from developer collateral. Always confirm the RERA carpet area — not just the saleable figure — before booking.</p>
          </section>
          ${p.masterplan || p.floorplan ? `<section class="panel" id="plans"><h2>Master plan &amp; floor plan <small>from the developer's brochure</small></h2>
            <div class="plan-grid">${planSlides(p).map((s, i) => `<button type="button" class="plan-tile" data-lb="${(p.photos ? p.photos.length : 0) + i}"><img src="${esc(s.src)}" alt="${esc(p.name + ' ' + s.cap)}" loading="lazy"><span class="tag">${esc(s.cap)}</span></button>`).join('')}</div>
            <p class="fine">Tap to enlarge. Plans are indicative — the RERA-approved drawings are legally binding; we share them on request.</p></section>` : ''}
          ${insight ? `<section class="panel" id="ins"><h2>Price insight</h2>${insight}</section>` : ''}
          <section class="panel" id="locn"><h2>Location <small>${esc(l ? l.name : p.locality)}</small></h2>
            <div class="map-wrap"><div class="loc-map" id="pdMap"></div><p class="map-note">Pin shows the approximate locality, not the exact site. <a class="inline-link" target="_blank" rel="noopener" href="https://www.google.com/maps/search/${encodeURIComponent(p.name + ' ' + p.builder + ' ' + p.locality + ' Hyderabad')}">Open in Google Maps →</a></p></div>
            ${l ? `<p style="margin-top:14px"><b>${esc(l.tag)}.</b> ${esc(l.blurb)} <a class="inline-link" href="#/locality/${l.slug}">Explore ${esc(l.name)} →</a></p>` : ''}
          </section>
          <section class="panel" id="emi"><h2>EMI estimate</h2>
            <div class="tool-layout" style="gap:24px">
              <div>
                ${slider('pdLoan', 'Loan amount', loan, 1000000, 100000000, 100000, '₹')}
                ${slider('pdRate', 'Interest rate (%)', 8.5, 6, 14, 0.05)}
                ${slider('pdYrs', 'Tenure (years)', 20, 5, 30, 1)}
              </div>
              <div><div class="result-big"><span>Monthly EMI</span><b id="pdEmi">—</b></div><div class="result-rows"><div><span>Total interest</span><b id="pdInt">—</b></div><div><span>Total payable</span><b id="pdTot">—</b></div></div>
                <p class="fine">Assumes an 80% loan on the starting price. <a class="inline-link" href="#/tools/afford">Check your affordability →</a></p></div>
            </div>
          </section>
          <section class="panel" id="bld"><h2>About the developer</h2>
            <div style="display:flex;gap:14px;align-items:center;margin-bottom:12px"><span class="b-mono">${esc(p.builder.replace(/[^A-Za-z ]/g,'').split(' ').filter(Boolean).slice(0,2).map(w => w[0]).join(''))}</span><div><b style="font-size:16px">${esc(p.builder)}</b><div class="muted" style="font-size:13px">${builder.projects.length} project${builder.projects.length > 1 ? 's' : ''} represented by Livarea</div></div></div>
            <p>Before you book, ask for the developer's delivery record on completed projects and visit one in person. We'll arrange it — and tell you plainly if a project isn't the right fit.</p>
            ${others.length ? `<div class="results-grid" style="margin-top:14px">${others.map(card).join('')}</div>` : ''}
          </section>
          ${similar.length ? `<section style="margin-top:28px"><div class="sec-head"><div><h2 style="font-size:22px">Similar projects</h2><p>Same corridor or a similar budget.</p></div></div><div class="results-grid">${similar.map(card).join('')}</div></section>` : ''}
        </div>
        <aside>
          <div class="side-card" id="contactCard">
            <div class="agent-row"><img src="assets/img/livarea-mark.png" alt=""><div><b>Livarea Advisory</b><span class="verified">${I.shield}TS RERA ${esc(C.rera)}</span></div></div>
            <div class="seg" role="tablist"><button class="on" data-pane="enq">Enquire</button><button data-pane="visit">Site visit</button><button data-pane="bro">Brochure</button></div>
            <form data-pane-body="enq" data-form="enquire">
              <div class="field"><label for="e-name">Name</label><input id="e-name" name="name" required autocomplete="name"></div>
              <div class="field"><label for="e-phone">WhatsApp number</label><input id="e-phone" name="phone" type="tel" placeholder="+91" required autocomplete="tel"></div>
              <div class="field"><label for="e-msg">Message</label><textarea id="e-msg" name="msg">I'm interested in ${esc(p.name)}. Please share the price sheet and availability.</textarea></div>
              <button class="btn btn-wa btn-block" type="submit">${I.wa}Send on WhatsApp</button>
            </form>
            <form data-pane-body="visit" data-form="visit" hidden>
              <span class="lbl">Pick a day</span>
              <div class="date-strip" style="margin-bottom:12px">${days.map((d, i) => `<button type="button" data-date="${d.toISOString().slice(0, 10)}" class="${i === 0 ? 'on' : ''}"><small>${dname(d)}</small><b>${d.getDate()}</b><small>${dmon(d)}</small></button>`).join('')}</div>
              <span class="lbl">Time</span>
              <div class="slot-chips chips" style="margin-bottom:12px" data-single="slot"><button type="button" class="chip on">Morning</button><button type="button" class="chip">Afternoon</button><button type="button" class="chip">Evening</button></div>
              <span class="lbl">Visit type</span>
              <div class="chips" style="margin-bottom:12px" data-single="vtype"><button type="button" class="chip on">In person</button><button type="button" class="chip">Video call</button></div>
              <div class="two"><div class="field"><label for="v-name">Name</label><input id="v-name" name="name" required autocomplete="name"></div><div class="field"><label for="v-phone">WhatsApp</label><input id="v-phone" name="phone" type="tel" required placeholder="+91" autocomplete="tel"></div></div>
              <button class="btn btn-primary btn-block" type="submit">${I.calendar}Request site visit</button>
              <p class="form-note">A request, not a confirmed slot — we confirm with you on WhatsApp.</p>
            </form>
            <form data-pane-body="bro" data-form="brochure" hidden>
              <p class="sc-sub" style="margin-top:0">${p.brochure ? "Enter your details — we'll open WhatsApp and start the download." : "We'll send the brochure to your WhatsApp."}</p>
              <div class="field"><label for="b-name">Name</label><input id="b-name" name="name" required autocomplete="name"></div>
              <div class="field"><label for="b-phone">WhatsApp number</label><input id="b-phone" name="phone" type="tel" required placeholder="+91" autocomplete="tel"></div>
              <button class="btn btn-primary btn-block" type="submit">${I.download}${p.brochure ? 'Download brochure' : 'Request brochure'}</button>
            </form>
            ${leadNote}
            <div style="display:flex;gap:8px;margin-top:12px"><a class="btn btn-ghost btn-sm" style="flex:1" href="${telLink}">${I.phone}Call</a><a class="btn btn-ghost btn-sm" style="flex:1" href="#/compare">${I.compare}Compare</a></div>
          </div>
        </aside>
      </div>
      <p class="disclaimer" style="margin-top:-30px;padding-bottom:40px">*Indicative pricing from public listings as of ${esc(C.pricesAsOf)}, subject to developer revision, floor-rise and availability. Livarea is an authorised marketing associate and shares the official cost sheet on request.</p>
    </div>
    <div class="pd-mobile-cta"><a class="btn btn-ghost" href="${telLink}">${I.phone}Call</a><a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink("Hi Livarea, I'm interested in " + p.wa + '.')}">${I.wa}WhatsApp</a><button class="btn btn-primary" data-scroll="contactCard" data-pane-go="visit">${I.calendar}Visit</button></div>`;
  };
  ROUTES['project'].after = function(params, id){
    const p = PBYID[id]; if(!p) return;
    document.body.classList.add('has-pd-cta');
    document.title = p.name + ' by ' + p.builder + ' — ' + p.price + ' | Livarea';
    if(p.photos || p.masterplan || p.floorplan){
      const slides = (p.photos || []).concat(planSlides(p));
      $$('[data-lb]').forEach(el => el.addEventListener('click', () => openLightbox(slides, +el.dataset.lb, p.name)));
    }
    $$('img[data-real]').forEach(img => {
      img.onload = () => { img.hidden = false; img.nextElementSibling.style.display = 'none'; };
      img.src = img.dataset.real;
    });
    drawMap($('#pdMap'), [p], { zoom:14 });
    bindSliders(['pdLoan','pdRate','pdYrs'], () => {
      const P = +$('#pdLoan').value, e = emi(P, +$('#pdRate').value, +$('#pdYrs').value), t = e*$('#pdYrs').value*12;
      $('#pdEmi').textContent = inr(e) + '/mo'; $('#pdInt').textContent = words(t - P); $('#pdTot').textContent = words(t);
    });
    // contact card panes
    const card = $('#contactCard');
    const showPane = name => { $$('.seg button', card).forEach(b => b.classList.toggle('on', b.dataset.pane === name)); $$('[data-pane-body]', card).forEach(f => f.hidden = f.dataset.paneBody !== name); };
    $$('.seg button', card).forEach(b => b.addEventListener('click', () => showPane(b.dataset.pane)));
    $$('[data-pane-go]').forEach(b => b.addEventListener('click', () => showPane(b.dataset.paneGo)));
    $$('.date-strip button', card).forEach(b => b.addEventListener('click', () => $$('.date-strip button', card).forEach(x => x.classList.toggle('on', x === b))));
    // tabs highlight on scroll
    const tabs = $$('#pdTabs a');
    const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) tabs.forEach(t => t.classList.toggle('on', t.dataset.scroll === e.target.id)); }), { rootMargin:'-40% 0px -55% 0px' });
    tabs.forEach(t => { const s = document.getElementById(t.dataset.scroll); if(s) io.observe(s); });
    // forms
    card.addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target, d = Object.fromEntries(new FormData(f));
      if(f.dataset.form === 'enquire'){
        saveLead('Project enquiry', { name:d.name, phone:d.phone, interest:p.name, message:d.msg });
        openWA(`Hi Livarea, I'm ${d.name} (${d.phone}). ${d.msg}`);
      } else if(f.dataset.form === 'visit'){
        const date = $('.date-strip button.on', f).dataset.date, slot = $('[data-single=slot] .on', f).textContent, vt = $('[data-single=vtype] .on', f).textContent;
        const nice = new Date(date + 'T00:00').toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' });
        saveLead('Site visit request', { name:d.name, phone:d.phone, interest:p.name, prefDate:date, prefTime:slot, contactMethod:vt });
        openWA(`Hi Livarea, I'm ${d.name} (${d.phone}). I'd like a ${vt.toLowerCase()} ${vt === 'Video call' ? 'walkthrough' : 'site visit'} of ${p.wa} on ${nice}, ${slot.toLowerCase()}.`);
      } else if(f.dataset.form === 'brochure'){
        saveLead('Brochure', { name:d.name, phone:d.phone, interest:p.name, message:p.brochure ? 'Brochure downloaded' : 'Brochure requested' });
        openWA(`Hi Livarea, I'm ${d.name} (${d.phone}). Please send me the brochure for ${p.wa}.`);
        if(p.brochure){ const fr = document.createElement('iframe'); fr.style.display = 'none'; fr.src = p.brochure; document.body.appendChild(fr); setTimeout(() => fr.remove(), 60000); }
      }
      toast('Opening WhatsApp…');
    });
  };

  /* ---------------- COMPARE ---------------- */
  ROUTES['compare'] = function(params){
    const fromUrl = (params.get('ids') || '').split(',').filter(id => PBYID[id]);
    if(fromUrl.length){ compare = fromUrl.slice(0, 3); store.set('compare', compare); }
    const list = compare.map(id => PBYID[id]);
    const pickable = PROJECTS.filter(p => !compare.includes(p.id));
    const picker = list.length < 3 ? `<select id="cmpAdd" class="search-budget" style="height:42px"><option value="">+ Add a project to compare</option>${pickable.map(p => `<option value="${p.id}">${esc(p.name)} — ${esc(p.builder)}</option>`).join('')}</select>` : '';
    if(!list.length) return pageHero('Compare projects', 'Put up to three projects side by side — price, size, density, RERA and more.') +
      `<div class="wrap section">${emptyState(I.compare, 'Nothing to compare yet', 'Tick “Compare” on any project card, or add one below.', picker)}</div>`;
    const prices = list.map(p => p.minCr).filter(v => v != null), minP = Math.min.apply(null, prices);
    const psfs = list.map(p => p.psf).filter(Boolean), minPsf = Math.min.apply(null, psfs);
    const st = (p, label) => { const x = (p.stats || []).find(s => s.l.toLowerCase().includes(label)); return x ? x.v.toLocaleString('en-IN', { maximumFractionDigits:x.d || 0 }) : '—'; };
    const rows = [
      ['Starting price', p => `<span class="${prices.length > 1 && p.minCr === minP ? 'best' : ''}">${esc(p.price)}</span>`],
      ['Price / sq.ft', p => p.psf ? `<span class="${list.length > 1 && psfs.length > 1 && p.psf === minPsf ? 'best' : ''}">~${inr(p.psf)}</span>` : 'On request'],
      ['Developer', p => esc(p.builder)],
      ['Locality', p => esc(LOC[p.loc] ? LOC[p.loc].name : p.locality)],
      ['Configuration', p => esc(p.bhkLabel)],
      ['Size range', p => esc(sqftLabel(p))],
      ['Corridor band', p => esc(LOC[p.loc] && LOC[p.loc].band || '—')],
      ['Towers', p => st(p, 'tower') !== '—' ? st(p, 'tower') : st(p, 'wing') !== '—' ? st(p, 'wing') + ' wings' : st(p, 'block') !== '—' ? st(p, 'block') + ' blocks' : '—'],
      ['Floors', p => st(p, 'floor')],
      ['Land area (acres)', p => st(p, 'acre')],
      ['Residences', p => st(p, 'residence')],
      ['RERA no.', p => p.rera ? esc(p.rera) : 'Ask us'],
      ['Possession', p => esc(p.possession || 'Ask us')],
      ['Brochure', p => p.brochure ? 'Available' : 'On request'],
      ['Highlights', p => p.highlights ? '<ul style="padding-left:16px">' + p.highlights.slice(0, 3).map(h => `<li style="margin-bottom:4px">${esc(h)}</li>`).join('') + '</ul>' : '—']
    ];
    return pageHero('Compare projects', 'Side by side, from the same verified data. Green ticks mark the lowest starting price and ₹/sq.ft.') + `
      <div class="wrap section">
        <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px">${picker}<button class="btn btn-ghost btn-sm" data-share-compare>${I.share}Share this comparison</button></div>
        <div class="cmp-scroll"><table class="cmp-table">
          <thead><tr><th></th>${list.map(p => `<td><div class="cmp-art">${cover(p)}</div><a href="#/project/${p.id}" style="font-weight:800;font-size:15px">${esc(p.name)}</a><div style="margin-top:6px;display:flex;gap:6px"><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink("Hi Livarea, I'm comparing " + list.map(x => x.name).join(', ') + ' and would like advice on ' + p.name + '.')}">${I.wa}Ask</a><button class="btn btn-ghost btn-sm" data-cmp-rm="${p.id}">Remove</button></div></td>`).join('')}</tr></thead>
          <tbody>${rows.map(([k, f]) => `<tr><th>${k}</th>${list.map(p => `<td>${f(p)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>
        <div class="callout" style="margin-top:18px"><b>Can't decide?</b> Send us this comparison on WhatsApp — we'll tell you honestly which one fits your budget and timeline, including anything the brochures don't say.</div>
      </div>`;
  };
  ROUTES['compare'].after = function(){
    const add = $('#cmpAdd');
    if(add) add.addEventListener('change', () => { if(add.value){ compare = compare.concat(add.value).slice(0, 3); store.set('compare', compare); router(); } });
    $$('[data-cmp-rm]').forEach(b => b.addEventListener('click', () => { compare = compare.filter(x => x !== b.dataset.cmpRm); store.set('compare', compare); history.replaceState(null, '', '#/compare'); router(); }));
    const sh = $('[data-share-compare]');
    if(sh) sh.addEventListener('click', () => share(location.href.split('#')[0] + '#/compare?ids=' + compare.join(','), 'Compare projects on Livarea'));
  };

  /* ---------------- SHORTLIST ---------------- */
  ROUTES['shortlist'] = function(){
    const list = shortlist.map(id => PBYID[id]);
    return pageHero('Your shortlist', 'Saved on this device only. Send it to us and we\'ll check live availability for every project at once.') + `
      <div class="wrap section">${list.length ? `
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px">
          <a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink("Hi Livarea, here's my shortlist: " + list.map(p => p.name + ' (' + p.builder + ')').join(', ') + '. Please share availability and pricing.')}">${I.wa}Send shortlist on WhatsApp</a>
          ${list.length > 1 ? `<a class="btn btn-ghost" href="#/compare?ids=${list.slice(0, 3).map(p => p.id).join(',')}">${I.compare}Compare ${Math.min(3, list.length)}</a>` : ''}
        </div>
        <div class="results-grid">${list.map(card).join('')}</div>` :
        emptyState(I.heart, 'No saved projects yet', 'Tap the heart on any project to save it here.', `<a class="btn btn-primary" href="#/buy">Browse projects</a>`)}
      </div>`;
  };

  /* ---------------- LOCALITIES ---------------- */
  ROUTES['localities'] = function(){
    const listed = LOCS.filter(l => projectsIn(l.slug).length), rest = LOCS.filter(l => !projectsIn(l.slug).length);
    return pageHero('Localities & market outlook', 'Real estate rewards timing as much as location. Here\'s what current market data shows across the corridors we work in.') + `
      <div class="wrap section">
        <div class="map-wrap" style="margin-bottom:24px"><div class="loc-map" id="locsMap" style="height:420px"></div><p class="map-note">Every project we represent, pinned at its approximate locality. Circles mark corridors we cover without a current listing.</p></div>
        <div class="sec-head"><div><h2>With current projects</h2></div></div>
        <div class="results-grid">${listed.map(locCard).join('')}</div>
        <div class="sec-head" style="margin-top:36px"><div><h2>Also covered</h2><p>No live listing right now — but we know these markets well and can source for you.</p></div></div>
        <div class="results-grid">${rest.map(locCard).join('')}</div>
        <div class="callout" style="margin-top:28px"><b>Why now:</b> Metro Phase 2 (a 116 km expansion including Raidurg–Kokapet and Nagole–Airport corridors) is under construction through 2027–2030. Infrastructure like this has historically moved prices 2–4 years <em>before</em> completion — the corridors above are inside that window now.</div>
        <p class="disclaimer">Figures are indicative, compiled from public market reports (Knight Frank India, CREDAI Hyderabad, ANAROCK and other industry sources) as of mid-2026. Past appreciation and forecasts are estimates, not guarantees — consult a financial advisor before any investment decision.</p>
      </div>`;
  };
  ROUTES['localities'].after = () => drawMap($('#locsMap'), PROJECTS, { extra:LOCS.filter(l => !projectsIn(l.slug).length) });

  ROUTES['locality'] = function(params, slug){
    const l = LOC[slug]; if(!l) return notFound();
    const list = projectsIn(slug), near = LOCS.filter(x => x.group === l.group && x.slug !== slug);
    const nearP = PROJECTS.filter(p => near.some(n => n.slug === p.loc));
    const prices = list.map(budgetOf).filter(v => v != null);
    return `<section class="page-hero"><div class="wrap">
        <nav class="crumbs" style="padding-top:0"><a href="#/">Home</a>›<a href="#/localities">Localities</a>›<span>${esc(l.name)}</span></nav>
        <p class="eyebrow">${esc(l.tag)}</p><h1>Property in ${esc(l.name)}, Hyderabad</h1><p>${esc(l.blurb)}</p>
      </div></section>
      <div class="wrap section">
        <div class="kv-grid" style="margin-bottom:24px">
          <div><span>Price band</span><b>${esc(l.band || 'Ask us')}</b></div><div><span>Outlook</span><b>${esc(l.appr || 'Ask us')}</b></div>
          <div><span>Projects listed</span><b>${list.length}</b></div><div><span>Starting from</span><b>${prices.length ? crLabel(Math.min.apply(null, prices)) : '—'}</b></div>
        </div>
        <div class="map-wrap" style="margin-bottom:28px"><div class="loc-map" id="locMap"></div><p class="map-note">Approximate locality centre.</p></div>
        <div class="sec-head"><div><h2>Projects in ${esc(l.name)}</h2></div>${list.length ? `<a class="see-all" href="#/buy?loc=${slug}">Filter &amp; sort ${I.arrow}</a>` : ''}</div>
        ${list.length ? `<div class="results-grid">${list.map(card).join('')}</div>` : emptyState(I.pin, 'No live listing here right now', 'We cover ' + esc(l.name) + ' and can source new launches and resale homes for you.', `<a class="btn btn-primary" href="#/upcoming?area=${encodeURIComponent(l.name)}">Alert me to new projects</a>`)}
        ${nearP.length ? `<div class="sec-head" style="margin-top:36px"><div><h2>Nearby in ${esc(l.group)}</h2></div></div><div class="results-grid">${nearP.slice(0, 4).map(card).join('')}</div>` : ''}
      </div>`;
  };
  ROUTES['locality'].after = (params, slug) => { const l = LOC[slug]; if(l){ document.title = 'Property in ' + l.name + ', Hyderabad | Livarea'; drawMap($('#locMap'), projectsIn(slug), { extra:projectsIn(slug).length ? [] : [l], zoom:13 }); } };

  /* ---------------- BUILDERS ---------------- */
  ROUTES['builders'] = () => pageHero('Builders we represent', 'Every partner is vetted on delivery record and construction quality. We disclose any developer we work with exclusively.') + `
    <div class="wrap section">${BUILDERS.map(b => `
      <div class="sec-head" style="margin-top:12px"><div style="display:flex;gap:12px;align-items:center"><span class="b-mono">${esc(b.name.replace(/[^A-Za-z ]/g,'').split(' ').filter(Boolean).slice(0,2).map(w => w[0]).join(''))}</span><div><h2 style="font-size:22px">${esc(b.name)}</h2><p style="margin:0">${b.projects.length} project${b.projects.length > 1 ? 's' : ''}</p></div></div><a class="see-all" href="#/buy?builder=${b.slug}">View ${I.arrow}</a></div>
      <div class="results-grid" style="margin-bottom:28px">${b.projects.map(card).join('')}</div>`).join('')}
      <div class="cta-band"><div><h2>Are you a developer?</h2><p>Give your project one dedicated marketing partner in Hyderabad.</p></div><div class="btns"><a class="btn btn-light" href="#/partner">Partner with Livarea</a></div></div>
    </div>`;

  /* ---------------- TOOLS ---------------- */
  function slider(id, label, val, min, max, step, prefix){
    return `<div class="slider-field"><div class="sf-top"><label for="${id}">${label}</label><input type="number" id="${id}n" value="${val}" min="${min}" max="${max}" step="${step}" aria-label="${label}"></div>
      <input type="range" id="${id}" value="${val}" min="${min}" max="${max}" step="${step}" aria-label="${label} slider">${prefix === '₹' ? `<div class="sf-words" id="${id}w"></div>` : ''}</div>`;
  }
  function bindSliders(ids, fn){
    ids.forEach(id => {
      const r = $('#' + id), n = $('#' + id + 'n'), w = $('#' + id + 'w');
      const sync = v => { if(w) w.textContent = words(+v); };
      r.addEventListener('input', () => { n.value = r.value; sync(r.value); fn(); });
      n.addEventListener('input', () => { if(n.value !== ''){ r.value = n.value; sync(n.value); fn(); } });
      sync(r.value);
    });
    fn();
  }
  const TOOLS = [['emi','EMI Calculator',I.calc],['afford','Affordability',I.wallet],['stamp','Stamp Duty',I.doc],['rentbuy','Rent vs Buy',I.scale],['area','Area Converter',I.ruler]];
  ROUTES['tools'] = function(params, tab){
    tab = TOOLS.some(t => t[0] === tab) ? tab : 'emi';
    const nav = `<nav class="tool-tabs">${TOOLS.map(([k, l, ic]) => `<a href="#/tools/${k}" class="${k === tab ? 'on' : ''}">${ic}${l}</a>`).join('')}</nav>`;
    let body = '';
    if(tab === 'emi') body = `<div class="tool-layout">
        <div class="panel">${slider('tLoan','Loan amount',8000000,500000,100000000,100000,'₹')}${slider('tRate','Interest rate (%)',8.5,6,15,0.05)}${slider('tYrs','Tenure (years)',20,1,30,1)}</div>
        <div class="panel"><div class="result-big"><span>Monthly EMI</span><b id="tEmi">—</b></div>
          <div class="donut-wrap"><svg width="132" height="132" viewBox="0 0 42 42" id="tDonut" role="img" aria-label="Principal vs interest"></svg><div class="legend"><span><i style="background:var(--brand)"></i>Principal <b id="tP"></b></span><span><i style="background:var(--brand-tint-2)"></i>Interest <b id="tI"></b></span></div></div>
          <div class="result-rows"><div class="total"><span>Total payable</span><b id="tT">—</b></div></div>
          <h4 style="margin:18px 0 0;font-size:13px;color:var(--muted)">Outstanding balance by year</h4><div class="bars" id="tBars"></div><div class="bars-axis"><span>Year 1</span><span id="tEnd"></span></div>
        </div></div>`;
    else if(tab === 'afford') body = `<div class="tool-layout">
        <div class="panel">${slider('aInc','Monthly take-home income',250000,25000,2000000,5000,'₹')}${slider('aObl','Existing EMIs per month',0,0,500000,1000,'₹')}${slider('aDown','Savings for down payment & costs',5000000,0,50000000,100000,'₹')}${slider('aRate','Interest rate (%)',8.5,6,15,0.05)}${slider('aYrs','Tenure (years)',20,5,30,1)}
          <p class="fine">Assumes banks cap total EMIs at 50% of take-home pay, RBI loan-to-value limits (90% / 80% / 75%), and ~6% stamp duty + registration paid from your savings.</p></div>
        <div class="panel"><div class="result-big"><span>Property budget you can likely afford</span><b id="aBud">—</b></div>
          <div class="result-rows"><div><span>Max loan (income-based)</span><b id="aLoan">—</b></div><div><span>Loan you'd actually take</span><b id="aUse">—</b></div><div><span>Monthly EMI</span><b id="aEmi">—</b></div><div><span>Down payment</span><b id="aDp">—</b></div><div><span>Stamp duty & registration (~6%)</span><b id="aReg">—</b></div></div>
          <div id="aMatch" style="margin-top:16px"></div></div></div>`;
    else if(tab === 'stamp') body = `<div class="tool-layout">
        <div class="panel">${slider('sVal','Agreement value',20000000,1000000,200000000,100000,'₹')}
          <div class="field"><label for="sGv">Government guidance value (optional, ₹)</label><input id="sGv" type="number" placeholder="Leave blank if lower than agreement value"></div>
          <p class="fine">Duty is charged on the higher of agreement value and guidance value. Rates shown are for urban Hyderabad (GHMC / municipal limits).</p></div>
        <div class="panel"><div class="result-big"><span>Total registration cost</span><b id="sTot">—</b></div>
          <div class="result-rows"><div><span>Stamp duty (4%)</span><b id="sSd">—</b></div><div><span>Transfer duty (1.5%)</span><b id="sTd">—</b></div><div><span>Registration fee (0.5%)</span><b id="sRf">—</b></div><div class="total"><span>All-in (property + registration)</span><b id="sAll">—</b></div></div>
          <p class="fine">Rates and guidance values are revised periodically — confirm current figures on the IGRS Telangana portal. GST (if under construction), parking, floor-rise and corpus fund are extra.</p></div></div>`;
    else if(tab === 'rentbuy') body = `<div class="tool-layout">
        <div class="panel">${slider('rPrice','Property price',20000000,2000000,100000000,100000,'₹')}${slider('rRent','Rent for a similar home (per month)',50000,5000,500000,1000,'₹')}${slider('rDown','Down payment (%)',20,10,100,1)}${slider('rRate','Home-loan rate (%)',8.5,6,15,0.05)}${slider('rYrs','Years you plan to stay',10,3,30,1)}${slider('rApp','Property appreciation (% / yr)',6,0,15,0.5)}${slider('rRinc','Rent increase (% / yr)',5,0,12,0.5)}${slider('rInv','Return on invested savings (% / yr)',8,0,15,0.5)}</div>
        <div class="panel"><div class="result-big"><span id="rVerdictL">Better choice</span><b id="rVerdict">—</b></div>
          <div class="result-rows"><div><span>Net worth if you buy</span><b id="rBuy">—</b></div><div><span>Net worth if you rent &amp; invest</span><b id="rRentW">—</b></div><div><span>Monthly EMI</span><b id="rEmi">—</b></div><div><span>Starting rent</span><b id="rR0">—</b></div></div>
          <p class="fine">Buyer pays down payment + ~6% registration upfront and the EMI monthly. Renter invests that same upfront cash, plus the monthly difference whenever rent is cheaper than the EMI (and the buyer invests the difference when it isn't). Ignores tax benefits, maintenance and selling costs — a starting point, not advice.</p></div></div>`;
    else body = `<div class="tool-layout">
        <div class="panel"><div class="two"><div class="field"><label for="cVal">Value</label><input id="cVal" type="number" value="1"></div><div class="field"><label for="cUnit">Unit</label><select id="cUnit">${AREA_UNITS.map(([k, l]) => `<option value="${k}" ${k === 'acre' ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>
          <p class="fine">Telangana land is often quoted in guntas and sq.yards; apartments in sq.ft. Always ask whether a price is on carpet, built-up or super built-up area — they can differ by 25% or more.</p></div>
        <div class="panel"><div class="conv-grid" id="cOut"></div></div></div>`;
    return pageHero('Property tools', 'Free, private calculators — nothing you type leaves your browser.') + `<div class="wrap section">${nav}${body}</div>`;
  };
  const AREA_UNITS = [['sqft','Square feet',1],['sqyd','Square yards',9],['sqm','Square metres',10.7639],['gunta','Guntas',1089],['cent','Cents',435.6],['acre','Acres',43560],['hectare','Hectares',107639.1]];
  ROUTES['tools'].after = function(params, tab){
    tab = TOOLS.some(t => t[0] === tab) ? tab : 'emi';
    document.title = TOOLS.find(t => t[0] === tab)[1] + ' — Hyderabad property tools | Livarea';
    const v = id => +$('#' + id).value;
    if(tab === 'emi') bindSliders(['tLoan','tRate','tYrs'], () => {
      const P = v('tLoan'), R = v('tRate'), Y = v('tYrs'), e = emi(P, R, Y), T = e*Y*12, Int = T - P;
      $('#tEmi').textContent = inr(e) + '/mo'; $('#tP').textContent = words(P); $('#tI').textContent = words(Int); $('#tT').textContent = inr(T) + ' (' + words(T) + ')';
      const frac = T ? P/T : 0, c = 2*Math.PI*15.915;
      $('#tDonut').innerHTML = `<circle cx="21" cy="21" r="15.915" fill="none" stroke="#EFD9DE" stroke-width="6"/><circle cx="21" cy="21" r="15.915" fill="none" stroke="#6E2438" stroke-width="6" stroke-dasharray="${(frac*c).toFixed(2)} ${c.toFixed(2)}" transform="rotate(-90 21 21)"/><text x="21" y="22.5" text-anchor="middle" font-size="5" font-weight="800" fill="#1D1517">${Math.round(frac*100)}%</text>`;
      const r = R/12/100; let bal = P, bars = [];
      for(let y = 1; y <= Y; y++){ for(let m = 0; m < 12; m++){ bal = bal*(1 + r) - e; } bars.push(Math.max(0, bal)); }
      $('#tBars').innerHTML = bars.map((b, i) => `<div title="Year ${i + 1}: ${words(b) || '₹0'}"><i style="height:${(b/P*100).toFixed(1)}%"></i></div>`).join('');
      $('#tEnd').textContent = 'Year ' + Y;
    });
    if(tab === 'afford') bindSliders(['aInc','aObl','aDown','aRate','aYrs'], () => {
      const maxEmi = Math.max(0, v('aInc')*0.5 - v('aObl')), r = v('aRate')/12/100, n = v('aYrs')*12;
      const maxLoan = r ? maxEmi*(Math.pow(1 + r, n) - 1)/(r*Math.pow(1 + r, n)) : maxEmi*n, cash = v('aDown');
      const ltv = p => p <= 3e6 ? 0.9 : p <= 7.5e6 ? 0.8 : 0.75;
      let price = (maxLoan + cash)/1.06;
      for(let i = 0; i < 3; i++) price = Math.min((maxLoan + cash)/1.06, cash/(1.06 - ltv(price)));
      price = Math.max(0, price);
      const reg = price*0.06, loanUse = Math.max(0, price - (cash - reg));
      $('#aBud').textContent = price > 0 ? words(price) : '—';
      $('#aLoan').textContent = words(maxLoan) || '₹0'; $('#aUse').textContent = words(loanUse) || '₹0';
      $('#aEmi').textContent = inr(emi(loanUse, v('aRate'), v('aYrs'))) + '/mo';
      $('#aDp').textContent = words(price - loanUse) || '₹0'; $('#aReg').textContent = words(reg) || '₹0';
      const cr = price/1e7, m = PROJECTS.filter(p => budgetOf(p) != null && budgetOf(p) <= cr);
      $('#aMatch').innerHTML = m.length ? `<div class="callout"><b>${m.length} project${m.length > 1 ? 's' : ''}</b> on Livarea start within this budget. <a class="inline-link" href="#/buy?max=${Math.max(1, Math.ceil(cr*2)/2)}&sort=price-desc">See them →</a></div>`
        : `<div class="callout">None of our current projects start below ${words(price) || 'this budget'} — but <a class="inline-link" href="#/resale">resale</a> or <a class="inline-link" href="#/upcoming">pre-launch</a> may fit. Tell us and we'll look.</div>`;
    });
    if(tab === 'stamp'){
      const calc = () => {
        const base = Math.max(v('sVal'), +$('#sGv').value || 0);
        $('#sSd').textContent = inr(base*0.04); $('#sTd').textContent = inr(base*0.015); $('#sRf').textContent = inr(base*0.005);
        $('#sTot').textContent = inr(base*0.06); $('#sAll').textContent = words(v('sVal') + base*0.06);
      };
      bindSliders(['sVal'], calc); $('#sGv').addEventListener('input', calc);
    }
    if(tab === 'rentbuy') bindSliders(['rPrice','rRent','rDown','rRate','rYrs','rApp','rRinc','rInv'], () => {
      const price = v('rPrice'), down = price*v('rDown')/100, loan = price - down, yrs = v('rYrs'), r = v('rRate')/12/100, n = 20*12;
      const e = loan > 0 ? emi(loan, v('rRate'), 20) : 0, inv = v('rInv')/12/100;
      let bal = loan, rent = v('rRent'), renterPot = down + price*0.06, buyerPot = 0;
      for(let m = 1; m <= yrs*12; m++){
        const pay = m <= n && bal > 0 ? e : 0;
        if(bal > 0) bal = Math.max(0, bal*(1 + r) - pay);
        renterPot *= 1 + inv; buyerPot *= 1 + inv;
        if(pay > rent) renterPot += pay - rent; else buyerPot += rent - pay;
        if(m % 12 === 0) rent *= 1 + v('rRinc')/100;
      }
      const home = price*Math.pow(1 + v('rApp')/100, yrs), buyW = home - bal + buyerPot;
      $('#rBuy').textContent = words(buyW); $('#rRentW').textContent = words(renterPot);
      $('#rEmi').textContent = e ? inr(e) + '/mo (20-yr loan)' : 'No loan'; $('#rR0').textContent = inr(v('rRent')) + '/mo';
      const diff = buyW - renterPot;
      $('#rVerdict').textContent = Math.abs(diff) < price*0.02 ? 'Roughly equal' : diff > 0 ? 'Buying' : 'Renting';
      $('#rVerdictL').textContent = Math.abs(diff) < price*0.02 ? 'After ' + yrs + ' years' : 'Ahead by ' + words(Math.abs(diff)) + ' after ' + yrs + ' yrs';
    });
    if(tab === 'area'){
      const calc = () => {
        const val = +$('#cVal').value || 0, f = AREA_UNITS.find(u => u[0] === $('#cUnit').value)[2], sqft = val*f;
        $('#cOut').innerHTML = AREA_UNITS.map(([k, l, m]) => `<div class="field"><label>${l}</label><input readonly value="${(sqft/m).toLocaleString('en-IN', { maximumFractionDigits:4 })}"></div>`).join('');
      };
      $('#cVal').addEventListener('input', calc); $('#cUnit').addEventListener('change', calc); calc();
    }
  };

  /* ---------------- PRE-LAUNCH ---------------- */
  ROUTES['upcoming'] = function(params){
    const area = params.get('area') || '';
    return `<section class="hero" style="padding:48px 0 60px"><div class="wrap split" style="align-items:center">
      <div><span class="hero-eyebrow">${I.bell}Pre-launch access</span><h1 style="font-size:clamp(28px,4vw,46px)">Get priority access to pre-launch projects</h1>
        <p class="hero-sub" style="margin:0">Our partner developers open new phases and pre-launch projects through the year — often quietly, before any public listing. Tell us once; we reach out personally when something genuinely matches.</p>
        <div class="point-list" style="color:#fff">
          <div><span class="pi" style="background:rgba(255,255,255,.12);color:#fff">${I.wallet}</span><div><b style="color:#fff">Pre-launch pricing</b><span style="color:rgba(255,255,255,.7)">Typically the lowest price point in a project's lifecycle.</span></div></div>
          <div><span class="pi" style="background:rgba(255,255,255,.12);color:#fff">${I.grid}</span><div><b style="color:#fff">First choice of units</b><span style="color:rgba(255,255,255,.7)">The best floors, facing and views go in the first few weeks.</span></div></div>
          <div><span class="pi" style="background:rgba(255,255,255,.12);color:#fff">${I.shield}</span><div><b style="color:#fff">RERA first, always</b><span style="color:rgba(255,255,255,.7)">We share a project only once it's RERA-registered — never pay a booking amount before that.</span></div></div>
        </div></div>
      <form class="form-card" id="upForm" data-form="upcoming">
        <h3>Register your interest</h3><p class="sub">30 seconds. We message you on WhatsApp when a match opens.</p>
        <div class="two"><div class="field"><label for="u-name">Name</label><input id="u-name" name="name" required autocomplete="name"></div><div class="field"><label for="u-phone">WhatsApp number</label><input id="u-phone" name="phone" type="tel" required placeholder="+91" autocomplete="tel"></div></div>
        <div class="field"><span class="lbl">Preferred localities</span><div class="chips" data-multi="areas">${['Kokapet','Neopolis','Financial District','HITEC City','Kukatpally','Kollur','Tellapur','Rajendra Nagar'].map(a => `<button type="button" class="chip${area && a.toLowerCase() === area.toLowerCase() ? ' on' : ''}">${a}</button>`).join('')}</div></div>
        <div class="field"><label for="u-other">Another area?</label><input id="u-other" name="other" list="locList" value="${area && !['kokapet','neopolis','financial district','hitec city','kukatpally','kollur','tellapur','rajendra nagar'].includes(area.toLowerCase()) ? esc(area) : ''}" placeholder="e.g. Kompally, Shamshabad">${locDatalist()}</div>
        <div class="two"><div class="field"><label for="u-type">Interested in</label><select id="u-type" name="type">${typeOpts}</select></div><div class="field"><label for="u-budget">Budget</label><select id="u-budget" name="budget">${budgetOpts}</select></div></div>
        <div class="two"><div class="field"><label for="u-when">Timeline</label><select id="u-when" name="timeline"><option>Ready to buy now</option><option>Within 1–3 months</option><option>Within 3–6 months</option><option>Just exploring</option></select></div><div class="field"><label for="u-time">Best time to call</label><select id="u-time" name="time">${timeOpts}</select></div></div>
        <button class="btn btn-primary btn-block" type="submit">${I.bell}Notify me first</button>${leadNote}
      </form></div></section>`;
  };

  /* ---------------- POST PROPERTY ---------------- */
  ROUTES['post'] = () => pageHero('List your property — free', 'Selling or renting out a home in West Hyderabad? We verify it, photograph it properly and bring you screened buyers or tenants — not a flood of random calls.') + `
    <div class="wrap section split">
      <div>
        <div class="point-list" style="margin-top:0">
          <div><span class="pi">${I.users}</span><div><b>Screened enquiries only</b><span>We confirm budget, timeline and intent before anyone visits.</span></div></div>
          <div><span class="pi">${I.shield}</span><div><b>Your number stays private</b><span>Buyers and tenants talk to us first. You hear only from serious ones.</span></div></div>
          <div><span class="pi">${I.chart}</span><div><b>Priced from real comparables</b><span>We tell you what similar homes in your project actually go for.</span></div></div>
          <div><span class="pi">${I.doc}</span><div><b>Paperwork handled</b><span>Agreement, registration and handover guidance, start to finish.</span></div></div>
        </div>
        <p class="disclaimer">Listing is free. Brokerage on a successful sale or rental is agreed with you in writing upfront.</p>
      </div>
      <form class="form-card" id="postForm" data-form="post">
        <h3>Property details</h3><p class="sub">We'll call to verify and set up your listing.</p>
        <div class="seg" data-single-seg="intent"><button type="button" class="on">Sell</button><button type="button">Rent out</button></div>
        <div class="two"><div class="field"><label for="o-type">Property type</label><select id="o-type" name="type">${typeOpts}</select></div><div class="field"><label for="o-bhk">BHK</label><select id="o-bhk" name="bhk"><option>1 BHK</option><option>2 BHK</option><option selected>3 BHK</option><option>4 BHK</option><option>5 BHK+</option><option>N/A</option></select></div></div>
        <div class="two"><div class="field"><label for="o-loc">Locality</label><input id="o-loc" name="loc" list="locList" required placeholder="e.g. Kokapet">${locDatalist()}</div><div class="field"><label for="o-proj">Project / society</label><input id="o-proj" name="proj" placeholder="e.g. My Home Avatar"></div></div>
        <div class="two"><div class="field"><label for="o-area">Area (sq.ft)</label><input id="o-area" name="area" type="number" placeholder="e.g. 1850"></div><div class="field"><label for="o-price">Expected price / rent</label><input id="o-price" name="price" placeholder="e.g. ₹1.6 Cr or ₹45,000/mo"></div></div>
        <div class="field"><label for="o-furn">Furnishing</label><select id="o-furn" name="furn"><option>Unfurnished</option><option>Semi-furnished</option><option>Fully furnished</option></select></div>
        <div class="two"><div class="field"><label for="o-name">Your name</label><input id="o-name" name="name" required autocomplete="name"></div><div class="field"><label for="o-phone">WhatsApp number</label><input id="o-phone" name="phone" type="tel" required placeholder="+91" autocomplete="tel"></div></div>
        <button class="btn btn-primary btn-block" type="submit">${I.plus}Submit listing</button>${leadNote}
      </form>
    </div>`;

  /* ---------------- GUIDES & FAQ ---------------- */
  ROUTES['guides'] = () => pageHero('Guides & FAQs', 'A few things worth knowing before you sign anything — written plainly, not in legal jargon.') + `
    <div class="wrap section split">
      <div><p class="eyebrow">Guides</p><h2 style="font-size:26px">Buying your first home in Hyderabad</h2>
        ${window.GUIDES.map((g, i) => `<details class="acc"${i === 0 ? ' open' : ''}><summary>${esc(g.t)}</summary><div class="acc-body prose">${g.h}</div></details>`).join('')}
        <p class="disclaimer">General information, not legal or financial advice. Rules, rates and processes change — confirm with a RERA-registered professional, a property lawyer or your bank.</p>
      </div>
      <div><p class="eyebrow">FAQ</p><h2 style="font-size:26px">Common questions</h2>
        ${window.FAQ.map(c => `<h3 class="faq-cat">${esc(c.cat)}</h3>` + c.items.map(([q, a]) => `<details class="acc"><summary>${esc(q)}</summary><div class="acc-body"><p>${esc(a)}</p></div></details>`).join('')).join('')}
        <p class="disclaimer">Last reviewed October 2026.</p>
      </div>
    </div>`;

  /* ---------------- ABOUT ---------------- */
  ROUTES['about'] = () => pageHero('We\'ve watched Kokapet turn into a skyline.', 'Livarea has spent over 15 years inside Hyderabad\'s real estate market — long enough to remember when the Financial District was mostly open land.') + `
    <div class="wrap section split">
      <div class="prose">
        <p>That local memory is the advantage we bring to every buyer: we know which layouts age well, which developers deliver on time, and which addresses are worth the premium.</p>
        <p>We operate as an independent advisory and channel partner — not a developer — so our shortlist is built around what fits your budget and lifestyle, not around clearing one project's inventory. Every recommendation comes from our own site visits, developer relationships and years of watching these micro-markets play out.</p>
        <div class="callout">Livarea is an authorised marketing associate for its partnered developers. TS RERA Agent Registration No. <b>${esc(C.rera)}</b> — verify it on rera.telangana.gov.in.</div>
      </div>
      <div class="point-list" style="margin-top:0">
        <div><span class="pi">${I.users}</span><div><b>Client-first advisory</b><span>We tell you plainly when a project isn't the right fit, and disclose any developer we work with exclusively.</span></div></div>
        <div><span class="pi">${I.building}</span><div><b>Trusted builder network</b><span>Every partner vetted on delivery record and construction quality.</span></div></div>
        <div><span class="pi">${I.doc}</span><div><b>End-to-end support</b><span>Site visits, comparisons and paperwork guidance through registration.</span></div></div>
        <div><span class="pi">${I.pin}</span><div><b>West &amp; Central Hyderabad</b><span>Deep, focused expertise rather than a city-wide scattershot.</span></div></div>
      </div>
    </div>
    <div class="wrap" style="padding-bottom:56px"><div class="steps">
      <div><h3>Understand</h3><p>Budget, preferred corridor and must-haves.</p></div><div><h3>Shortlist</h3><p>Matching projects with honest trade-offs.</p></div><div><h3>Visit</h3><p>Accompanied site visits.</p></div><div><h3>Close</h3><p>Booking, documentation and registration.</p></div>
    </div></div>`;

  /* ---------------- PARTNER ---------------- */
  ROUTES['partner'] = () => pageHero('Give your project one dedicated marketing partner', 'Livarea takes on a limited number of projects as an exclusive marketing partner in Hyderabad — adding qualified buyers on top of what your existing channels deliver.') + `
    <div class="wrap section split">
      <div class="prose">
        <h3>Problems we solve</h3>
        <ul><li><b>Unqualified walk-ins.</b> We screen budget, timeline and intent before anyone is sent to site.</li>
        <li><b>Rising cost of leads.</b> Portal leads are shared with competitors and rarely convert. We build focused, project-specific demand.</li>
        <li><b>Hard-to-reach NRI and high-budget buyers.</b> They want verified information and a trusted contact. We handle the conversation end to end.</li>
        <li><b>Too many channel partners, no one leading with your project.</b> Under an exclusive arrangement, yours is the one we lead with.</li>
        <li><b>Slow follow-up.</b> We respond on WhatsApp quickly and keep following up until the buyer decides.</li></ul>
        <h3>How we aim to sell one more unit than your current run-rate</h3>
        <ol style="padding-left:20px"><li><b>Add, not replace.</b> Incremental sales, measured against your own numbers.</li><li><b>Qualify before the visit.</b> Budget, timeline, funding and purpose confirmed first.</li><li><b>Dedicated project presence.</b> A project page, brochure and price-sheet sharing, targeted outreach.</li><li><b>Accompanied visits and follow-up</b> through booking and registration.</li><li><b>Monthly reporting</b> of enquiries, visits, objections and bookings.</li></ol>
        <p class="disclaimer">We do not promise guaranteed sales volumes. Terms, commission and exclusivity are agreed in writing before we start.</p>
      </div>
      <form class="form-card" data-form="partner">
        <h3>Partner with Livarea</h3><p class="sub">We reply within one working day.</p>
        <div class="two"><div class="field"><label for="pp-co">Company / developer</label><input id="pp-co" name="company" required></div><div class="field"><label for="pp-name">Contact person</label><input id="pp-name" name="name" required></div></div>
        <div class="two"><div class="field"><label for="pp-phone">Phone / WhatsApp</label><input id="pp-phone" name="phone" type="tel" required placeholder="+91"></div><div class="field"><label for="pp-email">Email</label><input id="pp-email" name="email" type="email"></div></div>
        <div class="field"><label for="pp-proj">Project name &amp; location</label><input id="pp-proj" name="project" required></div>
        <div class="two"><div class="field"><label for="pp-type">Project type</label><select id="pp-type" name="ptype"><option>Apartments</option><option>Villas</option><option>Plotted development</option><option>Commercial / Retail</option><option>Mixed use</option></select></div><div class="field"><label for="pp-stage">Stage</label><select id="pp-stage" name="stage"><option>Pre-launch</option><option>Under construction</option><option>Nearing completion</option><option>Ready to move</option></select></div></div>
        <div class="two"><div class="field"><label for="pp-rera">RERA status</label><select id="pp-rera" name="rera"><option>Registered</option><option>Applied</option><option>Not yet applied</option></select></div><div class="field"><label for="pp-units">Units left (approx.)</label><input id="pp-units" name="units" placeholder="e.g. 60"></div></div>
        <div class="field"><label for="pp-msg">Anything else?</label><textarea id="pp-msg" name="msg" placeholder="Current channels, target buyers, timelines…"></textarea></div>
        <button class="btn btn-primary btn-block" type="submit">Send partnership enquiry</button>
      </form>
    </div>`;

  /* ---------------- CONTACT ---------------- */
  ROUTES['contact'] = () => pageHero('Let\'s find your next address', 'Tell us your budget and preferred corridor — we\'ll get back with a shortlist that actually fits, usually within a day.') + `
    <div class="wrap section split">
      <div>
        <div class="kv-grid" style="grid-template-columns:1fr">
          <div><span>WhatsApp / Call</span><b><a href="${telLink}">${esc(C.phoneDisplay)}</a></b></div>
          <div><span>Email</span><b><a href="mailto:${esc(C.email)}">${esc(C.email)}</a></b></div>
          <div><span>Office</span><b>${esc(C.office)}</b></div>
          <div><span>TS RERA Agent No.</span><b>${esc(C.rera)}</b></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap"><a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink("Hi Livarea, I'd like to know more about your projects in Hyderabad.")}">${I.wa}WhatsApp us</a><a class="btn btn-ghost" href="${telLink}">${I.phone}Call now</a></div>
      </div>
      <form class="form-card" data-form="contact">
        <h3>Send an enquiry</h3><p class="sub">Choose how and when you'd like us to reach you.</p>
        <div class="two"><div class="field"><label for="c-name">Name</label><input id="c-name" name="name" required autocomplete="name"></div><div class="field"><label for="c-phone">Phone</label><input id="c-phone" name="phone" type="tel" required placeholder="+91" autocomplete="tel"></div></div>
        <div class="two"><div class="field"><label for="c-loc">Where are you looking?</label><input id="c-loc" name="loc" list="locList" placeholder="Any area">${locDatalist()}</div><div class="field"><label for="c-type">Interested in</label><select id="c-type" name="type">${typeOpts}</select></div></div>
        <div class="field"><span class="lbl">How should we reach you?</span><div class="chips" data-single="method"><button type="button" class="chip on">Call me</button><button type="button" class="chip">WhatsApp me</button><button type="button" class="chip">Video call</button><button type="button" class="chip">Visit in person</button></div></div>
        <div class="two"><div class="field"><label for="c-date">Preferred date</label><input id="c-date" name="date" type="date" min="${new Date().toISOString().slice(0, 10)}"></div><div class="field"><label for="c-time">Preferred time</label><select id="c-time" name="time">${timeOpts}</select></div></div>
        <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="msg" placeholder="Budget, BHK, timeline…"></textarea></div>
        <button class="btn btn-primary btn-block" type="submit">${I.wa}Send via WhatsApp</button>${leadNote}
      </form>
    </div>`;

  function pageHero(title, sub){ return `<section class="page-hero"><div class="wrap"><h1>${title}</h1><p>${sub}</p></div></section>`; }
  function notFound(){ return pageHero('Page not found', 'That link may be out of date.') + `<div class="wrap section"><a class="btn btn-primary" href="#/">Go home</a> <a class="btn btn-ghost" href="#/buy">Browse projects</a></div>`; }

  /* =====================================================================
     GENERIC FORM HANDLING (all data-form forms rendered in pages)
     ===================================================================== */
  function chipVal(form, key){ const g = $(`[data-single="${key}"] .on, [data-single-seg="${key}"] .on`, form); return g ? g.textContent : ''; }
  function multiVal(form, key){ return $$(`[data-multi="${key}"] .on`, form).map(b => b.textContent); }
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-multi] .chip');
    if(c){ c.classList.toggle('on'); return; }
    const s = e.target.closest('[data-single] .chip, [data-single-seg] button');
    if(s){ $$('.chip, button', s.parentElement).forEach(x => x.classList.toggle('on', x === s)); }
  });
  document.addEventListener('submit', e => {
    const f = e.target, kind = f.dataset.form;
    if(!kind || ['enquire','visit','brochure'].includes(kind)) return;
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    let text = '', source = '', lead = {};
    if(kind === 'rent'){
      const areas = multiVal(f, 'areas').join(', ') || 'Not specified';
      source = 'Rental enquiry'; lead = { name:d.name, phone:d.phone, interest:'Rent', propertyType:d.type, area:areas, budget:d.budget, timeline:d.movein, occupation:d.role };
      text = `Hi Livarea, I'm looking to rent a ${d.bhk} ${d.type}. Name: ${d.name}, WhatsApp: ${d.phone}. Areas: ${areas}. Budget: ${d.budget}/month. Move-in: ${d.movein}. Furnishing: ${d.furnishing}.${d.role ? ' Occupation: ' + d.role + '.' : ''}`;
    } else if(kind === 'resale'){
      const areas = multiVal(f, 'areas').join(', ') || 'Not specified';
      source = 'Resale enquiry'; lead = { name:d.name, phone:d.phone, interest:'Resale', area:areas, budget:d.budget, timeline:d.timeline };
      text = `Hi Livarea, I'm looking for a resale ${d.bhk}. Name: ${d.name}, WhatsApp: ${d.phone}. Areas: ${areas}. Budget: ${d.budget}. Timeline: ${d.timeline}.`;
    } else if(kind === 'upcoming'){
      const areas = multiVal(f, 'areas').concat(d.other ? [d.other] : []).join(', ') || 'Not specified';
      source = 'Pre-launch signup'; lead = { name:d.name, phone:d.phone, interest:d.type, area:areas, budget:d.budget, timeline:d.timeline, prefTime:d.time };
      text = `Hi Livarea, please notify me about pre-launch projects. Name: ${d.name}, WhatsApp: ${d.phone}. Looking for: ${d.type}. Localities: ${areas}. Budget: ${d.budget}. Timeline: ${d.timeline}. Best time to call: ${d.time}.`;
    } else if(kind === 'post'){
      const intent = chipVal(f, 'intent');
      source = 'Owner listing'; lead = { name:d.name, phone:d.phone, interest:intent, propertyType:d.type, area:d.loc, message:[d.bhk, d.proj, d.area && d.area + ' sq.ft', d.price, d.furn].filter(Boolean).join(' · ') };
      text = `Hi Livarea, I want to ${intent.toLowerCase()} my property. ${d.bhk} ${d.type} in ${d.loc}${d.proj ? ' (' + d.proj + ')' : ''}${d.area ? ', ' + d.area + ' sq.ft' : ''}, ${d.furn}. Expected: ${d.price || 'open to advice'}. Name: ${d.name}, WhatsApp: ${d.phone}.`;
    } else if(kind === 'partner'){
      source = 'Builder enquiry'; lead = { company:d.company, name:d.name, phone:d.phone, email:d.email, area:d.project, propertyType:d.ptype, timeline:d.stage, message:d.msg, budget:'Units left: ' + (d.units || 'n/a'), occupation:'RERA: ' + d.rera };
      text = `Hi Livarea, I'm ${d.name} from ${d.company} (${d.phone}). We'd like to discuss exclusive marketing of ${d.project}. Type: ${d.ptype}, Stage: ${d.stage}, RERA: ${d.rera}, Units left: ${d.units || 'n/a'}. ${d.msg || ''}`;
    } else if(kind === 'contact'){
      const method = chipVal(f, 'method'), date = d.date ? d.date.split('-').reverse().join('/') : '';
      source = 'Contact form'; lead = { name:d.name, phone:d.phone, interest:d.type, area:d.loc, contactMethod:method, prefDate:d.date, prefTime:d.time, message:d.msg };
      text = `Hi Livarea, I'm ${d.name} (${d.phone}). I'm looking for a ${d.type} in ${d.loc || 'Hyderabad'}. Preferred contact: ${method}${date ? ' on ' + date : ''}, ${d.time}.${d.msg ? ' ' + d.msg : ''}`;
    } else if(kind === 'chat'){
      source = 'Chat widget'; lead = { name:d.name, phone:d.phone, interest:d.intent, area:d.area, budget:d.budget, prefTime:d.time };
      text = `Hi Livarea! I'm ${d.name} (${d.phone}). Looking to: ${d.intent}. Area: ${d.area || 'Not specified'}. Budget: ${d.budget}. Best time to reach me: ${d.time}.`;
      toggleChat(false);
    }
    saveLead(source, lead);
    openWA(text);
    toast('Opening WhatsApp…');
  });

  /* =====================================================================
     GLOBAL UI
     ===================================================================== */
  let toastT;
  function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }
  function share(url, title){
    if(navigator.share){ navigator.share({ title:title, url:url }).catch(() => {}); return; }
    try{ navigator.clipboard.writeText(url).then(() => toast('Link copied'), () => prompt('Copy this link', url)); }catch(e){ prompt('Copy this link', url); }
  }
  function updateBadges(){
    $$('[data-count="shortlist"]').forEach(el => el.textContent = shortlist.length || '');
    const tray = $('#cmpTray');
    tray.classList.toggle('show', compare.length > 0 && !location.hash.startsWith('#/compare'));
    $('#cmpItems').innerHTML = compare.map(id => `<span class="ct-item">${esc(PBYID[id].name)}<button data-cmp-x="${id}" aria-label="Remove">×</button></span>`).join('');
    $('#cmpGo').textContent = compare.length > 1 ? 'Compare ' + compare.length : 'Add 1 more';
  }
  function toggleCompare(id, on){
    if(on && !compare.includes(id)){
      if(compare.length >= 3){ toast('You can compare up to 3 projects'); return false; }
      compare.push(id);
    } else if(!on) compare = compare.filter(x => x !== id);
    store.set('compare', compare); updateBadges(); return true;
  }
  document.addEventListener('click', e => {
    const h = e.target.closest('[data-heart]');
    if(h){
      e.preventDefault();
      const id = h.dataset.heart, on = !shortlist.includes(id);
      shortlist = on ? shortlist.concat(id) : shortlist.filter(x => x !== id);
      store.set('shortlist', shortlist);
      $$(`[data-heart="${id}"]`).forEach(b => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      toast(on ? 'Saved to shortlist' : 'Removed from shortlist');
      updateBadges();
      if(!on && location.hash.startsWith('#/shortlist')) router();
      return;
    }
    const cb = e.target.closest('[data-cmpbtn]');
    if(cb){ const id = cb.dataset.cmpbtn, on = !compare.includes(id); if(toggleCompare(id, on)){ cb.classList.toggle('on', on); toast(on ? 'Added to compare' : 'Removed from compare'); } return; }
    const cx = e.target.closest('[data-cmp-x]');
    if(cx){ toggleCompare(cx.dataset.cmpX, false); $$(`[data-cmp="${cx.dataset.cmpX}"]`).forEach(i => i.checked = false); return; }
    const sh = e.target.closest('[data-share]');
    if(sh){ const p = PBYID[sh.dataset.share]; share(location.href, p.name + ' by ' + p.builder + ' — Livarea'); return; }
    const sc = e.target.closest('[data-scroll]');
    if(sc){ const t = document.getElementById(sc.dataset.scroll); if(t){ e.preventDefault(); t.scrollIntoView({ behavior:'smooth', block:'start' }); } return; }
    const dd = e.target.closest('.nav-drop > button');
    $$('.nav-drop').forEach(n => { if(!dd || n !== dd.parentElement) n.classList.remove('open'); });
    if(dd){ dd.parentElement.classList.toggle('open'); dd.setAttribute('aria-expanded', dd.parentElement.classList.contains('open')); }
  });
  document.addEventListener('change', e => {
    const c = e.target.closest('[data-cmp]');
    if(c && !toggleCompare(c.dataset.cmp, c.checked)) c.checked = false;
  });

  // drawer
  const drawer = $('#drawer'), drawerBg = $('#drawerBg');
  function setDrawer(open){ drawer.classList.toggle('open', open); drawerBg.classList.toggle('open', open); drawer.setAttribute('aria-hidden', !open); }
  $('#menuToggle').addEventListener('click', () => setDrawer(true));
  $('#drawerClose').addEventListener('click', () => setDrawer(false));
  drawerBg.addEventListener('click', () => setDrawer(false));

  // chat
  const chat = $('#chatPanel');
  function toggleChat(open){ chat.classList.toggle('open', open); $('#chatFab').setAttribute('aria-expanded', open); if(open) setTimeout(() => { const i = $('input', chat); if(i) i.focus(); }, 50); }
  $('#chatFab').addEventListener('click', () => toggleChat(!chat.classList.contains('open')));
  $('#chatBottom').addEventListener('click', () => toggleChat(!chat.classList.contains('open')));
  $('#chatClose').addEventListener('click', () => toggleChat(false));
  document.addEventListener('keydown', e => { if(e.key === 'Escape'){ toggleChat(false); setDrawer(false); const f = $('#filters'); if(f) f.classList.remove('open'); } });

  /* =====================================================================
     ROUTER
     ===================================================================== */
  const TITLES = { '':'Livarea | New projects, resale & rentals in Hyderabad — RERA-registered advisory', buy:'New projects in Hyderabad | Livarea', commercial:'Commercial property in Hyderabad | Livarea', rent:'Homes for rent in Hyderabad | Livarea', resale:'Resale homes in Hyderabad | Livarea', compare:'Compare projects | Livarea', shortlist:'Your shortlist | Livarea', localities:'Hyderabad localities & market outlook | Livarea', builders:'Builders we represent | Livarea', upcoming:'Pre-launch projects in Hyderabad | Livarea', post:'List your property free | Livarea', guides:'Home-buying guides & FAQs | Livarea', about:'About Livarea', partner:'For developers | Livarea', contact:'Contact Livarea' };
  const NAV_KEY = { buy:'buy', commercial:'commercial', rent:'rent', resale:'resale', project:'buy', localities:'localities', locality:'localities', tools:'tools', builders:'buy' };
  let lastPath = null;
  function router(){
    const raw = location.hash.replace(/^#\/?/, '');
    const [pathPart, qs] = raw.split('?');
    const segs = pathPart.split('/').filter(Boolean);
    const key = segs[0] || '', arg = segs[1] ? decodeURIComponent(segs[1]) : undefined;
    const params = new URLSearchParams(qs || '');
    const route = ROUTES.hasOwnProperty(key) ? ROUTES[key] : null;
    document.body.classList.remove('has-pd-cta');
    searchState = null;
    app.innerHTML = route ? route(params, arg) : notFound();
    app.classList.remove('fade-in'); void app.offsetWidth; app.classList.add('fade-in');
    document.title = TITLES[key] || 'Livarea';
    if(route && route.after) route.after(params, arg);
    if(pathPart !== lastPath) window.scrollTo(0, 0);
    lastPath = pathPart;
    const nk = NAV_KEY[key] || key;
    $$('.main-nav a[data-nav], .bottom-nav [data-nav]').forEach(a => a.classList.toggle(a.closest('.bottom-nav') ? 'on' : 'active', a.dataset.nav === (nk || 'home')));
    setDrawer(false);
    updateBadges();
  }
  // in-page "#id" anchors (not routes) should scroll, not route
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if(a && !a.getAttribute('href').startsWith('#/') && a.getAttribute('href').length > 1){
      const t = document.getElementById(a.getAttribute('href').slice(1));
      e.preventDefault(); if(t) t.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  });
  window.addEventListener('hashchange', router);

  // FAQ structured data, generated from the same source as the page
  try{
    const ld = document.createElement('script'); ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({ '@context':'https://schema.org', '@type':'FAQPage', mainEntity:window.FAQ.flatMap(c => c.items.map(([q, a]) => ({ '@type':'Question', name:q, acceptedAnswer:{ '@type':'Answer', text:a } }))) });
    document.head.appendChild(ld);
  }catch(e){}

  router();
})();
