/*
    FILE: animations.js
    PURPOSE: Scroll-reveal animations for fade-up elements (content stays visible)
*/

document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.fade-up');
    if (!items.length) return;

    const reveal = (el) => {
        el.classList.add('revealed');
        el.classList.add('visible');
    };

    /* Always show above-the-fold copy immediately */
    items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
            reveal(el);
        }
    });

    if (!('IntersectionObserver' in window)) {
        items.forEach(reveal);
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    items.forEach((el) => observer.observe(el));
});
