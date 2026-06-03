// ─── Bike catalogue ──────────────────────────────────────────────────────────
const BIKES = [
  {
    id: 'lite',
    name: 'Bicicletas Lite',
    tagline: 'Perfect for leisure & casual rides',
    price: 15,
    category: 'leisure',
    accent: '#22c55e',
    accentLight: '#dcfce7',
    badge: 'Best Value',
    rating: 4.5,
    reviews: 312,
    available: true,
    image: 'green',
    specs: {
      motor: '250W Brushless Hub',
      battery: '36V 10Ah Li-ion',
      range: '40 km',
      maxSpeed: '25 km/h',
      weight: '18 kg',
      payload: '120 kg',
      chargingTime: '3.5 hrs',
      brakes: 'Mechanical Disc',
      gears: '7-speed Shimano',
      tyres: '26" × 2.0" Puncture-Resistant',
      suspension: 'Front Fork',
      display: 'LED LCD',
    },
    features: [
      'Integrated LED headlight & taillight',
      'USB-A charging port on handlebar',
      '7-speed Shimano gearset',
      'Anti-theft cable lock included',
      'Rear rack (optional add-on)',
      'IPX4 weather resistance',
      'Walk-assist mode',
      'Regenerative braking',
    ],
    description: 'The Lite is our entry-level e-bike engineered for daily leisure rides, park trails, and short city hops. Lightweight aluminium frame makes it easy to handle at any skill level.',
  },
  {
    id: 'urban',
    name: 'Bicicletas Urban',
    tagline: 'Conquer the city every day',
    price: 25,
    category: 'city',
    accent: '#3b82f6',
    accentLight: '#dbeafe',
    badge: 'Most Popular',
    rating: 4.8,
    reviews: 581,
    available: true,
    image: 'blue',
    specs: {
      motor: '350W Mid-Drive',
      battery: '48V 12Ah Li-ion',
      range: '65 km',
      maxSpeed: '32 km/h',
      weight: '22 kg',
      payload: '130 kg',
      chargingTime: '4 hrs',
      brakes: 'Hydraulic Disc',
      gears: '8-speed Shimano Acera',
      tyres: '700c × 40mm Schwalbe Marathon',
      suspension: 'Rigid (comfort saddle)',
      display: 'Colour TFT 3.5"',
    },
    features: [
      'Torque sensor for natural pedal feel',
      'Integrated rear light with brake signal',
      'Auto on/off lights via ambient sensor',
      'Smartphone connectivity (Bicicletas app)',
      'Navigation turn-by-turn on display',
      'Integrated rear lock',
      'IPX6 waterproof rating',
      '4 assist levels + walk mode',
      'Bluetooth audio remote',
    ],
    description: 'Built for the urban commuter who demands reliability, speed, and style. The Urban integrates seamlessly into city life — from cobblestone alleys to bus-lane blasts.',
  },
  {
    id: 'sport',
    name: 'Bicicletas Sport',
    tagline: 'Speed meets endurance',
    price: 40,
    category: 'sport',
    accent: '#f59e0b',
    accentLight: '#fef3c7',
    badge: 'High Performance',
    rating: 4.7,
    reviews: 198,
    available: true,
    image: 'yellow',
    specs: {
      motor: '500W Mid-Drive Bosch Performance CX',
      battery: '48V 17.5Ah Li-ion',
      range: '85 km',
      maxSpeed: '40 km/h',
      weight: '24 kg',
      payload: '130 kg',
      chargingTime: '4.5 hrs',
      brakes: 'Shimano MT520 4-piston Hydraulic',
      gears: '12-speed SRAM Eagle',
      tyres: '29" × 2.4" Maxxis Rekon Race',
      suspension: 'RockShox 120mm Travel',
      display: 'Bosch Kiox 300 Full Colour',
    },
    features: [
      'Bosch eMTB assist mode (adapts automatically)',
      'Integrated power meter',
      'Strava Live Segments via app',
      'Dropper seatpost ready',
      'GoPro mount on stem',
      'Tubeless-ready rims',
      'Anti-puncture Maxxis EXO casing',
      '5 assist levels + eMTB auto mode',
      'Walk mode & extended range mode',
    ],
    description: 'For riders who push limits — the Sport delivers Bosch CX torque through a 12-speed drivetrain. Whether you are crushing a 100 km gran fondo or attacking mountain switchbacks, this bike keeps up.',
  },
  {
    id: 'trail',
    name: 'Bicicletas Trail',
    tagline: 'Off-road adventure awaits',
    price: 45,
    category: 'offroad',
    accent: '#8b5cf6',
    accentLight: '#ede9fe',
    badge: 'Adventure',
    rating: 4.6,
    reviews: 143,
    available: true,
    image: 'purple',
    specs: {
      motor: '500W Bafang Ultra Mid-Drive',
      battery: '48V 20Ah Li-ion',
      range: '70 km (trail conditions)',
      maxSpeed: '35 km/h',
      weight: '27 kg',
      payload: '140 kg',
      chargingTime: '5 hrs',
      brakes: '4-piston Magura MT5 Hydraulic',
      gears: '11-speed Shimano Deore XT',
      tyres: '27.5" × 2.6" Schwalbe Magic Mary',
      suspension: 'RockShox Lyrik 160mm + RockShox Super Deluxe rear',
      display: '3.5" Full Colour + Remote Control',
    },
    features: [
      'Full suspension 160/145mm travel',
      'Trail-tuned geometry (67° head angle)',
      'Adjustable dropper post 150mm',
      'E-MTB specific Schwalbe SuperGravity tyres',
      'Waterproof mudguard kit included',
      'Bash guard for chain protection',
      'GPS tracking enabled',
      'Emergency SOS via app',
      'Night-vision front light 2000 lm',
    ],
    description: 'Designed for technical singletrack, rocky descents, and deep forest trails. The Trail\'s long-travel dual suspension absorbs whatever the mountain throws at you while the Bafang Ultra delivers torque on demand.',
  },
  {
    id: 'cargo',
    name: 'Bicicletas Cargo',
    tagline: 'Carry more, worry less',
    price: 35,
    category: 'cargo',
    accent: '#ef4444',
    accentLight: '#fee2e2',
    badge: 'Utility',
    rating: 4.4,
    reviews: 89,
    available: true,
    image: 'red',
    specs: {
      motor: '400W Rear Hub Cargo',
      battery: '48V 15Ah Li-ion',
      range: '50 km (loaded)',
      maxSpeed: '28 km/h',
      weight: '35 kg',
      payload: '180 kg',
      chargingTime: '4 hrs',
      brakes: 'Hydraulic Disc (203mm rotors)',
      gears: '8-speed Shimano Nexus IGH',
      tyres: '20" × 2.4" Schwalbe Big Apple',
      suspension: 'Springer front fork',
      display: 'Cargo LCD 4"',
    },
    features: [
      'Extended rear deck (200 kg rated)',
      'Child seat compatible (EN 14344)',
      'Front basket (30 L) included',
      'Cargo securing straps × 4',
      'Integrated front & rear mudguards',
      'Double kickstand for stability',
      'Low step-over frame',
      'Speed limiter for school zones',
      'Fleet management ready (QR unlock)',
    ],
    description: 'Haul groceries, tools, children, or deliveries without breaking a sweat. The Cargo\'s reinforced frame and 400W motor tackle loaded climbs effortlessly. Replace your second car today.',
  },
  {
    id: 'luxe',
    name: 'Bicicletas Luxe',
    tagline: 'The pinnacle of electric cycling',
    price: 60,
    category: 'premium',
    accent: '#0ea5e9',
    accentLight: '#e0f2fe',
    badge: 'Premium',
    rating: 4.9,
    reviews: 67,
    available: true,
    image: 'cyan',
    specs: {
      motor: '750W Fazua Ride 60 Mid-Drive',
      battery: '60V 25Ah Dual Li-ion',
      range: '120 km',
      maxSpeed: '45 km/h',
      weight: '21 kg (carbon frame)',
      payload: '130 kg',
      chargingTime: '3.5 hrs (fast charge)',
      brakes: 'Magura MT7 Pro 4-piston Hydraulic',
      gears: '12-speed SRAM Red eTap AXS (wireless)',
      tyres: '700c × 32mm Pirelli P Zero Velo',
      suspension: 'Fox 32 Step-Cast Factory 80mm',
      display: 'Garmin Edge 840 Solar integrated',
    },
    features: [
      'Full carbon monocoque frame & fork',
      'SRAM Red eTap wireless electronic shifting',
      'Garmin Solar GPS with full navigation',
      'Fazua\'s removable drive system (ride as a normal bike)',
      'Apple FindMy + Tile hidden tracker',
      'Fingerprint + PIN dual security lock',
      'Integrated ambient lighting (RGB)',
      'Wireless charging pad (phone)',
      'Premium saddle (Brooks C17 Carved)',
      'Integrated 30 lm rear brake light',
      '24/7 roadside assistance included',
    ],
    description: 'When only the best will do. The Luxe combines aerospace-grade carbon construction with wireless electronics and a removable drive system. Equally at home on a Sunday century or a business-district commute.',
  },
];

