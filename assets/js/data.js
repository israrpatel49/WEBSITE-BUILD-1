/* =====================================================================
   LIVAREA — SITE DATA
   Everything the site shows comes from this file. Edit here, not in app.js.
   ===================================================================== */

window.LIVAREA = {
  phone: '917020039986',
  phoneDisplay: '+91 70200 39986',
  email: 'livareaproperties@gmail.com',
  rera: 'A02500005244',
  office: 'Financial District, Hyderabad, Telangana',

  // Paste your Google Apps Script web-app URL here to save every lead to a
  // Google Sheet. While empty, forms still open WhatsApp but nothing is saved.
  leadEndpoint: '',

  pricesAsOf: 'July 2026'
};

/* ---------------------------------------------------------------------
   LOCALITIES
   lat/lng are approximate locality centres (not project pins).
   band / appr come from the Market Outlook research (indicative, mid-2026).
   --------------------------------------------------------------------- */
window.LOCALITIES = [
  { slug:'kokapet', name:'Kokapet', lat:17.3960, lng:78.3370, group:'Kokapet & Neopolis',
    band:'₹9,000–15,000/sqft', bandLo:9000, bandHi:15000, appr:'10–15% / yr',
    tag:"Hyderabad's \"Next Gachibowli\"",
    blurb:'Financial District overflow, the Neopolis SEZ and direct ORR access have made this the city\'s most premium western corridor.' },
  { slug:'neopolis', name:'Neopolis', lat:17.3895, lng:78.3260, group:'Kokapet & Neopolis',
    band:'₹9,000–15,000/sqft', bandLo:9000, bandHi:15000, appr:'10–15% / yr',
    tag:'Planned SEZ beside Gandipet Lake',
    blurb:'The HMDA-planned Neopolis layout inside Kokapet — wide roads, high-rise zoning and lake views towards Gandipet.' },
  { slug:'financial-district', name:'Financial District', lat:17.4170, lng:78.3420, group:'Financial District Core',
    band:'₹9,500–16,000/sqft', bandLo:9500, bandHi:16000, appr:'8–10% / yr',
    tag:'Steady, established value',
    blurb:'The city\'s original premium office-and-residential address — less upside than emerging corridors, but the lowest-risk hold.' },
  { slug:'nanakramguda', name:'Nanakramguda', lat:17.4210, lng:78.3490, group:'Financial District Core',
    band:'₹9,500–16,000/sqft', bandLo:9500, bandHi:16000, appr:'8–10% / yr',
    tag:'Beside WaveRock & the office belt',
    blurb:'Part of the Financial District office cluster — strong tenant demand from the surrounding tech campuses.' },
  { slug:'puppalaguda', name:'Puppalaguda', lat:17.3985, lng:78.3720, group:'Financial District Core',
    band:'₹9,500–16,000/sqft', bandLo:9500, bandHi:16000, appr:'8–10% / yr',
    tag:'Between Manikonda & the Financial District',
    blurb:'A fast-densifying pocket south of the Financial District, increasingly home to ultra-luxury towers.' },
  { slug:'hitec-city', name:'HITEC City', lat:17.4474, lng:78.3762, group:'Kukatpally & HITEC City',
    band:'₹8,000–12,000/sqft', bandLo:8000, bandHi:12000, appr:'Strong rental demand',
    tag:'Established, metro-anchored demand',
    blurb:'Mature social infrastructure and metro access keep rental demand consistently strong here.' },
  { slug:'kukatpally', name:'Kukatpally', lat:17.4849, lng:78.4138, group:'Kukatpally & HITEC City',
    band:'₹8,000–12,000/sqft', bandLo:8000, bandHi:12000, appr:'Strong rental demand',
    tag:'KPHB Metro, minutes from HITEC City',
    blurb:'One of the city\'s most established residential hubs with direct KPHB Metro access.' },
  { slug:'rajendra-nagar', name:'Rajendra Nagar', lat:17.3210, lng:78.4010, group:'Rajendra Nagar',
    band:'₹6,000–9,000/sqft', bandLo:6000, bandHi:9000, appr:'8–12% / yr',
    tag:"South Hyderabad's metro-linked bet",
    blurb:'The Purple Line extension and airport-corridor expressway access are opening this belt to institutional-grade launches.' },
  { slug:'kollur', name:'Kollur', lat:17.4730, lng:78.2600, group:'Kollur',
    band:'₹5,700–13,000/sqft', bandLo:5700, bandHi:13000, appr:'~116% over 5 yrs',
    tag:'Highest-upside entry point',
    blurb:'ORR frontage and the Metro Phase 2 tailwind are driving the city\'s sharpest 5-year price growth from a still-affordable base.' },
  { slug:'tellapur', name:'Tellapur', lat:17.4614, lng:78.2833, group:'Tellapur & Narsingi',
    band:'₹7,700–10,300/sqft', bandLo:7700, bandHi:10300, appr:'12–14% / yr',
    tag:'Low-density premium living',
    blurb:'Gachibowli-adjacent with more greenery and wider roads — a favourite for families upgrading out of denser corridors.' },
  { slug:'narsingi', name:'Narsingi', lat:17.3870, lng:78.3570, group:'Tellapur & Narsingi',
    band:'₹7,700–10,300/sqft', bandLo:7700, bandHi:10300, appr:'12–14% / yr',
    tag:'ORR-side, next to Kokapet',
    blurb:'Directly on the ORR between Kokapet and Gachibowli — good connectivity at a discount to its neighbours.' },
  { slug:'gachibowli', name:'Gachibowli', lat:17.4401, lng:78.3489, group:'Gachibowli',
    band:null, appr:null, tag:'The original IT corridor',
    blurb:'Home to many of the city\'s largest tech campuses; mature, dense and in steady rental demand.' },
  { slug:'kondapur', name:'Kondapur', lat:17.4600, lng:78.3548, group:'Kondapur',
    band:null, appr:null, tag:'Residential belt beside HITEC City',
    blurb:'A popular rental and end-user market immediately north of Gachibowli and west of HITEC City.' }
];

