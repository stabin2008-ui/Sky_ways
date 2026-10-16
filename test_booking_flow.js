/**
 * Comprehensive Automated Test Suite for SafeWay Travels Booking Form & WhatsApp Integration
 */

const fs = require('fs');
const assert = require('assert');

console.log('===============================================================');
console.log('>>> SAFEWAY TRAVELS - ADVANCED BOOKING & WHATSAPP TEST SUITE <<<');
console.log('===============================================================\n');

// Mock browser environment for Node.js
class MockClassList {
  constructor() {
    this.classes = new Set();
  }
  add(...cls) { cls.forEach(c => this.classes.add(c)); }
  remove(...cls) { cls.forEach(c => this.classes.delete(c)); }
  contains(cls) { return this.classes.has(cls); }
  toggle(cls, force) {
    if (force === true) this.classes.add(cls);
    else if (force === false) this.classes.delete(cls);
    else if (this.classes.has(cls)) this.classes.delete(cls);
    else this.classes.add(cls);
  }
}

class MockElement {
  constructor(id, tagName = 'div') {
    this.id = id;
    this.tagName = tagName.toUpperCase();
    this.value = '';
    this.textContent = '';
    this.innerHTML = '';
    this.style = {};
    this.attributes = {};
    this.classList = new MockClassList();
    this.options = [];
    this.selectedIndex = 0;
    this.listeners = {};
    this.disabled = false;
  }
  setAttribute(attr, val) { this.attributes[attr] = String(val); }
  getAttribute(attr) { return this.attributes[attr] || null; }
  removeAttribute(attr) { delete this.attributes[attr]; }
  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }
  dispatchEvent(event) {
    if (this.listeners[event.type]) {
      this.listeners[event.type].forEach(fn => fn(event));
    }
  }
  querySelectorAll(selector) { return []; }
  querySelector(selector) { return null; }
  focus() { this.focused = true; }
  scrollIntoView() { this.scrolled = true; }
}

const elements = {};
function getOrCreateElement(id, tagName = 'div') {
  if (!elements[id]) {
    elements[id] = new MockElement(id, tagName);
  }
  return elements[id];
}

// Setup form elements
const fieldIds = [
  'bookingForm',
  'customerName', 'customerNameError',
  'customerPhone', 'customerPhoneError',
  'customerEmail', 'customerEmailError',
  'serviceType', 'serviceTypeError',
  'vehicleCategory', 'vehicleCategoryError',
  'vehiclePreference', 'vehiclePreferenceError',
  'pickupLocation', 'pickupLocationError',
  'dropLocation', 'dropLocationError',
  'travelDate', 'travelDateError',
  'pickupTime', 'pickupTimeError',
  'passengerCount', 'passengerCountError',
  'specialRequests',
  'selectedVehicleBanner', 'selectedVehicleDisplay', 'btnClearVehicle',
  'btnSubmitBooking',
  'bookingModal', 'summaryCustomerName', 'summaryTripDetails', 'summaryService', 'btnContinueWhatsApp', 'btnCopyWhatsAppMessage'
];

fieldIds.forEach(id => getOrCreateElement(id));

// Populate select options
const serviceSelect = getOrCreateElement('serviceType', 'select');
serviceSelect.options = [
  { value: '', text: '-- Select Service --' },
  { value: 'Local Cab Service', text: 'Local Cab Service (Bengaluru)' },
  { value: 'Airport Transfer', text: 'Airport Transfer (BLR Airport)' },
  { value: 'Outstation Travel', text: 'Outstation Travel (One-Way)' },
  { value: 'Round Trip', text: 'Round Trip (Family / Tourism)' }
];

const categorySelect = getOrCreateElement('vehicleCategory', 'select');
categorySelect.options = [
  { value: 'Any Available', text: 'Any Available (Comfort AC)' },
  { value: 'Sedan (AC)', text: 'Sedan (AC)' },
  { value: 'SUV / MUV (AC)', text: 'SUV / MUV (AC)' },
  { value: 'Compact City Cab', text: 'Compact City Cab' },
  { value: 'Custom Group / Tempo Traveller', text: 'Custom Group / Tempo Traveller' }
];

