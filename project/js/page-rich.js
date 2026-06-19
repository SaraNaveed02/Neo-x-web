/** Scroll reveal for rich page sections */
(function () {
    'use strict';
    function init() {
        document.querySelectorAll('.pr-reveal').forEach((el, i) => {
            el.style.transitionDelay = (i % 4) * 0.08 + 's';
        });
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
        document.querySelectorAll('.pr-reveal').forEach((el) => obs.observe(el));
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