/* ---------------------------------------------------------------------
   NEW PROJECTS (Buy)
   - loc: locality slug used for filters and the map
   - minCr: starting price in crore (null = price on request)
   - bhk: configurations for filtering · bhkLabel: how it is shown
   - sqft: [min, max] saleable area where known
   - psf: indicative ₹/sqft where the source quoted one
   - configs: rows for the project page's configuration table
   - brochure: optional direct-download link
   - photos: [{ src, cap }] — first photo is used on cards; all appear in the gallery
   - masterplan / floorplan: optional image paths, shown in the Plans section
   Projects without photos show a labelled illustration instead.
   --------------------------------------------------------------------- */
window.PROJECTS = [
  { id:'marina', name:'Marina', builder:'Western Construction', locality:'Puppalaguda, Financial District', loc:'puppalaguda',
    type:'residential', blurb:'Ultra-luxury 4 BHK residences in the Western Windsor Park development, minutes from Nanakramguda and the Financial District.',
    price:'₹6.0 Cr onwards', minCr:6.0, priceNote:'4 BHK · ~5,475–10,900 sq.ft · ~₹11,000/sqft',
    bhk:[4], bhkLabel:'4 BHK', sqft:[5475,10900], psf:11000,
    configs:[{ c:'4 BHK', a:'~5,475 – 10,900 sq.ft' }],
    wa:'Marina by Western Construction, Puppalaguda' },

  { id:'pristinia', name:'Pristinia', builder:'Rajapushpa Properties', locality:'Kokapet', loc:'kokapet',
    type:'residential', blurb:'Premium 2, 3 & 4 BHK towers in Kokapet, moments from Neopolis and the Financial District.',
    price:'₹1.8 Cr onwards', minCr:1.8, priceNote:'2–4 BHK · ~1,380–4,595 sq.ft · ~₹8,300/sqft',
    bhk:[2,3,4], bhkLabel:'2, 3, 4 BHK', sqft:[1380,4595], psf:8300,
    configs:[{ c:'2, 3 & 4 BHK', a:'~1,380 – 4,595 sq.ft' }],
    rera:'TS RERA P02400006086',
    photos:[{ src:'assets/projects/pristinia/01.jpg', cap:'Tower elevation' },{ src:'assets/projects/pristinia/02.jpg', cap:'Daytime view of the towers' },{ src:'assets/projects/pristinia/03.jpg', cap:'Aerial view' },{ src:'assets/projects/pristinia/04.jpg', cap:'Club Pristine clubhouse' },{ src:'assets/projects/pristinia/05.jpg', cap:'Seating zone at the podium' },{ src:'assets/projects/pristinia/06.jpg', cap:'Tower elevation, dusk' }],
    masterplan:'assets/projects/pristinia/masterplan.jpg', floorplan:'assets/projects/pristinia/floorplan.jpg',
    brochure:'https://drive.google.com/uc?export=download&id=1co4TDknNcc14HCaQJWjvna4hm36B3i4P',
    wa:'Rajapushpa Pristinia, Kokapet' },

  { id:'neopolis', name:'Neopolis', builder:'Rajapushpa Properties', locality:'Neopolis, Kokapet', loc:'neopolis',
    type:'residential', blurb:'Luxury residences inside the Neopolis SEZ, close to Gandipet Lake and the ORR.',
    price:'₹2.5 Cr onwards', minCr:2.5, priceNote:'3 & 4 BHK · estimate based on the Neopolis–Kokapet corridor',
    bhk:[3,4], bhkLabel:'3, 4 BHK', sqft:null, psf:null, lake:true,
    configs:[{ c:'3 & 4 BHK', a:'Shared on request' }],
    wa:'Rajapushpa Neopolis' },

  { id:'beaumonde', name:'Beaumonde', builder:'Koncept Ambience', locality:'Kokapet', loc:'kokapet',
    type:'residential', blurb:'Only 140 homes in a single 14-storey tower on 1.6 acres — low-density luxury with a rooftop infinity pool and 54,000 sq.ft of amenities.',
    price:'₹1.9 Cr onwards', minCr:1.9, priceNote:'3 BHK · 1,860 / 2,320 / 2,350 sq.ft · ~₹8,500/sqft',
    bhk:[3], bhkLabel:'3 BHK', sqft:[1860,2350], psf:8500,
    art:{ towers:1, floors:14 },
    configs:[{ c:'3 BHK', a:'1,860 sq.ft' },{ c:'3 BHK', a:'2,320 sq.ft' },{ c:'3 BHK', a:'2,350 sq.ft' }],
    brochure:'https://drive.google.com/uc?export=download&id=1s_C3dKTtw1Um5_-A_83LPW1dGtUV4MwL',
    wa:'Ambience Beaumonde, Kokapet' },

  { id:'palais', name:'Palais Royale', builder:'Sumadhura Group', locality:'Puppalaguda, Financial District', loc:'puppalaguda',
    type:'residential', blurb:'A single floating tower connecting three wings on 7.35 acres — just 72 homes per acre, an 85,000 sq.ft branded clubhouse and a Sky Lounge at 212.9 m. Cloud facilities, ERV and evaporative cooling set a new benchmark for fine living between HITEC City and Neopolis.',
    price:'₹4.75 Cr onwards', minCr:4.75, priceNote:'4 & 5 BHK · 3,800–6,610 sq.ft · carpet 2,416–3,898 sq.ft',
    bhk:[4,5], bhkLabel:'4, 5 BHK', sqft:[3800,6610], psf:null, rera:'TG RERA P02400008107',
    art:{ towers:3, floors:55, bridge:true },
    stats:[{v:7.35,l:'Acres',d:2},{v:523,l:'Residences'},{v:3,l:'Wings'},{v:85000,l:'Sq.ft Clubhouse'}],
    configs:[{ c:'5 BHK · Wing 1', a:'6,500 – 6,610 sq.ft' },{ c:'4 BHK · Wing 2', a:'4,850 sq.ft' },{ c:'4 BHK · Wing 3', a:'3,800 – 4,030 sq.ft' }],
    highlights:['Low density — only 72 units per acre','Sky Lounge at 212.9 m with connected bridges','9 m high vehicle-free landscaped podium','IGBC Pre-Certified Gold · ERV + evaporative cooling'],
    wa:'Sumadhura Palais Royale' },

  { id:'olympus', name:'The Olympus', builder:'Sumadhura Group', locality:'Nanakramguda, Financial District', loc:'nanakramguda',
    type:'residential', blurb:"Two of Hyderabad's tallest residential towers in the making — 44 floors beside WaveRock SEZ, minutes from Amazon and Wipro Circle. Ultra-luxe 3 & 4 BHKs with a terrace pool and full clubhouse.",
    price:'₹2.2 Cr onwards', minCr:2.2, priceNote:'3 & 4 BHK · 1,670–3,000 sq.ft · carpet 1,023–1,904 sq.ft',
    bhk:[3,4], bhkLabel:'3, 4 BHK', sqft:[1670,3000], psf:null, rera:'TS RERA P02400003072',
    art:{ towers:2, floors:44 },
    stats:[{v:2,l:'Towers'},{v:44,l:'Floors'},{v:5.06,l:'Acres',d:2},{v:854,l:'Residences'}],
    configs:[{ c:'3 BHK', a:'From 1,670 sq.ft' },{ c:'4 BHK', a:'Up to 3,000 sq.ft' }],
    highlights:['Among the tallest towers in the Financial District','Adjacent to WaveRock SEZ · Amazon India ~5 min','Terrace swimming pool, squash, crossfit & co-working clubhouse','Trusted Sumadhura delivery track record'],
    photos:[{ src:'assets/projects/olympus/01.jpg', cap:'The two 44-floor towers at night' },{ src:'assets/projects/olympus/02.jpg', cap:'Tower elevation' }],
    masterplan:'assets/projects/olympus/masterplan.jpg', floorplan:'assets/projects/olympus/floorplan.jpg',
    brochure:'https://drive.google.com/uc?export=download&id=1PTOIQ5Hp1aojCrWvXWCjysnfx0iXcqLT',
    wa:'The Olympus by Sumadhura, Nanakramguda' },

  { id:'songs', name:'Songs of the Sun', builder:'Myscape Properties', locality:'Financial District', loc:'financial-district',
    type:'residential', blurb:'Four G+37 towers in 20 shades of the sun — 592 corner residences, four to a floor, built in just two formats for light, privacy and indoor-outdoor living on the Financial District skyline.',
    price:'₹2.9 Cr onwards', minCr:2.9, priceNote:'3 BHK 2,900 sq.ft · 4 BHK 3,300 sq.ft · 4 units per floor',
    bhk:[3,4], bhkLabel:'3, 4 BHK', sqft:[2900,3300], psf:null, rera:'TG RERA P02400008721',
    art:{ towers:4, floors:38, warm:true },
    stats:[{v:4,l:'Towers'},{v:37,l:'Floors (G+)'},{v:592,l:'Residences'},{v:4,l:'Units / Floor'}],
    configs:[{ c:'3 BHK', a:'2,900 sq.ft' },{ c:'4 BHK', a:'3,300 sq.ft' }],
    highlights:['Every home is a corner home — 4 apartments per floor','Facade in 20 terracotta, sandstone, brick & metal shades','3-level basement · separate resident & visitor entries','Landscape zones for multi-generational living'],
    brochure:'https://drive.google.com/uc?export=download&id=1odRMPuUUnq_gReTZIVzy0V7gZkQkydI-',
    wa:'Myscape Songs of the Sun, Financial District' },

  { id:'palma', name:'Palma', builder:'Myscape Properties', locality:'Financial District', loc:'financial-district',
    type:'residential', blurb:'A compact, low-density address off Myscape Road — two 33-floor towers of only 3 BHK homes for families who want a Financial District pin code with privacy over scale.',
    price:'₹1.9 Cr onwards', minCr:1.9, priceNote:'3 BHK only · ~1,930–2,630 sq.ft · ~₹9,500/sqft',
    bhk:[3], bhkLabel:'3 BHK', sqft:[1930,2630], psf:9500, rera:'TG RERA P02400010344', possession:'Oct 2030 (RERA target)',
    art:{ towers:2, floors:33 },
    stats:[{v:2,l:'Towers'},{v:33,l:'Floors'},{v:396,l:'Residences'},{v:30000,l:'Sq.ft Clubhouse'}],
    configs:[{ c:'3 BHK', a:'~1,930 – 2,630 sq.ft' }],
    highlights:['3 BHK only — a family-first resident profile','~3.58 acres · low-to-moderate density','Nehru ORR exit ~2.5 km · Microsoft ~4 km','Strong Financial District rental market'],
    wa:'Myscape Palma, Financial District' },

  { id:'brooklyn', name:'Brooklyn Avenue', builder:'Godrej Properties', locality:'Kukatpally', loc:'kukatpally',
    type:'residential', blurb:'Brooklyn-themed 3 & 4 BHK high-rises near KPHB Metro, minutes from HITEC City.',
    price:'₹2.10 Cr onwards', minCr:2.10, priceNote:'3 & 4 BHK · saleable 1,588–3,262 sq.ft',
    bhk:[3,4], bhkLabel:'3, 4 BHK', sqft:[1588,3262], psf:null,
    configs:[{ c:'3 BHK + 3T', a:'Carpet 1,011 – 1,406 · saleable 1,588 – 2,214 sq.ft' },{ c:'4 BHK + ST', a:'Carpet 2,010 – 2,102 · saleable 3,214 – 3,262 sq.ft' }],
    wa:'Godrej Brooklyn Avenue, Kukatpally' },

  { id:'regal', name:'Regal Pavilion', builder:'Godrej Properties', locality:'Rajendra Nagar', loc:'rajendra-nagar',
    type:'residential', blurb:'A 13-acre township of 2, 3 & 4 BHK homes on NH-44, with an 80% open-space layout.',
    price:'₹1.10 Cr onwards', minCr:1.10, priceNote:'2–4 BHK · ~1,300–2,900 sq.ft',
    bhk:[2,3,4], bhkLabel:'2, 3, 4 BHK', sqft:[1300,2900], psf:null,
    art:{ towers:5, floors:22 },
    configs:[{ c:'2, 3 & 4 BHK', a:'~1,300 – 2,900 sq.ft' }],
    wa:'Godrej Regal Pavilion, Rajendra Nagar' },

  { id:'fortune', name:'Fortune Grande', builder:'Surajbhan (SSI)', locality:'Neopolis, Kokapet', loc:'neopolis',
    type:'residential', blurb:'Hanging apartments with private lobbies and 11-ft ceilings across 6 towers on 12 acres in Neopolis — a 1,00,000 sq.ft clubhouse, 75% open space and lake views of Gandipet & Kokapet.',
    price:'₹2.62 Cr onwards', minCr:2.62, priceNote:'3.5 & 4 BHK · 2,909–3,910 sq.ft · 5 residences per floor',
    bhk:[3,4], bhkLabel:'3.5, 4 BHK', sqft:[2909,3910], psf:null, lake:true,
    art:{ towers:6, floors:46 },
    stats:[{v:12,l:'Acres'},{v:6,l:'Towers'},{v:46,l:'Levels'},{v:100000,l:'Sq.ft Clubhouse'}],
    configs:[{ c:'3.5 & 4 BHK', a:'2,909 – 3,910 sq.ft' }],
    highlights:['First floor starts ~75 ft above ground (2 cellar + 4 podium + stilt)','Private lobby for every apartment · 11 ft ceilings','1,77,759 sq.ft covered amenities at podium level','Views of Gandipet & Kokapet lakes','75% open spaces · 7.5-acre central landscape'],
    brochure:'https://drive.google.com/uc?export=download&id=19biEXRsas6peGjLn3apgyEtw6yrsUVh3',
    wa:'Surajbhan Fortune Grande, Kokapet' },

  { id:'kohinoor', name:'Kohinoor', builder:'Auro Realty', locality:'HITEC City', loc:'hitec-city',
    type:'residential', blurb:'Seven towers of 2, 3 & 4 BHK homes and duplexes in the heart of HITEC City.',
    price:'₹2.70 Cr onwards', minCr:2.70, priceNote:'2–4 BHK + duplex · ~1,296–7,619 sq.ft',
    bhk:[2,3,4], bhkLabel:'2, 3, 4 BHK + duplex', sqft:[1296,7619], psf:null,
    art:{ towers:7, floors:36 },
    configs:[{ c:'2, 3 & 4 BHK + duplex', a:'~1,296 – 7,619 sq.ft' }],
    photos:[{ src:'assets/projects/kohinoor/01.jpg', cap:'The seven towers' },{ src:'assets/projects/kohinoor/02.jpg', cap:'Elevation from the entrance' },{ src:'assets/projects/kohinoor/03.jpg', cap:'Aerial view at dusk' },{ src:'assets/projects/kohinoor/04.jpg', cap:'Clubhouse and swimming pool' },{ src:'assets/projects/kohinoor/05.jpg', cap:'Grand entrance' },{ src:'assets/projects/kohinoor/06.jpg', cap:'Lobby' },{ src:'assets/projects/kohinoor/07.jpg', cap:'Landscaped gardens' },{ src:'assets/projects/kohinoor/08.jpg', cap:'Sports courts' },{ src:'assets/projects/kohinoor/09.jpg', cap:'Living room (show-flat render)' },{ src:'assets/projects/kohinoor/10.jpg', cap:'Bedroom (show-flat render)' }],
    masterplan:'assets/projects/kohinoor/masterplan.jpg', floorplan:'assets/projects/kohinoor/floorplan.jpg',
    brochure:'https://drive.google.com/uc?export=download&id=1IARsTx5tsxnhjNnMO1XqnbwZiepqB9mw',
    wa:'Kohinoor by Auro Realty, HITEC City' },

  { id:'navanaami', name:'One', builder:'Navanaami Projects', locality:'Kokapet', loc:'kokapet',
    type:'residential', blurb:'A single iconic 63-floor tower of just 359 residences on 2.2 acres — low-density, lake-facing luxury with 60,000 sq.ft of amenities and a rooftop terrace.',
    price:'₹2.1 Cr onwards', minCr:2.1, priceNote:'3.5 & 4 BHK · 2,437 / 3,334 / 3,379 sq.ft · ~₹9,900/sqft',
    bhk:[3,4], bhkLabel:'3.5, 4 BHK', sqft:[2437,3379], psf:9900, rera:'RERA P02400010208', lake:true,
    art:{ towers:1, floors:63 },
    stats:[{v:1,l:'Tower'},{v:63,l:'Floors'},{v:359,l:'Residences'},{v:60000,l:'Sq.ft Amenities'}],
    configs:[{ c:'3.5 & 4 BHK', a:'2,437 / 3,334 / 3,379 sq.ft' }],
    highlights:['One of the tallest single towers in Kokapet','Only 359 homes on 2.2 acres','Roof terrace, mini theatre, spa & guest suites','Pickleball, box cricket, amphitheatre & pet park'],
    wa:'Navanaami One, Kokapet' },

  { id:'onebymsn', name:'One by MSN', builder:'MSN Realty', locality:'Neopolis, Kokapet', loc:'neopolis',
    type:'residential', blurb:'An ultra-luxury 5-tower address on 7.7 acres in Neopolis — 655 residences, two-sided panoramic views of Gandipet Lake, and a yacht clubhouse.',
    price:'Price on request', minCr:null, budgetBand:7, priceNote:'4 BHK only · 5,250–7,460 sq.ft · 12 ft ceilings · 1,80,000 sq.ft clubhouse & sky park',
    bhk:[4], bhkLabel:'4 BHK', sqft:[5250,7460], psf:null, lake:true,
    art:{ towers:5, floors:50 },
    configs:[{ c:'4 BHK', a:'5,250 – 7,460 sq.ft' }],
    wa:'One by MSN, Neopolis' },

  { id:'windsor', name:'Western Windsor Park', builder:'Western Construction', locality:'Nanakramguda · Commercial', loc:'nanakramguda',
    type:'commercial', blurb:'Grade-A commercial office asset in Nanakramguda — ~28 lakh sq.ft leasable across two blocks of 4 cellars + G + 21 floors, with 100% DG backup and an environmental deck. A strata-sale investment opportunity in the Financial District office market.',
    price:'₹12,000 / sq.ft', minCr:null, priceNote:'Grade-A offices · floor plates ~63,000–72,000 sq.ft · 4.05 m floor height',
    bhk:[], bhkLabel:'Office space', sqft:null, psf:12000,
    art:{ towers:2, floors:22, office:true },
    stats:[{v:28,l:'Lakh Sq.ft Leasable'},{v:2,l:'Blocks'},{v:21,l:'Floors (G+)'},{v:58,l:'High-speed Lifts'}],
    configs:[{ c:'Office floor plates', a:'~63,000 – 72,000 sq.ft' }],
    highlights:['Grade-A specification: 11 × 11.5 m grid, 500 kg/sqm loading','100% DG power backup · dedicated environmental deck','~17 lakh sq.ft parking across 4 cellars','Benchmark rents in the micro-market ~₹55/sq.ft (ADP nearby)'],
    brochure:'https://drive.google.com/uc?export=download&id=1wVBmnCF2Tkv6AyC9kO1kf3biXEYIBrU-',
    wa:'Western Windsor Park commercial, Nanakramguda' }
];

