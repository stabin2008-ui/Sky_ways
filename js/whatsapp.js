/**
 * SafeWay Travels - WhatsApp Integration & Generator
 * ===================================================
 * Generates properly URL-encoded WhatsApp messages and opens WhatsApp
 * on mobile apps or WhatsApp Web on desktop browsers.
 * Business WhatsApp number: 919980838845
 */

const SafeWayWhatsApp = (function () {
  const DEFAULT_PHONE = "919980838845"; // International format for wa.me (+91 9980838845)

  /**
   * Generates formatted WhatsApp text for booking requests matching exact required format:
   * 
   * Hello SafeWay Travels! I would like to request a cab booking.
   * 
   * Customer Name: [customer name]
   * Mobile Number: [customer phone]
   * Email: [email or Not provided]
   * Service Type: [selected service]
   * Pickup Location: [pickup]
   * Drop-off Location: [drop-off]
   * Travel Date: [date]
   * Pickup Time: [time]
   * Passengers: [number]
   * Vehicle Category: [category]
   * Preferred Vehicle: [selected model]
   * Additional Requirements: [requirements or None]
   * 
   * Please confirm availability and share the fare details. Thank you.
   */
  function generateBookingMessage(booking) {
    if (!booking) booking = {};

    const name = (booking.name || booking.customerName || "").trim();
    const phone = (booking.phone || booking.customerPhone || "").trim();
    const email = (booking.email || booking.customerEmail || "").trim();
    const serviceType = (booking.serviceType || booking.service || "").trim();
    const pickup = (booking.pickup || booking.pickupLocation || "").trim();
    const dropoff = (booking.dropoff || booking.drop || booking.dropLocation || "").trim();
    const date = (booking.date || booking.travelDate || "").trim();
    const time = (booking.time || booking.pickupTime || "").trim();
    const passengers = booking.passengers || booking.passengerCount || "1";
    const vehicleCategory = (booking.vehicleCategory || booking.category || "").trim();
    const vehicleModel = (booking.vehicleModel || booking.vehicle || booking.vehiclePreference || "").trim();
    const notes = (booking.notes || booking.specialRequests || "").trim();

    const messageLines = [
      "Hello SafeWay Travels! I would like to request a cab booking.",
      "",
      `Customer Name: ${name}`,
      `Mobile Number: ${phone}`,
      `Email: ${email || "Not provided"}`,
      `Service Type: ${serviceType}`,
      `Pickup Location: ${pickup}`,
      `Drop-off Location: ${dropoff || "Not specified"}`,
      `Travel Date: ${date}`,
      `Pickup Time: ${time}`,
      `Passengers: ${passengers}`,
      `Vehicle Category: ${vehicleCategory || "Not selected"}`,
      `Preferred Vehicle: ${vehicleModel || "Not selected"}`,
      `Additional Requirements: ${notes || "None"}`,
      "",
      "Please confirm availability and share the fare details. Thank you."
    ];

    return messageLines.join("\n");
  }

  /**
   * Detects if device is mobile for optimal WhatsApp URL opening
   */
  function isMobileDevice() {
    if (typeof navigator === "undefined" || !navigator.userAgent) return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Builds the target URL for WhatsApp with encodeURIComponent
   */
  function buildWhatsAppUrl(message, phone = DEFAULT_PHONE) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  }

  /**
   * Executes the WhatsApp booking integration logic:
   * Encodes message, builds URL and redirects / launches WhatsApp.
   * Returns metadata and target URL for fallback UI.
   */
  function sendBookingToWhatsApp(booking, phone = DEFAULT_PHONE) {
    const message = generateBookingMessage(booking);
    const whatsappUrl = buildWhatsAppUrl(message, phone);

    let opened = false;
    try {
      if (typeof window !== "undefined") {
        if (isMobileDevice()) {
          // On mobile, window.location.href triggers native WhatsApp app directly
          window.location.href = whatsappUrl;
          opened = true;
        } else {
          // On desktop, open in new tab so user preserves current website state
          const win = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
          if (win && !win.closed) {
            opened = true;
          } else {
            // Popup blocker prevented opening new window, fallback to href
            window.location.href = whatsappUrl;
            opened = true;
          }
        }
      }
    } catch (err) {
      console.warn("Could not automatically redirect to WhatsApp:", err);
      opened = false;
    }

    return {
      url: whatsappUrl,
      message: message,
      opened: opened
    };
  }

  /**
   * Opens WhatsApp with a given message
   */
  function openWhatsApp(message, phone = DEFAULT_PHONE) {
    const url = buildWhatsAppUrl(message, phone);
    if (typeof window !== "undefined") {
      if (isMobileDevice()) {
        window.location.href = url;
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    }
    return url;
  }

  /**
   * Quick general inquiry WhatsApp link
   */
  function openGeneralInquiry(customText) {
    const defaultText = "Hello SafeWay Travels! I would like to inquire about cab booking in Bengaluru.";
    const message = customText || defaultText;
    openWhatsApp(message);
  }

  return {
    generateBookingMessage,
    buildWhatsAppUrl,
    sendBookingToWhatsApp,
    openWhatsApp,
    openGeneralInquiry,
    isMobileDevice
  };
})();

if (typeof window !== "undefined") {
  window.SafeWayWhatsApp = SafeWayWhatsApp;
}
