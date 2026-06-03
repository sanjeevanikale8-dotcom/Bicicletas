/* ── Application State ─────────────────────────────────────────────────────── */
const STATE = {
  page: 'home',
  filter: 'all',
  search: '',
  selectedBike: null,
  selectedLocation: null,
  booking: {
    bikeId: null,
    locationId: null,
    startDate: '',
    endDate: '',
    days: 1,
    extras: [],
    promoCode: '',
    promoPct: 0,
    promoDesc: '',
    total: 0,
    dayDiscountPct: 0,
    dayDiscountLabel: '',
  },
  rentals: [...MOCK_RENTALS],
  dashSection: 'rentals',
  user: { name: 'Alex Rivera', email: 'alex@example.com', member: 'Gold Member', rides: 3, saved: 48.50 },
};

/* ── Router ───────────────────────────────────────────────────────────────── */
function navigate(page, extra) {
  STATE.page = page;
  if (extra) Object.assign(STATE, extra);
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Toast ───────────────────────────────────────────────────────────────── */
function toast(msg, type = 'success', dur = 3000) {
  const tc = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  t.innerHTML = `<span>${icons[type] || '✓'}</span><span>${msg}</span>`;
  tc.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'slideOut .3s ease forwards';
    setTimeout(() => t.remove(), 300);
  }, dur);
}

/* ── Bike SVG colours ─────────────────────────────────────────────────────── */
const BIKE_COLORS = {
  green:  { bg: '#dcfce7', fg: '#16a34a', accent: '#22c55e' },
  blue:   { bg: '#dbeafe', fg: '#1d4ed8', accent: '#3b82f6' },
  yellow: { bg: '#fef3c7', fg: '#b45309', accent: '#f59e0b' },
  purple: { bg: '#ede9fe', fg: '#6d28d9', accent: '#8b5cf6' },
  red:    { bg: '#fee2e2', fg: '#991b1b', accent: '#ef4444' },
  cyan:   { bg: '#e0f2fe', fg: '#0369a1', accent: '#0ea5e9' },
};

function bikeSVG(colorKey, size = 130) {
  const c = BIKE_COLORS[colorKey] || BIKE_COLORS.green;
  return `
  <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 0.7}">
    <!-- Rear wheel -->
    <circle cx="55" cy="100" r="32" stroke="${c.fg}" stroke-width="6"/>
    <circle cx="55" cy="100" r="10" fill="${c.accent}" opacity=".5"/>
    <line x1="55" y1="68" x2="55" y2="132" stroke="${c.fg}" stroke-width="2" opacity=".4"/>
    <line x1="23" y1="100" x2="87" y2="100" stroke="${c.fg}" stroke-width="2" opacity=".4"/>
    <!-- Front wheel -->
    <circle cx="150" cy="100" r="32" stroke="${c.fg}" stroke-width="6"/>
    <circle cx="150" cy="100" r="10" fill="${c.accent}" opacity=".5"/>
    <line x1="150" y1="68" x2="150" y2="132" stroke="${c.fg}" stroke-width="2" opacity=".4"/>
    <line x1="118" y1="100" x2="182" y2="100" stroke="${c.fg}" stroke-width="2" opacity=".4"/>
    <!-- Frame -->
    <path d="M55 100 L90 55 L130 55 L150 100" stroke="${c.fg}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M90 55 L55 100" stroke="${c.fg}" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    <path d="M130 55 L150 100" stroke="${c.fg}" stroke-width="5" stroke-linecap="round"/>
    <!-- Top tube -->
    <line x1="90" y1="55" x2="140" y2="55" stroke="${c.fg}" stroke-width="5" stroke-linecap="round"/>
    <!-- Handlebar -->
    <line x1="140" y1="55" x2="155" y2="38" stroke="${c.fg}" stroke-width="5" stroke-linecap="round"/>
    <line x1="148" y1="33" x2="162" y2="38" stroke="${c.fg}" stroke-width="4" stroke-linecap="round"/>
    <!-- Seat -->
    <line x1="90" y1="55" x2="90" y2="38" stroke="${c.fg}" stroke-width="5" stroke-linecap="round"/>
    <line x1="78" y1="33" x2="100" y2="33" stroke="${c.fg}" stroke-width="5" stroke-linecap="round"/>
    <!-- Motor/battery (e-bike marker) -->
    <rect x="96" y="72" width="28" height="16" rx="4" fill="${c.accent}"/>
    <text x="110" y="84" text-anchor="middle" font-size="9" fill="white" font-weight="bold">E</text>
    <!-- Chain ring -->
    <circle cx="102" cy="100" r="12" stroke="${c.accent}" stroke-width="4"/>
    <circle cx="102" cy="100" r="4" fill="${c.accent}"/>
    <!-- Pedal -->
    <line x1="90" y1="100" x2="114" y2="100" stroke="${c.fg}" stroke-width="3" stroke-linecap="round" opacity=".6"/>
  </svg>`;
}

/* ── Rating stars ─────────────────────────────────────────────────────────── */
function stars(rating) {
  let out = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) out += '<span class="star">★</span>';
    else if (i - 0.5 <= rating) out += '<span class="star" style="opacity:.5">★</span>';
    else out += '<span style="color:var(--gray-300)">★</span>';
  }
  return out;
}