/* ---------------------------------------------------------------------
   RESALE & RENTAL LISTINGS
   Add verified listings here. Leave an array empty and the page shows a
   "tell us what you need" request form instead of an empty grid.
   --------------------------------------------------------------------- */
window.RESALE = [
  // { id:'r1', title:'3 BHK in Rajapushpa Provincia', loc:'kokapet', price:'₹2.35 Cr', priceCr:2.35,
  //   bhk:3, area:'2,180 sq.ft', floor:'12th of 28', facing:'East', age:'2 years old',
  //   furnishing:'Semi-furnished', img:'' },
];

window.RENTALS = [
  // { id:'t1', title:'3 BHK in Sumadhura Olympus', loc:'nanakramguda', price:'₹55,000/mo', rent:55000,
  //   bhk:3, area:'1,860 sq.ft', floor:'8th of 24', facing:'North-East', deposit:'3 months',
  //   furnishing:'Fully furnished', img:'' },
];

/* ---------------------------------------------------------------------
   GUIDES & FAQ
   --------------------------------------------------------------------- */
window.GUIDES = [
  { t:'What RERA actually protects you from', h:`<p>The Telangana Real Estate Regulatory Authority (TS-RERA) exists to stop exactly the problems that used to be common in Hyderabad real estate: projects that never got built, carpet areas that shrank between brochure and handover, and buyer money spent on something other than construction.</p>
    <ul><li>Every project above a minimum size must be registered with TS-RERA before it's marketed — look up any registration number on <strong>rera.telangana.gov.in</strong>.</li>
    <li>Developers must park 70% of buyer payments in a dedicated escrow account, usable only for that project's construction and land cost.</li>
    <li>The carpet area quoted at booking is legally binding — it can't quietly shrink by the time you get your keys.</li>
    <li>Real estate agents and brokers must hold their own RERA agent registration.</li></ul>
    <p>Before booking anything, ask for the project's RERA number and cross-check it yourself — it takes two minutes and tells you the promised possession date, the sanctioned layout and any past complaints.</p>` },
  { t:'Documents to check before you book', h:`<ul><li><strong>Title chain / parent documents</strong> — proof the seller or developer actually owns the land, going back multiple transfers.</li>
    <li><strong>Encumbrance Certificate (EC)</strong> — usually for the last 30 years, confirming the property is free of loans or legal disputes.</li>
    <li><strong>RERA registration certificate</strong> and the RERA-approved layout/floor plan (not just the marketing brochure).</li>
    <li><strong>GHMC/HMDA approvals</strong> for the layout, and the Occupancy or Completion Certificate for any ready-to-move property.</li>
    <li><strong>Bank home-loan sanction letter</strong>, if you're financing — and confirm the project is on your bank's approved list.</li></ul>` },
  { t:'Stamp duty & registration, in plain numbers', h:`<p>In urban Hyderabad (GHMC and municipal limits), registering a property currently costs roughly <strong>6% of the property value</strong>: about 4% stamp duty, 1.5% transfer duty and 0.5% registration fee — charged on the higher of your agreement value or the government's guidance value.</p>
    <ul><li>Budget for this on top of the property price — it's not optional and not negotiable.</li>
    <li>Rates and guidance values are revised periodically — confirm the current figure on the <strong>IGRS Telangana</strong> portal before registration day.</li>
    <li>Telangana does not currently offer a discounted rate for women buyers, unlike some other states.</li></ul>
    <p><a class="inline-link" href="#/tools/stamp">Use the stamp duty calculator →</a></p>` },
  { t:"A first-time buyer's checklist", h:`<ul><li>Set your real budget including the ~6% registration cost and moving expenses — not just the flat price.</li>
    <li>Get a home-loan pre-approval before you fall in love with a specific unit; it tells you your real ceiling.</li>
    <li>Shortlist by corridor first, then by project — don't anchor on the first site visit.</li>
    <li>Visit at different times of day; traffic, noise and construction dust vary a lot by hour.</li>
    <li>Check the builder's actual delivery record on past projects, not just this one's brochure.</li>
    <li>Read the RERA-approved floor plan — confirm carpet area, not just the "super built-up" number.</li>
    <li>Most under-construction pricing has room to negotiate on floor-rise and PLC charges — always ask.</li></ul>` },
  { t:'Home loan basics: what banks look at', h:`<ul><li><strong>Credit score</strong> — most banks want 700+ for the best interest rates.</li>
    <li><strong>Income documentation</strong> — salaried buyers typically need 3 months of payslips and Form 16; self-employed buyers need 2–3 years of ITRs and bank statements.</li>
    <li><strong>Loan-to-value ratio</strong> — banks typically finance up to 75–90% of the property value, so plan the rest as your down payment.</li>
    <li><strong>Approved project lists</strong> — buying in a project your bank has already vetted speeds up sanction significantly.</li>
    <li><strong>EMI-to-income ratio</strong> — most lenders cap your total EMIs at 40–50% of monthly take-home income.</li></ul>
    <p><a class="inline-link" href="#/tools/afford">Check how much you can borrow →</a></p>` }
];

