/* =====================================================
   NailsCleanPro — Vanilla JS
   No frameworks. Progressive enhancement only.
===================================================== */
document.addEventListener('DOMContentLoaded', function () {

    // Sticky header shadow on scroll
    var header = document.querySelector('.site-header');
    if (header) {
        var toggleHeaderShadow = function () {
            if (window.scrollY > 8) {
                header.style.boxShadow = '0 8px 24px -16px rgba(13,59,102,.35)';
            } else {
                header.style.boxShadow = 'none';
            }
        };
        document.addEventListener('scroll', toggleHeaderShadow, { passive: true });
        toggleHeaderShadow();
    }

    // Close mobile nav after clicking a link
    var navLinks = document.querySelectorAll('#mainNav .nav-link, #mainNav .btn');
    var navCollapseEl = document.getElementById('mainNav');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navCollapseEl && navCollapseEl.classList.contains('show') && window.bootstrap) {
                var collapseInstance = window.bootstrap.Collapse.getOrCreateInstance(navCollapseEl);
                collapseInstance.hide();
            }
        });
    });

    // Fade-in on scroll for cards (respects reduced motion)
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        var revealTargets = document.querySelectorAll(
            '.mini-card, .benefit-card, .ingredient-card, .research-card, .review-card, .price-card, .step-card'
        );
        revealTargets.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(16px)';
            el.style.transition = 'opacity .5s ease, transform .5s ease';
        });
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealTargets.forEach(function (el) { observer.observe(el); });
    }

    // Hide mobile sticky CTA when the in-page pricing section is visible
    var stickyCta = document.querySelector('.mobile-sticky-cta');
    var pricingSection = document.getElementById('pricing');
    if (stickyCta && pricingSection && 'IntersectionObserver' in window) {
        var ctaObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                stickyCta.style.display = entry.isIntersecting ? 'none' : 'block';
            });
        }, { threshold: 0.1 });
        ctaObserver.observe(pricingSection);
    }

});
