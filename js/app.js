/**
 * SafeWay Travels - Main Application Bootstrap
 * ============================================
 * Orchestrates UI rendering, booking listeners, analytics hooks,
 * and service card actions.
 */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Initialize UI elements & dynamic renderers
  if (window.SafeWayUI) {
    window.SafeWayUI.init();
  }

  // 2. Initialize Booking system
  if (window.SafeWayBooking) {
    window.SafeWayBooking.init();
  }

  // 3. Bind Service Card CTA Buttons
  document.querySelectorAll(".btn-service-action").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const serviceTarget = this.getAttribute("data-service-target");
      if (window.SafeWayBooking) {
        window.SafeWayBooking.selectService(serviceTarget, true);
        if (window.SafeWayUI) {
          window.SafeWayUI.showToast(`Selected "${serviceTarget}" for booking`);
        }
      }
    });
  });

  // 4. Hero Quick Booking & WhatsApp buttons
  const heroBookBtn = document.getElementById("heroBookBtn");
  if (heroBookBtn) {
    heroBookBtn.addEventListener("click", function () {
      if (window.SafeWayBooking) {
        window.SafeWayBooking.scrollToBookingSection();
      }
      if (window.SafeWayAnalytics) {
        window.SafeWayAnalytics.trackEvent("hero_book_clicked");
      }
    });
  }

  const heroWhatsAppBtn = document.getElementById("heroWhatsAppBtn");
  if (heroWhatsAppBtn) {
    heroWhatsAppBtn.addEventListener("click", function () {
      if (window.SafeWayWhatsApp) {
        window.SafeWayWhatsApp.openGeneralInquiry("Hello SafeWay Travels, I am planning a trip in Bengaluru and would like to check cab availability.");
      }
      if (window.SafeWayAnalytics) {
        window.SafeWayAnalytics.trackEvent("hero_whatsapp_clicked");
      }
    });
  }

  // 5. Contact Section Form handler (Quick inquiry to WhatsApp)
  const contactForm = document.getElementById("contactInquiryForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = (document.getElementById("contactName")?.value || "").trim();
      const phone = (document.getElementById("contactPhone")?.value || "").trim();
      const message = (document.getElementById("contactMessage")?.value || "").trim();

      if (!name || !phone) {
        if (window.SafeWayUI) {
          window.SafeWayUI.showToast("Please enter your name and phone number.");
        }
        return;
      }

      const inquiryText = `Hello SafeWay Travels,\n\nI have an inquiry from your website.\nName: ${name}\nPhone: ${phone}\nMessage: ${message || "Interested in your cab services."}\n\nThank you.`;
      
      if (window.SafeWayWhatsApp) {
        window.SafeWayWhatsApp.openWhatsApp(inquiryText);
      }
      contactForm.reset();
      if (window.SafeWayUI) {
        window.SafeWayUI.showToast("Opening WhatsApp with your inquiry...");
      }
    });
  }

  // 6. Set dynamic copyright year
  const copyrightYear = document.getElementById("currentYear");
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

  console.log("SafeWay Travels web application initialized successfully.");
});
