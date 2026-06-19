/**
 * NEOXWEB Case Study — animations & interactions
 */
(function () {
    'use strict';

    /* Scroll reveal */
    function initReveal() {
        const els = document.querySelectorAll('.cs-reveal');
        if (!els.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        els.forEach((el) => observer.observe(el));
    }

    /* Animated KPI counters */
    function animateCounter(el, target, suffix, duration) {
        const start = performance.now();
        const isDecimal = String(target).includes('.');
        const numTarget = parseFloat(target);

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = numTarget * eased;
            el.textContent = isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = isDecimal ? numTarget.toFixed(1) : (suffix === 'M' ? numTarget + 'M+' : numTarget.toLocaleString());
        }

        requestAnimationFrame(tick);
    }

    function initCounters() {
        const kpis = document.querySelectorAll('[data-count]');
        if (!kpis.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    if (el.dataset.counted) return;
                    el.dataset.counted = '1';
                    const target = el.dataset.count;
                    const suffix = el.dataset.suffix || '';
                    const display = el.querySelector('.cs-kpi__number') || el;
                    animateCounter(display, target, suffix, 1800);
                    observer.unobserve(el);
                });
            },
            { threshold: 0.3 }
        );

        kpis.forEach((k) => observer.observe(k));
    }

    /* Light / dark theme toggle */
    function initThemeToggle() {
        const btn = document.getElementById('csThemeToggle');
        document.body.classList.remove('case-study--light');
        localStorage.setItem('cs-theme', 'dark');
        if (!btn) return;

        btn.addEventListener('click', () => {
            document.body.classList.toggle('case-study--light');
            const isLight = document.body.classList.contains('case-study--light');
            localStorage.setItem('cs-theme', isLight ? 'light' : 'dark');
            btn.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        });

        if (document.body.classList.contains('case-study--light')) {
            btn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    /* Portfolio filter */
    function initFilter() {
        const bar = document.getElementById('portfolioFilter');
        const grid = document.getElementById('portfolioGrid');
        if (!bar || !grid) return;

        bar.addEventListener('click', (e) => {
            const btn = e.target.closest('.ui-filter-btn, .cs-filter-btn');
            if (!btn) return;
            bar.querySelectorAll('.ui-filter-btn, .cs-filter-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            grid.querySelectorAll('[data-category]').forEach((card) => {
                card.style.display = filter === 'all' || card.dataset.category === filter ? '' : 'none';
            });
        });
    }

    /* Gallery lightbox (simple) */
    function initGallery() {
        document.querySelectorAll('.cs-gallery__item').forEach((item) => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (!img) return;
                const overlay = document.createElement('div');
                overlay.className = 'cs-lightbox';
                overlay.innerHTML = `<div class="cs-lightbox__inner"><img src="${img.src}" alt=""><button type="button" aria-label="Close">&times;</button></div>`;
                overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.92);display:grid;place-items:center;padding:2rem;cursor:pointer;';
                overlay.querySelector('.cs-lightbox__inner').style.cssText = 'max-width:min(1100px,100%);position:relative;';
                overlay.querySelector('img').style.cssText = 'width:100%;border-radius:12px;max-height:85vh;object-fit:contain;';
                overlay.querySelector('button').style.cssText = 'position:absolute;top:-2rem;right:0;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;';
                document.body.appendChild(overlay);
                const close = () => overlay.remove();
                overlay.addEventListener('click', (e) => { if (e.target === overlay || e.target.tagName === 'BUTTON') close(); });
                document.addEventListener('keydown', function esc(ev) { if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
            });
        });
    }

    function init() {
        initReveal();
        initCounters();
        initThemeToggle();
        initFilter();
        initGallery();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
