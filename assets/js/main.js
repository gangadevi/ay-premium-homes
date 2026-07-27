/* =========================================================================
   AY PREMIUM HOMES — main.js
   Responsibilities:
   1. Load shared partials (header, footer, enquiry modal, floating buttons)
      into every page via fetch — single source of truth, zero duplication.
   2. Wire up cross-page behaviour that depends on those partials once they
      exist in the DOM: nav toggle, active-link highlighting, modal
      triggers, back-to-top visibility, current year, AOS init.
   No inline handlers are used anywhere — everything binds here via
   addEventListener / data-attributes.
   ========================================================================= */

(function () {
  "use strict";

  const PARTIALS = [
    { selector: "#site-header", url: "/partials/header.html" },
    { selector: "#site-footer", url: "/partials/footer.html" },
    { selector: "#enquiry-modal-root", url: "/partials/enquiry-modal.html" },
    { selector: "#floating-buttons-root", url: "/partials/floating-buttons.html" },
  ];

  /**
   * Fetches a partial and injects its HTML into the target mount point.
   * Resolves even on failure so Promise.all() doesn't block the rest of
   * the page from initialising if one partial is unreachable.
   */
  function loadPartial({ selector, url }) {
    const mount = document.querySelector(selector);
    if (!mount) return Promise.resolve();

    return fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        return response.text();
      })
      .then((html) => {
        mount.innerHTML = html;
      })
      .catch((error) => {
        console.error("[AY] partial load error:", error);
      });
  }

  function loadAllPartials() {
    return Promise.all(PARTIALS.map(loadPartial));
  }

  /* ---- Fullscreen overlay nav ----------------------------------------
     One hamburger, one behaviour, every breakpoint: toggling adds/removes
     .ay-nav-open on <html>, which CSS keys everything off — the overlay
     reveal, the hamburger→X morph, the body scroll lock, and hiding the
     floating button stack while the overlay is up. */
  function initOverlayNav() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const overlay = document.querySelector("[data-overlay-nav]");
    const label = document.querySelector("[data-menu-toggle-label]");
    if (!toggle || !overlay) return;

    function setOpen(isOpen) {
      document.documentElement.classList.toggle("ay-nav-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      if (label) label.textContent = isOpen ? "Close" : "Menu";
      overlay.toggleAttribute("inert", !isOpen);
      overlay.setAttribute("aria-hidden", String(!isOpen));
    }

    toggle.addEventListener("click", () => {
      setOpen(!document.documentElement.classList.contains("ay-nav-open"));
    });

    overlay.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.documentElement.classList.contains("ay-nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---- Header background — transparent over the hero, solid once
     scrolled ------------------------------------------------------------ */
  function initHeaderScrollState() {
    const header = document.querySelector("[data-site-header]");
    if (!header) return;

    const SCROLLED_AFTER_PX = 60;
    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > SCROLLED_AFTER_PX);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---- Active nav link, driven by body[data-page] --------------------
     Matches every link with this key — the desktop nav and the overlay
     nav both render a link per page, so both need the state. */
  function initActiveNavLink() {
    const currentPage = document.body.getAttribute("data-page");
    if (!currentPage) return;

    document.querySelectorAll(`[data-nav-key="${currentPage}"]`).forEach((link) => {
      link.classList.add("is-active");
    });
  }

  /* ---- Enquiry modal triggers ----------------------------------------
     Bootstrap's Modal API is used programmatically (no inline
     data-bs-toggle needed on every trigger scattered across pages) so any
     element on any page can open the shared modal by adding
     [data-enquiry-trigger]. */
  function initEnquiryTriggers() {
    const modalEl = document.getElementById("enquiryModal");
    if (!modalEl || typeof bootstrap === "undefined") return;

    const modalInstance = new bootstrap.Modal(modalEl);

    document.querySelectorAll("[data-enquiry-trigger]").forEach((trigger) => {
      trigger.addEventListener("click", () => modalInstance.show());
    });
  }

  /* ---- Back-to-top floating button ------------------------------------ */
  function initBackToTop() {
    const btn = document.querySelector("[data-back-to-top]");
    if (!btn) return;

    const SHOW_AFTER_PX = 480;

    window.addEventListener("scroll", () => {
      btn.classList.toggle("is-visible", window.scrollY > SHOW_AFTER_PX);
    });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- Footer current year -------------------------------------------- */
  function initCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---- Project filter tabs — generic: wires up any [data-project-filters]
     button bar to the nearest [data-project-grid] within the same section,
     toggling cards by their [data-status] against the clicked [data-filter].
     Same markup pattern already exists on /projects/, so this activates
     both that page's filter bar and the Featured Projects one on Home. ---- */
  function initProjectFilters() {
    document.querySelectorAll("[data-project-filters]").forEach((filterBar) => {
      const scope = filterBar.closest("main") || document;
      const grid = scope.querySelector("[data-project-grid]");
      const buttons = filterBar.querySelectorAll("[data-filter]");
      if (!grid || !buttons.length) return;

      const cards = grid.querySelectorAll("[data-status]");

      function applyFilter(filter) {
        cards.forEach((card) => {
          const matches = filter === "all" || card.getAttribute("data-status") === filter;
          card.classList.toggle("is-hidden", !matches);
        });
      }

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          buttons.forEach((b) => {
            b.classList.remove("is-active");
            b.setAttribute("aria-selected", "false");
          });
          btn.classList.add("is-active");
          btn.setAttribute("aria-selected", "true");
          applyFilter(btn.getAttribute("data-filter"));
        });
      });
    });
  }

  /* ---- Stats counters — count up from 0 once the section scrolls into
     view, driven by [data-counter-to] / [data-counter-suffix] on each
     number's inner <span>. Runs once per element, and jumps straight to
     the final value when the user prefers reduced motion. ---------------- */
  function initStatsCounters() {
    const counters = document.querySelectorAll("[data-counter-to]");
    if (!counters.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const COUNT_DURATION_MS = 1800;

    function animateCounter(el) {
      const target = parseFloat(el.getAttribute("data-counter-to"));
      const suffix = el.getAttribute("data-counter-suffix") || "";

      if (prefersReducedMotion || !window.requestAnimationFrame) {
        el.textContent = target + suffix;
        return;
      }

      const startTime = performance.now();
      function tick(now) {
        const progress = Math.min((now - startTime) / COUNT_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (typeof IntersectionObserver === "undefined") {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* ---- AOS (scroll animation) init ------------------------------------ */
  function initAOS() {
    if (typeof AOS === "undefined") return;
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }

  /* ---- Bootstrap sequence --------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    loadAllPartials().then(() => {
      initOverlayNav();
      initHeaderScrollState();
      initActiveNavLink();
      initEnquiryTriggers();
      initBackToTop();
      initCurrentYear();
      initProjectFilters();
      initStatsCounters();
      initAOS();

      // Notify other scripts (e.g. email.js) that shared partials —
      // including the enquiry form — now exist in the DOM.
      document.dispatchEvent(new CustomEvent("ay:partials-ready"));
    });
  });
})();