const vehicleSelect = getOrCreateElement('vehiclePreference', 'select');
vehicleSelect.options = [
  { value: 'Any Available (Comfort AC)', text: 'Any Available (Comfort AC)' },
  { value: 'Toyota Etios — Sedan', text: 'Toyota Etios — Sedan' },
  { value: 'Toyota Innova Crysta — MUV', text: 'Toyota Innova Crysta — MUV' },
  { value: 'Maruti Suzuki Ertiga — MUV', text: 'Maruti Suzuki Ertiga — MUV' },
  { value: 'Toyota Rumion — MUV', text: 'Toyota Rumion — MUV' },
  { value: 'Toyota Innova Hycross — MUV', text: 'Toyota Innova Hycross — MUV' },
  { value: 'Custom Group Vehicle (Tempo Traveller)', text: 'Custom Group Vehicle (Tempo Traveller)' }
];

// Mock DOM
global.window = {
  location: { href: '' },
  open: function(url, target) {
    this.openedUrl = url;
    return { closed: false };
  }
};
global.document = {
  getElementById: function(id) { return elements[id] || null; },
  querySelectorAll: function(selector) { return []; },
  querySelector: function(selector) { return null; },
  addEventListener: function(event, fn) {},
  body: { style: {} }
};
global.navigator = { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };

// Load modules
require('./js/config.js');
require('./js/whatsapp.js');
require('./js/booking.js');

const wa = global.window.SafeWayWhatsApp;
const booking = global.window.SafeWayBooking;

assert(wa, 'SafeWayWhatsApp must be loaded');
assert(booking, 'SafeWayBooking must be loaded');

// TEST 1: WhatsApp Message Generation Template
console.log('TEST 1: Testing exact WhatsApp message template and defaults...');
const sampleBooking = {
  name: 'Priya Sharma',
  phone: '9876543210',
  email: '',
  serviceType: 'Airport Transfer',
  pickup: 'Koramangala 4th Block',
  dropoff: 'BLR Kempegowda International Airport',
  date: '2026-10-25',
  time: '04:00',
  passengers: '2',
  vehicleCategory: 'SUV / MUV (AC)',
  vehicleModel: 'Toyota Innova Crysta — MUV',
  notes: 'Need early morning pickup, infant traveling'
};

const generatedMsg = wa.generateBookingMessage(sampleBooking);
console.log('\n--- Generated Message ---');
console.log(generatedMsg);
console.log('-------------------------\n');

const expectedTemplateLines = [
  "Hello SafeWay Travels! I would like to request a cab booking.",
  "",
  "Customer Name: Priya Sharma",
  "Mobile Number: 9876543210",
  "Email: Not provided",
  "Service Type: Airport Transfer",
  "Pickup Location: Koramangala 4th Block",
  "Drop-off Location: BLR Kempegowda International Airport",
  "Travel Date: 2026-10-25",
  "Pickup Time: 04:00",
  "Passengers: 2",
  "Vehicle Category: SUV / MUV (AC)",
  "Preferred Vehicle: Toyota Innova Crysta — MUV",
  "Additional Requirements: Need early morning pickup, infant traveling",
  "",
  "Please confirm availability and share the fare details. Thank you."
];

assert.strictEqual(generatedMsg, expectedTemplateLines.join("\n"), "Generated WhatsApp message must match exact format");
console.log('[PASS] WhatsApp message format matches required template line-for-line.');

// TEST 2: WhatsApp URL and Phone Destination
console.log('\nTEST 2: Testing WhatsApp URL generation...');
const waUrl = wa.buildWhatsAppUrl(generatedMsg);
assert(waUrl.startsWith('https://wa.me/919980838845?text='), 'Target WhatsApp URL must use business number 919980838845');
assert(waUrl.includes(encodeURIComponent('Hello SafeWay Travels! I would like to request a cab booking.')), 'Message must be URL-encoded');
assert(waUrl.includes(encodeURIComponent('Customer Name: Priya Sharma')), 'Encoded customer name must be in URL');
console.log('[PASS] WhatsApp URL correctly formatted to 919980838845 with full encoding.');

// TEST 3: Vehicle Selection & Category Synchronization
console.log('\nTEST 3: Testing vehicle selection and category auto-fill...');
booking.init();

