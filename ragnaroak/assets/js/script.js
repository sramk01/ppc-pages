/* =============================================================
   RAGNAROAK — script.js (Vanilla JS, no frameworks)
   ============================================================= */
document.addEventListener('DOMContentLoaded', function () {

  var stickyCta = document.getElementById('stickyCta');
  var hero = document.getElementById('hero');
  if (stickyCta && hero) {
    var toggleSticky = function () {
      var heroBottom = hero.getBoundingClientRect().bottom;
      if (heroBottom < 0 && window.innerWidth < 992) {
        stickyCta.classList.add('show');
      } else {
        stickyCta.classList.remove('show');
      }
    };
    window.addEventListener('scroll', toggleSticky, { passive: true });
    window.addEventListener('resize', toggleSticky);
    toggleSticky();
  }

  /* Animate the Performance Rune Circle arcs on load */
  var runeArcs = document.querySelectorAll('.rune-arc');
  runeArcs.forEach(function (arc, i) {
    var len = arc.getAttribute('data-length');
    var pct = arc.getAttribute('data-pct');
    if (!len || !pct) return;
    var offset = len - (len * pct) / 100;
    arc.style.strokeDasharray = len;
    arc.style.strokeDashoffset = len;
    setTimeout(function () {
      arc.style.transition = 'stroke-dashoffset 1.3s ease-out';
      arc.style.strokeDashoffset = offset;
    }, 150 + i * 120);
  });

  var priceCards = document.querySelectorAll('.price-card');
  priceCards.forEach(function (card) {
    card.addEventListener('click', function () {
      priceCards.forEach(function (c) { c.classList.remove('popular'); });
      card.classList.add('popular');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  var yearEl = document.getElementById('currentYear');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
});
