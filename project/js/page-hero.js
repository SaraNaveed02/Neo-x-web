/**
 * Inner pages — homepage-style hero (bg image + dots rising bottom → top)
 */
(function () {
    var DEFAULT_HERO = 'assets/images/neoxweb/hero-bg-new.jpg';

    var SERVICE_HERO_IMAGES = {
        web: 'web-dev.jpg',
        mobile: 'portfolio-web.jpg',
        development: 'web-dev.jpg',
        'saas-platforms': 'web-dev.jpg',
        'ecommerce-strategy': 'portfolio-ppc.jpg',
        cloud: 'web-dev.jpg',
        'software-engineering': 'web-dev.jpg',
        'testing-qa': 'web-dev.jpg',
        'application-modernization': 'portfolio-web.jpg',
        'data-analytics': 'seo-new.jpg',
        ai: 'seo-new.jpg',
        'it-consulting': 'seo-new.jpg',
        'product-design': 'social-media-new.jpg',
        'graphic-design': 'portfolio-branding.jpg',
        'social-media-marketing': 'social-media-new.jpg',
        'video-editing': 'portfolio-web.jpg'
    };

    function pageKey() {
        return (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/i, '') || 'index';
    }

    function resolveHeroImage(hero) {
        if (hero && hero.dataset.heroImg) return hero.dataset.heroImg;

        var sideImg = hero && hero.querySelector('.web-hero-visual-icon img, .web-hero-visual img[src]');
        if (sideImg) {
            var src = sideImg.getAttribute('src') || '';
            if (/assets\/images\//.test(src)) return src;
        }

        var key = pageKey();
        var file = SERVICE_HERO_IMAGES[key] || 'hero-bg-new.jpg';
        return 'assets/images/neoxweb/' + file;
    }

    function buildHeroLayers(imgSrc) {
        return (
            '<div class="hero-neoxweb-bg" aria-hidden="true"></div>' +
            '<div class="hero-tech-bg" aria-hidden="true">' +
            '<img src="' + imgSrc + '" alt="" width="1536" height="1024" decoding="async" fetchpriority="high">' +
            '</div>' +
            '<div class="hero-globe-orbit" aria-hidden="true">' +
            '<span class="hero-globe-orbit__ring"></span>' +
            '<span class="hero-globe-orbit__ring hero-globe-orbit__ring--2"></span>' +
            '<span class="hero-globe-orbit__ring hero-globe-orbit__ring--3"></span>' +
            '</div>' +
            '<div class="hero-bg-overlay" aria-hidden="true"></div>'
        );
    }

    function stripOldHeroBg(hero) {
        [
            '.nx-page-hero__bg',
            '.nx-page-hero__overlay',
            '.svc-banner-hero__bg',
            '.svc-banner-hero__overlay',
            '.nx-hero-img__bg',
            '.nx-hero-img__overlay',
            '.cs-hero__glow'
        ].forEach(function (sel) {
            hero.querySelectorAll(sel).forEach(function (el) { el.remove(); });
        });
    }

    function ensureHeroParticles(hero) {
        if (!hero || hero.dataset.nxParticlesCanvas === '1') return;
        if (hero.dataset.nxParticlesInit === '1') return;

        var canvas = hero.querySelector('.nx-page-hero__particles, .hero-particles-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.className = 'hero-particles-canvas';
            canvas.setAttribute('aria-hidden', 'true');
            hero.appendChild(canvas);
        }

        hero.dataset.nxParticlesCanvas = '1';
        hero.dataset.nxParticlesInit = '1';
        initUpwardParticles(canvas, hero);
    }

    function mountHomeHeroBg(hero) {
        if (!hero || hero.dataset.nxHomeHeroBg === '1') return;
        if (document.body.classList.contains('home-page')) return;
        /* Technology pages — keep split hero with side image, no full-bleed bg */
        if (hero.classList.contains('web-hero') && hero.querySelector('.web-hero-visual-icon')) return;
        if (hero.classList.contains('hero-section') && hero.querySelector('.hero-tech-bg')) {
            ensureHeroParticles(hero);
            return;
        }

        hero.dataset.nxHomeHeroBg = '1';
        stripOldHeroBg(hero);
        hero.classList.add('hero-section--neoxweb', 'hero-section--pro');

        if (!hero.querySelector('.hero-tech-bg')) {
            var imgSrc = resolveHeroImage(hero);
            var wrap = document.createElement('div');
            wrap.innerHTML = buildHeroLayers(imgSrc);
            while (wrap.firstChild) {
                hero.insertBefore(wrap.firstChild, hero.firstChild);
            }
        }

        ensureHeroParticles(hero);
    }

    function heroSelectors() {
        return [
            '.nx-page-hero',
            '.contact-page-hero',
            '.svc-banner-hero',
            '.web-hero',
            '.cs-index-hero',
            '.ui-hero--inner',
            '.nx-hero-img',
            '.site-hero',
            '.cs-hero'
        ].join(', ');
    }

    function ensurePageHeroStyles() {
        var base = window.__NEOXWEB_BASE__ || '';
        function inject(id, href) {
            if (document.getElementById(id)) return;
            var link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href = base + href;
            document.head.appendChild(link);
        }
        inject('page-hero-home-css', 'css/page-hero-home.css');
        inject('service-pages-pro-css', 'css/service-pages-pro.css');
    }

    function initHomeHeroBackgrounds() {
        document.querySelectorAll(heroSelectors()).forEach(mountHomeHeroBg);

        var main = document.querySelector('main');
        if (main && !document.body.classList.contains('home-page')) {
            var first = main.querySelector('section:first-of-type');
            if (first && !first.dataset.nxHomeHeroBg) {
                mountHomeHeroBg(first);
            }
        }
    }

    function particleCount(w) {
        if (w < 480) return 18;
        if (w < 900) return 28;
        return 40;
    }

    var resizeListenerBound = false;
    var resizeTimer = 0;
    var activeParticleLoops = 0;
    var maxParticleLoops = 2;
    var visibilityListenerBound = false;

    function initUpwardParticles(canvas, hero) {
        if (canvas.dataset.nxUpParticles === '1') return;
        if (activeParticleLoops >= maxParticleLoops) return;
        canvas.dataset.nxUpParticles = '1';
        activeParticleLoops += 1;

        var ctx = canvas.getContext('2d');
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var particles = [];
        var w = 0;
        var h = 0;
        var raf = 0;
        var visible = true;

        function createParticle(fromBottom) {
            var depth = 0.35 + Math.random() * 0.65;
            return {
                x: Math.random() * w,
                y: fromBottom ? h + Math.random() * 120 : Math.random() * h,
                vy: -(0.25 + depth * 0.55),
                vx: (Math.random() - 0.5) * 0.12,
                r: 0.8 + depth * 2.2,
                alpha: 0.15 + depth * 0.45,
                phase: Math.random() * Math.PI * 2
            };
        }

        function resetParticle(p) {
            p.x = Math.random() * w;
            p.y = h + Math.random() * 40;
            var depth = 0.35 + Math.random() * 0.65;
            p.vy = -(0.25 + depth * 0.55);
            p.vx = (Math.random() - 0.5) * 0.12;
            p.r = 0.8 + depth * 2.2;
            p.alpha = 0.15 + depth * 0.45;
        }

        function drawParticle(p, time) {
            var pulse = 0.85 + Math.sin(time * 0.001 + p.phase) * 0.15;
            var a = Math.min(0.65, p.alpha * pulse);
            var r = p.r * pulse;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(74, 222, 128, ' + a + ')';
            ctx.fill();
        }

        function resize() {
            var rect = hero.getBoundingClientRect();
            w = Math.max(1, Math.floor(rect.width));
            h = Math.max(1, Math.floor(rect.height));
            canvas.width = w;
            canvas.height = h;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
        }

        function seed() {
            particles = Array.from({ length: particleCount(w) }, function () {
                return createParticle(false);
            });
        }

        function drawStatic() {
            resize();
            ctx.clearRect(0, 0, w, h);
            var t = performance.now();
            particles.forEach(function (p) { drawParticle(p, t); });
        }

        function step(time) {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(function (p) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < -20) resetParticle(p);
                drawParticle(p, time);
            });
            raf = requestAnimationFrame(step);
        }

        function pause() {
            if (raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
        }

        function resume() {
            if (reduced || raf || !visible || document.hidden) return;
            raf = requestAnimationFrame(step);
        }

        function start() {
            pause();
            resize();
            seed();
            if (reduced) {
                drawStatic();
                return;
            }
            if (visible) resume();
        }

        if (typeof IntersectionObserver === 'function') {
            new IntersectionObserver(function (entries) {
                visible = entries[0] && entries[0].isIntersecting;
                if (visible && !document.hidden) resume();
                else pause();
            }, { threshold: 0 }).observe(hero);
        }

        if (!visibilityListenerBound) {
            visibilityListenerBound = true;
            document.addEventListener('visibilitychange', function () {
                document.querySelectorAll('[data-nx-particles-resize="1"]').forEach(function (node) {
                    if (document.hidden) {
                        if (typeof node.__nxParticlePause === 'function') node.__nxParticlePause();
                    } else if (typeof node.__nxParticleResume === 'function') {
                        node.__nxParticleResume();
                    }
                });
            });
        }

        start();

        if (!resizeListenerBound) {
            resizeListenerBound = true;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    document.querySelectorAll('[data-nx-particles-resize="1"]').forEach(function (node) {
                        if (typeof node.__nxParticleRestart === 'function') node.__nxParticleRestart();
                    });
                }, 200);
            }, { passive: true });
        }

        hero.__nxParticleRestart = start;
        hero.__nxParticlePause = pause;
        hero.__nxParticleResume = function () {
            if (visible && !document.hidden) resume();
        };
        hero.setAttribute('data-nx-particles-resize', '1');
    }

    function initLegacyPageHeroParticles() {
        document.querySelectorAll('.nx-page-hero__particles').forEach(function (canvas) {
            if (canvas.dataset.nxParticles === '1') return;
            var hero = canvas.closest('.hero-section--pro, .nx-page-hero, .contact-page-hero');
            if (!hero || hero.dataset.nxParticlesInit === '1') return;
            canvas.dataset.nxParticles = '1';
            hero.dataset.nxParticlesInit = '1';
            initUpwardParticles(canvas, hero);
        });
    }

    function boot() {
        if (
            document.body.classList.contains('service-page') ||
            document.querySelector('.svc-banner-hero, .web-hero, .nx-page-hero')
        ) {
            ensurePageHeroStyles();
        }
        initHomeHeroBackgrounds();
        initLegacyPageHeroParticles();
    }

    function scheduleBoot() {
        if (window.NxDefer) {
            window.NxDefer(boot);
            return;
        }
        if ('requestIdleCallback' in window) {
            requestIdleCallback(boot, { timeout: 1200 });
            return;
        }
        setTimeout(boot, 1);
    }

    window.__NEOXWEB_PAGE_HERO__ = { boot: boot, mount: mountHomeHeroBg };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleBoot, { once: true });
    } else {
        scheduleBoot();
    }
})();