// Select Innova Crysta
booking.selectVehicle('Toyota Innova Crysta — MUV', false);
assert(elements['vehicleCategory'].selectedIndex > 0, 'Vehicle Category must be auto-selected');
assert(elements['vehicleCategory'].options[elements['vehicleCategory'].selectedIndex].value.includes('SUV'), 'Category must be SUV/MUV for Crysta');
assert.strictEqual(elements['selectedVehicleDisplay'].textContent, 'Toyota Innova Crysta — MUV', 'Selected vehicle banner display must update');
console.log('[PASS] Selecting Crysta auto-fills SUV/MUV Category and updates banner.');

// Select Etios
booking.selectVehicle('Toyota Etios — Sedan', false);
assert(elements['vehicleCategory'].options[elements['vehicleCategory'].selectedIndex].value.includes('Sedan'), 'Category must be Sedan for Etios');
console.log('[PASS] Selecting Etios auto-fills Sedan Category.');

// Select Tempo Traveller
booking.selectVehicle('Custom Group Vehicle (Tempo Traveller)', false);
assert(elements['vehicleCategory'].options[elements['vehicleCategory'].selectedIndex].value.includes('Group') || elements['vehicleCategory'].options[elements['vehicleCategory'].selectedIndex].value.includes('Tempo'), 'Category must be Custom Group/Tempo Traveller');
console.log('[PASS] Selecting Tempo Traveller auto-fills Custom Group Category.');

// TEST 4: Form Validation
console.log('\nTEST 4: Testing Form Validation...');

// 4a: Incomplete form (missing name, phone, etc.)
elements['customerName'].value = '';
elements['customerPhone'].value = '';
elements['serviceType'].value = '';
elements['pickupLocation'].value = '';
elements['travelDate'].value = '';
elements['pickupTime'].value = '';

const isInvalidValid = booking.validateForm();
assert.strictEqual(isInvalidValid, false, 'Validation must fail when required fields are empty');
assert.strictEqual(elements['customerName'].classList.contains('input-error'), true, 'customerName must have input-error class');
assert(elements['customerNameError'].textContent.length > 0, 'customerNameError must show error message');
assert.strictEqual(elements['customerPhone'].classList.contains('input-error'), true, 'customerPhone must have input-error class');
console.log('[PASS] Incomplete form submission correctly blocked with inline error messages.');

// 4b: Past travel date validation
elements['customerName'].value = 'Anand Verma';
elements['customerPhone'].value = '9876543210';
elements['serviceType'].value = 'Local Cab Service';
elements['pickupLocation'].value = 'Indiranagar';
elements['travelDate'].value = '2020-01-01'; // Past date!
elements['pickupTime'].value = '10:00';
elements['passengerCount'].value = '2';

const pastDateValid = booking.validateForm();
assert.strictEqual(pastDateValid, false, 'Validation must fail for travel dates in the past');
assert(elements['travelDateError'].textContent.includes('past'), 'travelDateError must warn about past date');
console.log('[PASS] Past travel date (2020-01-01) correctly blocked.');

// 4c: Complete valid form
elements['travelDate'].value = '2026-12-01'; // Future date
const validFormResult = booking.validateForm();
assert.strictEqual(validFormResult, true, 'Validation must pass for complete valid form data');
console.log('[PASS] Complete form with future travel date successfully passes validation.');

// TEST 5: Form Submission and WhatsApp send trigger
console.log('\nTEST 5: Testing Form Submission triggers sendBookingToWhatsApp...');
let submitFired = false;
let dispatchedUrl = '';

// Trigger submit
const submitEvent = {
  preventDefault: () => { submitFired = true; }
};
elements['bookingForm'].dispatchEvent({ type: 'submit', preventDefault: () => {} });

assert(global.window.openedUrl.startsWith('https://wa.me/919980838845'), 'Form submission must trigger WhatsApp redirection to 919980838845');
assert(elements['bookingModal'].classList.contains('modal-open'), 'Modal must open on submission');
assert(elements['btnContinueWhatsApp'].href.startsWith('https://wa.me/919980838845'), 'Fallback button must have valid WhatsApp URL');
console.log('[PASS] Form submit triggers WhatsApp redirect and populates modal with clickable fallback URL.');

console.log('\n===============================================================');
console.log('>>> ALL 5 ADVANCED VERIFICATION TESTS PASSED SUCCESSFULLY! <<<');
console.log('===============================================================\n');
