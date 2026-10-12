/**
 * SafeWay Travels - Centralized Business Configuration & Data
 * ============================================================
 * "25 Years of Comfort & Trust"
 *
 * NOTE FOR OWNER / DEVELOPER:
 * You can edit all business details, fleet items, pricing packages,
 * testimonials, and contact information directly in this file without
 * modifying any HTML or CSS layout.
 */

const SafeWayConfig = {
  // 1. BUSINESS & CONTACT DETAILS
  business: {
    name: "SafeWay Travels",
    legalNote: "Bengaluru-based private cab & travel services",
    tagline: "25 Years of Comfort & Trust",
    yearsOfExperience: 25,
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    fullAddress: "Bengaluru, Karnataka, India", // Owner can add specific area/address here
    phoneRaw: "9980838845",
    phoneDisplay: "+91 99808 38845",
    whatsappRaw: "9980838845",
    whatsappDisplay: "+91 99808 38845",
    email: "ways63098@gmail.com",
    serviceHours: "24/7 Cab & Airport Transfer Service",
    heroHeadline: "Reliable Travel. Comfortable Journeys. Trusted for 25 Years.",
    heroSubheadline: "SafeWay Travels provides reliable local, airport and outstation cab services across Bengaluru with a focus on safety, comfort and dependable service.",
    aboutHeading: "25 Years on the Road. Built on Trust.",
    aboutOwnerNote: "Founded and operated with over 25 years of hands-on professional driving experience, SafeWay Travels was built on a simple promise: arrive safely, travel comfortably, and treat every passenger with respect and honesty.",
    driverImage: "assets/images/driver_placeholder.svg" // Replace with actual driver photo e.g. "assets/images/driver-photo.jpg"
  },

  // 2. PRIMARY SERVICES
  services: [
    {
      id: "local",
      code: "Local Cab Service",
      title: "Local Cab Service",
      tag: "City Travel",
      shortDesc: "Comfortable transportation within Bengaluru for daily travel, appointments, shopping, business trips and other local journeys.",
      highlights: [
        "Doorstep pickup across Bengaluru",
        "Deep knowledge of city traffic & optimal routes",
        "Clean, sanitized and air-conditioned travel",
        "Flexible hourly or point-to-point rides"
      ],
      icon: "car",
      ctaText: "Book Local Cab",
      defaultTripType: "Local"
    },
    {
      id: "airport",
      code: "Airport Transfers",
      title: "Airport Transfers",
      tag: "BLR Kempegowda Airport",
      popular: true,
      shortDesc: "Reliable airport pickup and drop services. Prompt, stress-free transfers scheduled around your flights.",
      highlights: [
        "Punctual on-time pickups — zero missed flights",
        "24/7 early morning & late night availability",
        "Flight schedule tracking & buffer time",
        "Spacious luggage accommodation"
      ],
      icon: "plane",
      ctaText: "Book Airport Transfer",
      defaultTripType: "Airport"
    },
    {
      id: "outstation",
      code: "Outstation Travel",
      title: "Outstation Travel",
      tag: "Intercity Journeys",
      shortDesc: "Comfortable long-distance journeys from Bengaluru to other destinations across Karnataka and South India.",
      highlights: [
        "25+ years highway & ghat section driving experience",
        "Well-maintained vehicles tested for long routes",
        "Custom itinerary & sightseeing flexibility",
        "Transparent outstation driver allowance & km billing"
      ],
      icon: "map",
      ctaText: "Book Outstation Cab",
      defaultTripType: "Outstation"
    },
    {
      id: "roundTrip",
      code: "Round Trips",
      title: "Round Trips",
      tag: "Return Travel",
      shortDesc: "Convenient round-trip travel for family trips, business travel, tourism, and personal journeys.",
      highlights: [
        "Same dedicated, trusted driver throughout your trip",
        "Flexible return timings tailored to your schedule",
        "Economical round-trip pricing quotes",
        "Safe family-friendly journey with zero stress"
      ],
      icon: "repeat",
      ctaText: "Book Round Trip",
      defaultTripType: "Round Trip"
    }
  ],

  // 3. FLEET DATA STRUCTURE
  // Exact vehicles available for booking with authentic exterior & interior photos
  // Vehicle images represent reference fleet models.
  fleet: {
    sectionNotice: "Vehicle images for reference. We maintain a versatile fleet of comfortable, sanitized AC vehicles. Representative model photographs shown; exact models confirmed upon inquiry.",
    referenceNoticeText: "Vehicle images for reference",
    vehicles: [
      {
        id: "toyota_etios",
        vehicleName: "Toyota Etios",
        bookingValue: "Toyota Etios — Sedan",
        category: "Sedan",
        vehicleType: "Sedan (AC)",
        seatingCapacity: "4 Passengers + 1 Driver",
        luggageCapacity: "2 Large Bags + Hand Luggage",
        airConditioning: "Fully Air Conditioned",
        description: "Smooth, comfortable sedan with generous boot space. A trusted choice for airport transfers, corporate visits, and Bengaluru city travel.",
        exteriorImage: "assets/images/fleet/toyota_etios_exterior.jpg",
        interiorImage: "assets/images/fleet/toyota_etios_interior.jpg",
        exteriorAlt: "Toyota Etios sedan exterior view",
        interiorAlt: "Toyota Etios dashboard and cabin interior view",
        statusText: "Available for Booking",
        referenceNotice: "Vehicle image for reference",
        isComingSoon: false
      },
      {
        id: "toyota_innova_crysta",
        vehicleName: "Toyota Innova Crysta",
        bookingValue: "Toyota Innova Crysta — MUV",
        category: "SUV / MUV",
        vehicleType: "MUV (AC)",
        seatingCapacity: "6 - 7 Passengers + 1 Driver",
        luggageCapacity: "4 Large Bags + Hand Luggage",
        airConditioning: "Dual AC Vents (Front & Rear)",
        description: "The gold standard for highway road trips and family comfort. Exceptional cabin legroom, plush reclining seats, and dependable highway performance.",
        exteriorImage: "assets/images/fleet/toyota_innova_crysta_exterior.jpg",
        interiorImage: "assets/images/fleet/toyota_innova_crysta_interior.jpg",
        exteriorAlt: "Toyota Innova Crysta MUV exterior view",
        interiorAlt: "Toyota Innova Crysta premium interior cabin view",
        statusText: "Available for Booking",
        referenceNotice: "Vehicle image for reference",
        isComingSoon: false
      },
      {
        id: "maruti_suzuki_ertiga",
        vehicleName: "Maruti Suzuki Ertiga",
        bookingValue: "Maruti Suzuki Ertiga — MUV",
        category: "SUV / MUV",
        vehicleType: "MUV (AC)",
        seatingCapacity: "6 Passengers + 1 Driver",
        luggageCapacity: "2 - 3 Medium Bags + Hand Luggage",
        airConditioning: "Dual AC with Roof Blowers",
        description: "Versatile, economical 6-seater MUV with flexible seating. Outstanding city agility and comfort for family airport drops and weekend outstation trips.",
        exteriorImage: "assets/images/fleet/maruti_suzuki_ertiga_exterior.jpg",
        interiorImage: "assets/images/fleet/maruti_suzuki_ertiga_interior.jpg",
        exteriorAlt: "Maruti Suzuki Ertiga MUV exterior view",
        interiorAlt: "Maruti Suzuki Ertiga cabin interior view",
        statusText: "Available for Booking",
        referenceNotice: "Vehicle image for reference",
        isComingSoon: false
      },
      {
        id: "toyota_rumion",
        vehicleName: "Toyota Rumion",
        bookingValue: "Toyota Rumion — MUV",
        category: "SUV / MUV",
        vehicleType: "MUV (AC)",
        seatingCapacity: "6 Passengers + 1 Driver",
        luggageCapacity: "2 - 3 Medium Bags + Hand Luggage",
        airConditioning: "Automatic Climate Control & Rear AC",
        description: "Modern, refined 6-seater family MUV engineered with proven Toyota comfort. Features smooth suspension, comfortable 3-row seating, and quiet cabin.",
        exteriorImage: "assets/images/fleet/toyota_rumion_exterior.jpg",
        interiorImage: "assets/images/fleet/toyota_rumion_interior.png",
        exteriorAlt: "Toyota Rumion MUV exterior view",
        interiorAlt: "Toyota Rumion cabin interior view",
        statusText: "Available for Booking",
        referenceNotice: "Vehicle image for reference",
        isComingSoon: false
      },
      {
        id: "toyota_innova_hycross",
        vehicleName: "Toyota Innova Hycross",
        bookingValue: "Toyota Innova Hycross — MUV",
        category: "SUV / MUV",
        vehicleType: "MUV (AC)",
        seatingCapacity: "6 - 7 Passengers + 1 Driver",
        luggageCapacity: "4 Large Bags + Hand Luggage",
        airConditioning: "Multi-Zone Automatic Climate Control",
        description: "Latest-generation premium vehicle delivering ultra-smooth ride quality, whisper-quiet cabin acoustics, expansive legroom, and first-class comfort.",
        exteriorImage: "assets/images/fleet/toyota_innova_hycross_exterior.jpg",
        interiorImage: "assets/images/fleet/toyota_innova_hycross_interior.jpg",
        exteriorAlt: "Toyota Innova Hycross modern premium MUV exterior view",
        interiorAlt: "Toyota Innova Hycross luxury cabin interior view",
        statusText: "Available for Booking",
        referenceNotice: "Vehicle image for reference",
        isComingSoon: false
      }
    ]
  },

  // 4. PRICING DATA STRUCTURE
  // IMPORTANT: Exact prices are NOT being entered yet.
  // We DO NOT display fake prices. Transparent placeholder quote structure is provided.
  pricing: {
    noticeHeading: "Honest & Transparent Fare Quotes",
    noticeBody: "At SafeWay Travels, we do not believe in hidden charges, unexpected platform fees, or peak surge shocks. Because routes, luggage, timing, and travel duration vary, please request an exact upfront fare quote via WhatsApp or phone call.",
    categories: [
      {
        id: "local",
        title: "Local Packages",
        subtitle: "Bengaluru City Travel",
        priceBadge: "Price details on request",
        pricingModel: "Hourly / KM-based options",
        summary: "Affordable transparent rates customized for local city requirements.",
        features: [
          "Doorstep pickup & drop within Bengaluru",
          "AC on throughout the ride",
          "Clean car and professional driving",
          "No hidden platform commission fees",
          "Custom multi-stop stops supported"
        ],
        ctaText: "Get Local Fare Quote"
      },
      {
        id: "airport",
        title: "Airport Packages",
        subtitle: "BLR Kempegowda Airport",
        priceBadge: "Transparent Fixed Quotes",
        pricingModel: "One-way Pickup or Drop",
        popular: true,
        summary: "Punctual airport transfers with zero delay tolerance and complete route clarity.",
        features: [
          "Door-to-terminal pickup and drop",
          "Toll & parking clarity discussed upfront",
          "Flight delay assistance & driver coordination",
          "Spacious trunk space for international luggage",
          "Zero midnight cancellation fears"
        ],
        ctaText: "Get Airport Quote"
      },
      {
        id: "roundTrip",
        title: "Outstation & Round-Trip",
        subtitle: "Inter-city & Tourism Packages",
        priceBadge: "Custom Trip Quote",
        pricingModel: "Per-km + Driver Allowance",
        summary: "Comfortable long-distance travel backed by 25+ years of highway driving experience.",
        features: [
          "Clear per-kilometer transparent billing",
          "Driver food and accommodation allowance clarity",
          "Flexible halts for tea, meals, and sightseeing",
          "Well-maintained vehicle for safe highway journeys",
          "Round-trip multi-day packages available"
        ],
        ctaText: "Get Outstation Quote"
      }
    ]
  },

  // 5. TESTIMONIALS (SAMPLE REVIEWS - EDITABLE)
  // Labeled clearly as sample reviews until the owner adds verified customer reviews
  testimonials: {
    badgeText: "Sample Customer Experiences",
    note: "These are sample customer reviews representing typical passenger feedback. The business owner can update these with actual customer testimonials.",
    reviews: [
      {
        id: 1,
        author: "K. R. Narayanan",
        location: "Koramangala, Bengaluru",
        tripType: "Airport Transfer (Early Morning)",
        label: "Sample Customer Review",
        stars: 5,
        content: "Booked an airport drop at 3:30 AM. SafeWay Travels arrived 10 minutes ahead of schedule. The driver was extremely polite, drove smoothly on the Bellary Road expressway, and helped with our heavy luggage. Absolute peace of mind."
      },
      {
        id: 2,
        author: "Deepa & Ramesh",
        location: "Indiranagar, Bengaluru",
        tripType: "Outstation Round-Trip (Coorg)",
        label: "Sample Customer Review",
        stars: 5,
        content: "You can truly feel the 25 years of driving experience. On the winding ghat roads to Madikeri, the driving was exceptionally calm, steady, and safe. My elderly parents were very comfortable throughout the 3-day round trip."
      },
      {
        id: 3,
        author: "Siddharth V.",
        location: "Whitefield, Bengaluru",
        tripType: "Local Full-Day City Travel",
        label: "Sample Customer Review",
        stars: 5,
        content: "Had multiple client meetings across Whitefield, Electronic City, and CBD. Booking through WhatsApp was instant. No surge price gimmicks, clean AC cab, and patient navigation through Bengaluru traffic."
      }
    ]
  },

  // 6. TRUST & SAFETY PILLARS
  trustPillars: [
    {
      metric: "25+ Years",
      title: "Driving Experience",
      desc: "Decades of proven driving experience across Bengaluru city roads and South Indian highways."
    },
    {
      metric: "100%",
      title: "Transparent Pricing",
      desc: "Clear upfront quotes with honest discussions on tolls, parking, and route estimates."
    },
    {
      metric: "Safety First",
      title: "Reliable Journeys",
      desc: "Responsible driving speed, well-maintained vehicles, and passenger safety as top priority."
    },
    {
      metric: "Customer Focused",
      title: "Comfortable Travel",
      desc: "Punctual doorstep pickups, courteous communication, and clean, sanitized vehicles."
    }
  ],

  // 7. WHY CHOOSE SAFEWAY TRAVELS
  whyChooseUs: [
    {
      icon: "award",
      title: "25 Years of Experience",
      desc: "Decades of professional driving expertise means safe maneuvering, intimate route knowledge, and calm driving in all weather and traffic conditions."
    },
    {
      icon: "shield",
      title: "Safety & Responsibility First",
      desc: "Your safety is our utmost priority. Responsible driving habits, regular vehicle inspections, and respectful passenger etiquette."
    },
    {
      icon: "dollar-sign",
      title: "Transparent Pricing",
      desc: "Clear pricing with no unexpected hidden charges, no sudden cancellation penalties, and no surge pricing games."
    },
    {
      icon: "heart",
      title: "Customer First Mentality",
      desc: "Dedicated personal service where every journey is treated with care. Whether a solo commuter or a family with elders, comfort is assured."
    },
    {
      icon: "compass",
      title: "Multiple Travel Options",
      desc: "Comprehensive coverage for local city travel, Kempegowda Airport transfers, outstation destinations, and multi-day round trips."
    },
    {
      icon: "message-circle",
      title: "Easy WhatsApp & Direct Booking",
      desc: "No apps to download, no accounts to create, and no confusing OTPs. Fill in your details and connect directly with the driver on WhatsApp."
    }
  ],

  // 8. FAQS (Clear and honest)
  faqs: [
    {
      q: "How does booking work without online payment?",
      a: "Simply fill out our booking form with your trip details and tap 'Book a Cab'. Your request is structured and sent directly to our WhatsApp (+91 9980838845). We confirm vehicle availability, share your fare quote, and confirm the booking immediately."
    },
    {
      q: "Is submitting the website form a confirmed booking?",
      a: "No, submitting the form creates a formal 'Booking Request'. Because every cab is personally dispatched, we confirm driver and vehicle availability directly through WhatsApp or a phone call before confirming your trip."
    },
    {
      q: "Do you offer early morning or late night airport pickups?",
      a: "Yes! Airport transfers operate 24/7. We recommend booking in advance so your cab is assigned and arrives punctually with extra buffer time."
    },
    {
      q: "What destinations do you cover for outstation trips?",
      a: "We travel from Bengaluru to anywhere in Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, and Telangana, including popular routes like Mysuru, Coorg, Ooty, Chikmagalur, Tirupati, and Chennai."
    },
    {
      q: "How are tolls, interstate permits, and parking handled?",
      a: "All toll charges, state permits (for outstation trips), and airport parking fees are transparently communicated when we share your quote, so there are never any surprises."
    }
  ]
};

// Export to window for global browser usage
if (typeof window !== "undefined") {
  window.SafeWayConfig = SafeWayConfig;
}
