/* ==========================================================================
   ALPHA ROCK — script.js (Vanilla JS, no frameworks)
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initStickyCta();
    initBackToTop();
    initSmoothScroll();
    initPricingSelect();
    initContactForm();
    initYear();
  });

  /* Sticky mobile "Buy Now" bar appears after hero is scrolled past */
  function initStickyCta() {
    var bar = document.getElementById("stickyCta");
    var hero = document.getElementById("hero");
    if (!bar || !hero) return;

    var toggle = function () {
      var heroBottom = hero.getBoundingClientRect().bottom;
      if (heroBottom < 0) {
        bar.classList.add("show");
      } else {
        bar.classList.remove("show");
      }
    };
    window.addEventListener("scroll", toggle, { passive: true });
    toggle();
  }

  /* Back-to-top button */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 700) {
          btn.classList.add("show");
        } else {
          btn.classList.remove("show");
        }
      },
      { passive: true }
    );
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Smooth-scroll for in-page anchor links (nav, CTAs) */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var offset = 90;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });

        var navCollapse = document.getElementById("mainNav");
        if (navCollapse && navCollapse.classList.contains("show")) {
          var bsCollapse = bootstrap && bootstrap.Collapse ? bootstrap.Collapse.getInstance(navCollapse) : null;
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }

  /* Pricing package selector — keeps the sticky bar + main CTA in sync */
  function initPricingSelect() {
    var cards = document.querySelectorAll("[data-package]");
    var stickyPrice = document.querySelector("#stickyCta .price-mini");
    if (!cards.length) return;

    cards.forEach(function (card) {
      var buyBtn = card.querySelector("[data-buy]");
      if (!buyBtn) return;
      buyBtn.addEventListener("click", function () {
        cards.forEach(function (c) { c.classList.remove("is-selected"); });
        card.classList.add("is-selected");
        var price = card.getAttribute("data-price");
        if (stickyPrice && price) stickyPrice.textContent = price;
      });
    });
  }

  /* Basic client-side validation for the contact form (no external deps) */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var fields = form.querySelectorAll("[required]");

      fields.forEach(function (field) {
        field.classList.remove("is-invalid");
        if (!field.value || (field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value))) {
          field.classList.add("is-invalid");
          valid = false;
        }
      });

      var successBox = document.getElementById("contactSuccess");
      if (valid) {
        form.reset();
        if (successBox) {
          successBox.classList.remove("d-none");
          successBox.setAttribute("tabindex", "-1");
          successBox.focus();
        }
      }
    });
  }

  function initYear() {
    var yearEls = document.querySelectorAll(".current-year");
    var year = new Date().getFullYear();
    yearEls.forEach(function (el) { el.textContent = year; });
  }
})();
