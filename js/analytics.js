/**
 * SafeWay Travels - Analytics & Event Tracking Helper
 * ====================================================
 * Lightweight, privacy-first event tracking dispatcher.
 * Integrates cleanly with Google Analytics / Meta Pixel if added later,
 * while safely logging to internal diagnostic queue during development.
 */

const SafeWayAnalytics = (function () {
  const eventsLog = [];

  function trackEvent(eventName, eventParams = {}) {
    const payload = {
      event: eventName,
      params: eventParams,
      timestamp: new Date().toISOString()
    };

    eventsLog.push(payload);

    // If Google Analytics (gtag) or dataLayer exists in the future
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, eventParams);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...eventParams
      });
    }

    // Diagnostic console trace in development
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.log(`[Analytics] Tracked: "${eventName}"`, eventParams);
    }
  }

  function getEventsHistory() {
    return [...eventsLog];
  }

  return {
    trackEvent,
    getEventsHistory
  };
})();

if (typeof window !== "undefined") {
  window.SafeWayAnalytics = SafeWayAnalytics;
}
