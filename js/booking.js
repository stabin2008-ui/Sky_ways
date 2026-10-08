/**
 * SafeWay Travels - Booking Logic & Form Validation
 * ==================================================
 * Robust validation, pre-selection handlers, date constraints,
 * and seamless WhatsApp confirmation flow.
 */

const SafeWayBooking = (function () {
  let formElement = null;
  let successModal = null;
  let currentPreparedMessage = "";
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
    setupFormSubmission();
    setupModalEvents();
  }

  /**
   * Ensures travel date cannot be in the past (Indian Standard Time compliant)
   */
  function setupDateInputConstraints() {
    const dateInput = document.getElementById("travelDate");
    if (!dateInput) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const minDateString = `${year}-${month}-${day}`;

    dateInput.min = minDateString;

    // Default to today if empty
    if (!dateInput.value) {
      dateInput.value = minDateString;
    }

    // Default time to next hour rounded if empty
    const timeInput = document.getElementById("pickupTime");
    if (timeInput && !timeInput.value) {
      const nextHour = (today.getHours() + 1) % 24;
      timeInput.value = `${String(nextHour).padStart(2, "0")}:00`;
    }
  }

  /**
   * Auto-formats / cleans Indian phone numbers
   */
  function setupPhoneFormatting() {
    const phoneInput = document.getElementById("customerPhone");
    if (!phoneInput) return;

    phoneInput.addEventListener("input", function (e) {
      // Keep only numbers and plus
      let val = e.target.value.replace(/[^\d+]/g, "");
      e.target.value = val;
      clearFieldError("customerPhone");
    });
  }

  /**
   * Quick chip toggles for special requests
   */
  function setupSpecialRequestChips() {
    const chips = document.querySelectorAll(".special-chip");
    const requestsTextarea = document.getElementById("specialRequests");
    if (!requestsTextarea || !chips.length) return;

    chips.forEach(chip => {
      chip.addEventListener("click", function () {
        const chipText = this.getAttribute("data-tag") || this.textContent.trim();
        let currentVal = requestsTextarea.value.trim();

        if (this.classList.contains("active")) {
          // Remove tag
          this.classList.remove("active");
          const regex = new RegExp(`(?:,\\s*)?${chipText}|${chipText}(?:,\\s*)?`, "gi");
          currentVal = currentVal.replace(regex, "").replace(/^,\s*|,\s*$/g, "").trim();
        } else {
          // Add tag
          this.classList.add("active");
          if (currentVal.length > 0) {
            currentVal += `, ${chipText}`;
          } else {
            currentVal = chipText;
          }
        }
        requestsTextarea.value = currentVal;
      });
    });
  }

  /**
   * Handles Pre-selection of Service Type from any section
   */
  function selectService(serviceType, scrollIntoView = true) {
    const serviceSelect = document.getElementById("serviceType");
    if (serviceSelect) {
      // Find matching option
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
   * Handles Pre-selection of Vehicle from Fleet section
   */
  function selectVehicle(vehicleName, scrollIntoView = true) {
    const vehicleSelect = document.getElementById("vehiclePreference");
    if (vehicleSelect) {
      let matched = false;
      for (let i = 0; i < vehicleSelect.options.length; i++) {
        if (vehicleSelect.options[i].text.toLowerCase().includes(vehicleName.toLowerCase()) ||
            vehicleName.toLowerCase().includes(vehicleSelect.options[i].value.toLowerCase())) {
          vehicleSelect.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched && vehicleSelect.options.length > 0) {
        // Fallback to closest or default
        vehicleSelect.selectedIndex = 1;
      }
    }

    if (window.SafeWayAnalytics) {
      window.SafeWayAnalytics.trackEvent("vehicle_selected", { vehicle: vehicleName });
    }

    if (scrollIntoView) {
      scrollToBookingSection();
    }
  }

  /**
   * Smoothly scrolls to the booking section
   */
  function scrollToBookingSection() {
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = document.getElementById("customerName");
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 600);
      }
    }
  }

  /**
   * Form validation with friendly, clear error messages
   */
  function validateForm() {
    let isValid = true;

    // 1. Full Name
    const nameInput = document.getElementById("customerName");
    const nameVal = nameInput ? nameInput.value.trim() : "";
    if (!nameVal || nameVal.length < 2) {
      setFieldError("customerName", "Please enter your full name.");
      isValid = false;
    } else {
      clearFieldError("customerName");
    }

    // 2. Phone Number (Valid Indian mobile: 10 digits, optionally with +91)
    const phoneInput = document.getElementById("customerPhone");
    const rawPhone = phoneInput ? phoneInput.value.trim().replace(/\D/g, "") : "";
    // If entered 12 digits starting with 91, strip 91 for length check
    const digitsOnly = rawPhone.startsWith("91") && rawPhone.length === 12 ? rawPhone.substring(2) : rawPhone;
    const phonePattern = /^[6-9]\d{9}$/;

    if (!digitsOnly || !phonePattern.test(digitsOnly)) {
      setFieldError("customerPhone", "Please enter a valid 10-digit Indian mobile number (e.g. 9980838845).");
      isValid = false;
    } else {
      clearFieldError("customerPhone");
    }

    // 3. Email (optional, but validate format if present)
    const emailInput = document.getElementById("customerEmail");
    const emailVal = emailInput ? emailInput.value.trim() : "";
    if (emailVal) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        setFieldError("customerEmail", "Please enter a valid email address, or leave it blank.");
        isValid = false;
      } else {
        clearFieldError("customerEmail");
      }
    } else {
      clearFieldError("customerEmail");
    }

    // 4. Service Type
    const serviceInput = document.getElementById("serviceType");
    if (!serviceInput || !serviceInput.value) {
      setFieldError("serviceType", "Please choose your service type (Local, Airport, Outstation, or Round Trip).");
      isValid = false;
    } else {
      clearFieldError("serviceType");
    }

    // 5. Pickup Location
    const pickupInput = document.getElementById("pickupLocation");
    const pickupVal = pickupInput ? pickupInput.value.trim() : "";
    if (!pickupVal) {
      setFieldError("pickupLocation", "Please enter your pickup location in Bengaluru.");
      isValid = false;
    } else {
      clearFieldError("pickupLocation");
    }

    // 6. Drop Location
    const dropInput = document.getElementById("dropLocation");
    const dropVal = dropInput ? dropInput.value.trim() : "";
    if (!dropVal) {
      setFieldError("dropLocation", "Please enter your drop or destination location.");
      isValid = false;
    } else {
      clearFieldError("dropLocation");
    }

    // 7. Travel Date
    const dateInput = document.getElementById("travelDate");
    const dateVal = dateInput ? dateInput.value : "";
    if (!dateVal) {
      setFieldError("travelDate", "Please select your travel date.");
      isValid = false;
    } else {
      const selected = new Date(dateVal);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      if (selected < today) {
        setFieldError("travelDate", "Travel date cannot be in the past. Please select today or a future date.");
        isValid = false;
      } else {
        clearFieldError("travelDate");
      }
    }

    // 8. Pickup Time
    const timeInput = document.getElementById("pickupTime");
    if (!timeInput || !timeInput.value) {
      setFieldError("pickupTime", "Please choose your preferred pickup time.");
      isValid = false;
    } else {
      clearFieldError("pickupTime");
    }

    // 9. Passengers
    const passengerInput = document.getElementById("passengerCount");
    const passengers = passengerInput ? parseInt(passengerInput.value, 10) : 1;
    if (isNaN(passengers) || passengers < 1) {
      setFieldError("passengerCount", "Please select at least 1 passenger.");
      isValid = false;
    } else {
      clearFieldError("passengerCount");
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
   * Sets up form submission handler
   */
  function setupFormSubmission() {
    formElement.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateForm()) {
        // Focus first field with error
        const firstError = formElement.querySelector(".input-error");
        if (firstError) {
          firstError.focus();
        }
        return;
      }

      // Collect form data
      const data = {
        name: document.getElementById("customerName").value.trim(),
        phone: document.getElementById("customerPhone").value.trim(),
        email: document.getElementById("customerEmail") ? document.getElementById("customerEmail").value.trim() : "",
        service: document.getElementById("serviceType").value,
        pickup: document.getElementById("pickupLocation").value.trim(),
        drop: document.getElementById("dropLocation").value.trim(),
        date: document.getElementById("travelDate").value,
        time: document.getElementById("pickupTime").value,
        passengers: document.getElementById("passengerCount").value,
        vehicle: document.getElementById("vehiclePreference").value,
        specialRequests: document.getElementById("specialRequests") ? document.getElementById("specialRequests").value.trim() : ""
      };

      lastSubmissionData = data;

      // Track analytics
      if (window.SafeWayAnalytics) {
        window.SafeWayAnalytics.trackEvent("booking_form_submitted", {
          service: data.service,
          vehicle: data.vehicle,
          passengers: data.passengers
        });
      }

      // Generate structured message
      currentPreparedMessage = window.SafeWayWhatsApp.generateBookingMessage(data);

      // Show confirmation modal
      showSuccessModal(data);

      // Automatically launch WhatsApp in new tab for best frictionless experience
      window.SafeWayWhatsApp.openWhatsApp(currentPreparedMessage);
    });
  }

  /**
   * Displays the "Booking Request Ready" modal
   */
  function showSuccessModal(data) {
    const modal = document.getElementById("bookingModal");
    if (!modal) return;

    // Populate preview elements
    const summaryName = document.getElementById("summaryCustomerName");
    const summaryTrip = document.getElementById("summaryTripDetails");
    const summaryService = document.getElementById("summaryService");

    if (summaryName) summaryName.textContent = data.name;
    if (summaryService) summaryService.textContent = data.service;
    if (summaryTrip) {
      summaryTrip.innerHTML = `
        <strong>Pickup:</strong> ${escapeHtml(data.pickup)}<br>
        <strong>Drop:</strong> ${escapeHtml(data.drop)}<br>
        <strong>Date & Time:</strong> ${escapeHtml(data.date)} at ${escapeHtml(data.time)}<br>
        <strong>Passengers:</strong> ${escapeHtml(data.passengers)} | <strong>Vehicle:</strong> ${escapeHtml(data.vehicle)}
      `;
    }

    modal.classList.add("modal-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent background scroll

    // Focus WhatsApp action button
    const continueBtn = document.getElementById("btnContinueWhatsApp");
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

    const closeBtns = modal.querySelectorAll("[data-close-modal]");
    closeBtns.forEach(btn => {
      btn.addEventListener("click", closeModal);
    });

    // Close on clicking backdrop
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Esc key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("modal-open")) {
        closeModal();
      }
    });

    // Continue to WhatsApp button
    const continueBtn = document.getElementById("btnContinueWhatsApp");
    if (continueBtn) {
      continueBtn.addEventListener("click", function () {
        if (currentPreparedMessage) {
          window.SafeWayWhatsApp.openWhatsApp(currentPreparedMessage);
        }
      });
    }

    // Copy message fallback button
    const copyBtn = document.getElementById("btnCopyWhatsAppMessage");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        if (currentPreparedMessage) {
          navigator.clipboard.writeText(currentPreparedMessage).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied to Clipboard!";
            setTimeout(() => {
              copyBtn.textContent = originalText;
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
    closeModal
  };
})();

if (typeof window !== "undefined") {
  window.SafeWayBooking = SafeWayBooking;
}
