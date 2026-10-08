/**
 * SafeWay Travels - WhatsApp Integration & Generator
 * ===================================================
 * Generates properly URL-encoded WhatsApp messages and opens WhatsApp
 * on mobile apps or WhatsApp Web on desktop browsers.
 */

const SafeWayWhatsApp = (function () {
  const DEFAULT_PHONE = "919980838845"; // International format for wa.me (+91 9980838845)

  /**
   * Generates formatted WhatsApp text for booking requests
   */
  function generateBookingMessage(details) {
    const name = (details.name || "").trim();
    const phone = (details.phone || "").trim();
    const email = (details.email || "").trim();
    const service = (details.service || "").trim();
    const pickup = (details.pickup || "").trim();
    const drop = (details.drop || "").trim();
    const date = (details.date || "").trim();
    const time = (details.time || "").trim();
    const passengers = details.passengers || "1";
    const vehicle = (details.vehicle || "Any Available (Comfort AC)").trim();
    const specialRequests = (details.specialRequests || "None").trim();

    let message = `Hello SafeWay Travels,\n`;
    message += `I would like to book a cab.\n\n`;
    message += `Customer Details:\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    if (email) {
      message += `Email: ${email}\n`;
    }
    message += `\nTrip Details:\n`;
    message += `Service: ${service}\n`;
    message += `Pickup: ${pickup}\n`;
    message += `Drop: ${drop}\n`;
    message += `Date: ${date}\n`;
    message += `Time: ${time}\n`;
    message += `Passengers: ${passengers}\n`;
    message += `Vehicle Preference: ${vehicle}\n\n`;
    message += `Special Requests:\n${specialRequests}\n\n`;
    message += `Thank you.`;

    return message;
  }

  /**
   * Detects if device is likely mobile for optimal WhatsApp URL
   */
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Builds the target URL for WhatsApp
   */
  function buildWhatsAppUrl(message, phone = DEFAULT_PHONE) {
    const encodedMessage = encodeURIComponent(message);
    // Universal wa.me URL works seamlessly on both mobile app and desktop redirect
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  }

  /**
   * Opens WhatsApp with a given message
   */
  function openWhatsApp(message, phone = DEFAULT_PHONE) {
    const url = buildWhatsAppUrl(message, phone);
    window.open(url, "_blank", "noopener,noreferrer");
    return url;
  }

  /**
   * Quick general inquiry WhatsApp link
   */
  function openGeneralInquiry(customText) {
    const defaultText = "Hello SafeWay Travels, I would like to inquire about cab booking in Bengaluru.";
    const message = customText || defaultText;
    openWhatsApp(message);
  }

  return {
    generateBookingMessage,
    buildWhatsAppUrl,
    openWhatsApp,
    openGeneralInquiry,
    isMobileDevice
  };
})();

if (typeof window !== "undefined") {
  window.SafeWayWhatsApp = SafeWayWhatsApp;
}
