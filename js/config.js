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
  // IMPORTANT: The exact vehicle models and images have not been provided yet.
  // This structure allows the business owner to add exact vehicle models, photos,
  // capacities, and descriptions whenever ready.
  fleet: {
    sectionNotice: "Fleet details are being updated. Multiple comfortable AC vehicle categories are available on request.",
    vehicles: [
      {
        id: "sedan",
        vehicleName: "Comfort Sedan", // Owner can change to exact model (e.g., Swift Dzire / Etios)
        vehicleType: "Sedan (AC)",
        seatingCapacity: "4 Passengers + 1 Driver",
        luggageCapacity: "2 Medium Bags + Hand Luggage",
        airConditioning: "Fully Air Conditioned",
        description: "Ideal for city commutes, business trips, and comfortable airport drops with trunk space.",
        vehicleImage: "", // Leave empty for polished placeholder, or add image URL e.g. "assets/images/fleet/sedan.jpg"
        statusText: "Available for Booking",
        isComingSoon: false,
        editablePlaceholderTag: "Sedan Category"
      },
      {
        id: "suv",
        vehicleName: "Spacious Family SUV", // Owner can change to exact model (e.g., Innova / Ertiga)
        vehicleType: "SUV / MUV (AC)",
        seatingCapacity: "6 - 7 Passengers + 1 Driver",
        luggageCapacity: "3-4 Large Bags",
        airConditioning: "Dual AC Vents",
        description: "Extra legroom and spacious luggage capacity. Perfect for family outstation travel and group airport transfers.",
        vehicleImage: "", // Owner can add photo
        statusText: "Available for Booking",
        isComingSoon: false,
        editablePlaceholderTag: "SUV Category"
      },
      {
        id: "hatchback",
        vehicleName: "Compact City Cab", // Owner can change to exact model (e.g., WagonR / Tiago)
        vehicleType: "Hatchback (AC)",
        seatingCapacity: "3 - 4 Passengers + 1 Driver",
        luggageCapacity: "1-2 Bags",
        airConditioning: "Fully Air Conditioned",
        description: "Quick, economical travel for city errands, daily office visits, and light luggage travel in Bengaluru.",
        vehicleImage: "", // Owner can add photo
        statusText: "Available for Booking",
        isComingSoon: false,
        editablePlaceholderTag: "Hatchback Category"
      },
      {
        id: "custom",
        vehicleName: "Custom Group Vehicle",
        vehicleType: "Tempo / Premium (AC)",
        seatingCapacity: "Arranged on Request",
        luggageCapacity: "Custom Luggage Space",
        airConditioning: "Fully Air Conditioned",
        description: "Traveling with a larger group or specific vehicle requirement? Request custom vehicle arrangements directly.",
        vehicleImage: "",
        statusText: "On Request",
        isComingSoon: false,
        editablePlaceholderTag: "Custom Travel"
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
