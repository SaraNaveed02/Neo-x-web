/*
    FILE: site-stats.js
    PURPOSE: Load real stats from API and update frontend
*/

(function () {
    const STAT_SELECTORS = '.hero-statcards, .auth-brand-stats, .stat-grid, section.web-stats-band[data-site-stats]';

    function pageSlugFromPath() {
        const file = window.location.pathname.split('/').pop() || 'index.html';
        if (file === 'index.html') return 'home';
        if (file === 'about.html') return 'about';
        if (file === 'login.html') return 'login';
        return file.replace(/\.html$/, '');
    }

    function applyToCards(container, stats) {
        if (!container || !stats || !stats.length) return;
        const cards = Array.from(container.children);
        stats.forEach((stat, index) => {
            const card = cards[index];
            if (!card) return;
            const valueEl = card.querySelector('strong, h3');
            const labelEl = card.querySelector('span, p');
            if (valueEl) valueEl.textContent = stat.value;
            if (labelEl) labelEl.textContent = stat.label;
        });
    }

    function applySiteStats(pages) {
        const slug = pageSlugFromPath();
        const global = pages.global || [];

        document.querySelectorAll('[data-site-stats]').forEach((el) => {
            const key = el.getAttribute('data-site-stats');
            applyToCards(el, pages[key] || global);
        });

        const homeCards = document.querySelector('.hero-statcards');
        if (homeCards && !homeCards.hasAttribute('data-site-stats')) {
            applyToCards(homeCards, pages.home || global);
        }

        const loginCards = document.querySelector('.auth-brand-stats');
        if (loginCards && !loginCards.hasAttribute('data-site-stats')) {
            applyToCards(loginCards, pages.login || global);
        }

        const aboutGrid = document.querySelector('.stat-grid');
        if (aboutGrid && !aboutGrid.hasAttribute('data-site-stats')) {
            applyToCards(aboutGrid, pages.about || global);
        }

        document.querySelectorAll('section.web-stats-band[data-site-stats]').forEach((section) => {
            const pageKey = section.getAttribute('data-site-stats') || slug;
            const stats = pages[pageKey] || pages.global || global;
            const items = section.querySelectorAll('.web-stat-item');
            stats.forEach((stat, index) => {
                const item = items[index];
                if (!item) return;
                const valueEl = item.querySelector('strong');
                const labelEl = item.querySelector('span');
                if (valueEl) valueEl.textContent = stat.value;
                if (labelEl) labelEl.textContent = stat.label;
            });
        });
    }

    async function loadSiteStats() {
        if (!document.querySelector(STAT_SELECTORS)) return;

        try {
            const api = window.NexuraAPI;
            if (!api) return;
            const result = await api.getPublicStats();
            applySiteStats(result.data?.pages || {});
        } catch (err) {
            console.warn('Site stats API:', err.message);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSiteStats);
    } else {
        loadSiteStats();
    }
})();