window.FAQ = [
  { cat:'About Livarea', items:[
    ['Is Livarea a builder, or a broker?','Neither, exactly — we\'re an independent advisory and authorised marketing associate for the developers listed on this site. We don\'t construct anything ourselves, which means our recommendations aren\'t tied to moving one specific project\'s inventory.'],
    ['Does it cost me anything to work with Livarea?','Typically no — advisories like us are usually compensated by the developer, not the buyer. We\'ll always confirm this upfront for the specific project you\'re considering, so there are no surprises.'],
    ['Is Livarea RERA registered?','Yes. Livarea Properties is registered with TS RERA as a real estate agent, registration number A02500005244. You can verify it on the Telangana RERA website.'],
    ['Which areas of Hyderabad does Livarea cover?','Our deepest knowledge is in West Hyderabad: Kokapet, Neopolis, Financial District, Gachibowli, HITEC City, Kondapur, Kukatpally, Narsingi, Rajendra Nagar, Kollur and Puppalaguda. If you are looking elsewhere — Secunderabad, Kompally or Uppal — tell us and we will say honestly whether we can help.'],
    ['How can I contact Livarea, and can I book a visit or video call?','Call or WhatsApp +91 70200 39986, or email livareaproperties@gmail.com. Every project page lets you request a site visit or video call for a date and time — it is a request, and we confirm the slot with you on WhatsApp.'],
    ['How do site visits actually work?','We accompany you, coordinate timing directly with the developer\'s sales team, and there\'s no cost or obligation to book anything. Most buyers visit 2–3 shortlisted projects before deciding — we\'d rather you compare properly than rush.'],
    ['I am a developer. How can I partner with Livarea?','Use the For Builders page. Share your project, stage, RERA status and units left to sell. If it is a fit, we agree terms and the scope of exclusivity in writing before we start marketing. We do not guarantee sales volumes.'] ]},
  { cat:'Buying basics', items:[
    ['Should I buy an under-construction or a ready-to-move home?','Under-construction homes usually cost less per sq.ft and come with staged payments, but you wait for possession and carry delivery risk. Ready-to-move homes cost more but you can inspect the actual unit, move in sooner and avoid GST on the sale of a completed property. Choose by your timeline and risk comfort.'],
    ['What questions should I ask before buying property in Hyderabad?','Ask for the RERA registration number, the approved layout or building permission, the title documents, the payment schedule against construction stages, the promised possession date, and the full cost sheet with every charge. Then ask what happens if the project is delayed or you want to cancel.'],
    ['Is it a good time to buy in Hyderabad?','Nobody can time a property market reliably, and anyone who promises otherwise is selling something. A better test is whether you have a stable income, a down payment plus buffer for registration costs, an EMI you can carry comfortably, and a plan to hold for at least 5 to 7 years.'],
    ['Villa or apartment: which should I buy?','A villa gives you more space, privacy and a share of land, but costs more, sits further out and needs more upkeep. An apartment is cheaper per head, usually closer to offices and schools, with shared amenities and security. Choose by budget, commute and how much space your family really needs.'],
    ['Resale or new construction: which is better?','New construction gives you a fresh unit, modern amenities, staged payments and RERA protection, but you wait for possession. Resale gives you an actual home you can inspect and often a faster move-in, but you inherit older fittings and the paperwork needs more checking.'],
    ['How do I choose a locality in West Hyderabad?','Compare commute, schools and hospitals within a short drive, road and metro connectivity, the developer\'s delivery record in that area, price per sq.ft against likely rent, and how much new supply is coming. Our Localities page puts the price bands side by side.'],
    ['Rent or buy in Hyderabad?','Rental yields in Indian cities are usually low, so buying rarely beats renting on pure cash comparison in the first few years. Buying makes sense when you plan to stay 7 years or more, your EMI is manageable, and you value stability. Try our Rent vs Buy tool with your own numbers.'] ]},
  { cat:'Costs, loans & legal', items:[
    ['What are stamp duty and registration charges in Hyderabad?','For a sale deed, Telangana charges roughly 6% of the registered value: about 4% stamp duty, 1.5% transfer duty and 0.5% registration fee. Rates, surcharges and minimum values change, so confirm current figures with the registration department before you book.'],
    ['What costs should I budget beyond the listed price?','Add stamp duty and registration (about 6%), GST on under-construction property, parking, floor-rise and preferential location charges, maintenance deposit and corpus fund, and loan processing fees. Ask for a full cost sheet before paying any booking amount.'],
    ['How much down payment do I need?','Under RBI norms banks lend up to 90% of the property value for loans up to ₹30 lakh, 80% for ₹30–75 lakh, and 75% above ₹75 lakh — so your minimum down payment is 10% to 25%, plus about 6% for stamp duty and registration.'],
    ['What if I need to cancel a booking later?','RERA requires cancellation and refund terms to be spelled out in the builder-buyer agreement, but the specifics — timelines, deductions — vary by developer. Read that clause carefully before signing; we can flag anything that looks unusual.'],
    ['How do I convert sq.ft, sq.yards, guntas and cents?','1 sq.yard = 9 sq.ft. 1 gunta = 121 sq.yards (about 1,089 sq.ft), and 40 guntas make 1 acre (4,840 sq.yards or 43,560 sq.ft). 1 cent = about 435.6 sq.ft. Our Area Converter does this instantly.'],
    ['Can NRIs buy property here?','Generally yes — NRIs can buy residential property in India under FEMA guidelines, with restrictions on agricultural land, plantations and farmhouses. Repatriation of sale proceeds has its own rules; use a chartered accountant for the tax side.'] ]},
  { cat:'Staying safe', items:[
    ['How do I check whether a Hyderabad project is RERA registered?','Search the project name or its registration number on rera.telangana.gov.in. Check that the promoter name, approved layout and completion date match what the seller told you. Livarea\'s own TS RERA agent registration number is A02500005244.'],
    ['What are the red flags and common scams?','Watch for a project with no RERA number, a price far below the market, pressure to pay in cash or to book today, unclear title, missing approvals, a verbal promise that is not in the agreement, and a seller who will not share documents.'],
    ['Can I negotiate the price?','For new projects the base price is mostly fixed, but you can often negotiate the payment plan, parking, floor-rise or other add-ons, and timing offers. Resale usually has more room. Arriving with your loan pre-approved strengthens your hand.'],
    ['Can I buy without an agent?','Yes, you can approach a developer\'s sales office or a private seller directly. For new projects the price is generally the same either way, since developers usually pay the agent — but confirm this for the project you are considering.'] ]}
];
