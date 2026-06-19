/**
 * Upgrade all page heroes to premium style (same as home):
 * bg image + overlay + particles + text left
 */
(function () {
    var DEFAULT_HERO = 'assets/images/neoxweb/hero-bg-new.jpg';
    var IMGS = [
        'assets/images/neoxweb/hero-bg-new.jpg',
        'assets/images/neoxweb/web-dev.jpg',
        'assets/images/neoxweb/seo-new.jpg',
        'assets/images/neoxweb/ppc.jpg',
        'assets/images/neoxweb/social-media-new.jpg'
    ];

    function imgFor(i) {
        return IMGS[i % IMGS.length];
    }

    function ensureBg(hero, i) {
        var bg = hero.querySelector(':scope > .hero-tech-bg');
        if (!bg) {
            bg = document.createElement('div');
            bg.className = 'hero-tech-bg';
            bg.setAttribute('aria-hidden', 'true');
            hero.insertBefore(bg, hero.firstChild);
        }
        if (!bg.querySelector('img')) {
            var existing = hero.querySelector('.contact-hero-row__media img, .web-hero-visual img, .nx-portfolio-row__media img');
            var img = document.createElement('img');
            img.src = existing ? existing.src : imgFor(i);
            img.alt = '';
            img.width = 1536;
            img.height = 1024;
            img.decoding = 'async';
            if (i === 0) img.setAttribute('fetchpriority', 'high');
            bg.appendChild(img);
        }
    }

    function ensureOverlay(hero) {
        if (!hero.querySelector(':scope > .hero-bg-overlay')) {
            var el = document.createElement('div');
            el.className = 'hero-bg-overlay';
            el.setAttribute('aria-hidden', 'true');
            var canvas = hero.querySelector('.hero-particles-canvas');
            if (canvas) hero.insertBefore(el, canvas);
            else hero.appendChild(el);
        }
    }

    function ensureParticles(hero) {
        if (!hero.querySelector(':scope > .hero-particles-canvas')) {
            var canvas = document.createElement('canvas');
            canvas.className = 'hero-particles-canvas';
            canvas.setAttribute('aria-hidden', 'true');
            hero.appendChild(canvas);
        }
    }

    function unwrapRow(hero) {
        var row = hero.querySelector('.contact-hero-row, .nx-page-hero-row');
        if (!row) return null;
        var copy = row.querySelector('.nx-portfolio-row__copy, .contact-hero-inner');
        var frag = document.createDocumentFragment();
        if (copy) {
            while (copy.firstChild) frag.appendChild(copy.firstChild);
        }
        row.remove();
        return frag;
    }

    function normalizeInner(hero, extraNodes) {
        var inner = hero.querySelector(
            '.nx-page-hero__inner, .cs-container.nx-page-hero__inner, .contact-hero-premium__inner, .container.hero-grid--bg, .web-hero-grid, .svc-banner-hero__inner'
        );

        if (!inner) {
            inner = document.createElement('div');
            inner.className = 'container nx-page-hero__inner';
            hero.appendChild(inner);
        }

        inner.classList.add('hero-grid', 'hero-grid--bg', 'container', 'nx-page-hero__inner');

        var copy = inner.querySelector(':scope > .hero-copy');
        if (!copy) {
            copy = document.createElement('div');
            copy.className = 'hero-copy fade-up';
            var rowContent = unwrapRow(hero);
            if (rowContent && rowContent.childNodes.length) {
                copy.appendChild(rowContent);
            } else {
                while (inner.firstChild && !inner.firstChild.classList.contains('hero-copy')) {
                    copy.appendChild(inner.firstChild);
                }
            }
            inner.appendChild(copy);
        }

        if (extraNodes) {
            copy.appendChild(extraNodes);
        }

        var h1 = copy.querySelector('h1');
        if (h1 && !h1.classList.contains('hero-title')) {
            h1.classList.add('hero-title');
        }

        copy.querySelectorAll('p').forEach(function (p) {
            if (p.classList.contains('section-desc')) return;
            if (!p.classList.contains('hero-text') && !p.classList.contains('nx-page-hero__lead') &&
                !p.classList.contains('contact-hero-lead') && !p.classList.contains('web-hero-lead') &&
                !p.classList.contains('svc-banner-hero__lead')) {
                p.classList.add('hero-text');
            }
        });

        return inner;
    }

    function upgradeHero(hero, i) {
        if (hero.dataset.nxPremiumHero) return;
        if (hero.closest('.hero-section--premium-home')) {
            hero.dataset.nxPremiumHero = '1';
            return;
        }

        hero.classList.add(
            'hero-section--neoxweb',
            'hero-section--pro',
            'hero-section--premium'
        );

        ensureBg(hero, i);
        ensureOverlay(hero);
        ensureParticles(hero);
        normalizeInner(hero);

        hero.dataset.nxPremiumHero = '1';
    }

    function run() {
        var selectors = [
            '.nx-page-hero',
            '.cs-index-hero',
            '.contact-page-hero',
            '.web-hero',
            '.svc-banner-hero'
        ];

        document.querySelectorAll(selectors.join(',')).forEach(function (hero, i) {
            upgradeHero(hero, i);
        });

        document.querySelectorAll('.hero-section--premium-home, .hero-section--premium').forEach(function (hero, i) {
            if (!hero.dataset.nxPremiumHero) {
                ensureBg(hero, i);
                ensureOverlay(hero);
                ensureParticles(hero);
                hero.dataset.nxPremiumHero = '1';
            }
        });

        window.dispatchEvent(new Event('nx:heroes-upgraded'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
        run();
    }
})();
