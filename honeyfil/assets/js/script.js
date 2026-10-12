/* ==========================================================================
   HONEYFIL — script.js (vanilla JS, no dependencies beyond Bootstrap bundle)
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initStickyCta();
    initBackToTop();
    initYear();
    initOrderCountdown();
    initPricingSelect();
    initNavShrink();
  });

  /* Sticky mobile CTA — appears after hero is scrolled past */
  function initStickyCta() {
    var sticky = document.getElementById("stickyCta");
    var hero = document.getElementById("hero");
    if (!sticky || !hero) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            sticky.classList.remove("show-sticky");
          } else {
            sticky.classList.add("show-sticky");
          }
        });
      },
      { threshold: 0 }
    );
    observer.observe(hero);
  }

  /* Back-to-top button */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 900) {
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

  /* Footer year */
  function initYear() {
    var el = document.getElementById("currentYear");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* Simple evergreen order-window countdown (resets daily at midnight local time) */
  function initOrderCountdown() {
    var elH = document.getElementById("cdHours");
    var elM = document.getElementById("cdMinutes");
    var elS = document.getElementById("cdSeconds");
    if (!elH || !elM || !elS) return;

    function pad(n) {
      return n < 10 ? "0" + n : "" + n;
    }

    function tick() {
      var now = new Date();
      var midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      var diff = Math.max(0, midnight - now);
      var hours = Math.floor(diff / 3600000);
      var minutes = Math.floor((diff % 3600000) / 60000);
      var seconds = Math.floor((diff % 60000) / 1000);
      elH.textContent = pad(hours);
      elM.textContent = pad(minutes);
      elS.textContent = pad(seconds);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* Pricing card selection highlight + updates sticky/CTA hrefs if data-buy-url present */
  function initPricingSelect() {
    var cards = document.querySelectorAll("[data-pkg]");
    if (!cards.length) return;
    cards.forEach(function (card) {
      card.addEventListener("click", function (e) {
        if (e.target.tagName === "A") return; // let link work natively
        var link = card.querySelector("a.btn");
        if (link) link.click();
      });
    });
  }

  /* Shrink navbar on scroll for a tighter, premium feel */
  function initNavShrink() {
    var nav = document.getElementById("hfNavbar");
    if (!nav) return;
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 40) {
          nav.style.padding = "0.5rem 0";
        } else {
          nav.style.padding = "0.85rem 0";
        }
      },
      { passive: true }
    );
  }
})();
