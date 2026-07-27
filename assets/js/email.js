/* =========================================================================
   AY PREMIUM HOMES — email.js
   EmailJS integration. Handles submission for:
   - #enquiryForm  (shared enquiry modal, injected by main.js)
   - #contactForm  (contact.html page form)
   Replace the placeholder IDs below with real EmailJS account values
   before going live.
   ========================================================================= */

(function () {
  "use strict";

  const EMAILJS_CONFIG = {
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    enquiryTemplateId: "YOUR_ENQUIRY_TEMPLATE_ID",
    contactTemplateId: "YOUR_CONTACT_TEMPLATE_ID",
  };

  function initEmailJS() {
    if (typeof emailjs === "undefined") return false;
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    return true;
  }

  function setStatus(form, state, message) {
    const statusEl = form.querySelector("[data-form-status]");
    if (!statusEl) return;
    statusEl.dataset.state = state;
    statusEl.textContent = message;
  }

  function setSubmitting(form, isSubmitting) {
    const btn = form.querySelector("[data-submit-btn]");
    if (!btn) return;
    btn.disabled = isSubmitting;
    btn.textContent = isSubmitting ? "Sending…" : btn.dataset.originalLabel || btn.textContent;
    if (!btn.dataset.originalLabel) btn.dataset.originalLabel = btn.textContent;
  }

  /**
   * Generic bind-and-submit handler shared by both forms so the enquiry
   * modal and the contact page behave identically.
   */
  function bindForm(formEl, templateId) {
    if (!formEl) return;

    formEl.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!formEl.checkValidity()) {
        formEl.reportValidity();
        return;
      }

      setSubmitting(formEl, true);
      setStatus(formEl, "", "");

      emailjs
        .sendForm(EMAILJS_CONFIG.serviceId, templateId, formEl)
        .then(() => {
          setStatus(formEl, "success", "Thank you — our team will reach out shortly.");
          formEl.reset();
        })
        .catch((error) => {
          console.error("[AY] EmailJS send error:", error);
          setStatus(formEl, "error", "Something went wrong. Please try again or call us directly.");
        })
        .finally(() => {
          setSubmitting(formEl, false);
        });
    });
  }

  function bindContactForm() {
    const contactForm = document.getElementById("contactForm");
    bindForm(contactForm, EMAILJS_CONFIG.contactTemplateId);
  }

  function bindEnquiryForm() {
    const enquiryForm = document.getElementById("enquiryForm");
    bindForm(enquiryForm, EMAILJS_CONFIG.enquiryTemplateId);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const ready = initEmailJS();
    if (!ready) console.warn("[AY] EmailJS SDK not found — form submission disabled.");

    bindContactForm(); // static markup, present immediately

    // Enquiry form only exists once main.js has injected the modal partial
    document.addEventListener("ay:partials-ready", bindEnquiryForm);
  });
})();
