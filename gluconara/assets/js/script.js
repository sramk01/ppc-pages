/* =========================================================
   GLUCONARA — script.js
   Vanilla JS only. No frameworks.
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initBackToTop();
    initStickyCta();
    initPricingSelect();
    initSmoothAnchors();
    initYear();
  });

  /* Back to top button */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Mobile sticky CTA appears after hero is scrolled past */
  function initStickyCta() {
    var sticky = document.querySelector(".sticky-cta");
    var hero = document.querySelector(".hero");
    if (!sticky || !hero) return;
    var heroBottom = hero.offsetTop + hero.offsetHeight;
    window.addEventListener("scroll", function () {
      if (window.scrollY > heroBottom) {
        sticky.classList.add("show");
      } else {
        sticky.classList.remove("show");
      }
    });
  }

  /* Pricing card selection highlight (visual only, links still work) */
  function initPricingSelect() {
    var cards = document.querySelectorAll("[data-price-card]");
    cards.forEach(function (card) {
      card.addEventListener("click", function (e) {
        if (e.target.tagName.toLowerCase() === "a") return;
        cards.forEach(function (c) { c.classList.remove("featured"); });
        card.classList.add("featured");
      });
    });
  }

  /* Smooth scroll for in-page anchors (fallback for browsers ignoring CSS) */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var targetId = this.getAttribute("href");
        if (targetId.length < 2) return;
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* Auto-update footer year */
  function initYear() {
    var el = document.getElementById("current-year");
    if (el) el.textContent = new Date().getFullYear();
  }
})();
