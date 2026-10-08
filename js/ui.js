/**
 * SafeWay Travels - UI Controller & DOM Renderer
 * ===============================================
 * Handles navigation, mobile drawer, dynamic data rendering,
 * smooth scrolling, accordion toggles, and toast notifications.
 */

const SafeWayUI = (function () {
  /**
   * Initializes all UI components
   */
  function init() {
    setupStickyNav();
    setupMobileMenu();
    setupFaqAccordion();
    setupSmoothScrollLinks();
    renderFleetCards();
    renderPricingCards();
    renderTestimonialCards();
    renderTrustPillars();
    renderWhyChooseCards();
    bindDirectContactTracking();
  }

  /**
   * Header scroll shadow & backdrop filter effect
   */
  function setupStickyNav() {
    const navbar = document.getElementById("mainNavbar");
    if (!navbar) return;

    window.addEventListener("scroll", function () {
      if (window.scrollY > 20) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
    }, { passive: true });
  }

  /**
   * Mobile Hamburger Drawer Menu
   */
  function setupMobileMenu() {
    const menuBtn = document.getElementById("mobileMenuBtn");
    const navDrawer = document.getElementById("navDrawer");
    const drawerBackdrop = document.getElementById("drawerBackdrop");
    const closeBtn = document.getElementById("drawerCloseBtn");

    if (!menuBtn || !navDrawer) return;

    function openDrawer() {
      navDrawer.classList.add("drawer-open");
      navDrawer.setAttribute("aria-hidden", "false");
      menuBtn.setAttribute("aria-expanded", "true");
      if (drawerBackdrop) drawerBackdrop.classList.add("backdrop-open");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      navDrawer.classList.remove("drawer-open");
      navDrawer.setAttribute("aria-hidden", "true");
      menuBtn.setAttribute("aria-expanded", "false");
      if (drawerBackdrop) drawerBackdrop.classList.remove("backdrop-open");
      document.body.style.overflow = "";
    }

    menuBtn.addEventListener("click", openDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);

    // Close when clicking nav links in mobile drawer
    const drawerLinks = navDrawer.querySelectorAll(".nav-link, .btn-drawer-cta");
    drawerLinks.forEach(link => {
      link.addEventListener("click", () => {
        closeDrawer();
      });
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navDrawer.classList.contains("drawer-open")) {
        closeDrawer();
      }
    });
  }

  /**
   * Smooth scroll links
   */
  function setupSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#" || !href) return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navHeight = document.getElementById("mainNavbar")?.offsetHeight || 70;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 5;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }
      });
    });
  }

  /**
   * FAQ Accordion
   */
  function setupFaqAccordion() {
    const faqContainer = document.getElementById("faqAccordionContainer");
    if (!faqContainer || !window.SafeWayConfig?.faqs) return;

    faqContainer.innerHTML = window.SafeWayConfig.faqs.map((faq, index) => `
      <div class="faq-item" id="faqItem-${index}">
        <button class="faq-question" aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="faqAnswer-${index}">
          <span class="faq-title">${escapeHtml(faq.q)}</span>
          <span class="faq-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </button>
        <div class="faq-answer ${index === 0 ? 'faq-answer-open' : ''}" id="faqAnswer-${index}">
          <div class="faq-answer-inner">
            <p>${escapeHtml(faq.a)}</p>
          </div>
        </div>
      </div>
    `).join("");

    const questions = faqContainer.querySelectorAll(".faq-question");
    questions.forEach(btn => {
      btn.addEventListener("click", function () {
        const isExpanded = this.getAttribute("aria-expanded") === "true";
        const answer = this.nextElementSibling;

        // Close other answers for clean accordion experience
        questions.forEach(otherBtn => {
          if (otherBtn !== this) {
            otherBtn.setAttribute("aria-expanded", "false");
            otherBtn.nextElementSibling.classList.remove("faq-answer-open");
          }
        });

        if (isExpanded) {
          this.setAttribute("aria-expanded", "false");
          answer.classList.remove("faq-answer-open");
        } else {
          this.setAttribute("aria-expanded", "true");
          answer.classList.add("faq-answer-open");
        }
      });
    });
  }

  /**
   * Renders Fleet Cards dynamically from central config
   * NOTE: Owner can easily update names, capacities, images in config.js!
   */
  function renderFleetCards() {
    const container = document.getElementById("fleetContainer");
    if (!container || !window.SafeWayConfig?.fleet?.vehicles) return;

    const vehicles = window.SafeWayConfig.fleet.vehicles;

    container.innerHTML = vehicles.map(v => `
      <div class="fleet-card" data-vehicle-id="${v.id}">
        <div class="fleet-media">
          ${v.vehicleImage ? `
            <img src="${escapeHtml(v.vehicleImage)}" alt="${escapeHtml(v.vehicleName)}" class="fleet-img" loading="lazy">
          ` : `
            <div class="fleet-placeholder">
              <div class="fleet-placeholder-badge">${escapeHtml(v.editablePlaceholderTag || 'Vehicle Category')}</div>
              <div class="fleet-icon-symbol" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.6">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L2 12v4c0 .6.4 1 1 1h2"></path>
                  <circle cx="7" cy="17" r="2"></circle>
                  <path d="M9 17h6"></path>
                  <circle cx="17" cy="17" r="2"></circle>
                </svg>
              </div>
              <p class="fleet-placeholder-note">Owner can customize vehicle model &amp; photo</p>
            </div>
          `}
          <div class="fleet-status-pill">
            <span class="status-dot"></span>
            ${escapeHtml(v.statusText)}
          </div>
        </div>

        <div class="fleet-body">
          <div class="fleet-type-tag">${escapeHtml(v.vehicleType)}</div>
          <h3 class="fleet-name">${escapeHtml(v.vehicleName)}</h3>
          <p class="fleet-desc">${escapeHtml(v.description)}</p>

          <div class="fleet-specs-grid">
            <div class="spec-item">
              <span class="spec-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </span>
              <span class="spec-val">${escapeHtml(v.seatingCapacity)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </span>
              <span class="spec-val">${escapeHtml(v.luggageCapacity)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </span>
              <span class="spec-val">${escapeHtml(v.airConditioning)}</span>
            </div>
          </div>

          <button type="button" class="btn btn-outline btn-block btn-select-vehicle" data-vehicle-name="${escapeHtml(v.vehicleName)}">
            <span>Select Vehicle</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    `).join("");

    // Bind Select Vehicle clicks
    container.querySelectorAll(".btn-select-vehicle").forEach(btn => {
      btn.addEventListener("click", function () {
        const vehicleName = this.getAttribute("data-vehicle-name");
        window.SafeWayBooking.selectVehicle(vehicleName, true);
        showToast(`Selected "${vehicleName}" in booking form.`);
      });
    });
  }

  /**
   * Renders Pricing Packages dynamically from central config
   * NOTE: We do NOT invent fake prices. Honest transparent pricing notes.
   */
  function renderPricingCards() {
    const container = document.getElementById("pricingContainer");
    if (!container || !window.SafeWayConfig?.pricing?.categories) return;

    const categories = window.SafeWayConfig.pricing.categories;

    container.innerHTML = categories.map(pkg => `
      <div class="pricing-card ${pkg.popular ? 'pricing-card-popular' : ''}">
        ${pkg.popular ? `<div class="popular-ribbon">Most Popular</div>` : ''}
        <div class="pricing-header">
          <span class="pricing-sub">${escapeHtml(pkg.subtitle)}</span>
          <h3 class="pricing-title">${escapeHtml(pkg.title)}</h3>
          <div class="price-quote-badge">${escapeHtml(pkg.priceBadge)}</div>
          <p class="pricing-model">${escapeHtml(pkg.pricingModel)}</p>
          <p class="pricing-summary">${escapeHtml(pkg.summary)}</p>
        </div>

        <ul class="pricing-features">
          ${pkg.features.map(f => `
            <li>
              <span class="feature-check" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span>${escapeHtml(f)}</span>
            </li>
          `).join("")}
        </ul>

        <div class="pricing-footer">
          <button type="button" class="btn ${pkg.popular ? 'btn-primary' : 'btn-outline'} btn-block btn-quote-action" data-package-id="${pkg.id}">
            <span>${escapeHtml(pkg.ctaText)}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    `).join("");

    // Bind Get Quote buttons to scroll and select appropriate service
    container.querySelectorAll(".btn-quote-action").forEach(btn => {
      btn.addEventListener("click", function () {
        const pkgId = this.getAttribute("data-package-id");
        let serviceTarget = "Local";
        if (pkgId === "airport") serviceTarget = "Airport";
        if (pkgId === "roundTrip") serviceTarget = "Round Trip";
        window.SafeWayBooking.selectService(serviceTarget, true);
        showToast(`Requesting quote for ${serviceTarget} cab...`);
      });
    });
  }

  /**
   * Renders Testimonials (Sample Customer Reviews clearly indicated)
   */
  function renderTestimonialCards() {
    const container = document.getElementById("testimonialsContainer");
    if (!container || !window.SafeWayConfig?.testimonials?.reviews) return;

    const reviews = window.SafeWayConfig.testimonials.reviews;

    container.innerHTML = reviews.map(rev => `
      <div class="testimonial-card">
        <div class="testimonial-top">
          <div class="sample-review-badge">
            <span class="sample-icon" aria-hidden="true">ℹ</span>
            ${escapeHtml(rev.label)}
          </div>
          <div class="star-rating" aria-label="5 out of 5 stars">
            ${Array(rev.stars || 5).fill(0).map(() => `
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#F59E0B" stroke="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            `).join("")}
          </div>
        </div>

        <p class="testimonial-text">“${escapeHtml(rev.content)}”</p>

        <div class="testimonial-author">
          <div class="author-avatar">${rev.author.charAt(0)}</div>
          <div class="author-info">
            <h4 class="author-name">${escapeHtml(rev.author)}</h4>
            <span class="author-trip">${escapeHtml(rev.tripType)}</span>
            <span class="author-location">${escapeHtml(rev.location)}</span>
          </div>
        </div>
      </div>
    `).join("");
  }

  /**
   * Renders Trust Strip pillars
   */
  function renderTrustPillars() {
    const container = document.getElementById("trustPillarsContainer");
    if (!container || !window.SafeWayConfig?.trustPillars) return;

    container.innerHTML = window.SafeWayConfig.trustPillars.map(pillar => `
      <div class="trust-item">
        <div class="trust-metric">${escapeHtml(pillar.metric)}</div>
        <h3 class="trust-title">${escapeHtml(pillar.title)}</h3>
        <p class="trust-desc">${escapeHtml(pillar.desc)}</p>
      </div>
    `).join("");
  }

  /**
   * Renders Why Choose Us cards
   */
  function renderWhyChooseCards() {
    const container = document.getElementById("whyChooseContainer");
    if (!container || !window.SafeWayConfig?.whyChooseUs) return;

    container.innerHTML = window.SafeWayConfig.whyChooseUs.map(item => `
      <div class="why-card">
        <div class="why-icon-box">
          ${getSvgIcon(item.icon)}
        </div>
        <h3 class="why-title">${escapeHtml(item.title)}</h3>
        <p class="why-desc">${escapeHtml(item.desc)}</p>
      </div>
    `).join("");
  }

  /**
   * Binds direct contact analytics hooks
   */
  function bindDirectContactTracking() {
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener("click", () => {
        if (window.SafeWayAnalytics) {
          window.SafeWayAnalytics.trackEvent("call_clicked", { phone: "9980838845" });
        }
      });
    });

    document.querySelectorAll('.btn-whatsapp-track').forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.SafeWayAnalytics) {
          window.SafeWayAnalytics.trackEvent("whatsapp_clicked", { source: btn.getAttribute("data-source") || "unknown" });
        }
      });
    });
  }

  /**
   * Toast notification helper
   */
  function showToast(message, duration = 3000) {
    let toast = document.getElementById("safeWayToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "safeWayToast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("toast-show");

    setTimeout(() => {
      toast.classList.remove("toast-show");
    }, duration);
  }

  function getSvgIcon(iconName) {
    switch (iconName) {
      case "award":
        return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`;
      case "shield":
        return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
      case "dollar-sign":
        return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`;
      case "heart":
        return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
      case "compass":
        return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`;
      case "message-circle":
        return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`;
    }
  }

  function escapeHtml(string) {
    if (!string) return "";
    return String(string)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  return {
    init,
    showToast
  };
})();

if (typeof window !== "undefined") {
  window.SafeWayUI = SafeWayUI;
}
