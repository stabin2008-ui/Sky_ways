const fs = require('fs');
const path = require('path');

console.log('--- STARTING SAFEWAY TRAVELS AUTOMATED TEST SUITE ---');

// 1. Check Core & Fleet Files Existence
const requiredFiles = [
  'index.html',
  'favicon.svg',
  'css/variables.css',
  'css/base.css',
  'css/layout.css',
  'css/components.css',
  'css/sections.css',
  'css/responsive.css',
  'js/config.js',
  'js/analytics.js',
  'js/whatsapp.js',
  'js/booking.js',
  'js/ui.js',
  'js/app.js',
  'assets/images/bengaluru_travel_hero.jpg',
  'assets/images/driver_placeholder.svg',
  // All 12 Authentic Fleet Images
  'assets/images/fleet/toyota_etios_exterior.jpg',
  'assets/images/fleet/toyota_etios_interior.jpg',
  'assets/images/fleet/toyota_innova_crysta_exterior.jpg',
  'assets/images/fleet/toyota_innova_crysta_interior.jpg',
  'assets/images/fleet/maruti_suzuki_ertiga_exterior.jpg',
  'assets/images/fleet/maruti_suzuki_ertiga_interior.jpg',
  'assets/images/fleet/toyota_rumion_exterior.jpg',
  'assets/images/fleet/toyota_rumion_interior.png',
  'assets/images/fleet/toyota_innova_hycross_exterior.jpg',
  'assets/images/fleet/toyota_innova_hycross_interior.jpg',
  'assets/images/fleet/tempo_traveller_exterior.jpg',
  'assets/images/fleet/tempo_traveller_interior.jpg'
];

let allFilesOk = true;
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error('MISSING FILE:', file);
    allFilesOk = false;
  } else {
    const size = fs.statSync(file).size;
    console.log('[OK] ' + file + ' (' + size + ' bytes)');
  }
}

if (!allFilesOk) {
  process.exit(1);
}

// 2. Test js/config.js
global.window = {};
require('./js/config.js');
const cfg = global.window.SafeWayConfig;
if (!cfg) throw new Error('SafeWayConfig not loaded');
console.log('\n[CONFIG VERIFICATION]');
console.log('  Business Name:', cfg.business.name);
console.log('  Phone:', cfg.business.phoneRaw);
console.log('  Email:', cfg.business.email);
console.log('  Tagline:', cfg.business.tagline);
console.log('  Services count:', cfg.services.length);
console.log('  Fleet categories count:', cfg.fleet.categories.length);
console.log('  Fleet vehicles count:', cfg.fleet.vehicles.length);
console.log('  Pricing categories:', cfg.pricing.categories.length);
console.log('  Testimonials count:', cfg.testimonials.reviews.length);

if (cfg.business.phoneRaw !== '9980838845') throw new Error('Phone mismatch');
if (cfg.business.email !== 'ways63098@gmail.com') throw new Error('Email mismatch');
if (cfg.business.yearsOfExperience !== 25) throw new Error('Experience mismatch');

// Verify 4 categories
if (!cfg.fleet.categories || cfg.fleet.categories.length !== 4) {
  throw new Error('Expected 4 fleet categories, got: ' + (cfg.fleet.categories ? cfg.fleet.categories.length : 0));
}
console.log('  [OK] 4 Categories verified in config.');

// Verify exact fleet vehicles in config
const expectedVehicleModels = [
  'Toyota Etios',
  'Toyota Innova Crysta',
  'Maruti Suzuki Ertiga',
  'Toyota Rumion',
  'Toyota Innova Hycross',
  'Custom Group Vehicle (Tempo Traveller)'
];

for (const model of expectedVehicleModels) {
  const found = cfg.fleet.vehicles.find(v => v.vehicleName === model || v.vehicleName.includes(model));
  if (!found) throw new Error('Missing expected fleet vehicle model: ' + model);
  if (!found.exteriorImage || !fs.existsSync(found.exteriorImage)) {
    throw new Error('Missing exterior image for vehicle: ' + model);
  }
  if (!found.interiorImage || !fs.existsSync(found.interiorImage)) {
    throw new Error('Missing interior image for vehicle: ' + model);
  }
  console.log(`  [OK] Vehicle Verified: ${model} (${found.category}) - Exterior & Interior present.`);
}

// 3. Test js/whatsapp.js
global.navigator = { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };
require('./js/whatsapp.js');
const wa = global.window.SafeWayWhatsApp;
if (!wa) throw new Error('SafeWayWhatsApp not loaded');

const testBookingData = {
  name: 'Ramesh Kumar',
  phone: '9980838845',
  email: 'ramesh@example.com',
  service: 'Airport Transfers',
  pickup: 'Indiranagar 100ft Road, Bengaluru',
  drop: 'BLR Kempegowda Airport',
  date: '2026-10-09',
  time: '05:30',
  passengers: '4',
  vehicle: 'Toyota Innova Crysta — MUV',
  specialRequests: 'Flight delay buffer, Extra luggage'
};

const msg = wa.generateBookingMessage(testBookingData);
console.log('\n[WHATSAPP MESSAGE VERIFICATION]');
console.log(msg);

if (!msg.includes('Ramesh Kumar')) throw new Error('Name missing in WA message');
if (!msg.includes('9980838845')) throw new Error('Phone missing in WA message');
if (!msg.includes('Airport Transfers')) throw new Error('Service missing in WA message');
if (!msg.includes('BLR Kempegowda Airport')) throw new Error('Drop missing in WA message');
if (!msg.includes('Toyota Innova Crysta — MUV')) throw new Error('Selected vehicle missing in WA message');
if (!msg.includes('Flight delay buffer')) throw new Error('Special requests missing in WA message');

const url = wa.buildWhatsAppUrl(msg);
console.log('\n[WHATSAPP TARGET URL]:');
console.log(url.substring(0, 110) + '...');
if (!url.startsWith('https://wa.me/919980838845?text=')) throw new Error('URL prefix invalid');

// 4. Test HTML Content & Critical Elements
const html = fs.readFileSync('index.html', 'utf8');
const expectedElements = [
  'SafeWay Travels',
  '25 Years of Comfort & Trust',
  '9980838845',
  'ways63098@gmail.com',
  'id="bookingForm"',
  'id="bookingModal"',
  'id="fleetLightbox"',
  'id="lightboxCloseBtn"',
  'id="lightboxImg"',
  'id="selectedVehicleBanner"',
  'id="mainNavbar"',
  'id="mobileMenuBtn"',
  'id="navDrawer"',
  'class="mobile-bottom-bar"',
  'BOOK A CAB',
  'Toyota Etios — Sedan',
  'Toyota Innova Crysta — MUV',
  'Maruti Suzuki Ertiga — MUV',
  'Toyota Rumion — MUV',
  'Toyota Innova Hycross — MUV',
  'assets/images/bengaluru_travel_hero.jpg',
  'assets/images/driver_placeholder.svg'
];

for (const item of expectedElements) {
  if (!html.includes(item)) {
    throw new Error('Missing expected element in index.html: ' + item);
  }
}
console.log('\n[HTML VALIDATION]');
console.log('All expected element IDs, assets, vehicles, and metadata verified in index.html.');

console.log('\n======================================================');
console.log('>>> ALL VERIFICATION TESTS PASSED SUCCESSFULLY! <<<');
console.log('======================================================\n');
