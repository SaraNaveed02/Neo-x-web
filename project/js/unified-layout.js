/**
 * Loads unified header + footer into page slots
 */
(function () {
    'use strict';

    function scriptBase() {
        const s = document.querySelector('script[src*="unified-layout.js"]');
        if (s?.src) return s.src.replace(/js\/unified-layout\.js.*$/, '');
        const path = window.location.pathname;
        const i = path.lastIndexOf('/');
        return i >= 0 ? path.substring(0, i + 1) : './';
    }

    function markActiveNav() {
        const current = document.body.dataset.uiNav || location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.ui-nav a[href]').forEach((a) => {
            const href = a.getAttribute('href');
            if (href === current) {
                a.classList.add('ui-nav-active');
                a.style.color = 'var(--ui-blue)';
                a.style.fontWeight = '600';
            }
        });
    }

    async function injectLayout() {
        const headerSlot = document.getElementById('ui-header-slot');
        const footerSlot = document.getElementById('ui-footer-slot');
        if (!headerSlot && !footerSlot) return;

        const base = scriptBase();
        try {
            const tasks = [];
            if (headerSlot) {
                headerSlot.innerHTML = '<div class="ui-header-skeleton" aria-hidden="true"></div>';
                tasks.push(
                    fetch(base + 'unified-header.html')
                        .then((r) => r.text())
                        .then((html) => { headerSlot.innerHTML = html; })
                );
            }
            if (footerSlot) {
                tasks.push(
                    fetch(base + 'unified-footer.html')
                        .then((r) => r.text())
                        .then((html) => { footerSlot.innerHTML = html; })
                );
            }
            await Promise.all(tasks);
            markActiveNav();
            if (typeof window.initUnifiedNav === 'function') {
                window.initUnifiedNav.__reset?.();
                window.initUnifiedNav();
            }
            if (typeof window.initUnifiedApp === 'function') {
                window.markAppLinks?.(document);
            }
        } catch (err) {
            console.warn('Unified layout could not load:', err);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectLayout);
    } else {
        injectLayout();
    }
})();
