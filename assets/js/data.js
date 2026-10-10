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

  pricesAsOf: 'July 2026',

  // Used for canonical URLs, the sitemap and structured data. Change if the domain changes.
  siteUrl: 'https://www.livareaproperties.com',
  updated: '2026-10-09',
  updatedLabel: 'October 2026'
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
   - brochure: path or link to the PDF — only released after the visitor submits
     their name and WhatsApp number (see the brochure gate in app.js)
   - photos: [{ src, cap }] — first photo is used on cards; all appear in the gallery
   - masterplan / floorplan: optional image paths, shown in the Plans section
   Projects without photos show a labelled illustration instead.
   --------------------------------------------------------------------- */
window.PROJECTS = [
  { id:'pristinia',
    name:'Pristinia',
    builder:'Rajapushpa Properties',
    locality:'Kokapet',
    loc:'kokapet',
    type:'residential',
    blurb:'Premium 2, 3 & 4 BHK towers in Kokapet, moments from Neopolis and the Financial District.',
    price:'₹1.8 Cr onwards',
    minCr:1.8,
    priceNote:'2–4 BHK · ~1,380–4,595 sq.ft · ~₹8,300/sqft',
    bhk:[2, 3, 4],
    bhkLabel:'2, 3, 4 BHK',
    sqft:[1380, 4595],
    psf:8300,
    configs:[{ c:'2, 3 & 4 BHK', a:'~1,380 – 4,595 sq.ft' }],
    rera:'TS RERA P02400006086',
    photos:[{ src:'assets/projects/pristinia/01.jpg', cap:'Tower elevation' }, { src:'assets/projects/pristinia/02.jpg', cap:'Daytime view of the towers' }, { src:'assets/projects/pristinia/03.jpg', cap:'Aerial view' }, { src:'assets/projects/pristinia/04.jpg', cap:'Club Pristine clubhouse' }, { src:'assets/projects/pristinia/05.jpg', cap:'Seating zone at the podium' }, { src:'assets/projects/pristinia/06.jpg', cap:'Tower elevation, dusk' }],
    masterplan:'assets/projects/pristinia/masterplan.jpg',
    floorplan:'assets/projects/pristinia/floorplan.jpg',
    brochure:'assets/brochures/rajapushpa-pristinia-brochure.pdf',
    wa:'Rajapushpa Pristinia, Kokapet' },

  { id:'skyra',
    name:'Skyra',
    builder:'Rajapushpa Properties',
    locality:'Neopolis, Kokapet',
    loc:'neopolis',
    type:'residential',
    blurb:'Three 56-floor towers on 6.5 acres in Neopolis — 777 large 3 & 4 BHK homes with 11 ft ceilings, a private lobby and a separate staff room for every apartment, and 1,15,000 sq.ft of amenities across a 7-level clubhouse, stilt level and sky level.',
    price:'Price on request',
    minCr:null,
    budgetBand:3,
    priceNote:'3 & 4 BHK · 3,140–5,350 sq.ft · 11 ft ceilings · staff room + private lobby per flat',
    bhk:[3, 4],
    bhkLabel:'3, 4 BHK',
    sqft:[3140, 5350],
    psf:null,
    rera:'TS RERA P02400009520',
    art:{ towers:3, floors:56 },
    stats:[{ v:6.5, l:'Acres', d:1 }, { v:3, l:'Towers' }, { v:56, l:'Floors' }, { v:777, l:'Residences' }],
    configs:[{ c:'3 & 4 BHK', a:'3,140 – 5,350 sq.ft' }, { c:'4 BHK (West facing, example)', a:'4,000 sq.ft saleable' }],
    highlights:['11 ft ceiling height in every home', 'Private lobby and separate staff room for each apartment', 'G+6 clubhouse of 60,000 sq.ft', '30,000 sq.ft stilt-level and 25,000 sq.ft sky-level amenities', '~7 min to the Financial District, ~20 min to HITEC City, ~27 min to the airport (per developer)'],
    wa:'Rajapushpa Skyra, Neopolis',
    photos:[{ src:'assets/projects/skyra/01.jpg', cap:'The three 56-floor towers' }, { src:'assets/projects/skyra/02.jpg', cap:'Tower crown' }, { src:'assets/projects/skyra/03.jpg', cap:'Tower elevation' }, { src:'assets/projects/skyra/04.jpg', cap:'G+6 clubhouse' }, { src:'assets/projects/skyra/05.jpg', cap:'Stilt-level arrival' }, { src:'assets/projects/skyra/06.jpg', cap:'Sky-level lighting at night' }],
    masterplan:'assets/projects/skyra/masterplan.jpg',
    floorplan:'assets/projects/skyra/floorplan.jpg',
    brochure:'assets/brochures/rajapushpa-skyra-brochure.pdf' },

  { id:'beaumonde',
    name:'Beaumonde',
    builder:'Koncept Ambience',
    locality:'Kokapet',
    loc:'kokapet',
    type:'residential',
    blurb:'Only 140 homes in a single 14-storey tower on 1.6 acres — low-density luxury with a rooftop infinity pool and 54,000 sq.ft of amenities.',
    price:'₹1.9 Cr onwards',
    minCr:1.9,
    priceNote:'3 BHK · 1,860 / 2,320 / 2,350 sq.ft · ~₹8,500/sqft',
    bhk:[3],
    bhkLabel:'3 BHK',
    sqft:[1860, 2350],
    psf:8500,
    art:{ towers:1, floors:14 },
    configs:[{ c:'3 BHK', a:'1,860 sq.ft' }, { c:'3 BHK', a:'2,320 sq.ft' }, { c:'3 BHK', a:'2,350 sq.ft' }],
    photos:[{ src:'assets/projects/beaumonde/01.jpg', cap:'The 14-storey tower' }, { src:'assets/projects/beaumonde/02.jpg', cap:'Lake-side elevation' }, { src:'assets/projects/beaumonde/03.jpg', cap:'Aerial view of the rooftop' }, { src:'assets/projects/beaumonde/04.jpg', cap:'The entry' }, { src:'assets/projects/beaumonde/05.jpg', cap:'Rooftop infinity pool' }, { src:'assets/projects/beaumonde/06.jpg', cap:'The Sky Bar' }, { src:'assets/projects/beaumonde/07.jpg', cap:'Open-air rooftop cinema' }, { src:'assets/projects/beaumonde/08.jpg', cap:'Le Cercle clubhouse' }, { src:'assets/projects/beaumonde/09.jpg', cap:'Gym' }, { src:'assets/projects/beaumonde/10.jpg', cap:'Living and dining (show-flat render)' }, { src:'assets/projects/beaumonde/11.jpg', cap:'Master bedroom (show-flat render)' }],
    masterplan:'assets/projects/beaumonde/masterplan.jpg',
    floorplan:'assets/projects/beaumonde/floorplan.jpg',
    brochure:'assets/brochures/koncept-ambience-beaumonde-brochure.pdf',
    wa:'Ambience Beaumonde, Kokapet' },

  { id:'palais',
    name:'Palais Royale',
    builder:'Sumadhura Group',
    locality:'Puppalaguda, Financial District',
    loc:'puppalaguda',
    type:'residential',
    blurb:'A single floating tower connecting three wings on 7.35 acres — just 72 homes per acre, an 85,000 sq.ft branded clubhouse and a Sky Lounge at 212.9 m. Cloud facilities, ERV and evaporative cooling set a new benchmark for fine living between HITEC City and Neopolis.',
    price:'₹4.75 Cr onwards',
    minCr:4.75,
    priceNote:'4 & 5 BHK · 3,800–6,610 sq.ft · carpet 2,416–3,898 sq.ft',
    bhk:[4, 5],
    bhkLabel:'4, 5 BHK',
    sqft:[3800, 6610],
    psf:null,
    rera:'TG RERA P02400008107',
    art:{ towers:3, floors:55, bridge:true },
    stats:[{ v:7.35, l:'Acres', d:2 }, { v:523, l:'Residences' }, { v:3, l:'Wings' }, { v:85000, l:'Sq.ft Clubhouse' }],
    configs:[{ c:'5 BHK · Wing 1', a:'6,500 – 6,610 sq.ft' }, { c:'4 BHK · Wing 2', a:'4,850 sq.ft' }, { c:'4 BHK · Wing 3', a:'3,800 – 4,030 sq.ft' }],
    highlights:['Low density — only 72 units per acre', 'Sky Lounge at 212.9 m with connected bridges', '9 m high vehicle-free landscaped podium', 'IGBC Pre-Certified Gold · ERV + evaporative cooling'],
    photos:[{ src:'assets/projects/palais/02.jpg', cap:'Grand entrance' }, { src:'assets/projects/palais/01.jpg', cap:'The floating tower and its three wings' }, { src:'assets/projects/palais/03.jpg', cap:'Tower at dusk' }, { src:'assets/projects/palais/04.jpg', cap:'Floating clubhouse terraces' }, { src:'assets/projects/palais/05.jpg', cap:'View from a residence balcony' }, { src:'assets/projects/palais/06.jpg', cap:'Residence balconies' }, { src:'assets/projects/palais/07.jpg', cap:'Clubhouse lounge' }],
    masterplan:'assets/projects/palais/masterplan.jpg',
    floorplan:'assets/projects/palais/floorplan.jpg',
    wa:'Sumadhura Palais Royale',
    brochure:'assets/brochures/sumadhura-palais-royale-brochure.pdf' },

  { id:'olympus',
    name:'The Olympus',
    builder:'Sumadhura Group',
    locality:'Nanakramguda, Financial District',
    loc:'nanakramguda',
    type:'residential',
    blurb:'Two of Hyderabad\'s tallest residential towers in the making — 44 floors beside WaveRock SEZ, minutes from Amazon and Wipro Circle. Ultra-luxe 3 & 4 BHKs with a terrace pool and full clubhouse.',
    price:'₹2.2 Cr onwards',
    minCr:2.2,
    priceNote:'3 & 4 BHK · 1,670–3,000 sq.ft · carpet 1,023–1,904 sq.ft',
    bhk:[3, 4],
    bhkLabel:'3, 4 BHK',
    sqft:[1670, 3000],
    psf:null,
    rera:'TS RERA P02400003072',
    art:{ towers:2, floors:44 },
    stats:[{ v:2, l:'Towers' }, { v:44, l:'Floors' }, { v:5.06, l:'Acres', d:2 }, { v:854, l:'Residences' }],
    configs:[{ c:'3 BHK', a:'From 1,670 sq.ft' }, { c:'4 BHK', a:'Up to 3,000 sq.ft' }],
    highlights:['Among the tallest towers in the Financial District', 'Adjacent to WaveRock SEZ · Amazon India ~5 min', 'Terrace swimming pool, squash, crossfit & co-working clubhouse', 'Trusted Sumadhura delivery track record'],
    photos:[{ src:'assets/projects/olympus/01.jpg', cap:'The two 44-floor towers at night' }, { src:'assets/projects/olympus/02.jpg', cap:'Tower elevation' }],
    masterplan:'assets/projects/olympus/masterplan.jpg',
    floorplan:'assets/projects/olympus/floorplan.jpg',
    brochure:'assets/brochures/sumadhura-the-olympus-brochure.pdf',
    wa:'The Olympus by Sumadhura, Nanakramguda' },

  { id:'songs',
    name:'Songs of the Sun',
    builder:'Myscape Properties',
    locality:'Financial District',
    loc:'financial-district',
    type:'residential',
    blurb:'Four G+37 towers in 20 shades of the sun — 592 corner residences, four to a floor, built in just two formats for light, privacy and indoor-outdoor living on the Financial District skyline.',
    price:'₹2.9 Cr onwards',
    minCr:2.9,
    priceNote:'3 BHK 2,900 sq.ft · 4 BHK 3,300 sq.ft · 4 units per floor',
    bhk:[3, 4],
    bhkLabel:'3, 4 BHK',
    sqft:[2900, 3300],
    psf:null,
    rera:'TG RERA P02400008721',
    art:{ towers:4, floors:38, warm:true },
    stats:[{ v:4, l:'Towers' }, { v:37, l:'Floors (G+)' }, { v:592, l:'Residences' }, { v:4, l:'Units / Floor' }],
    configs:[{ c:'3 BHK', a:'2,900 sq.ft' }, { c:'4 BHK', a:'3,300 sq.ft' }],
    highlights:['Every home is a corner home — 4 apartments per floor', 'Facade in 20 terracotta, sandstone, brick & metal shades', '3-level basement · separate resident & visitor entries', 'Landscape zones for multi-generational living'],
    photos:[{ src:'assets/projects/songs/01.jpg', cap:'The towers in terracotta' }, { src:'assets/projects/songs/02.jpg', cap:'Skyline view' }, { src:'assets/projects/songs/03.jpg', cap:'Looking up the tower' }, { src:'assets/projects/songs/04.jpg', cap:'Entrance gateway' }, { src:'assets/projects/songs/05.jpg', cap:'Podium and landscape' }, { src:'assets/projects/songs/06.jpg', cap:'Central lawns' }, { src:'assets/projects/songs/07.jpg', cap:'Amphitheatre lawn' }, { src:'assets/projects/songs/08.jpg', cap:'The clubhouse' }, { src:'assets/projects/songs/09.jpg', cap:'Poolside deck' }, { src:'assets/projects/songs/10.jpg', cap:'Clubhouse at night' }, { src:'assets/projects/songs/11.jpg', cap:'Gym' }, { src:'assets/projects/songs/12.jpg', cap:'Living room (show-flat render)' }],
    masterplan:'assets/projects/songs/masterplan.jpg',
    floorplan:'assets/projects/songs/floorplan.jpg',
    brochure:'assets/brochures/myscape-songs-of-the-sun-brochure.pdf',
    wa:'Myscape Songs of the Sun, Financial District' },

  { id:'brooklyn',
    name:'Brooklyn Avenue',
    builder:'Godrej Properties',
    locality:'Kukatpally',
    loc:'kukatpally',
    type:'residential',
    blurb:'Brooklyn-themed 3 & 4 BHK high-rises near KPHB Metro, minutes from HITEC City — with The Milestones Club, pocket gardens, a Brooklyn Bridge themed play area and a terrace party deck.',
    price:'₹2.10 Cr onwards',
    minCr:2.1,
    priceNote:'3 & 4 BHK · saleable 1,588–3,262 sq.ft',
    bhk:[3, 4],
    bhkLabel:'3, 4 BHK',
    sqft:[1588, 3262],
    psf:null,
    configs:[{ c:'3 BHK + 3T', a:'Carpet 1,011 – 1,406 · saleable 1,588 – 2,214 sq.ft' }, { c:'4 BHK + ST', a:'Carpet 2,010 – 2,102 · saleable 3,214 – 3,262 sq.ft' }],
    wa:'Godrej Brooklyn Avenue, Kukatpally',
    rera:'TG RERA P02200010981',
    highlights:['The Milestones Club — lobby, café, banquet hall, gym, AV room', 'Pocket gardens and a landscaped central spine', 'Brooklyn Bridge themed children\'s play area', 'Near KPHB Metro; minutes from HITEC City', 'HMDA permit 2189/HMDA/SWBP/2026'],
    imgNote:'The developer marks some brochure images as artistic impressions or AI-generated/stock images for representation only.',
    photos:[{ src:'assets/projects/brooklyn/01.jpg', cap:'The towers' }, { src:'assets/projects/brooklyn/02.jpg', cap:'The Milestones Club' }, { src:'assets/projects/brooklyn/03.jpg', cap:'Pocket gardens' }, { src:'assets/projects/brooklyn/04.jpg', cap:'Clubhouse lobby' }, { src:'assets/projects/brooklyn/05.jpg', cap:'Café' }, { src:'assets/projects/brooklyn/06.jpg', cap:'Banquet hall' }, { src:'assets/projects/brooklyn/07.jpg', cap:'Gym' }, { src:'assets/projects/brooklyn/08.jpg', cap:'AV room' }, { src:'assets/projects/brooklyn/09.jpg', cap:'Terrace party area' }],
    masterplan:'assets/projects/brooklyn/masterplan.jpg',
    brochure:'assets/brochures/godrej-brooklyn-avenue-brochure.pdf' },

  { id:'regal',
    name:'Regal Pavilion',
    builder:'Godrej Properties',
    locality:'Rajendra Nagar',
    loc:'rajendra-nagar',
    type:'residential',
    blurb:'A 13-acre Godrej township on NH-44 in Rajendra Nagar — 2, 3 & 4 BHK homes in Luxe and Premium formats, the palace-themed Club Regalia and 75,000 sq.ft of curated landscapes.',
    price:'₹1.10 Cr onwards',
    minCr:1.1,
    priceNote:'2–4 BHK · saleable ~1,352–3,571 sq.ft',
    bhk:[2, 3, 4],
    bhkLabel:'2, 3, 4 BHK',
    sqft:[1352, 3571],
    psf:null,
    art:{ towers:5, floors:22 },
    configs:[{ c:'2 BHK Luxe', a:'1,352 sq.ft saleable · 865 sq.ft RERA carpet' }, { c:'3 BHK Premium', a:'1,680 sq.ft saleable · 1,050 sq.ft RERA carpet' }, { c:'3 BHK (larger formats)', a:'2,017 – 2,674 sq.ft saleable' }, { c:'4 BHK Premium', a:'2,904 sq.ft saleable' }, { c:'4 BHK Luxe', a:'3,571 sq.ft saleable' }],
    wa:'Godrej Regal Pavilion, Rajendra Nagar',
    highlights:['Palace-themed Club Regalia clubhouse', '75,000 sq.ft of curated landscapes incl. Regal Meadow', 'Atrium, Chamber, Arcade and Pavilion amenity levels', '80% open-space layout on 13 acres'],
    photos:[{ src:'assets/projects/regal/01.jpg', cap:'Entrance and towers' }, { src:'assets/projects/regal/02.jpg', cap:'Club Regalia' }, { src:'assets/projects/regal/03.jpg', cap:'Regal Meadow' }, { src:'assets/projects/regal/04.jpg', cap:'Pergola garden' }, { src:'assets/projects/regal/05.jpg', cap:'Living room (show-flat render)' }],
    masterplan:'assets/projects/regal/masterplan.jpg',
    floorplan:'assets/projects/regal/floorplan.jpg',
    brochure:'assets/brochures/godrej-regal-pavilion-brochure.pdf' },

  { id:'fortune',
    name:'Fortune Grande',
    builder:'Surajbhan (SSI)',
    locality:'Neopolis, Kokapet',
    loc:'neopolis',
    type:'residential',
    blurb:'Hanging apartments with private lobbies and 11-ft ceilings across 6 towers on 12 acres in Neopolis — a 1,00,000 sq.ft clubhouse, 75% open space and lake views of Gandipet & Kokapet.',
    price:'₹2.62 Cr onwards',
    minCr:2.62,
    priceNote:'3.5 & 4 BHK · 2,909–3,910 sq.ft · 5 residences per floor',
    bhk:[3, 4],
    bhkLabel:'3.5, 4 BHK',
    sqft:[2909, 3910],
    psf:null,
    lake:true,
    art:{ towers:6, floors:46 },
    stats:[{ v:12, l:'Acres' }, { v:6, l:'Towers' }, { v:46, l:'Levels' }, { v:100000, l:'Sq.ft Clubhouse' }],
    configs:[{ c:'3.5 & 4 BHK', a:'2,909 – 3,910 sq.ft' }],
    highlights:['First floor starts ~75 ft above ground (2 cellar + 4 podium + stilt)', 'Private lobby for every apartment · 11 ft ceilings', '1,77,759 sq.ft covered amenities at podium level', 'Views of Gandipet & Kokapet lakes', '75% open spaces · 7.5-acre central landscape'],
    photos:[{ src:'assets/projects/fortune/01.jpg', cap:'The six towers' }, { src:'assets/projects/fortune/02.jpg', cap:'Aerial view' }, { src:'assets/projects/fortune/03.jpg', cap:'Entrance and podium' }, { src:'assets/projects/fortune/04.jpg', cap:'Drop-off and arrival' }, { src:'assets/projects/fortune/05.jpg', cap:'Podium gardens and pool' }, { src:'assets/projects/fortune/06.jpg', cap:'Central landscape' }, { src:'assets/projects/fortune/07.jpg', cap:'Pickleball court' }, { src:'assets/projects/fortune/08.jpg', cap:'Living room (show-flat render)' }, { src:'assets/projects/fortune/09.jpg', cap:'Bedroom (show-flat render)' }, { src:'assets/projects/fortune/10.jpg', cap:'Banquet hall' }, { src:'assets/projects/fortune/11.jpg', cap:'Gym' }],
    masterplan:'assets/projects/fortune/masterplan.jpg',
    floorplan:'assets/projects/fortune/floorplan.jpg',
    brochure:'assets/brochures/fortune-suraj-bhan-grande-brochure.pdf',
    wa:'Surajbhan Fortune Grande, Kokapet' },

  { id:'kohinoor',
    name:'Kohinoor',
    builder:'Auro Realty',
    locality:'HITEC City',
    loc:'hitec-city',
    type:'residential',
    blurb:'Seven towers of 2, 3 & 4 BHK homes and duplexes in the heart of HITEC City.',
    price:'₹2.70 Cr onwards',
    minCr:2.7,
    priceNote:'2–4 BHK + duplex · ~1,296–7,619 sq.ft',
    bhk:[2, 3, 4],
    bhkLabel:'2, 3, 4 BHK + duplex',
    sqft:[1296, 7619],
    psf:null,
    art:{ towers:7, floors:36 },
    configs:[{ c:'2, 3 & 4 BHK + duplex', a:'~1,296 – 7,619 sq.ft' }],
    photos:[{ src:'assets/projects/kohinoor/01.jpg', cap:'The seven towers' }, { src:'assets/projects/kohinoor/02.jpg', cap:'Elevation from the entrance' }, { src:'assets/projects/kohinoor/03.jpg', cap:'Aerial view at dusk' }, { src:'assets/projects/kohinoor/04.jpg', cap:'Clubhouse and swimming pool' }, { src:'assets/projects/kohinoor/05.jpg', cap:'Grand entrance' }, { src:'assets/projects/kohinoor/06.jpg', cap:'Lobby' }, { src:'assets/projects/kohinoor/07.jpg', cap:'Landscaped gardens' }, { src:'assets/projects/kohinoor/08.jpg', cap:'Sports courts' }, { src:'assets/projects/kohinoor/09.jpg', cap:'Living room (show-flat render)' }, { src:'assets/projects/kohinoor/10.jpg', cap:'Bedroom (show-flat render)' }],
    masterplan:'assets/projects/kohinoor/masterplan.jpg',
    floorplan:'assets/projects/kohinoor/floorplan.jpg',
    brochure:'assets/brochures/auro-realty-kohinoor-brochure.pdf',
    wa:'Kohinoor by Auro Realty, HITEC City' },

  { id:'navanaami',
    name:'One',
    builder:'Navanaami Projects',
    locality:'Kokapet',
    loc:'kokapet',
    type:'residential',
    blurb:'A single iconic 63-floor tower of just 359 residences on 2.2 acres — low-density, lake-facing luxury with 60,000 sq.ft of amenities and a rooftop terrace.',
    price:'₹2.1 Cr onwards',
    minCr:2.1,
    priceNote:'3.5 & 4 BHK · 2,437 / 3,334 / 3,379 sq.ft · ~₹9,900/sqft',
    bhk:[3, 4],
    bhkLabel:'3.5, 4 BHK',
    sqft:[2437, 3379],
    psf:9900,
    rera:'RERA P02400010208',
    lake:true,
    art:{ towers:1, floors:63 },
    stats:[{ v:1, l:'Tower' }, { v:63, l:'Floors' }, { v:359, l:'Residences' }, { v:60000, l:'Sq.ft Amenities' }],
    configs:[{ c:'3.5 & 4 BHK', a:'2,437 / 3,334 / 3,379 sq.ft' }],
    highlights:['One of the tallest single towers in Kokapet', 'Only 359 homes on 2.2 acres', 'Roof terrace, mini theatre, spa & guest suites', 'Pickleball, box cricket, amphitheatre & pet park'],
    wa:'Navanaami One, Kokapet',
    photos:[{ src:'assets/projects/navanaami/01.jpg', cap:'The 63-floor tower' }, { src:'assets/projects/navanaami/02.jpg', cap:'Tower at dusk' }, { src:'assets/projects/navanaami/03.jpg', cap:'Rooftop amenities' }, { src:'assets/projects/navanaami/04.jpg', cap:'Landscaped arrival' }, { src:'assets/projects/navanaami/05.jpg', cap:'Entrance plaza' }, { src:'assets/projects/navanaami/06.jpg', cap:'Outdoor amenity zones' }],
    masterplan:'assets/projects/navanaami/masterplan.jpg',
    floorplan:'assets/projects/navanaami/floorplan.jpg',
    brochure:'assets/brochures/navanaami-one-brochure.pdf' },

  { id:'onebymsn',
    name:'One by MSN',
    builder:'MSN Realty',
    locality:'Neopolis, Kokapet',
    loc:'neopolis',
    type:'residential',
    blurb:'An ultra-luxury 5-tower address on 7.7 acres in Neopolis — 655 four-bedroom residences with 12 ft ceilings, two-sided panoramic views of Gandipet Lake, a 1,80,000 sq.ft clubhouse with sky park and a yacht clubhouse.',
    price:'₹10 Cr onwards',
    minCr:10,
    priceNote:'4 BHK only · 5,250–7,460 sq.ft · 12 ft ceilings · indicative, confirm the current price sheet with us',
    bhk:[4],
    bhkLabel:'4 BHK',
    sqft:[5250, 7460],
    psf:null,
    lake:true,
    art:{ towers:5, floors:50 },
    stats:[{ v:7.7, l:'Acres', d:1 }, { v:5, l:'Towers' }, { v:655, l:'Residences' }, { v:180000, l:'Sq.ft Clubhouse & Sky Park' }],
    configs:[{ c:'4 BHK', a:'5,250 – 7,460 sq.ft' }],
    highlights:['Two-sided panoramic views of Gandipet Lake','12 ft ceiling height','1,80,000 sq.ft clubhouse and sky park','Yacht clubhouse','Only 4 BHK residences — an ultra-premium resident profile'],
    wa:'One by MSN, Neopolis',
    photos:[{ src:'assets/projects/onebymsn/01.jpg', cap:'The towers at dusk' }] },

  { id:'windsor',
    name:'Western Windsor Park',
    builder:'Western Construction',
    locality:'Nanakramguda · Commercial',
    loc:'nanakramguda',
    type:'commercial',
    blurb:'Grade-A commercial office asset in Nanakramguda — ~28 lakh sq.ft leasable across two blocks of 4 cellars + G + 21 floors, with 100% DG backup and an environmental deck. A strata-sale investment opportunity in the Financial District office market.',
    price:'₹12,000 / sq.ft',
    minCr:null,
    priceNote:'Grade-A offices · floor plates ~63,000–72,000 sq.ft · 4.05 m floor height',
    bhk:[],
    bhkLabel:'Office space',
    sqft:null,
    psf:12000,
    art:{ towers:2, floors:22, office:true },
    stats:[{ v:28, l:'Lakh Sq.ft Leasable' }, { v:2, l:'Blocks' }, { v:21, l:'Floors (G+)' }, { v:58, l:'High-speed Lifts' }],
    configs:[{ c:'Office floor plates', a:'~63,000 – 72,000 sq.ft' }],
    highlights:['Grade-A specification: 11 × 11.5 m grid, 500 kg/sqm loading', '100% DG power backup · dedicated environmental deck', '~17 lakh sq.ft parking across 4 cellars', 'Benchmark rents in the micro-market ~₹55/sq.ft (ADP nearby)'],
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
