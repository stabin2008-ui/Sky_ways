/**
 * SafeWay Travels - Booking Logic & Form Validation
 * ==================================================
 * Robust validation, two-way vehicle/category synchronization, date constraints,
 * and direct WhatsApp booking flow.
 * WhatsApp Destination: 919980838845
 */

const SafeWayBooking = (function () {
  let formElement = null;
  let currentPreparedMessage = "";
  let currentWhatsAppUrl = "";
  let lastSubmissionData = null;

  /**
   * Initializes booking form listeners and date constraints
   */
  function init() {
    formElement = document.getElementById("bookingForm");
    if (!formElement) return;

    setupDateInputConstraints();
    setupPhoneFormatting();
    setupSpecialRequestChips();
    setupVehiclePreferenceSync();
    setupFormSubmission();
    setupModalEvents();
    setupRealtimeValidation();
    setupGlobalBookingTriggers();
  }

  /**
   * Constrains travel date input to today or future dates only
   */
  function setupDateInputConstraints() {
    const dateInput = document.getElementById("travelDate");
    if (!dateInput) return;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;

    dateInput.addEventListener("change", function () {
      if (!this.value) {
        setFieldError("travelDate", "Please select your travel date.");
        return;
      }
      const selected = new Date(this.value + "T00:00:00");
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (selected < now) {
        setFieldError("travelDate", "Travel date cannot be in the past. Please select today or a future date.");
      } else {
        clearFieldError("travelDate");
      }
    });
  }

  /**
   * Phone number input formatting and realtime validation
   */
  function setupPhoneFormatting() {
    const phoneInput = document.getElementById("customerPhone");
    if (!phoneInput) return;

    phoneInput.addEventListener("input", function () {
      let val = this.value;
      if (val.startsWith("+")) {
        val = "+" + val.slice(1).replace(/\D/g, "");
      } else {
        val = val.replace(/\D/g, "");
      }
      this.value = val;

      const digitsOnly = val.replace(/\D/g, "");
      const cleanPhone = digitsOnly.startsWith("91") && digitsOnly.length === 12 ? digitsOnly.substring(2) : digitsOnly;
      if (/^[6-9]\d{9}$/.test(cleanPhone)) {
        clearFieldError("customerPhone");
      }
    });
  }

  /**
   * Special requests chips toggler
   */
  function setupSpecialRequestChips() {
    const chips = document.querySelectorAll(".chips-container .special-chip");
    const textarea = document.getElementById("specialRequests");
    if (!chips.length || !textarea) return;

    chips.forEach(chip => {
      chip.addEventListener("click", function () {
        const tag = this.getAttribute("data-tag") || this.textContent.trim();
        this.classList.toggle("active");
        const isActive = this.classList.contains("active");

        let currentVal = textarea.value.trim();
        let items = currentVal ? currentVal.split(",").map(s => s.trim()).filter(Boolean) : [];

        if (isActive) {
          if (!items.includes(tag)) {
            items.push(tag);
          }
        } else {
          items = items.filter(item => item.toLowerCase() !== tag.toLowerCase());
        }

        textarea.value = items.join(", ");
      });
    });
  }

  /**
   * Syncs dropdown changes and clear vehicle button with the banner and gallery
   */
  function setupVehiclePreferenceSync() {
    const vehicleSelect = document.getElementById("vehiclePreference") || document.getElementById("vehicleModel");
    const categorySelect = document.getElementById("vehicleCategory");
    const clearBtn = document.getElementById("btnClearVehicle");

    if (vehicleSelect) {
      vehicleSelect.addEventListener("change", function () {
        const val = this.value;
        syncCategoryFromModel(val);
        if (val && !val.toLowerCase().includes("any available")) {
          updateVehicleBannerAndCard(val);
        } else {
          hideVehicleBanner();
          clearFleetCardHighlights();
        }
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", function () {
        const catVal = this.value;
        syncModelFromCategory(catVal);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        if (vehicleSelect) {
          vehicleSelect.selectedIndex = 0; // "Any Available (Comfort AC)"
        }
        if (categorySelect) {
          categorySelect.selectedIndex = 0; // "Any Available"
        }
        hideVehicleBanner();
        clearFleetCardHighlights();
        if (window.SafeWayUI && window.SafeWayUI.showToast) {
          window.SafeWayUI.showToast("Vehicle preference reset to Any Available.");
        }
      });
    }
  }

  /**
   * Automatically select Category based on Model chosen
   */
  function syncCategoryFromModel(modelName) {
    const categorySelect = document.getElementById("vehicleCategory");
    if (!categorySelect || !modelName) return;

    const lower = modelName.toLowerCase();
    if (lower.includes("etios")) {
      setSelectByValueSubstring(categorySelect, "Sedan");
    } else if (lower.includes("innova") || lower.includes("ertiga") || lower.includes("rumion")) {
      setSelectByValueSubstring(categorySelect, "SUV");
    } else if (lower.includes("group") || lower.includes("traveller")) {
      setSelectByValueSubstring(categorySelect, "Group");
    } else if (lower.includes("any available")) {
      categorySelect.selectedIndex = 0;
    }
  }

  /**
   * Automatically select default Model based on Category chosen
   */
  function syncModelFromCategory(categoryName) {
    const vehicleSelect = document.getElementById("vehiclePreference") || document.getElementById("vehicleModel");
    if (!vehicleSelect || !categoryName) return;

    const lower = categoryName.toLowerCase();
    if (lower.includes("sedan")) {
      setSelectByValueSubstring(vehicleSelect, "Etios");
      updateVehicleBannerAndCard(vehicleSelect.value);
    } else if (lower.includes("suv") || lower.includes("muv")) {
      setSelectByValueSubstring(vehicleSelect, "Innova Crysta");
      updateVehicleBannerAndCard(vehicleSelect.value);
    } else if (lower.includes("compact")) {
      setSelectByValueSubstring(vehicleSelect, "Etios");
      updateVehicleBannerAndCard(vehicleSelect.value);
    } else if (lower.includes("group") || lower.includes("traveller")) {
      setSelectByValueSubstring(vehicleSelect, "Custom Group");
      updateVehicleBannerAndCard(vehicleSelect.value);
    } else {
      vehicleSelect.selectedIndex = 0;
      hideVehicleBanner();
      clearFleetCardHighlights();
    }
  }

  function setSelectByValueSubstring(selectEl, substring) {
    if (!selectEl) return;
    const lower = substring.toLowerCase();
    for (let i = 0; i < selectEl.options.length; i++) {
      if (selectEl.options[i].value.toLowerCase().includes(lower) ||
          selectEl.options[i].text.toLowerCase().includes(lower)) {
        selectEl.selectedIndex = i;
        break;
      }
    }
  }

  /**
   * Updates the selected vehicle banner in the booking form
   */
  function updateVehicleBannerAndCard(vehicleName) {
    const banner = document.getElementById("selectedVehicleBanner");
    const display = document.getElementById("selectedVehicleDisplay");

    if (banner && display) {
      display.textContent = vehicleName;
      banner.style.display = "flex";
      banner.classList.add("banner-pulse");
      setTimeout(() => banner.classList.remove("banner-pulse"), 800);
    }

    highlightFleetCard(vehicleName);
  }

  function hideVehicleBanner() {
    const banner = document.getElementById("selectedVehicleBanner");
    if (banner) {
      banner.style.display = "none";
    }
  }

  function highlightFleetCard(vehicleName) {
    const cards = document.querySelectorAll(".category-card, .fleet-card");
    const cleanQuery = vehicleName.toLowerCase();

    cards.forEach(card => {
      const cardBookingVal = (card.getAttribute("data-booking-value") || "").toLowerCase();
      const cardVehicleId = (card.getAttribute("data-active-vehicle-id") || "").toLowerCase();
      const isMatch = cardBookingVal.includes(cleanQuery) ||
                      cleanQuery.includes(cardBookingVal) ||
                      cleanQuery.includes(cardVehicleId);

      const btn = card.querySelector(".btn-card-select-vehicle, .btn-select-vehicle");
      if (isMatch) {
        card.classList.add("card-selected", "fleet-card-selected");
        if (btn) {
          btn.classList.add("btn-selected-active");
          btn.innerHTML = `<span>Selected ✓</span>`;
        }
      } else {
        card.classList.remove("card-selected", "fleet-card-selected");
        if (btn) {
          btn.classList.remove("btn-selected-active");
          btn.innerHTML = `<span>Select Vehicle</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
        }
      }
    });
  }

  function clearFleetCardHighlights() {
    const cards = document.querySelectorAll(".category-card, .fleet-card");
    cards.forEach(card => {
      card.classList.remove("card-selected", "fleet-card-selected");
      const btn = card.querySelector(".btn-card-select-vehicle, .btn-select-vehicle");
      if (btn) {
        btn.classList.remove("btn-selected-active");
        btn.innerHTML = `<span>Select Vehicle</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
      }
    });
  }

  /**
   * Handles Pre-selection of Service Type from any section
   */
  function selectService(serviceType, scrollIntoView = true) {
    const serviceSelect = document.getElementById("serviceType");
    if (serviceSelect && serviceType) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.toLowerCase().includes(serviceType.toLowerCase()) ||
            serviceType.toLowerCase().includes(serviceSelect.options[i].value.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
      clearFieldError("serviceType");
    }

    if (window.SafeWayAnalytics) {
      window.SafeWayAnalytics.trackEvent("service_selected", { service: serviceType });
    }

    if (scrollIntoView) {
      scrollToBookingSection();
    }
  }

  /**
   * Handles Pre-selection of Vehicle from Fleet section / cards / lightbox
   * Automatically fills in both Vehicle Category and Preferred Vehicle Model
   */
  function selectVehicle(vehicleName, scrollIntoView = true) {
    const vehicleSelect = document.getElementById("vehiclePreference") || document.getElementById("vehicleModel");
    let chosenVal = vehicleName;

    if (vehicleSelect && vehicleName) {
      let matched = false;
      const lowerReq = vehicleName.toLowerCase();
      for (let i = 0; i < vehicleSelect.options.length; i++) {
        const optText = vehicleSelect.options[i].text.toLowerCase();
        const optVal = vehicleSelect.options[i].value.toLowerCase();
        if (optText.includes(lowerReq) || lowerReq.includes(optVal) || optVal.includes(lowerReq)) {
          vehicleSelect.selectedIndex = i;
          chosenVal = vehicleSelect.options[i].value;
          matched = true;
          break;
        }
      }
      if (!matched && vehicleSelect.options.length > 1) {
        vehicleSelect.selectedIndex = 1;
        chosenVal = vehicleSelect.options[1].value;
      }
    }

    // Auto-sync the category dropdown as well
    syncCategoryFromModel(chosenVal);

    updateVehicleBannerAndCard(chosenVal);

    if (window.SafeWayAnalytics) {
      window.SafeWayAnalytics.trackEvent("vehicle_selected", { vehicle: chosenVal });
    }

    if (scrollIntoView) {
      scrollToBookingSection();
    }
  }

  /**
   * Smoothly scrolls to the booking section and focuses the first input field
   */
  function scrollToBookingSection() {
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = document.getElementById("customerName");
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 500);
      }
    }
  }

  /**
   * Binds global triggers so any button/link with "Book" or "Select Vehicle" navigates cleanly
   */
  function setupGlobalBookingTriggers() {
    // Select all links with href="#booking"
    document.querySelectorAll('a[href="#booking"]').forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        scrollToBookingSection();
      });
    });
  }

  /**
   * Clears inline field errors in real time as user interacts with inputs
   */
  function setupRealtimeValidation() {
    const fieldIds = [
      "customerName",
      "customerPhone",
      "customerEmail",
      "serviceType",
      "pickupLocation",
      "dropLocation",
      "travelDate",
      "pickupTime",
      "passengerCount"
    ];

    fieldIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => clearFieldError(id));
        el.addEventListener("change", () => clearFieldError(id));
      }
    });
  }

  /**
   * Form validation with clear, friendly inline error messages
   */
  function validateForm() {
    let isValid = true;
    let firstErrorField = null;

    function markInvalid(fieldId, errorMsg) {
      setFieldError(fieldId, errorMsg);
      isValid = false;
      if (!firstErrorField) {
        firstErrorField = document.getElementById(fieldId);
      }
    }

    // 1. Full Name (Required, at least 2 characters)
    const nameInput = document.getElementById("customerName");
    const nameVal = nameInput ? nameInput.value.trim() : "";
    if (!nameVal || nameVal.length < 2) {
      markInvalid("customerName", "Please enter your full name.");
    } else {
      clearFieldError("customerName");
    }

    // 2. Phone Number (Required: 10-digit Indian mobile number, e.g. 9980838845)
    const phoneInput = document.getElementById("customerPhone");
    const rawPhone = phoneInput ? phoneInput.value.trim().replace(/\D/g, "") : "";
    const digitsOnly = rawPhone.startsWith("91") && rawPhone.length === 12 ? rawPhone.substring(2) : rawPhone;
    const phonePattern = /^[6-9]\d{9}$/;

    if (!digitsOnly || !phonePattern.test(digitsOnly)) {
      markInvalid("customerPhone", "Please enter a valid 10-digit Indian mobile number (e.g. 9980838845).");
    } else {
      clearFieldError("customerPhone");
    }

    // 3. Email (Optional, validate format if provided)
    const emailInput = document.getElementById("customerEmail");
    const emailVal = emailInput ? emailInput.value.trim() : "";
    if (emailVal) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        markInvalid("customerEmail", "Please enter a valid email address, or leave it blank.");
      } else {
        clearFieldError("customerEmail");
      }
    } else {
      clearFieldError("customerEmail");
    }

    // 4. Service Type (Required)
    const serviceInput = document.getElementById("serviceType");
    const serviceVal = serviceInput ? serviceInput.value : "";
    if (!serviceVal) {
      markInvalid("serviceType", "Please choose your service type (Local, Airport, Outstation, or Round Trip).");
    } else {
      clearFieldError("serviceType");
    }

    // 5. Pickup Location (Required)
    const pickupInput = document.getElementById("pickupLocation");
    const pickupVal = pickupInput ? pickupInput.value.trim() : "";
    if (!pickupVal) {
      markInvalid("pickupLocation", "Please enter your pickup location in Bengaluru.");
    } else {
      clearFieldError("pickupLocation");
    }

    // 6. Drop Location (Required where applicable: Airport, Outstation, Round Trip)
    const dropInput = document.getElementById("dropLocation");
    const dropVal = dropInput ? dropInput.value.trim() : "";
    const isAirportOrOutstation = serviceVal && (
      serviceVal.includes("Airport") ||
      serviceVal.includes("Outstation") ||
      serviceVal.includes("Round Trip")
    );

    if (!dropVal && isAirportOrOutstation) {
      markInvalid("dropLocation", "Please enter your destination / drop location for " + serviceVal + ".");
    } else if (!dropVal && !serviceVal) {
      markInvalid("dropLocation", "Please enter your drop or destination location.");
    } else {
      clearFieldError("dropLocation");
    }

    // 7. Travel Date (Required, prevent dates in the past)
    const dateInput = document.getElementById("travelDate");
    const dateVal = dateInput ? dateInput.value : "";
    if (!dateVal) {
      markInvalid("travelDate", "Please select your travel date.");
    } else {
      const selected = new Date(dateVal + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        markInvalid("travelDate", "Travel date cannot be in the past. Please select today or a future date.");
      } else {
        clearFieldError("travelDate");
      }
    }

    // 8. Pickup Time (Required)
    const timeInput = document.getElementById("pickupTime");
    if (!timeInput || !timeInput.value) {
      markInvalid("pickupTime", "Please choose your preferred pickup time.");
    } else {
      clearFieldError("pickupTime");
    }

    // 9. Passengers (Required, >= 1)
    const passengerInput = document.getElementById("passengerCount");
    const passengers = passengerInput ? parseInt(passengerInput.value, 10) : 1;
    if (isNaN(passengers) || passengers < 1) {
      markInvalid("passengerCount", "Please select at least 1 passenger.");
    } else {
      clearFieldError("passengerCount");
    }

    if (!isValid && firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => firstErrorField.focus(), 350);
    }

    return isValid;
  }

  function setFieldError(fieldId, errorMessage) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}Error`);
    if (input) {
      input.classList.add("input-error");
      input.setAttribute("aria-invalid", "true");
    }
    if (errorSpan) {
      errorSpan.textContent = errorMessage;
      errorSpan.style.display = "block";
    }
  }

  function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}Error`);
    if (input) {
      input.classList.remove("input-error");
      input.removeAttribute("aria-invalid");
    }
    if (errorSpan) {
      errorSpan.textContent = "";
      errorSpan.style.display = "none";
    }
  }

  /**
   * Sets up form submission handler and executes WhatsApp integration
   */
  function setupFormSubmission() {
    formElement.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const submitBtn = document.getElementById("btnSubmitBooking");
      let originalBtnContent = "";
      if (submitBtn) {
        originalBtnContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" class="btn-spinner" aria-hidden="true" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          <span>Connecting to WhatsApp...</span>
        `;
      }

      // Collect form data
      const categoryEl = document.getElementById("vehicleCategory");
      const modelEl = document.getElementById("vehiclePreference") || document.getElementById("vehicleModel");
      const dropEl = document.getElementById("dropLocation");

      const booking = {
        name: document.getElementById("customerName").value.trim(),
        phone: document.getElementById("customerPhone").value.trim(),
        email: document.getElementById("customerEmail") ? document.getElementById("customerEmail").value.trim() : "",
        serviceType: document.getElementById("serviceType").value,
        pickup: document.getElementById("pickupLocation").value.trim(),
        dropoff: dropEl ? dropEl.value.trim() : "",
        date: document.getElementById("travelDate").value,
        time: document.getElementById("pickupTime").value,
        passengers: document.getElementById("passengerCount").value,
        vehicleCategory: categoryEl ? categoryEl.value : "",
        vehicleModel: modelEl ? modelEl.value : "",
        notes: document.getElementById("specialRequests") ? document.getElementById("specialRequests").value.trim() : ""
      };

      // Aliases for compatibility
      booking.service = booking.serviceType;
      booking.drop = booking.dropoff;
      booking.vehicle = booking.vehicleModel;
      booking.specialRequests = booking.notes;

      lastSubmissionData = booking;

      // Track analytics
      if (window.SafeWayAnalytics) {
        window.SafeWayAnalytics.trackEvent("booking_form_submitted", {
          service: booking.serviceType,
          vehicle: booking.vehicleModel,
          passengers: booking.passengers
        });
      }

      // Send to WhatsApp via SafeWayWhatsApp.sendBookingToWhatsApp
      const waResult = window.SafeWayWhatsApp.sendBookingToWhatsApp(booking);
      currentPreparedMessage = waResult.message;
      currentWhatsAppUrl = waResult.url;

      // Display informative modal with trip preview and clickable fallback link
      showSuccessModal(booking, currentWhatsAppUrl);

      // Re-enable button after brief loading state
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnContent || `
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.09 19.11L7.79 18.93L4.69 19.74L5.52 16.72L5.32 16.41C4.55 15.08 4.14 13.52 4.14 11.91C4.14 7.37 7.84 3.67 12.05 3.67Z"></path></svg>
            <span>Send Booking Request on WhatsApp</span>
          `;
        }
      }, 1200);
    });
  }

  /**
   * Displays the "Booking Request Ready" modal with summary & fallback button
   */
  function showSuccessModal(data, whatsappUrl) {
    const modal = document.getElementById("bookingModal");
    if (!modal) return;

    const summaryName = document.getElementById("summaryCustomerName");
    const summaryTrip = document.getElementById("summaryTripDetails");
    const summaryService = document.getElementById("summaryService");

    if (summaryName) summaryName.textContent = data.name;
    if (summaryService) summaryService.textContent = data.serviceType;
    if (summaryTrip) {
      summaryTrip.innerHTML = `
        <strong>Customer:</strong> ${escapeHtml(data.name)} (${escapeHtml(data.phone)})<br>
        <strong>Service:</strong> ${escapeHtml(data.serviceType)}<br>
        <strong>Pickup:</strong> ${escapeHtml(data.pickup)}<br>
        <strong>Drop-off:</strong> ${escapeHtml(data.dropoff || "Not specified")}<br>
        <strong>Date &amp; Time:</strong> ${escapeHtml(data.date)} at ${escapeHtml(data.time)}<br>
        <strong>Passengers:</strong> ${escapeHtml(data.passengers)}<br>
        <strong>Vehicle Category:</strong> ${escapeHtml(data.vehicleCategory || "Not selected")}<br>
        <strong>Preferred Vehicle:</strong> ${escapeHtml(data.vehicleModel || "Not selected")}
        ${data.notes ? `<br><strong>Additional Requirements:</strong> ${escapeHtml(data.notes)}` : ""}
      `;
    }

    const continueBtn = document.getElementById("btnContinueWhatsApp");
    if (continueBtn) {
      continueBtn.href = whatsappUrl || `https://wa.me/919980838845?text=${encodeURIComponent(currentPreparedMessage)}`;
    }

    modal.classList.add("modal-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (continueBtn) {
      setTimeout(() => continueBtn.focus(), 150);
    }
  }

  /**
   * Sets up modal events (close, continue to whatsapp, copy message)
   */
  function setupModalEvents() {
    const modal = document.getElementById("bookingModal");
    if (!modal) return;

    const closeBtns = modal.querySelectorAll ? modal.querySelectorAll("[data-close-modal]") : [];
    if (closeBtns && closeBtns.forEach) {
      closeBtns.forEach(btn => {
        btn.addEventListener("click", closeModal);
      });
    }

    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("modal-open")) {
        closeModal();
      }
    });

    const continueBtn = document.getElementById("btnContinueWhatsApp");
    if (continueBtn) {
      continueBtn.addEventListener("click", function (e) {
        if (currentWhatsAppUrl) {
          continueBtn.href = currentWhatsAppUrl;
        } else if (currentPreparedMessage) {
          continueBtn.href = window.SafeWayWhatsApp.buildWhatsAppUrl(currentPreparedMessage);
        }
      });
    }

    const copyBtn = document.getElementById("btnCopyWhatsAppMessage");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        if (currentPreparedMessage) {
          navigator.clipboard.writeText(currentPreparedMessage).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Copied to Clipboard!</span>
            `;
            setTimeout(() => {
              copyBtn.innerHTML = originalText;
            }, 2500);
          }).catch(() => {
            alert("Please copy message manually: \n\n" + currentPreparedMessage);
          });
        }
      });
    }
  }

  function closeModal() {
    const modal = document.getElementById("bookingModal");
    if (modal) {
      modal.classList.remove("modal-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
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
    selectService,
    selectVehicle,
    scrollToBookingSection,
    validateForm,
    closeModal
  };
})();

if (typeof window !== "undefined") {
  window.SafeWayBooking = SafeWayBooking;
}
