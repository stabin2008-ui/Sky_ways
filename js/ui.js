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
    setupFleetLightbox();
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

    // Close when clicking ANY interactive link or button inside mobile drawer
    const drawerInteractiveElements = navDrawer.querySelectorAll(".nav-link, .btn, a, button:not(#drawerCloseBtn)");
    drawerInteractiveElements.forEach(el => {
      el.addEventListener("click", () => {
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
   * Helper to return clean SVG feature icons
   */
  function getFeatureIconSvg(iconName) {
    if (iconName === "users") {
      return `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;
    } else if (iconName === "briefcase") {
      return `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
    } else {
      return `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>`;
    }
  }

  /**
   * Renders the 4 Premium Vehicle Category Cards matching reference design:
   * 1. Sedan Category — Toyota Etios
   * 2. SUV Category — Four models with interactive switcher (Crysta, Ertiga, Rumion, Hycross)
   * 3. Compact City Cab — Two selectable options (Etios Sedan, Ertiga SUV)
   * 4. Custom Group Vehicle — Traveller (Tempo Traveller)
   */
  function renderFleetCards() {
    const container = document.getElementById("fleetContainer");
    if (!container || !window.SafeWayConfig?.fleet) return;

    const categories = window.SafeWayConfig.fleet.categories;
    if (!categories || !categories.length) return;

    container.innerHTML = categories.map(cat => {
      let initialModel = null;
      let exteriorImg = cat.exteriorImage;
      let interiorImg = cat.interiorImage;
      let exteriorAlt = cat.exteriorAlt;
      let interiorAlt = cat.interiorAlt;
      let displayName = cat.vehicleName;
      let bookingVal = cat.bookingValue;
      let featuresList = cat.features || [];
      let currentVehicleId = cat.id === "sedan_category" ? "toyota_etios" : (cat.id === "traveller_category" ? "tempo_traveller" : "");

      if (cat.hasModelSelector && cat.models && cat.models.length) {
        initialModel = cat.models.find(m => m.id === cat.defaultModelId) || cat.models[0];
        exteriorImg = initialModel.exteriorImage;
        interiorImg = initialModel.interiorImage;
        exteriorAlt = initialModel.exteriorAlt;
        interiorAlt = initialModel.interiorAlt;
        displayName = initialModel.name;
        bookingVal = initialModel.bookingValue;
        featuresList = initialModel.features || [];
        currentVehicleId = initialModel.id.replace("compact_", "");
      }

      // Model selector HTML for SUV and Compact City Cab
      let modelSelectorHtml = "";
      if (cat.hasModelSelector && cat.models && cat.models.length) {
        modelSelectorHtml = `
          <div class="card-model-selector-wrap">
            <span class="selector-label">${escapeHtml(cat.selectorLabel || "Select Model:")}</span>
            <div class="card-model-pills" role="tablist" aria-label="${escapeHtml(cat.categoryPill)} models">
              ${cat.models.map(m => `
                <button type="button" 
                        class="model-pill ${m.id === initialModel.id ? 'active' : ''}" 
                        data-category-id="${cat.id}" 
                        data-model-id="${m.id}" 
                        role="tab" 
                        aria-selected="${m.id === initialModel.id ? 'true' : 'false'}">
                  ${escapeHtml(m.tabLabel || m.name)}
                </button>
              `).join("")}
            </div>
          </div>
        `;
      }

      // Feature panel HTML
      const featuresHtml = featuresList.map(f => `
        <div class="feature-item">
          <span class="feature-icon" aria-hidden="true">${getFeatureIconSvg(f.icon)}</span>
          <span class="feature-text">${escapeHtml(f.text)}</span>
        </div>
      `).join("");

      return `
        <div class="category-card" id="categoryCard-${cat.id}" data-category-id="${cat.id}" data-active-vehicle-id="${currentVehicleId}" data-booking-value="${escapeHtml(bookingVal)}">
          <!-- 1. Rounded Category Label at Top -->
          <div class="card-top-pill">${escapeHtml(cat.categoryPill)}</div>

          <!-- 2. Large Exterior Photograph -->
          <div class="card-img-block card-img-exterior" data-category-id="${cat.id}" data-view="exterior" title="Click to enlarge exterior photo">
            <img src="${escapeHtml(exteriorImg)}" 
                 alt="${escapeHtml(exteriorAlt)}" 
                 class="category-img" 
                 id="catImgExt-${cat.id}" 
                 loading="lazy" 
                 width="600" 
                 height="375">
            <span class="img-view-badge">Exterior View</span>
            <span class="img-zoom-btn" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
            </span>
          </div>

          <!-- 3. Interior Photograph Immediately Underneath -->
          <div class="card-img-block card-img-interior" data-category-id="${cat.id}" data-view="interior" title="Click to enlarge interior photo">
            <img src="${escapeHtml(interiorImg)}" 
                 alt="${escapeHtml(interiorAlt)}" 
                 class="category-img" 
                 id="catImgInt-${cat.id}" 
                 loading="lazy" 
                 width="600" 
                 height="375">
            <span class="img-view-badge">Interior &amp; Cabin View</span>
            <span class="img-zoom-btn" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
            </span>
          </div>

          <div class="card-content-area">
            <!-- 4. Availability Badge with small dot -->
            <div class="card-availability-badge ${cat.availability === 'available' ? 'badge-available' : 'badge-on-request'}">
              <span class="avail-dot"></span>
              <span>${escapeHtml(cat.availabilityText)}</span>
            </div>

            <!-- 5. Orange Vehicle Category Label -->
            <div class="card-orange-label">${escapeHtml(cat.categoryLabel)}</div>

            <!-- 6. Bold Navy Vehicle Name -->
            <h3 class="card-navy-title" id="catTitle-${cat.id}">${escapeHtml(displayName)}</h3>

            <!-- 7. Short Descriptive Paragraph -->
            <p class="card-desc">${escapeHtml(cat.description)}</p>

            <!-- 8. Light-Grey Feature Panel with Navy Icons -->
            <div class="card-feature-panel" id="catFeatures-${cat.id}">
              ${featuresHtml}
            </div>

            <!-- 9. Model list / selector when applicable -->
            ${modelSelectorHtml}

            <!-- 10. Full-width Outlined Select Vehicle Button with Right Arrow -->
            <button type="button" 
                    class="btn-card-select-vehicle" 
                    id="catSelectBtn-${cat.id}" 
                    data-category-id="${cat.id}" 
                    data-booking-value="${escapeHtml(bookingVal)}" 
                    data-vehicle-name="${escapeHtml(displayName)}"
                    aria-label="Select ${escapeHtml(displayName)} for booking">
              <span>Select Vehicle</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join("");

    // Bind Model Switcher Pills (SUV models & Compact City Cab options)
    container.querySelectorAll(".model-pill").forEach(pill => {
      pill.addEventListener("click", function (e) {
        e.stopPropagation();
        const catId = this.getAttribute("data-category-id");
        const modelId = this.getAttribute("data-model-id");
        const card = document.getElementById(`categoryCard-${catId}`);
        const categoryData = categories.find(c => c.id === catId);
        if (!card || !categoryData || !categoryData.models) return;

        const model = categoryData.models.find(m => m.id === modelId);
        if (!model) return;

        // Update active tab styles
        card.querySelectorAll(".model-pill").forEach(p => {
          const isTarget = p === this;
          p.classList.toggle("active", isTarget);
          p.setAttribute("aria-selected", isTarget ? "true" : "false");
        });

        // Update active vehicle ID for Lightbox
        const cleanVehId = model.id.replace("compact_", "");
        card.setAttribute("data-active-vehicle-id", cleanVehId);
        card.setAttribute("data-booking-value", model.bookingValue);

        // Smooth image transitions
        const extImg = document.getElementById(`catImgExt-${catId}`);
        const intImg = document.getElementById(`catImgInt-${catId}`);
        const titleEl = document.getElementById(`catTitle-${catId}`);
        const featEl = document.getElementById(`catFeatures-${catId}`);
        const selectBtn = document.getElementById(`catSelectBtn-${catId}`);

        if (extImg) {
          extImg.style.opacity = "0.3";
          setTimeout(() => {
            extImg.src = model.exteriorImage;
            extImg.alt = model.exteriorAlt;
            extImg.style.opacity = "1";
          }, 120);
        }

        if (intImg) {
          intImg.style.opacity = "0.3";
          setTimeout(() => {
            intImg.src = model.interiorImage;
            intImg.alt = model.interiorAlt;
            intImg.style.opacity = "1";
          }, 120);
        }

        if (titleEl) {
          titleEl.textContent = model.name;
        }

        if (featEl && model.features) {
          featEl.innerHTML = model.features.map(f => `
            <div class="feature-item">
              <span class="feature-icon" aria-hidden="true">${getFeatureIconSvg(f.icon)}</span>
              <span class="feature-text">${escapeHtml(f.text)}</span>
            </div>
          `).join("");
        }

        if (selectBtn) {
          selectBtn.setAttribute("data-booking-value", model.bookingValue);
          selectBtn.setAttribute("data-vehicle-name", model.name);
          selectBtn.setAttribute("aria-label", `Select ${model.name} for booking`);
        }
      });
    });

    // Bind Select Vehicle buttons
    container.querySelectorAll(".btn-card-select-vehicle").forEach(btn => {
      btn.addEventListener("click", function () {
        const bookingVal = this.getAttribute("data-booking-value");
        const vehicleName = this.getAttribute("data-vehicle-name") || bookingVal;
        const catId = this.getAttribute("data-category-id");

        // Highlight selected card visually
        container.querySelectorAll(".category-card").forEach(c => c.classList.remove("card-selected"));
        const card = document.getElementById(`categoryCard-${catId}`);
        if (card) card.classList.add("card-selected");

        window.SafeWayBooking.selectVehicle(bookingVal, true);
        showToast(`Selected "${vehicleName}" in booking form.`);
      });
    });

    // Bind Lightbox on Image Click
    container.querySelectorAll(".card-img-block").forEach(block => {
      block.addEventListener("click", function () {
        const catId = this.getAttribute("data-category-id");
        const view = this.getAttribute("data-view") || "exterior";
        const card = document.getElementById(`categoryCard-${catId}`);
        const vehId = card ? card.getAttribute("data-active-vehicle-id") : "";
        if (vehId) {
          openFleetLightbox(vehId, view);
        }
      });
    });
  }

  // Active Lightbox State
  let lightboxState = {
    currentIndex: 0,
    currentView: "exterior" // "exterior" | "interior"
  };

  /**
   * Initializes Accessible Fleet Lightbox
   */
  function setupFleetLightbox() {
    const lightboxModal = document.getElementById("fleetLightbox");
    const closeBtn = document.getElementById("lightboxCloseBtn");
    const backdrop = document.getElementById("lightboxBackdrop");
    const prevBtn = document.getElementById("lightboxPrevBtn");
    const nextBtn = document.getElementById("lightboxNextBtn");
    const tabExterior = document.getElementById("lightboxTabExterior");
    const tabInterior = document.getElementById("lightboxTabInterior");
    const selectBtn = document.getElementById("lightboxSelectBtn");

    if (!lightboxModal) return;

    function closeLightbox() {
      lightboxModal.classList.remove("lightbox-open");
      lightboxModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (backdrop) backdrop.addEventListener("click", closeLightbox);

    // Escape closes lightbox
    document.addEventListener("keydown", function (e) {
      if (!lightboxModal.classList.contains("lightbox-open")) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        cycleLightboxVehicle(-1);
      } else if (e.key === "ArrowRight") {
        cycleLightboxVehicle(1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        setLightboxView(lightboxState.currentView === "exterior" ? "interior" : "exterior");
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        cycleLightboxVehicle(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        cycleLightboxVehicle(1);
      });
    }

    if (tabExterior) {
      tabExterior.addEventListener("click", function () {
        setLightboxView("exterior");
      });
    }

    if (tabInterior) {
      tabInterior.addEventListener("click", function () {
        setLightboxView("interior");
      });
    }

    if (selectBtn) {
      selectBtn.addEventListener("click", function () {
        const vehicles = window.SafeWayConfig?.fleet?.vehicles || [];
        const vehicle = vehicles[lightboxState.currentIndex];
        if (vehicle) {
          closeLightbox();
          window.SafeWayBooking.selectVehicle(vehicle.bookingValue || vehicle.vehicleName, true);
          showToast(`Selected "${vehicle.bookingValue || vehicle.vehicleName}" in booking form.`);
        }
      });
    }
  }

  function openFleetLightbox(vehicleId, view = "exterior") {
    const lightboxModal = document.getElementById("fleetLightbox");
    const vehicles = window.SafeWayConfig?.fleet?.vehicles || [];
    if (!lightboxModal || !vehicles.length) return;

    let index = vehicles.findIndex(v => v.id === vehicleId);
    if (index === -1) index = 0;

    lightboxState.currentIndex = index;
    lightboxState.currentView = view;

    updateLightboxContent();

    lightboxModal.classList.add("lightbox-open");
    lightboxModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeBtn = document.getElementById("lightboxCloseBtn");
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 150);
    }
  }

  function cycleLightboxVehicle(delta) {
    const vehicles = window.SafeWayConfig?.fleet?.vehicles || [];
    if (!vehicles.length) return;

    let newIndex = lightboxState.currentIndex + delta;
    if (newIndex < 0) newIndex = vehicles.length - 1;
    if (newIndex >= vehicles.length) newIndex = 0;

    lightboxState.currentIndex = newIndex;
    updateLightboxContent();
  }

  function setLightboxView(view) {
    lightboxState.currentView = view;
    updateLightboxContent();
  }

  function updateLightboxContent() {
    const vehicles = window.SafeWayConfig?.fleet?.vehicles || [];
    const vehicle = vehicles[lightboxState.currentIndex];
    if (!vehicle) return;

    const titleEl = document.getElementById("lightboxTitle");
    const catEl = document.getElementById("lightboxCategoryBadge");
    const imgEl = document.getElementById("lightboxImg");
    const indicatorEl = document.getElementById("lightboxViewIndicator");
    const tabExterior = document.getElementById("lightboxTabExterior");
    const tabInterior = document.getElementById("lightboxTabInterior");
    const specsEl = document.getElementById("lightboxSpecsSummary");
    const selectBtn = document.getElementById("lightboxSelectBtn");

    const isInterior = lightboxState.currentView === "interior";

    if (titleEl) titleEl.textContent = vehicle.vehicleName;
    if (catEl) catEl.textContent = vehicle.category;

    if (indicatorEl) {
      indicatorEl.textContent = isInterior ? "Cabin / Interior View" : "Exterior View";
    }

    if (tabExterior) {
      tabExterior.classList.toggle("active", !isInterior);
      tabExterior.setAttribute("aria-selected", !isInterior ? "true" : "false");
    }

    if (tabInterior) {
      tabInterior.classList.toggle("active", isInterior);
      tabInterior.setAttribute("aria-selected", isInterior ? "true" : "false");
    }

    if (imgEl) {
      imgEl.style.opacity = "0.3";
      imgEl.src = isInterior ? vehicle.interiorImage : vehicle.exteriorImage;
      imgEl.alt = isInterior ? vehicle.interiorAlt : vehicle.exteriorAlt;
      setTimeout(() => {
        imgEl.style.opacity = "1";
      }, 100);
    }

    if (specsEl) {
      specsEl.innerHTML = `
        <span class="lightbox-spec-chip">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
          ${escapeHtml(vehicle.seatingCapacity)}
        </span>
        <span class="lightbox-spec-chip">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          ${escapeHtml(vehicle.airConditioning)}
        </span>
        <span class="lightbox-spec-chip">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          ${escapeHtml(vehicle.luggageCapacity)}
        </span>
      `;
    }

    if (selectBtn) {
      const span = selectBtn.querySelector("span");
      if (span) {
        span.textContent = `Select ${vehicle.vehicleName} for Booking`;
      }
    }
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
