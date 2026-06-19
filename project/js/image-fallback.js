/**
 * NEOXWEB — photo fallback: local JPG → CDN → SVG (never swap photos to SVG unless both fail)
 */
(function () {
    var CDN = 'https://neoxweb.pages.dev/static/images/';

    var SVG_FALLBACK = {
        'web-dev.jpg': 'web-dev.svg',
        'seo-new.jpg': 'seo-new.svg',
        'ppc.jpg': 'ppc.svg',
        'social-media-new.jpg': 'social-media-new.svg',
        'portfolio-branding.jpg': 'portfolio-branding.svg',
        'portfolio-web.jpg': 'portfolio-web.svg',
        'portfolio-seo.jpg': 'portfolio-seo.svg',
        'portfolio-ppc.jpg': 'portfolio-ppc.svg',
        'hero-bg-new.jpg': 'hero-bg-new.svg',
        'hero-tech-bg.png': 'hero-tech-bg.svg'
    };

    function siteBase() {
        if (window.__NEOXWEB_BASE__) return window.__NEOXWEB_BASE__;
        var path = location.pathname || '/';
        var slash = path.lastIndexOf('/');
        return slash >= 0 ? path.slice(0, slash + 1) : '/';
    }

    function attach(img) {
        if (!img || img.dataset.nxImgFix === '1') return;
        img.dataset.nxImgFix = '1';

        img.addEventListener('error', function onFail() {
            img.removeEventListener('error', onFail);
            var src = img.getAttribute('src') || '';
            var name = src.split('/').pop().split('?')[0];
            if (!name) return;

            if (/\.jpe?g$/i.test(name) || /\.png$/i.test(name)) {
                if (!img.dataset.nxTriedCdn) {
                    img.dataset.nxTriedCdn = '1';
                    img.src = CDN + name;
                    return;
                }
                var svg = SVG_FALLBACK[name];
                if (svg) {
                    img.src = siteBase() + 'assets/images/neoxweb/' + svg;
                }
            }
        }, { once: false });
    }

    function scan(root) {
        (root || document).querySelectorAll('img[src]').forEach(attach);
    }

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, { once: true });
        } else {
            fn();
        }
    }

    onReady(function () {
        scan(document);
        if (window.__NEOXWEB_PAGE_HERO__ && typeof window.__NEOXWEB_PAGE_HERO__.boot === 'function') {
            window.__NEOXWEB_PAGE_HERO__.boot();
        }
    });

    if (typeof MutationObserver !== 'undefined') {
        new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes.forEach(function (node) {
                    if (node.nodeType !== 1) return;
                    if (node.tagName === 'IMG') attach(node);
                    else scan(node);
                });
            });
        }).observe(document.documentElement, { childList: true, subtree: true });
    }
})();
