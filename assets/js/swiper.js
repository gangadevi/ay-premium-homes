/* =========================================================================
   AY PREMIUM HOMES — swiper.js
   Centralised Swiper instance setup. Every slider on the site is opted
   into here by giving its container one of the class hooks below — pages
   never write their own <script> to configure Swiper, keeping every
   slider's behaviour consistent site-wide.
   ========================================================================= */

(function () {
  "use strict";

  function initHeroSlider() {
    const el = document.querySelector(".js-hero-slider");
    if (!el || typeof Swiper === "undefined") return;

    new Swiper(el, {
      loop: true,
      speed: 800,
      autoplay: { delay: 5500, disableOnInteraction: false },
      effect: "fade",
      fadeEffect: { crossFade: true },
      pagination: { el: ".js-hero-slider .swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".js-hero-slider .swiper-button-next",
        prevEl: ".js-hero-slider .swiper-button-prev",
      },
    });
  }

  function initProjectGallery() {
    const el = document.querySelector(".js-project-gallery");
    if (!el || typeof Swiper === "undefined") return;

    new Swiper(el, {
      loop: false,
      spaceBetween: 24,
      slidesPerView: 1.15,
      breakpoints: {
        576: { slidesPerView: 2, spaceBetween: 24 },
        992: { slidesPerView: 3, spaceBetween: 32 },
      },
      pagination: { el: ".js-project-gallery .swiper-pagination", clickable: true },
    });
  }

  function initProjectDetailGallery() {
    const el = document.querySelector(".js-detail-gallery");
    if (!el || typeof Swiper === "undefined") return;

    new Swiper(el, {
      loop: true,
      spaceBetween: 12,
      navigation: {
        nextEl: ".js-detail-gallery .swiper-button-next",
        prevEl: ".js-detail-gallery .swiper-button-prev",
      },
      thumbs: undefined, // wire up a thumbnail Swiper here if/when thumbnail markup is added
    });
  }

  function initTestimonialSlider() {
    const el = document.querySelector(".js-testimonial-slider");
    if (!el || typeof Swiper === "undefined") return;

    new Swiper(el, {
      loop: true,
      spaceBetween: 32,
      slidesPerView: 1,
      autoplay: { delay: 6500, disableOnInteraction: false },
      pagination: { el: ".js-testimonial-slider .swiper-pagination", clickable: true },
    });
  }

  // Loaded through a dynamically-created <script> tag (see the BASE_PATH
  // loader at the bottom of each page), so it can finish downloading
  // after DOMContentLoaded has already fired — check document.readyState
  // rather than assume the event is still to come.
  function onDomReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  onDomReady(() => {
    initHeroSlider();
    initProjectGallery();
    initProjectDetailGallery();
    initTestimonialSlider();
  });
})();