// ─── Pickup locations ─────────────────────────────────────────────────────────
// Each city has 2–3 hubs. `cityId` groups hubs together.
const LOCATIONS = [
  // ── New York ──
  { id: 'nyc-1', cityId: 'nyc', city: 'New York', country: 'USA', flag: '🇺🇸', hub: 'Central Park South', address: '59th St & 6th Ave, Manhattan', hours: '7am – 10pm', bikes: 24, rating: 4.9, lat: 40.766, lng: -73.978 },
  { id: 'nyc-2', cityId: 'nyc', city: 'New York', country: 'USA', flag: '🇺🇸', hub: 'Brooklyn Bridge', address: 'Cadman Plaza W, Brooklyn', hours: '7am – 9pm', bikes: 18, rating: 4.7, lat: 40.704, lng: -73.987 },
  { id: 'nyc-3', cityId: 'nyc', city: 'New York', country: 'USA', flag: '🇺🇸', hub: 'Times Square', address: '350 W 42nd St, Midtown', hours: '8am – 11pm', bikes: 20, rating: 4.6, lat: 40.758, lng: -73.985 },

  // ── London ──
  { id: 'lon-1', cityId: 'lon', city: 'London', country: 'UK', flag: '🇬🇧', hub: 'Waterloo Bridge', address: '15 Southbank, SE1', hours: '6am – 11pm', bikes: 28, rating: 4.8, lat: 51.506, lng: -0.118 },
  { id: 'lon-2', cityId: 'lon', city: 'London', country: 'UK', flag: '🇬🇧', hub: "King's Cross", address: 'Euston Rd, N1 9AL', hours: '6am – midnight', bikes: 22, rating: 4.7, lat: 51.531, lng: -0.124 },
  { id: 'lon-3', cityId: 'lon', city: 'London', country: 'UK', flag: '🇬🇧', hub: 'Canary Wharf', address: 'Canada Square, E14', hours: '7am – 10pm', bikes: 16, rating: 4.6, lat: 51.505, lng: -0.019 },

  // ── Paris ──
  { id: 'par-1', cityId: 'par', city: 'Paris', country: 'France', flag: '🇫🇷', hub: 'Châtelet – Les Halles', address: '2 Rue de Rivoli, 75001', hours: '7am – 10pm', bikes: 30, rating: 4.9, lat: 48.855, lng: 2.348 },
  { id: 'par-2', cityId: 'par', city: 'Paris', country: 'France', flag: '🇫🇷', hub: 'Montmartre', address: '12 Rue Lepic, 75018', hours: '8am – 10pm', bikes: 14, rating: 4.8, lat: 48.884, lng: 2.337 },
  { id: 'par-3', cityId: 'par', city: 'Paris', country: 'France', flag: '🇫🇷', hub: 'Eiffel Tower', address: 'Champ de Mars, 75007', hours: '7am – 11pm', bikes: 20, rating: 5.0, lat: 48.858, lng: 2.294 },

  // ── Tokyo ──
  { id: 'tok-1', cityId: 'tok', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', hub: 'Marunouchi', address: '1-9 Marunouchi, Chiyoda-ku', hours: '5am – midnight', bikes: 32, rating: 5.0, lat: 35.681, lng: 139.767 },
  { id: 'tok-2', cityId: 'tok', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', hub: 'Shinjuku Station', address: '3 Chome Nishi-Shinjuku', hours: '5am – 1am', bikes: 26, rating: 4.9, lat: 35.689, lng: 139.700 },
  { id: 'tok-3', cityId: 'tok', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', hub: 'Shibuya Crossing', address: '2 Chome-24 Dogenzaka, Shibuya', hours: '6am – midnight', bikes: 20, rating: 4.8, lat: 35.659, lng: 139.700 },

  // ── Sydney ──
  { id: 'syd-1', cityId: 'syd', city: 'Sydney', country: 'Australia', flag: '🇦🇺', hub: 'The Rocks', address: '100 George St, The Rocks', hours: '6am – 10pm', bikes: 20, rating: 4.7, lat: -33.860, lng: 151.209 },
  { id: 'syd-2', cityId: 'syd', city: 'Sydney', country: 'Australia', flag: '🇦🇺', hub: 'Bondi Beach', address: '2 Campbell Parade, Bondi', hours: '6am – 9pm', bikes: 16, rating: 4.8, lat: -33.891, lng: 151.277 },

  // ── Barcelona ──
  { id: 'bcn-1', cityId: 'bcn', city: 'Barcelona', country: 'Spain', flag: '🇪🇸', hub: 'Passeig de Gràcia', address: 'Passeig de Gràcia 43, 08007', hours: '7am – 11pm', bikes: 28, rating: 4.9, lat: 41.393, lng: 2.162 },
  { id: 'bcn-2', cityId: 'bcn', city: 'Barcelona', country: 'Spain', flag: '🇪🇸', hub: 'Barceloneta Beach', address: 'Passeig Marítim 30, 08003', hours: '7am – 11pm', bikes: 22, rating: 4.8, lat: 41.380, lng: 2.189 },
  { id: 'bcn-3', cityId: 'bcn', city: 'Barcelona', country: 'Spain', flag: '🇪🇸', hub: 'Sagrada Família', address: 'Carrer de Mallorca 401, 08013', hours: '8am – 9pm', bikes: 16, rating: 4.7, lat: 41.404, lng: 2.174 },

  // ── Amsterdam ──
  { id: 'ams-1', cityId: 'ams', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', hub: 'Central Station', address: 'Stationsplein 15, 1012 AB', hours: '6am – midnight', bikes: 40, rating: 4.9, lat: 52.379, lng: 4.900 },
  { id: 'ams-2', cityId: 'ams', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', hub: 'Vondelpark', address: 'Stadhouderskade 1, 1054 ES', hours: '7am – 10pm', bikes: 24, rating: 4.9, lat: 52.358, lng: 4.869 },
  { id: 'ams-3', cityId: 'ams', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', hub: 'Museumplein', address: 'Jan Luijkenstraat 1, 1071 CJ', hours: '8am – 9pm', bikes: 18, rating: 4.8, lat: 52.358, lng: 4.882 },

  // ── Toronto ──
  { id: 'tor-1', cityId: 'tor', city: 'Toronto', country: 'Canada', flag: '🇨🇦', hub: 'Union Station', address: '90 Front St W, ON M5J 1E3', hours: '6am – 10pm', bikes: 24, rating: 4.8, lat: 43.645, lng: -79.381 },
  { id: 'tor-2', cityId: 'tor', city: 'Toronto', country: 'Canada', flag: '🇨🇦', hub: 'Harbourfront', address: '235 Queens Quay W, ON M5J 2G8', hours: '7am – 9pm', bikes: 18, rating: 4.7, lat: 43.638, lng: -79.383 },

  // ── Dubai ──
  { id: 'dxb-1', cityId: 'dxb', city: 'Dubai', country: 'UAE', flag: '🇦🇪', hub: 'JBR Walk', address: 'The Walk, Jumeirah Beach Residence', hours: '4am – 2am', bikes: 20, rating: 4.6, lat: 25.076, lng: 55.133 },
  { id: 'dxb-2', cityId: 'dxb', city: 'Dubai', country: 'UAE', flag: '🇦🇪', hub: 'Downtown Dubai', address: 'Emaar Blvd, Downtown, 123234', hours: '5am – 1am', bikes: 16, rating: 4.7, lat: 25.197, lng: 55.274 },

  // ── Singapore ──
  { id: 'sin-1', cityId: 'sin', city: 'Singapore', country: 'Singapore', flag: '🇸🇬', hub: 'Raffles Place', address: '1 Raffles Place, 048616', hours: '6am – 11pm', bikes: 30, rating: 4.9, lat: 1.284, lng: 103.851 },
  { id: 'sin-2', cityId: 'sin', city: 'Singapore', country: 'Singapore', flag: '🇸🇬', hub: 'Marina Bay Sands', address: '10 Bayfront Ave, 018956', hours: '6am – midnight', bikes: 22, rating: 4.8, lat: 1.283, lng: 103.859 },
];

// Unique cities derived from LOCATIONS
const CITIES = [...new Map(LOCATIONS.map(l => [l.cityId, { cityId: l.cityId, city: l.city, country: l.country, flag: l.flag }])).values()];

function getLocationsByCity(cityId) { return LOCATIONS.filter(l => l.cityId === cityId); }

// ─── Discount tiers ───────────────────────────────────────────────────────────
const DISCOUNTS = [
  { minDays: 1,  maxDays: 2,  pct: 0,  label: '' },
  { minDays: 3,  maxDays: 6,  pct: 10, label: '10% multi-day discount' },
  { minDays: 7,  maxDays: 13, pct: 20, label: '20% weekly discount' },
  { minDays: 14, maxDays: Infinity, pct: 30, label: '30% long-term discount' },
];

// ─── Promo codes ──────────────────────────────────────────────────────────────
const PROMO_CODES = {
  FIRSTRIDE: { pct: 15, desc: '15% off your first rental', once: true },
  SUMMER25:  { pct: 25, desc: '25% Summer Festival offer',  once: false },
  ECO10:     { pct: 10, desc: '10% Green Rider discount',   once: false },
  BICI20:    { pct: 20, desc: '20% Loyalty reward',         once: false },
  WORLD30:   { pct: 30, desc: '30% World Explorer deal',    once: false },
};

// ─── Offers / promotions ──────────────────────────────────────────────────────
const OFFERS = [
  {
    id: 'summer',
    title: 'Summer Festival Sale',
    subtitle: 'Up to 25% off all bikes',
    code: 'SUMMER25',
    discount: '25%',
    expiry: '31 Aug 2026',
    color: '#f59e0b',
    colorLight: '#fef3c7',
    icon: '☀️',
    terms: 'Valid on rentals of any duration. Cannot be combined with other codes.',
  },
  {
    id: 'first',
    title: 'First Ride Bonus',
    subtitle: '15% off for new members',
    code: 'FIRSTRIDE',
    discount: '15%',
    expiry: 'No expiry',
    color: '#22c55e',
    colorLight: '#dcfce7',
    icon: '🎉',
    terms: 'One-time use per account. Applied automatically on first booking.',
  },
  {
    id: 'eco',
    title: 'Green Rider Reward',
    subtitle: '10% off when you go car-free',
    code: 'ECO10',
    discount: '10%',
    expiry: '31 Dec 2026',
    color: '#10b981',
    colorLight: '#d1fae5',
    icon: '🌍',
    terms: 'Stack with multi-day discount. Share your ride stats to qualify.',
  },
  {
    id: 'loyalty',
    title: 'Loyalty Discount',
    subtitle: '20% off — for our regulars',
    code: 'BICI20',
    discount: '20%',
    expiry: 'Ongoing',
    color: '#3b82f6',
    colorLight: '#dbeafe',
    icon: '⭐',
    terms: 'Available after 3 completed rentals. Applied to all future bookings.',
  },
  {
    id: 'world',
    title: 'World Explorer',
    subtitle: '30% off when you rent in a new country',
    code: 'WORLD30',
    discount: '30%',
    expiry: 'Ongoing',
    color: '#8b5cf6',
    colorLight: '#ede9fe',
    icon: '🌐',
    terms: 'First rental in each new country qualifies. Verify via location service.',
  },
  {
    id: 'multiday',
    title: 'Multi-Day Savings',
    subtitle: 'Auto-applied — no code needed',
    code: 'AUTO',
    discount: 'Up to 30%',
    expiry: 'Always on',
    color: '#ef4444',
    colorLight: '#fee2e2',
    icon: '📅',
    terms: '3–6 days: 10% off. 7–13 days: 20% off. 14+ days: 30% off. Stacks with promo codes.',
  },
];

// ─── Mock rental history ──────────────────────────────────────────────────────
const MOCK_RENTALS = [
  {
    id: 'RNT-10042',
    bikeId: 'urban',
    locationId: 'par',
    startDate: '2026-04-10',
    endDate: '2026-04-14',
    days: 4,
    total: 90.00,
    status: 'completed',
    promo: 'ECO10',
  },
  {
    id: 'RNT-10037',
    bikeId: 'lite',
    locationId: 'bcn',
    startDate: '2026-03-20',
    endDate: '2026-03-22',
    days: 2,
    total: 30.00,
    status: 'completed',
    promo: null,
  },
  {
    id: 'RNT-10031',
    bikeId: 'sport',
    locationId: 'ams',
    startDate: '2026-02-14',
    endDate: '2026-02-21',
    days: 7,
    total: 224.00,
    status: 'refunded',
    promo: 'BICI20',
    refundReason: 'Mechanical fault reported on day 3',
  },
];

// ─── Extras / add-ons ─────────────────────────────────────────────────────────
const EXTRAS = [
  { id: 'helmet',   label: 'Safety Helmet',       price: 3,  icon: '⛑️',  desc: 'EN 1078 certified, adjustable fit' },
  { id: 'lock',     label: 'Heavy-Duty Lock',      price: 2,  icon: '🔒', desc: 'Abus Granit 540 chain lock' },
  { id: 'basket',   label: 'Front Basket',         price: 2,  icon: '🧺', desc: '25L wire basket with lid' },
  { id: 'panniers', label: 'Rear Panniers',        price: 4,  icon: '🎒', desc: 'Waterproof 2×20L set' },
  { id: 'gps',      label: 'GPS Tracker',          price: 3,  icon: '📍', desc: 'Live tracking on Bicicletas app' },
  { id: 'insurance',label: 'Ride Insurance',       price: 5,  icon: '🛡️',  desc: 'Full theft & damage cover' },
];

// ─── Helper utilities ─────────────────────────────────────────────────────────
function getDayDiscount(days) {
  return DISCOUNTS.find(d => days >= d.minDays && days <= d.maxDays) || DISCOUNTS[0];
}

function calcTotal(pricePerDay, days, dayDiscountPct, promoPct, extras) {
  const base = pricePerDay * days;
  const afterDayDiscount = base * (1 - dayDiscountPct / 100);
  const afterPromo = afterDayDiscount * (1 - promoPct / 100);
  const extrasTotal = extras.reduce((s, e) => s + e.price * days, 0);
  return { base, afterDayDiscount, afterPromo, extrasTotal, total: afterPromo + extrasTotal };
}

function getBikeById(id) { return BIKES.find(b => b.id === id); }
function getLocationById(id) { return LOCATIONS.find(l => l.id === id); }
function formatCurrency(n) { return '$' + n.toFixed(2); }
function dateStr(d) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
function daysBetween(a, b) {
  const ms = new Date(b) - new Date(a);
  return Math.max(1, Math.round(ms / 86400000));
}