/* ── Category labels ──────────────────────────────────────────────────────── */
const CATEGORY_LABELS = { leisure: 'Leisure', city: 'City', sport: 'Sport', offroad: 'Off-Road', cargo: 'Cargo', premium: 'Premium' };

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE: HOME
═══════════════════════════════════════════════════════════════════════════ */
function renderHome() {
  return `
  <!-- Hero -->
  <section class="hero">
    <div class="hero-bg-text">BICICLETAS</div>
    <div class="hero-kicker">🌿 Eco-Friendly · 🌍 Worldwide · ⚡ Electric</div>
    <h1>Rent an <span class="highlight">E-Bicycle</span><br>Anywhere in the World</h1>
    <p>Premium electric bicycles available in 10+ global cities. Explore sustainably, ride effortlessly, return wherever you want.</p>
    <div class="hero-search">
      <span style="font-size:1.1rem;padding-left:4px">📍</span>
      <select id="hero-city" style="flex:1;background:transparent;border:none;outline:none;color:#fff;font-size:.9rem;padding:6px 10px">
        <option value="">Choose a city...</option>
        ${CITIES.map(c => `<option value="${c.cityId}">${c.flag} ${c.city}, ${c.country}</option>`).join('')}
      </select>
      <button class="btn btn-primary" onclick="heroSearch()">Find Bikes →</button>
    </div>
    <div class="hero-stats">
      <div class="hero-stat"><div class="val">10+</div><div class="lbl">Global Cities</div></div>
      <div class="hero-stat"><div class="val">6</div><div class="lbl">Bike Models</div></div>
      <div class="hero-stat"><div class="val">50K+</div><div class="lbl">Happy Riders</div></div>
      <div class="hero-stat"><div class="val">4.8★</div><div class="lbl">Average Rating</div></div>
    </div>
  </section>

  <!-- Why Bicicletas -->
  <section class="section" style="background:var(--white)">
    <div class="container">
      <div class="section-header">
        <span class="section-kicker">Why Bicicletas</span>
        <h2>The smarter way to explore</h2>
        <p>We combine cutting-edge e-bikes with seamless booking so you can focus on the ride.</p>
      </div>
      <div class="why-grid">
        ${[
          ['⚡','Instant Online Booking','Reserve in under 2 minutes. Choose your bike, city, dates, and extras — all in one flow.'],
          ['🌍','Worldwide Presence','10 cities and counting. Pick up and drop off at any of our partner hubs globally.'],
          ['🔋','Premium E-Bikes','Every bike is serviced before each rental. Batteries are always fully charged at pickup.'],
          ['💳','Transparent Pricing','No hidden fees. Multi-day discounts applied automatically. Refunds processed in 24 hrs.'],
          ['🛡️','Fully Insured','Optional ride insurance covers theft and accidental damage so you ride worry-free.'],
          ['♻️','Carbon Neutral','Every rental offsets CO₂ via our partner reforestation programme.'],
        ].map(([icon, title, desc]) => `
        <div class="why-card">
          <div class="why-icon">${icon}</div>
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- Featured Bikes -->
  <section class="section" style="background:var(--gray-50)">
    <div class="container">
      <div class="section-header">
        <span class="section-kicker">Our Fleet</span>
        <h2>Find your perfect ride</h2>
        <p>From casual city cruisers to high-performance trail machines — every rider has a Bicicletas.</p>
      </div>
      <div class="bikes-grid">
        ${BIKES.slice(0, 3).map(b => bikeCardHTML(b)).join('')}
      </div>
      <div style="text-align:center;margin-top:32px">
        <button class="btn btn-outline btn-lg" onclick="navigate('bikes')">View all bikes →</button>
      </div>
    </div>
  </section>

  <!-- How it works -->
  <section class="section" style="background:var(--white)">
    <div class="container">
      <div class="section-header">
        <span class="section-kicker">Process</span>
        <h2>Up and riding in 3 steps</h2>
      </div>
      <div class="how-grid">
        ${[
          ['1','Choose Your Bike','Browse our fleet. Filter by category, price, or range. Read full specs and real reviews.'],
          ['2','Pick Your Location','Select from 10+ cities worldwide. Our hubs are near transit, hotels, and city centres.'],
          ['3','Book & Pay','Secure checkout in seconds. Apply discount codes. Your bike is waiting at pickup time.'],
          ['4','Ride & Return','Unlock with your QR code. Enjoy the city. Return to any Bicicletas hub when done.'],
        ].map(([n, title, desc]) => `
        <div class="how-step">
          <div class="how-step-num">${n}</div>
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="section testimonials-bg">
    <div class="container">
      <div class="section-header" style="color:#fff">
        <span class="section-kicker" style="background:rgba(34,197,94,.2);color:#86efac">Testimonials</span>
        <h2 style="color:#fff">Loved by riders worldwide</h2>
        <p style="color:#9ca3af">Over 50,000 rentals completed. Here's what riders say.</p>
      </div>
      <div class="testimonials-grid">
        ${[
          ['⭐⭐⭐⭐⭐','The Urban model handled Amsterdam\'s cobblestones perfectly. Battery lasted the full day. Booking took 2 minutes flat.','🇳🇱','Sophie van der Berg','Amsterdam, Netherlands'],
          ['⭐⭐⭐⭐⭐','Rented the Trail in Barcelona for 5 days. The hills were no issue. Refund for the extra day was back in my account within hours.','🇦🇺','James Liu','Sydney, Australia'],
          ['⭐⭐⭐⭐★','Luxe model is genuinely worth the price. Carbon frame, wireless shifting — felt like flying. Pickup at Tokyo station was seamless.','🇯🇵','Yuki Tanaka','Tokyo, Japan'],
        ].map(([st, text, flag, name, loc]) => `
        <div class="testimonial-card">
          <div class="testimonial-stars">${st}</div>
          <p class="testimonial-text">"${text}"</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${flag}</div>
            <div>
              <div class="testimonial-name">${name}</div>
              <div class="testimonial-loc">${loc}</div>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- Offers strip -->
  <div class="offers-strip">
    <p>
      🎉 Summer Sale — 25% off all bikes!&nbsp;
      <span class="code-pill">SUMMER25</span>
      &nbsp;·&nbsp; New member? Use
      <span class="code-pill">FIRSTRIDE</span>
      for 15% off &nbsp;·&nbsp;
      <button class="btn btn-sm" style="background:rgba(255,255,255,.2);color:#fff;border:1px solid rgba(255,255,255,.3)" onclick="navigate('offers')">See all offers →</button>
    </p>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   BIKES CATALOGUE
═══════════════════════════════════════════════════════════════════════════ */
function bikeCardHTML(bike) {
  const c = BIKE_COLORS[bike.image] || BIKE_COLORS.green;
  return `
  <div class="bike-card" onclick="navigate('bike-detail', {selectedBike:'${bike.id}'})">
    <div class="bike-card-img" style="background:${c.bg}">
      ${bikeSVG(bike.image)}
      <div class="bike-card-badge" style="background:${c.accent}">${bike.badge}</div>
    </div>
    <div class="bike-card-body">
      <div class="bike-card-name">${bike.name}</div>
      <div class="bike-card-tagline">${bike.tagline}</div>
      <div class="bike-specs-mini">
        <span class="spec-pill">⚡ ${bike.specs.motor.split(' ')[0]}</span>
        <span class="spec-pill">🔋 ${bike.specs.range}</span>
        <span class="spec-pill">🏎️ ${bike.specs.maxSpeed}</span>
        <span class="spec-pill">⚖️ ${bike.specs.weight}</span>
      </div>
      <div class="bike-card-footer">
        <div>
          <div class="bike-price" style="color:${c.fg}">${formatCurrency(bike.price)}<span>/day</span></div>
          <div class="bike-rating">${stars(bike.rating)} ${bike.rating} (${bike.reviews})</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openBooking('${bike.id}')">Book Now</button>
      </div>
    </div>
  </div>`;
}

function renderBikes() {
  const categories = ['all', ...new Set(BIKES.map(b => b.category))];
  const filtered = BIKES.filter(b => {
    const matchCat = STATE.filter === 'all' || b.category === STATE.filter;
    const matchSearch = !STATE.search || b.name.toLowerCase().includes(STATE.search.toLowerCase()) || b.tagline.toLowerCase().includes(STATE.search.toLowerCase());
    return matchCat && matchSearch;
  });

  return `
  <div class="page-header">
    <div class="container">
      <div class="breadcrumb">Home <span>/</span> Our Bikes</div>
      <h1>Our Electric Fleet</h1>
      <p>6 premium models · Auto multi-day discounts · Free helmet with 7+ day rentals</p>
    </div>
  </div>

  <!-- Discount notice -->
  <div style="background:var(--green-xlight);border-bottom:1px solid var(--green-light);padding:10px 20px;">
    <div class="container" style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center;font-size:.85rem;color:var(--green-dark);font-weight:600">
      📅 3-6 days: <strong>10% off</strong> &nbsp;·&nbsp; 7-13 days: <strong>20% off</strong> &nbsp;·&nbsp; 14+ days: <strong>30% off</strong> &nbsp;·&nbsp; Use code <strong>SUMMER25</strong> for extra 25%!
    </div>
  </div>

  <div class="filter-bar">
    <div class="filter-inner">
      ${categories.map(cat => `
        <button class="filter-chip ${STATE.filter === cat ? 'active' : ''}" onclick="setFilter('${cat}')">
          ${cat === 'all' ? 'All Bikes' : (CATEGORY_LABELS[cat] || cat)}
        </button>`).join('')}
      <div class="filter-search">
        <span>🔍</span>
        <input type="text" placeholder="Search bikes…" value="${STATE.search}" oninput="setSearch(this.value)">
      </div>
    </div>
  </div>

  <section class="section-sm">
    <div class="container">
      ${filtered.length ? `
        <p style="font-size:.85rem;color:var(--gray-500);margin-bottom:18px">Showing ${filtered.length} bike${filtered.length !== 1 ? 's' : ''}</p>
        <div class="bikes-grid">${filtered.map(b => bikeCardHTML(b)).join('')}</div>
      ` : `
        <div style="text-align:center;padding:80px 20px;color:var(--gray-400)">
          <div style="font-size:3rem;margin-bottom:16px">🔍</div>
          <h3 style="margin-bottom:8px">No bikes found</h3>
          <p style="font-size:.9rem">Try a different search or filter.</p>
          <button class="btn btn-outline" style="margin-top:16px" onclick="clearFilter()">Clear filters</button>
        </div>`}
    </div>
  </section>`;
}

function setFilter(cat) {
  STATE.filter = cat;
  document.getElementById('main-content').innerHTML = renderBikes();
  updateNav();
}
function setSearch(val) {
  STATE.search = val;
  document.getElementById('main-content').innerHTML = renderBikes();
}
function clearFilter() {
  STATE.filter = 'all';
  STATE.search = '';
  document.getElementById('main-content').innerHTML = renderBikes();
}

/* ═══════════════════════════════════════════════════════════════════════════
   BIKE DETAIL
═══════════════════════════════════════════════════════════════════════════ */
function renderBikeDetail() {
  const bike = getBikeById(STATE.selectedBike) || BIKES[0];
  const c = BIKE_COLORS[bike.image];
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = addDays(today, 1);

  return `
  <div class="page-header" style="background:linear-gradient(135deg,${c.fg}dd,${c.accent})">
    <div class="container">
      <div class="breadcrumb">
        <button onclick="navigate('bikes')" style="background:none;border:none;color:#86efac;cursor:pointer;font-size:.8rem">← Bikes</button>
        <span>/</span> ${bike.name}
      </div>
      <h1>${bike.name}</h1>
      <p style="color:rgba(255,255,255,.8)">${bike.tagline}</p>
    </div>
  </div>

  <div class="bike-detail-grid">
    <!-- Left: image -->
    <div>
      <div class="bike-detail-img-wrap" style="background:${c.bg}">
        ${bikeSVG(bike.image, 280)}
        <div class="bike-card-badge" style="background:${c.accent};top:16px;left:16px;font-size:.82rem;padding:5px 14px">${bike.badge}</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        ${bike.features.slice(0,4).map(f => `<span class="badge badge-green" style="font-size:.75rem">✓ ${f}</span>`).join('')}
      </div>
    </div>

    <!-- Right: info -->
    <div class="bike-detail-info">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
          <span class="badge" style="background:${c.bg};color:${c.fg}">${CATEGORY_LABELS[bike.category] || bike.category}</span>
          ${bike.available ? '<span class="badge badge-green">✓ Available</span>' : '<span class="badge badge-red">Unavailable</span>'}
        </div>
        <div class="bike-detail-title">${bike.name}</div>
        <div class="bike-detail-tagline">${bike.tagline}</div>
        <div style="display:flex;align-items:center;gap:8px;margin:8px 0">
          ${stars(bike.rating)} <span style="font-size:.88rem;color:var(--gray-500)">${bike.rating}/5 · ${bike.reviews} reviews</span>
        </div>
        <div class="bike-detail-price" style="color:${c.fg}">${formatCurrency(bike.price)}<small>/day</small></div>
      </div>

      <p style="font-size:.92rem;color:var(--gray-600);line-height:1.7">${bike.description}</p>

      <!-- Specs table -->
      <div>
        <h3 style="font-size:.95rem;font-weight:700;margin-bottom:10px;color:var(--gray-700)">Technical Specifications</h3>
        <div style="border:1px solid var(--gray-100);border-radius:10px;overflow:hidden">
          <table class="spec-table">
            ${Object.entries(bike.specs).map(([k, v]) => `
            <tr>
              <td>${k.replace(/([A-Z])/g,' $1').replace(/^./, s=>s.toUpperCase())}</td>
              <td>${v}</td>
            </tr>`).join('')}
          </table>
        </div>
      </div>

      <!-- Features -->
      <div>
        <h3 style="font-size:.95rem;font-weight:700;margin-bottom:10px;color:var(--gray-700)">Included Features</h3>
        <ul class="features-list">
          ${bike.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <!-- Price calculator -->
      <div class="price-calc" id="price-calc">
        <h3>Price Calculator</h3>
        <div class="calc-row">
          <div style="flex:1">
            <label>Start Date</label>
            <input type="date" id="calc-start" value="${today}" min="${today}" onchange="updateCalc()">
          </div>
          <div style="flex:1">
            <label>End Date</label>
            <input type="date" id="calc-end" value="${tomorrow}" min="${tomorrow}" onchange="updateCalc()">
          </div>
        </div>
        <div id="calc-result"></div>
        <button class="btn btn-primary btn-full" style="margin-top:14px" onclick="openBooking('${bike.id}')">Book This Bike →</button>
      </div>
    </div>
  </div>`;
}

function updateCalc() {
  const start = document.getElementById('calc-start').value;
  const end = document.getElementById('calc-end').value;
  if (!start || !end || end <= start) return;

  const bike = getBikeById(STATE.selectedBike);
  const days = daysBetween(start, end);
  const tier = getDayDiscount(days);
  const { base, afterPromo, extrasTotal, total } = calcTotal(bike.price, days, tier.pct, 0, []);

  document.getElementById('calc-result').innerHTML = `
  <div class="calc-result">
    <div class="calc-result-row"><span>${formatCurrency(bike.price)} × ${days} day${days !== 1 ? 's' : ''}</span><span>${formatCurrency(base)}</span></div>
    ${tier.pct > 0 ? `<div class="calc-result-row"><span class="calc-discount">🏷️ ${tier.label}</span><span class="calc-discount">-${formatCurrency(base - afterPromo)}</span></div>` : ''}
    <div class="calc-result-row total"><span>Estimated Total</span><span style="color:var(--green-dark)">${formatCurrency(total)}</span></div>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOCATIONS
═══════════════════════════════════════════════════════════════════════════ */
function renderLocations() {
  const sel    = STATE.selectedLocation || LOCATIONS[0].id;
  const selLoc = getLocationById(sel) || LOCATIONS[0];

  // Which city is expanded (show hubs for it)
  const expandedCity = STATE.expandedCity || selLoc.cityId;

  const minLat = -35, maxLat = 55, minLng = -80, maxLng = 155;
  function toXY(lat, lng) {
    const x = ((lng - minLng) / (maxLng - minLng)) * 94 + 3;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 90 + 3;
    return { x, y };
  }

  return `
  <div class="page-header">
    <div class="container">
      <div class="breadcrumb">Home <span>/</span> Locations</div>
      <h1>Our Global Hubs</h1>
      <p>10 cities · ${LOCATIONS.length} pickup points worldwide. Choose a city, then pick your preferred hub.</p>
    </div>
  </div>

  <div class="locations-layout">
    <!-- Left: city + hub list -->
    <div>
      <div style="margin-bottom:14px">
        <div class="filter-search" style="max-width:100%;border-radius:10px;padding:8px 14px;background:var(--white);border:1.5px solid var(--gray-200)">
          <span>🔍</span>
          <input type="text" placeholder="Search city or country…" id="loc-search" oninput="filterLocations(this.value)" style="width:100%">
        </div>
      </div>
      <div class="location-list" id="location-list">
        ${cityGroupsHTML(CITIES, expandedCity, sel)}
      </div>
    </div>

    <!-- Right: map -->
    <div class="map-panel" id="map-panel">
      ${LOCATIONS.map(l => {
        const { x, y } = toXY(l.lat, l.lng);
        const isSelected = l.id === sel;
        return `
        <div class="map-dot ${isSelected ? 'selected' : ''}"
          style="left:${x}%;top:${y}%"
          onclick="selectLocation('${l.id}')"
          title="${l.city} — ${l.hub}">
        </div>
        <div class="map-tooltip" style="left:${x}%;top:${y}%;display:${isSelected ? 'block' : 'none'};pointer-events:none">
          ${l.flag} ${l.hub}
        </div>`;
      }).join('')}

      <!-- Selected hub info card -->
      <div style="position:absolute;bottom:16px;left:50%;transform:translateX(-50%);background:#fff;border-radius:12px;padding:14px 18px;box-shadow:var(--shadow-xl);min-width:270px;max-width:320px;z-index:30">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <span style="font-size:1.8rem">${selLoc.flag}</span>
          <div>
            <div style="font-weight:800;font-size:.95rem">${selLoc.hub}</div>
            <div style="font-size:.78rem;color:var(--gray-500)">${selLoc.city}, ${selLoc.country}</div>
            <div style="font-size:.75rem;color:var(--gray-400);margin-top:1px">📍 ${selLoc.address}</div>
          </div>
        </div>
        <div style="display:flex;gap:12px;font-size:.78rem;color:var(--gray-600);margin-bottom:12px;flex-wrap:wrap">
          <span>🕐 ${selLoc.hours}</span>
          <span>🚲 ${selLoc.bikes} bikes</span>
          <span>⭐ ${selLoc.rating}</span>
        </div>
        <button class="btn btn-primary btn-sm btn-full" onclick="openBookingLocation('${selLoc.id}')">Book at this hub →</button>
      </div>

      <div style="position:absolute;top:12px;right:12px;background:rgba(255,255,255,.9);padding:6px 10px;border-radius:8px;font-size:.75rem;color:var(--gray-500)">
        🗺️ ${LOCATIONS.length} hubs worldwide
      </div>
    </div>
  </div>`;
}

/* Render city group accordion + hub cards */
function cityGroupsHTML(cities, expandedCity, selectedLocId) {
  return cities.map(c => {
    const hubs = getLocationsByCity(c.cityId);
    const totalBikes = hubs.reduce((s, h) => s + h.bikes, 0);
    const isOpen = c.cityId === expandedCity;
    return `
    <div style="border:1.5px solid ${isOpen ? 'var(--green)' : 'var(--gray-200)'};border-radius:12px;overflow:hidden;margin-bottom:10px">
      <!-- City header (clickable) -->
      <div onclick="toggleCity('${c.cityId}')"
        style="display:flex;align-items:center;gap:12px;padding:13px 16px;cursor:pointer;background:${isOpen ? 'var(--green-xlight)' : 'var(--white)'};transition:background .2s">
        <span style="font-size:1.5rem">${c.flag}</span>
        <div style="flex:1">
          <div style="font-weight:800;font-size:.95rem">${c.city}</div>
          <div style="font-size:.75rem;color:var(--gray-500)">${c.country} · ${hubs.length} hub${hubs.length !== 1 ? 's' : ''} · ${totalBikes} bikes total</div>
        </div>
        <span style="font-size:.85rem;color:${isOpen ? 'var(--green-dark)' : 'var(--gray-400)'};transition:transform .2s;display:inline-block;transform:rotate(${isOpen ? 180 : 0}deg)">▼</span>
      </div>
      <!-- Hub list (collapsible) -->
      ${isOpen ? `
      <div style="border-top:1px solid var(--green-light)">
        ${hubs.map(h => hubRowHTML(h, h.id === selectedLocId)).join('')}
      </div>` : ''}
    </div>`;
  }).join('');
}

function hubRowHTML(h, selected) {
  return `
  <div onclick="selectLocation('${h.id}')"
    style="display:flex;align-items:center;gap:12px;padding:11px 16px 11px 20px;cursor:pointer;
           background:${selected ? '#f0fdf4' : '#fff'};border-bottom:1px solid var(--gray-100);
           transition:background .15s;border-left:3px solid ${selected ? 'var(--green)' : 'transparent'}">
    <div style="flex:1">
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:.9rem;font-weight:700;color:${selected ? 'var(--green-dark)' : 'var(--gray-800)'}">${h.hub}</span>
        ${selected ? '<span class="badge badge-green" style="font-size:.65rem;padding:2px 7px">Selected</span>' : ''}
      </div>
      <div style="font-size:.75rem;color:var(--gray-500);margin-top:2px">📍 ${h.address}</div>
      <div style="display:flex;gap:10px;margin-top:4px;font-size:.73rem;color:var(--gray-400)">
        <span>🕐 ${h.hours}</span>
        <span>🚲 ${h.bikes} available</span>
        <span>⭐ ${h.rating}</span>
      </div>
    </div>
    <button class="btn btn-${selected ? 'primary' : 'outline'} btn-sm" style="font-size:.75rem;flex-shrink:0"
      onclick="event.stopPropagation();openBookingLocation('${h.id}')">
      ${selected ? 'Book here' : 'Select'}
    </button>
  </div>`;
}

function toggleCity(cityId) {
  STATE.expandedCity = STATE.expandedCity === cityId ? null : cityId;
  // Re-render just the list panel without full page reload
  const sel = STATE.selectedLocation || LOCATIONS[0].id;
  document.getElementById('location-list').innerHTML =
    cityGroupsHTML(CITIES, STATE.expandedCity, sel);
}

function selectLocation(id) {
  const loc = getLocationById(id);
  STATE.selectedLocation = id;
  if (loc) STATE.expandedCity = loc.cityId;
  document.getElementById('main-content').innerHTML = renderLocations();
}

function filterLocations(val) {
  const q = val.toLowerCase();
  const matchedCities = CITIES.filter(c =>
    c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
  );
  const sel = STATE.selectedLocation || LOCATIONS[0].id;
  document.getElementById('location-list').innerHTML =
    cityGroupsHTML(matchedCities, STATE.expandedCity, sel);
}

function openBookingLocation(locId) {
  STATE.booking.locationId = locId;
  openBooking(null);
}

/* ═══════════════════════════════════════════════════════════════════════════
   OFFERS PAGE
═══════════════════════════════════════════════════════════════════════════ */
function renderOffers() {
  return `
  <div class="page-header">
    <div class="container">
      <div class="breadcrumb">Home <span>/</span> Offers</div>
      <h1>Deals & Discounts</h1>
      <p>Current promotions, seasonal offers, and loyalty rewards — all in one place.</p>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="section-header">
        <span class="section-kicker">Live Now</span>
        <h2>Current Promotions</h2>
        <p>Copy a code and paste it at checkout. Multi-day discounts apply automatically — no code needed.</p>
      </div>
      <div class="offers-grid">
        ${OFFERS.map(o => offerCardHTML(o)).join('')}
      </div>

      <!-- Referral section -->
      <div style="margin-top:48px;background:linear-gradient(135deg,#052e16,#14532d);border-radius:var(--radius-lg);padding:40px;color:#fff;text-align:center">
        <div style="font-size:2.5rem;margin-bottom:12px">🤝</div>
        <h2 style="font-size:1.6rem;font-weight:800;margin-bottom:10px">Refer a Friend, Ride for Free</h2>
        <p style="color:#a7f3d0;font-size:.95rem;max-width:480px;margin:0 auto 24px;line-height:1.7">
          Share your unique referral link. When a friend completes their first rental, you both get a <strong style="color:#86efac">$20 credit</strong>.
        </p>
        <div style="display:flex;gap:10px;max-width:420px;margin:0 auto;background:rgba(255,255,255,.1);border-radius:10px;padding:6px;border:1px solid rgba(255,255,255,.2)">
          <input type="text" value="bicicletas.io/ref/ALEX2026" readonly
            style="flex:1;background:transparent;border:none;outline:none;color:#fff;font-size:.88rem;padding:6px 10px">
          <button class="btn btn-primary btn-sm" onclick="copyRef()">Copy Link</button>
        </div>
      </div>

      <!-- Loyalty tiers -->
      <div style="margin-top:40px">
        <div class="section-header">
          <span class="section-kicker">Loyalty</span>
          <h2>Ride More, Save More</h2>
          <p>Every rental earns you status and unlocks bigger discounts automatically.</p>
        </div>
        <div class="grid-3" style="gap:20px">
          ${[
            ['🥉','Bronze','0-2 rentals','5% off every rental','var(--gray-600)','var(--gray-100)'],
            ['🥈','Silver','3-9 rentals','15% off + free helmet','#64748b','#f1f5f9'],
            ['🥇','Gold','10+ rentals','25% off + free insurance','#b45309','#fef3c7'],
          ].map(([icon, tier, req, perk, fg, bg]) => `
          <div style="background:${bg};border-radius:var(--radius-lg);padding:28px;text-align:center;border:1.5px solid ${fg}22">
            <div style="font-size:2.5rem;margin-bottom:10px">${icon}</div>
            <div style="font-size:1.2rem;font-weight:800;color:${fg};margin-bottom:4px">${tier}</div>
            <div style="font-size:.8rem;color:var(--gray-500);margin-bottom:12px">${req}</div>
            <div style="font-size:.9rem;font-weight:600;color:var(--gray-700)">${perk}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </section>`;
}

function offerCardHTML(o) {
  return `
  <div class="offer-card">
    <div class="offer-card-header" style="background:${o.color};color:#fff">
      <div class="offer-icon">${o.icon}</div>
      <div class="offer-discount">${o.discount}</div>
      <div class="offer-title">${o.title}</div>
      <div class="offer-subtitle">${o.subtitle}</div>
    </div>
    <div class="offer-card-body">
      ${o.code === 'AUTO' ? `
        <div style="background:var(--green-light);border-radius:8px;padding:10px 14px;margin-bottom:12px;font-size:.85rem;color:var(--green-dark);font-weight:600">
          ✓ Applied automatically at checkout — no code needed
        </div>
      ` : `
        <div class="offer-code-row">
          <div>
            <div class="offer-code-label">PROMO CODE</div>
            <div class="offer-code-value">${o.code}</div>
          </div>
          <button class="offer-copy-btn" onclick="copyCode('${o.code}')">Copy</button>
        </div>
      `}
      <div class="offer-terms">${o.terms}</div>
      <div class="offer-expiry">📅 Valid until: ${o.expiry}</div>
      ${o.code !== 'AUTO' ? `<button class="btn btn-primary btn-full" style="margin-top:14px;font-size:.85rem" onclick="navigate('bikes')">Book with this offer →</button>` : ''}
    </div>
  </div>`;
}

function copyCode(code) {
  navigator.clipboard.writeText(code).catch(() => {});
  toast(`Code "${code}" copied to clipboard!`, 'success');
}
function copyRef() {
  navigator.clipboard.writeText('bicicletas.io/ref/ALEX2026').catch(() => {});
  toast('Referral link copied!', 'success');
}

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════════════════════ */
function renderDashboard() {
  return `
  <div class="page-header">
    <div class="container">
      <div class="breadcrumb">Home <span>/</span> My Account</div>
      <h1>My Dashboard</h1>
      <p>Manage your rentals, track orders, and access your rewards.</p>
    </div>
  </div>

  <div class="dashboard-grid">
    <!-- Sidebar -->
    <div class="dashboard-sidebar">
      <div class="user-card">
        <div class="user-avatar">🚴</div>
        <div class="user-name">${STATE.user.name}</div>
        <div class="user-email">${STATE.user.email}</div>
        <span class="badge badge-amber">⭐ ${STATE.user.member}</span>
        <div class="user-stats">
          <div>
            <div class="user-stat-val">${STATE.rentals.length}</div>
            <div class="user-stat-lbl">Rentals</div>
          </div>
          <div>
            <div class="user-stat-val">${formatCurrency(STATE.user.saved)}</div>
            <div class="user-stat-lbl">Saved</div>
          </div>
          <div>
            <div class="user-stat-val">3</div>
            <div class="user-stat-lbl">Countries</div>
          </div>
        </div>
      </div>
      <div class="sidebar-menu">
        ${[
          ['🚲','rentals','My Rentals'],
          ['⭐','offers','My Offers'],
          ['💳','payment','Payment Methods'],
          ['🔔','notifications','Notifications'],
          ['⚙️','settings','Settings'],
        ].map(([icon, sec, label]) => `
          <button class="${STATE.dashSection === sec ? 'active' : ''}" onclick="setDashSection('${sec}')">
            <span>${icon}</span>${label}
          </button>`).join('')}
      </div>
    </div>

    <!-- Main content -->
    <div class="dashboard-main" id="dash-main">
      ${renderDashSection()}
    </div>
  </div>`;
}

function setDashSection(sec) {
  STATE.dashSection = sec;
  const el = document.getElementById('dash-main');
  if (el) el.innerHTML = renderDashSection();
  // Update active in sidebar
  document.querySelectorAll('.sidebar-menu button').forEach(b => {
    b.classList.toggle('active', b.textContent.trim().includes(sec === 'rentals' ? 'Rentals' : sec === 'offers' ? 'Offers' : sec === 'payment' ? 'Payment' : sec === 'notifications' ? 'Notifications' : 'Settings'));
  });
}

function renderDashSection() {
  switch (STATE.dashSection) {
    case 'rentals': return renderRentals();
    case 'offers':  return renderMyOffers();
    case 'payment': return renderPaymentMethods();
    case 'notifications': return renderNotifications();
    default: return renderSettings();
  }
}

function renderRentals() {
  const totalSpent = STATE.rentals.reduce((s, r) => s + r.total, 0);
  const active = STATE.rentals.filter(r => r.status === 'active').length;
  return `
  <div class="dash-stats-row">
    ${[
      ['🚲', STATE.rentals.length, 'Total Rentals'],
      ['✅', STATE.rentals.filter(r=>r.status==='completed').length, 'Completed'],
      ['💰', formatCurrency(totalSpent), 'Total Spent'],
      ['♻️', STATE.rentals.filter(r=>r.status==='refunded').length, 'Refunded'],
    ].map(([icon, val, lbl]) => `
    <div class="dash-stat-card">
      <div class="dash-stat-icon">${icon}</div>
      <div class="dash-stat-val">${val}</div>
      <div class="dash-stat-lbl">${lbl}</div>
    </div>`).join('')}
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
    <h3 style="font-size:1rem;font-weight:700">Rental History</h3>
    <button class="btn btn-primary btn-sm" onclick="navigate('bikes')">+ New Rental</button>
  </div>
  ${STATE.rentals.map(r => rentalCardHTML(r)).join('')}`;
}

function rentalCardHTML(r) {
  const bike = getBikeById(r.bikeId);
  const loc  = getLocationById(r.locationId);
  if (!bike || !loc) return '';
  const c = BIKE_COLORS[bike.image];
  return `
  <div class="rental-card">
    <div class="rental-img" style="background:${c.bg}">${bikeSVG(bike.image, 55)}</div>
    <div class="rental-info">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
        <div>
          <div class="rental-id">${r.id}</div>
          <div class="rental-bike">${bike.name}</div>
        </div>
        <span class="status-pill status-${r.status}">${r.status.charAt(0).toUpperCase()+r.status.slice(1)}</span>
      </div>
      <div class="rental-meta">
        <span>📍 ${loc.flag} ${loc.city} · ${loc.hub}</span>
        <span>📅 ${r.startDate} → ${r.endDate}</span>
        <span>⏱️ ${r.days} day${r.days !== 1 ? 's' : ''}</span>
        ${r.promo ? `<span>🏷️ ${r.promo}</span>` : ''}
      </div>
      ${r.refundReason ? `<div style="font-size:.78rem;color:var(--red);margin-top:4px">↩️ ${r.refundReason}</div>` : ''}
    </div>
    <div style="text-align:right;flex-shrink:0">
      <div class="rental-price">${formatCurrency(r.total)}</div>
      ${r.status === 'completed' ? `<button class="btn btn-outline btn-sm" style="margin-top:6px;font-size:.75rem" onclick="requestRefund('${r.id}')">Request Refund</button>` : ''}
      ${r.status === 'active' ? `<button class="btn btn-primary btn-sm" style="margin-top:6px;font-size:.75rem">Track Bike</button>` : ''}
    </div>
  </div>`;
}

function requestRefund(id) {
  const r = STATE.rentals.find(r => r.id === id);
  if (r) {
    r.status = 'refunded';
    r.refundReason = 'Customer requested refund';
    document.getElementById('dash-main').innerHTML = renderDashSection();
    toast(`Refund for ${r.id} initiated. Expected within 24 hrs.`, 'info', 4000);
  }
}

function renderMyOffers() {
  return `
  <h3 style="font-size:1rem;font-weight:700;margin-bottom:16px">Available Promo Codes</h3>
  <div style="display:flex;flex-direction:column;gap:12px">
    ${OFFERS.filter(o => o.code !== 'AUTO').map(o => `
    <div style="background:var(--white);border:1.5px solid var(--gray-200);border-radius:12px;padding:16px;display:flex;align-items:center;gap:16px">
      <div style="font-size:2rem">${o.icon}</div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:.95rem">${o.title}</div>
        <div style="font-size:.82rem;color:var(--gray-500);margin-top:2px">${o.subtitle}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:8px">
          <span style="background:var(--gray-100);padding:3px 10px;border-radius:6px;font-family:monospace;font-weight:700;font-size:.88rem;letter-spacing:1px">${o.code}</span>
          <span style="font-size:.75rem;color:var(--gray-400)">Expires: ${o.expiry}</span>
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-size:1.3rem;font-weight:900;color:var(--green-dark)">${o.discount}</div>
        <button class="btn btn-primary btn-sm" style="margin-top:6px;font-size:.75rem" onclick="copyCode('${o.code}')">Copy</button>
      </div>
    </div>`).join('')}
  </div>`;
}

function renderPaymentMethods() {
  return `
  <h3 style="font-size:1rem;font-weight:700;margin-bottom:16px">Payment Methods</h3>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="background:linear-gradient(135deg,#1f2937,#374151);border-radius:12px;padding:22px;color:#fff">
      <div class="card-chip"></div>
      <div class="card-num" style="margin-bottom:8px">•••• •••• •••• 4242</div>
      <div style="display:flex;justify-content:space-between;font-size:.82rem;opacity:.8">
        <span>Alex Rivera</span><span>12/28</span><span>VISA</span>
      </div>
    </div>
    <button class="btn btn-outline btn-full" style="border-style:dashed" onclick="toast('Add card feature coming soon','info')">
      + Add New Card
    </button>
  </div>
  <h3 style="font-size:1rem;font-weight:700;margin:24px 0 12px">Billing History</h3>
  <div style="background:var(--white);border:1px solid var(--gray-200);border-radius:10px;overflow:hidden">
    ${STATE.rentals.map(r => {
      const b = getBikeById(r.bikeId);
      return `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--gray-100);font-size:.88rem">
        <div><div style="font-weight:600">${b ? b.name : r.bikeId} · ${r.id}</div><div style="font-size:.75rem;color:var(--gray-400)">${r.startDate}</div></div>
        <div style="text-align:right"><div style="font-weight:700">${formatCurrency(r.total)}</div><span class="status-pill status-${r.status}" style="font-size:.68rem">${r.status}</span></div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderNotifications() {
  return `
  <h3 style="font-size:1rem;font-weight:700;margin-bottom:16px">Notifications</h3>
  ${[
    ['🎉','Your Summer25 discount has been activated','2 hours ago','unread'],
    ['✅','Rental RNT-10042 in Paris completed successfully','Apr 14, 2026','read'],
    ['♻️','Refund for RNT-10031 processed — $224.00 returned','Mar 5, 2026','read'],
    ['🆕','New hub opened in Dubai! Explore rides there.','Feb 20, 2026','read'],
  ].map(([icon, msg, time, status]) => `
  <div style="background:${status==='unread'?'var(--green-xlight)':'var(--white)'};border:1.5px solid ${status==='unread'?'var(--green-light)':'var(--gray-200)'};border-radius:10px;padding:14px 16px;margin-bottom:10px;display:flex;gap:12px;align-items:flex-start">
    <span style="font-size:1.3rem">${icon}</span>
    <div style="flex:1"><div style="font-size:.9rem;font-weight:${status==='unread'?700:500}">${msg}</div><div style="font-size:.75rem;color:var(--gray-400);margin-top:4px">${time}</div></div>
    ${status==='unread'?'<div style="width:8px;height:8px;border-radius:50%;background:var(--green);margin-top:4px;flex-shrink:0"></div>':''}
  </div>`).join('')}`;
}

function renderSettings() {
  return `
  <h3 style="font-size:1rem;font-weight:700;margin-bottom:16px">Account Settings</h3>
  <div style="background:var(--white);border:1px solid var(--gray-200);border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:14px">
    ${[['Full Name','Alex Rivera'],['Email','alex@example.com'],['Phone','+1 555 0123'],['Country','United States']].map(([lbl, val]) => `
    <div>
      <label class="form-label">${lbl}</label>
      <input type="text" class="form-control" value="${val}">
    </div>`).join('')}
    <button class="btn btn-primary" style="align-self:flex-start" onclick="toast('Settings saved!','success')">Save Changes</button>
  </div>
  <h3 style="font-size:1rem;font-weight:700;margin:24px 0 12px">Preferences</h3>
  <div style="background:var(--white);border:1px solid var(--gray-200);border-radius:12px;padding:20px;display:flex;flex-direction:column;gap:12px">
    ${[
      ['Email promotions','Receive deals and offers via email'],
      ['SMS updates','Booking confirmations and reminders'],
      ['Location sharing','Enable for nearby hub suggestions'],
    ].map(([title, desc], i) => `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
      <div><div style="font-size:.9rem;font-weight:600">${title}</div><div style="font-size:.78rem;color:var(--gray-500)">${desc}</div></div>
      <label style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0">
        <input type="checkbox" ${i < 2 ? 'checked' : ''} style="opacity:0;width:0;height:0" onchange="togglePref(this)">
        <span style="position:absolute;inset:0;border-radius:12px;background:${i<2?'var(--green)':'var(--gray-300)'};cursor:pointer;transition:.3s"></span>
        <span style="position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:3px;left:${i<2?'23px':'3px'};transition:.3s;box-shadow:var(--shadow)"></span>
      </label>
    </div>`).join('')}
  </div>`;
}

function togglePref(input) {
  const span = input.nextElementSibling;
  const dot = span.nextElementSibling;
  if (input.checked) {
    span.style.background = 'var(--green)';
    dot.style.left = '23px';
  } else {
    span.style.background = 'var(--gray-300)';
    dot.style.left = '3px';
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   BOOKING MODAL (6 STEPS)
   1 — Bike & Dates  2 — City  3 — Pickup Hub  4 — Extras  5 — Summary  6 — Payment
═══════════════════════════════════════════════════════════════════════════ */
let BOOKING_STEP = 1;
const BOOKING_STEPS = ['Bike & Dates', 'City', 'Pickup Hub', 'Extras', 'Summary', 'Payment'];

function openBooking(bikeId) {
  if (bikeId) STATE.booking.bikeId = bikeId;
  if (!STATE.booking.bikeId) {
    STATE.booking.bikeId = BIKES[0].id;
  }
  BOOKING_STEP = 1;
  const today = new Date().toISOString().split('T')[0];
  STATE.booking.startDate  = today;
  STATE.booking.endDate    = addDays(today, 1);
  STATE.booking.days       = 1;
  STATE.booking.cityId     = null;
  STATE.booking.locationId = null;
  STATE.booking.extras     = [];
  STATE.booking.promoCode  = '';
  STATE.booking.promoPct   = 0;
  STATE.booking.promoDesc  = '';
  STATE.booking.total      = 0;
  renderBookingModal();
  document.getElementById('booking-overlay').classList.add('open');
}

function closeBooking() {
  document.getElementById('booking-overlay').classList.remove('open');
}

function renderBookingModal() {
  const overlay = document.getElementById('booking-overlay');
  overlay.innerHTML = `
  <div class="modal" id="booking-modal">
    <div class="modal-header">
      <h2>${BOOKING_STEP < 7 ? `Book Your Ride — Step ${BOOKING_STEP} of 6` : 'Booking Confirmed! 🎉'}</h2>
      <button class="modal-close" onclick="closeBooking()">✕</button>
    </div>
    <div class="modal-body">
      ${BOOKING_STEP < 7 ? `
      <div class="step-progress">
        ${BOOKING_STEPS.map((s, i) => `
        <div class="step-item ${i+1 < BOOKING_STEP ? 'done' : i+1 === BOOKING_STEP ? 'active' : ''}" data-n="${i+1}">${s}</div>`).join('')}
      </div>` : ''}
      ${renderBookingStep()}
    </div>
    ${BOOKING_STEP < 7 ? `
    <div class="modal-footer">
      ${BOOKING_STEP > 1 ? `<button class="btn btn-ghost" onclick="bookingBack()">← Back</button>` : ''}
      <div style="margin-left:auto">
        <button class="btn btn-primary" id="booking-next-btn" onclick="bookingNext()">
          ${BOOKING_STEP === 6 ? '💳 Pay Now' : BOOKING_STEP === 5 ? 'Proceed to Payment →' : 'Continue →'}
        </button>
      </div>
    </div>` : ''}
  </div>`;
}

function renderBookingStep() {
  switch (BOOKING_STEP) {
    case 1: return renderBookingStep1();   // Bike + Dates
    case 2: return renderBookingStep2();   // City
    case 3: return renderBookingStep3();   // Pickup Hub
    case 4: return renderBookingStep4();   // Extras
    case 5: return renderBookingStep5();   // Summary + Promo
    case 6: return renderBookingStep6();   // Payment
    case 7: return renderBookingSuccess(); // Confirmation
    default: return '';
  }
}

function renderBookingStep1() {
  const bike = getBikeById(STATE.booking.bikeId);
  return `
  <div>
    <!-- Bike selector -->
    <div class="form-group">
      <label class="form-label">Select Bike Model</label>
      <select class="form-control" onchange="STATE.booking.bikeId=this.value;renderBookingModal()" id="bike-select">
        ${BIKES.map(b => `<option value="${b.id}" ${b.id===STATE.booking.bikeId?'selected':''}>${b.name} — ${formatCurrency(b.price)}/day</option>`).join('')}
      </select>
    </div>

    ${bike ? `
    <div style="background:var(--gray-50);border-radius:10px;padding:14px;margin-bottom:16px;display:flex;align-items:center;gap:14px">
      <div style="background:${BIKE_COLORS[bike.image].bg};border-radius:8px;width:70px;height:55px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        ${bikeSVG(bike.image, 55)}
      </div>
      <div>
        <div style="font-weight:700">${bike.name}</div>
        <div style="font-size:.8rem;color:var(--gray-500)">${bike.specs.range} range · ${bike.specs.maxSpeed} max</div>
        <div style="font-size:.95rem;font-weight:800;color:var(--green-dark);margin-top:2px">${formatCurrency(bike.price)}/day</div>
      </div>
    </div>` : ''}

    <!-- Date pickers -->
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Pickup Date</label>
        <input type="date" class="form-control" id="b-start"
          value="${STATE.booking.startDate}" min="${new Date().toISOString().split('T')[0]}"
          onchange="bookingDateChange()">
      </div>
      <div class="form-group">
        <label class="form-label">Return Date</label>
        <input type="date" class="form-control" id="b-end"
          value="${STATE.booking.endDate}" min="${STATE.booking.startDate || new Date().toISOString().split('T')[0]}"
          onchange="bookingDateChange()">
      </div>
    </div>
    <div id="date-calc-preview"></div>
  </div>`;
}

function bookingDateChange() {
  const s = document.getElementById('b-start').value;
  const e = document.getElementById('b-end').value;
  STATE.booking.startDate = s;
  STATE.booking.endDate = e;
  if (s && e && e > s) {
    STATE.booking.days = daysBetween(s, e);
    const bike = getBikeById(STATE.booking.bikeId);
    const tier = getDayDiscount(STATE.booking.days);
    const { base, afterPromo, total } = calcTotal(bike.price, STATE.booking.days, tier.pct, 0, []);
    document.getElementById('date-calc-preview').innerHTML = `
    <div class="calc-result" style="margin-top:0">
      <div class="calc-result-row"><span>Duration</span><span>${STATE.booking.days} day${STATE.booking.days !== 1 ? 's' : ''}</span></div>
      <div class="calc-result-row"><span>${formatCurrency(bike.price)} × ${STATE.booking.days}</span><span>${formatCurrency(base)}</span></div>
      ${tier.pct > 0 ? `<div class="calc-result-row"><span class="calc-discount">🏷️ ${tier.label}</span><span class="calc-discount">-${formatCurrency(base - afterPromo)}</span></div>` : ''}
      <div class="calc-result-row total"><span>Subtotal (before extras)</span><span>${formatCurrency(total)}</span></div>
    </div>`;
  }
}

/* ── Step 2: City only ────────────────────────────────────────────────────── */
function renderBookingStep2() {
  const bike = getBikeById(STATE.booking.bikeId);
  return `
  <div>
    <p style="font-size:.88rem;color:var(--gray-500);margin-bottom:16px">
      Where would you like to pick up your <strong>${bike?.name || 'bike'}</strong>?
    </p>
    <div class="form-group">
      <input type="text" class="form-control" placeholder="Search city or country…"
        oninput="filterBookingCities(this.value)" id="city-filter">
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;max-height:360px;overflow-y:auto" id="booking-city-list">
      ${bookingCityListHTML(CITIES)}
    </div>
  </div>`;
}

function bookingCityListHTML(cities) {
  return cities.map(c => {
    const hubs = getLocationsByCity(c.cityId);
    const totalBikes = hubs.reduce((s, h) => s + h.bikes, 0);
    const isSel = c.cityId === STATE.booking.cityId;
    return `
    <div onclick="selectBookingCity('${c.cityId}')"
      style="display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:10px;cursor:pointer;
             border:1.5px solid ${isSel ? 'var(--green)' : 'var(--gray-200)'};
             background:${isSel ? 'var(--green-xlight)' : '#fff'};transition:all .15s">
      <span style="font-size:2rem">${c.flag}</span>
      <div style="flex:1">
        <div style="font-weight:700;font-size:.95rem">${c.city}</div>
        <div style="font-size:.78rem;color:var(--gray-500);margin-top:2px">
          ${c.country} · ${hubs.length} pickup hub${hubs.length !== 1 ? 's' : ''} · ${totalBikes} bikes available
        </div>
      </div>
      <div style="width:22px;height:22px;border-radius:50%;
                  border:2px solid ${isSel ? 'var(--green)' : 'var(--gray-300)'};
                  background:${isSel ? 'var(--green)' : 'transparent'};
                  display:flex;align-items:center;justify-content:center;
                  flex-shrink:0;color:#fff;font-size:.75rem;font-weight:700">
        ${isSel ? '✓' : ''}
      </div>
    </div>`;
  }).join('');
}

function filterBookingCities(val) {
  const q = val.toLowerCase();
  document.getElementById('booking-city-list').innerHTML =
    bookingCityListHTML(CITIES.filter(c =>
      c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    ));
}

function selectBookingCity(cityId) {
  STATE.booking.cityId     = cityId;
  STATE.booking.locationId = null; // clear hub whenever city changes
  document.getElementById('booking-city-list').innerHTML = bookingCityListHTML(CITIES);
}

/* ── Step 3: Pickup Hub (filtered to chosen city) ─────────────────────────── */
function renderBookingStep3() {
  const city = CITIES.find(c => c.cityId === STATE.booking.cityId);
  const hubs = getLocationsByCity(STATE.booking.cityId);
  return `
  <div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
      <span style="font-size:1.6rem">${city?.flag || '📍'}</span>
      <div>
        <div style="font-weight:800;font-size:1rem">${city?.city || ''}, ${city?.country || ''}</div>
        <div style="font-size:.78rem;color:var(--gray-500)">${hubs.length} pickup hub${hubs.length !== 1 ? 's' : ''} in this city</div>
      </div>
    </div>
    <p style="font-size:.85rem;color:var(--gray-500);margin:12px 0 16px">
      Choose your preferred pickup point. You can return to any hub in ${city?.city || 'this city'}.
    </p>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${hubs.map(h => {
        const isSel = h.id === STATE.booking.locationId;
        return `
        <div onclick="selectBookingHub('${h.id}')"
          style="display:flex;gap:14px;align-items:flex-start;padding:14px 16px;border-radius:10px;cursor:pointer;
                 border:1.5px solid ${isSel ? 'var(--green)' : 'var(--gray-200)'};
                 background:${isSel ? 'var(--green-xlight)' : '#fff'};
                 border-left:4px solid ${isSel ? 'var(--green)' : 'var(--gray-200)'};
                 transition:all .15s">
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-weight:800;font-size:.95rem">${h.hub}</span>
              ${isSel ? '<span class="badge badge-green" style="font-size:.65rem">✓ Selected</span>' : ''}
            </div>
            <div style="font-size:.8rem;color:var(--gray-500);margin-bottom:6px">📍 ${h.address}</div>
            <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:.78rem;color:var(--gray-400)">
              <span>🕐 ${h.hours}</span>
              <span>🚲 ${h.bikes} bikes available</span>
              <span>⭐ ${h.rating}/5</span>
            </div>
          </div>
          <div style="width:22px;height:22px;border-radius:50%;flex-shrink:0;margin-top:2px;
                      border:2px solid ${isSel ? 'var(--green)' : 'var(--gray-300)'};
                      background:${isSel ? 'var(--green)' : 'transparent'};
                      display:flex;align-items:center;justify-content:center;
                      color:#fff;font-size:.75rem;font-weight:700">
            ${isSel ? '✓' : ''}
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function selectBookingHub(id) {
  STATE.booking.locationId = id;
  // Re-render step 3 in place so radio circles update instantly
  document.querySelector('#booking-modal .modal-body').innerHTML = `
    <div class="step-progress">
      ${BOOKING_STEPS.map((s, i) => `
      <div class="step-item ${i+1 < BOOKING_STEP ? 'done' : i+1 === BOOKING_STEP ? 'active' : ''}" data-n="${i+1}">${s}</div>`).join('')}
    </div>
    ${renderBookingStep3()}`;
}

/* ── Step 4: Extras ───────────────────────────────────────────────────────── */
function renderBookingStep4() {
  return `
  <div>
    <p style="font-size:.88rem;color:var(--gray-500);margin-bottom:14px">Enhance your rental with these add-ons. All prices are per day.</p>
    <div class="extras-grid">
      ${EXTRAS.map(ex => `
      <div class="extra-item ${STATE.booking.extras.includes(ex.id) ? 'selected' : ''}" onclick="toggleExtra('${ex.id}')">
        <div>
          <div style="font-size:1.6rem;margin-bottom:4px">${ex.icon}</div>
          <div class="extra-label">${ex.label}</div>
          <div class="extra-desc">${ex.desc}</div>
          <div class="extra-price">+${formatCurrency(ex.price)}/day</div>
        </div>
        <div class="extra-check">${STATE.booking.extras.includes(ex.id) ? '✓' : ''}</div>
      </div>`).join('')}
    </div>
    ${STATE.booking.extras.length > 0 ? `
    <div style="margin-top:14px;background:var(--green-xlight);border-radius:8px;padding:12px 14px;font-size:.85rem;color:var(--green-dark);font-weight:600">
      ✓ ${STATE.booking.extras.length} add-on${STATE.booking.extras.length !== 1 ? 's' : ''} selected ·
      +${formatCurrency(STATE.booking.extras.reduce((s,id) => s + (EXTRAS.find(e=>e.id===id)?.price||0), 0) * STATE.booking.days)} total
    </div>` : ''}
  </div>`;
}

function toggleExtra(id) {
  const idx = STATE.booking.extras.indexOf(id);
  if (idx === -1) STATE.booking.extras.push(id);
  else STATE.booking.extras.splice(idx, 1);
  renderBookingModal();
}

/* ── Step 5: Summary + Promo ─────────────────────────────────────────────── */
function renderBookingStep5() {
  const bike = getBikeById(STATE.booking.bikeId);
  const loc  = getLocationById(STATE.booking.locationId);
  const selectedExtras = EXTRAS.filter(e => STATE.booking.extras.includes(e.id));
  const tier = getDayDiscount(STATE.booking.days);
  const { base, afterDayDiscount, afterPromo, total } =
    calcTotal(bike.price, STATE.booking.days, tier.pct, STATE.booking.promoPct, selectedExtras);
  STATE.booking.total = total;
  STATE.booking.dayDiscountPct   = tier.pct;
  STATE.booking.dayDiscountLabel = tier.label;

  return `
  <div>
    <div class="summary-box">
      <div class="summary-row"><span class="summary-label">🚲 Bike</span><span style="font-weight:600">${bike.name}</span></div>
      <div class="summary-row"><span class="summary-label">🌍 City</span><span>${loc ? `${loc.flag} ${loc.city}` : '—'}</span></div>
      <div class="summary-row"><span class="summary-label">📍 Hub</span><span>${loc ? loc.hub : '—'}</span></div>
      <div class="summary-row"><span class="summary-label">📅 Dates</span><span>${STATE.booking.startDate} → ${STATE.booking.endDate}</span></div>
      <div class="summary-row"><span class="summary-label">⏱️ Duration</span><span>${STATE.booking.days} day${STATE.booking.days !== 1 ? 's' : ''}</span></div>
      <div class="summary-row"><span class="summary-label">Base price</span><span>${formatCurrency(base)}</span></div>
      ${tier.pct > 0 ? `<div class="summary-row"><span class="summary-discount">🏷️ ${tier.label}</span><span class="summary-discount">-${formatCurrency(base - afterDayDiscount)}</span></div>` : ''}
      ${STATE.booking.promoPct > 0 ? `<div class="summary-row"><span class="summary-discount">🎟️ ${STATE.booking.promoCode} (${STATE.booking.promoPct}% off)</span><span class="summary-discount">-${formatCurrency(afterDayDiscount - afterPromo)}</span></div>` : ''}
      ${selectedExtras.map(ex => `<div class="summary-row"><span class="summary-label">${ex.icon} ${ex.label}</span><span>+${formatCurrency(ex.price * STATE.booking.days)}</span></div>`).join('')}
      <div class="summary-row" style="font-weight:800;font-size:1.05rem;border-top:1px solid var(--gray-200)">
        <span>Total</span><span style="color:var(--green-dark)">${formatCurrency(total)}</span>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Promo Code</label>
      <div class="promo-input-row">
        <input type="text" id="promo-input" placeholder="e.g. SUMMER25" value="${STATE.booking.promoCode}" maxlength="20">
        <button class="btn btn-primary btn-sm" onclick="applyPromo()">Apply</button>
        ${STATE.booking.promoPct > 0 ? `<button class="btn btn-ghost btn-sm" onclick="removePromo()">✕</button>` : ''}
      </div>
      ${STATE.booking.promoPct > 0 ? `<div class="promo-badge">✓ ${STATE.booking.promoDesc}</div>` : ''}
      <div id="promo-error" style="color:var(--red);font-size:.78rem;margin-top:4px"></div>
    </div>
  </div>`;
}

function applyPromo() {
  const code = document.getElementById('promo-input').value.trim().toUpperCase();
  const promo = PROMO_CODES[code];
  document.getElementById('promo-error').textContent = '';
  if (!promo) { document.getElementById('promo-error').textContent = 'Invalid code. Try: SUMMER25, FIRSTRIDE, ECO10, BICI20'; return; }
  STATE.booking.promoCode = code;
  STATE.booking.promoPct  = promo.pct;
  STATE.booking.promoDesc = promo.desc;
  BOOKING_STEP = 5; renderBookingModal();
  toast(`Promo "${code}" applied — ${promo.pct}% off!`, 'success');
}

function removePromo() {
  STATE.booking.promoCode = ''; STATE.booking.promoPct = 0; STATE.booking.promoDesc = '';
  BOOKING_STEP = 5; renderBookingModal();
}

/* ── Step 6: Payment ──────────────────────────────────────────────────────── */
function renderBookingStep6() {
  const bike = getBikeById(STATE.booking.bikeId);
  return `
  <div>
    <div class="payment-card-visual">
      <div class="card-chip"></div>
      <div class="card-num" id="card-num-display">•••• •••• •••• ••••</div>
      <div class="card-meta">
        <div><div style="font-size:.6rem;margin-bottom:2px">CARD HOLDER</div><span id="card-name-display">YOUR NAME</span></div>
        <div><div style="font-size:.6rem;margin-bottom:2px">EXPIRES</div><span id="card-exp-display">MM/YY</span></div>
        <div><div style="font-size:.6rem;margin-bottom:2px">AMOUNT</div><span>${formatCurrency(STATE.booking.total)}</span></div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Cardholder Name</label>
      <input type="text" class="form-control" id="pay-name" placeholder="Alex Rivera" oninput="updateCardVisual()">
    </div>
    <div class="form-group">
      <label class="form-label">Card Number</label>
      <input type="text" class="form-control" id="pay-num" placeholder="1234 5678 9012 3456" maxlength="19" oninput="formatCardNum(this);updateCardVisual()">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Expiry (MM/YY)</label>
        <input type="text" class="form-control" id="pay-exp" placeholder="12/28" maxlength="5" oninput="formatExpiry(this);updateCardVisual()">
      </div>
      <div class="form-group">
        <label class="form-label">CVV</label>
        <input type="password" class="form-control" id="pay-cvv" placeholder="•••" maxlength="4">
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:8px;font-size:.8rem;color:var(--gray-500);margin-top:4px">
      <span>🔒</span><span>Secured with 256-bit SSL encryption. We never store your card details.</span>
    </div>
    <div style="background:var(--gray-50);border-radius:10px;padding:12px 14px;margin-top:14px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:.88rem;color:var(--gray-600)">Total for <strong>${bike?.name || ''}</strong></span>
      <span style="font-size:1.3rem;font-weight:900;color:var(--green-dark)">${formatCurrency(STATE.booking.total)}</span>
    </div>
  </div>`;
}

function formatCardNum(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 16);
  el.value = v.replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
  el.value = v;
}
function updateCardVisual() {
  const name = document.getElementById('pay-name')?.value;
  const num  = document.getElementById('pay-num')?.value;
  const exp  = document.getElementById('pay-exp')?.value;
  if (name) document.getElementById('card-name-display').textContent = name.toUpperCase() || 'YOUR NAME';
  if (num)  document.getElementById('card-num-display').textContent  = num.padEnd(19, '•').substring(0, 19);
  if (exp)  document.getElementById('card-exp-display').textContent  = exp || 'MM/YY';
}

/* ── Success screen ───────────────────────────────────────────────────────── */
function renderBookingSuccess() {
  const bike = getBikeById(STATE.booking.bikeId);
  const loc  = getLocationById(STATE.booking.locationId);
  const ref  = 'BIC-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  return `
  <div class="success-screen">
    <div class="success-icon">✓</div>
    <h2>Booking Confirmed!</h2>
    <p>Your ${bike?.name || 'e-bike'} is reserved. We've emailed your confirmation and QR code pickup pass.</p>
    <div class="booking-ref"><small>Booking Reference</small><strong>${ref}</strong></div>
    <div style="background:var(--gray-50);border-radius:12px;padding:16px;text-align:left;margin-bottom:20px;font-size:.88rem">
      <div style="display:flex;flex-direction:column;gap:8px">
        <div style="display:flex;gap:10px"><span style="color:var(--gray-400);width:80px">Bike</span><strong>${bike?.name || '—'}</strong></div>
        <div style="display:flex;gap:10px"><span style="color:var(--gray-400);width:80px">City</span><strong>${loc ? `${loc.flag} ${loc.city}` : '—'}</strong></div>
        <div style="display:flex;gap:10px"><span style="color:var(--gray-400);width:80px">Hub</span><strong>${loc ? `${loc.hub} · ${loc.address}` : '—'}</strong></div>
        <div style="display:flex;gap:10px"><span style="color:var(--gray-400);width:80px">Dates</span><strong>${STATE.booking.startDate} → ${STATE.booking.endDate}</strong></div>
        <div style="display:flex;gap:10px"><span style="color:var(--gray-400);width:80px">Total</span><strong style="color:var(--green-dark)">${formatCurrency(STATE.booking.total)}</strong></div>
      </div>
    </div>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="closeBooking();navigate('dashboard')">View My Rentals</button>
      <button class="btn btn-ghost" onclick="closeBooking()">Close</button>
    </div>
  </div>`;
}

/* ── Step navigation ──────────────────────────────────────────────────────── */
function bookingNext() {
  if (BOOKING_STEP === 1) {
    const s = document.getElementById('b-start')?.value;
    const e = document.getElementById('b-end')?.value;
    STATE.booking.startDate = s; STATE.booking.endDate = e;
    if (!s || !e)  { toast('Please select both dates', 'error'); return; }
    if (e <= s)    { toast('Return date must be after pickup date', 'error'); return; }
    STATE.booking.days = daysBetween(s, e);
  }
  if (BOOKING_STEP === 2 && !STATE.booking.cityId)     { toast('Please select a city', 'error'); return; }
  if (BOOKING_STEP === 3 && !STATE.booking.locationId) { toast('Please select a pickup hub', 'error'); return; }
  if (BOOKING_STEP === 6) {
    const name = document.getElementById('pay-name')?.value.trim();
    const num  = document.getElementById('pay-num')?.value.replace(/\s/g, '');
    const exp  = document.getElementById('pay-exp')?.value;
    const cvv  = document.getElementById('pay-cvv')?.value;
    if (!name)                          { toast('Enter cardholder name', 'error'); return; }
    if (num.length < 16)                { toast('Enter a valid 16-digit card number', 'error'); return; }
    if (!exp.match(/^\d{2}\/\d{2}$/))  { toast('Enter expiry as MM/YY', 'error'); return; }
    if (cvv.length < 3)                 { toast('Enter a valid CVV', 'error'); return; }

    const btn = document.getElementById('booking-next-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Processing…'; }

    STATE.rentals.unshift({
      id: 'RNT-' + Math.floor(10000 + Math.random() * 90000),
      bikeId:     STATE.booking.bikeId,
      locationId: STATE.booking.locationId,
      startDate:  STATE.booking.startDate,
      endDate:    STATE.booking.endDate,
      days:       STATE.booking.days,
      total:      STATE.booking.total,
      status:     'active',
      promo:      STATE.booking.promoCode || null,
    });
    setTimeout(() => { BOOKING_STEP = 7; renderBookingModal(); updateNavCart(); }, 1800);
    return;
  }
  BOOKING_STEP++;
  renderBookingModal();
}

function bookingBack() {
  if (BOOKING_STEP > 1) { BOOKING_STEP--; renderBookingModal(); }
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO SEARCH
═══════════════════════════════════════════════════════════════════════════ */
function heroSearch() {
  const cityId = document.getElementById('hero-city')?.value;
  if (cityId) {
    STATE.booking.cityId = cityId;
    STATE.booking.locationId = null;
  }
  navigate('bikes');
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN RENDER ENGINE
═══════════════════════════════════════════════════════════════════════════ */
function render() {
  const mc = document.getElementById('main-content');
  switch (STATE.page) {
    case 'home':        mc.innerHTML = renderHome(); break;
    case 'bikes':       mc.innerHTML = renderBikes(); break;
    case 'bike-detail': mc.innerHTML = renderBikeDetail(); setTimeout(updateCalc, 50); break;
    case 'locations':   mc.innerHTML = renderLocations(); break;
    case 'offers':      mc.innerHTML = renderOffers(); break;
    case 'dashboard':   mc.innerHTML = renderDashboard(); break;
    default:            mc.innerHTML = renderHome();
  }
  updateNav();
  updateNavCart();
}

function updateNav() {
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === STATE.page);
  });
}

function updateNavCart() {
  const active = STATE.rentals.filter(r => r.status === 'active').length;
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = active;
    cartCount.style.display = active > 0 ? 'flex' : 'none';
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  render();
  // Close modal when clicking outside
  document.getElementById('booking-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('booking-overlay')) closeBooking();
  });
  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBooking();
  });
});
