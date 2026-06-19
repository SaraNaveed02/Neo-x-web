/** Async CSS — non-blocking (PageSpeed) */
window.NxLoadCSS = function (href) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
};

window.NxDefer = function (fn) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(fn, { timeout: 2500 });
    } else {
        setTimeout(fn, 1);
    }
};

/* Premium agency + pro layouts — load CSS immediately (no FOUC on heroes/images) */
(function () {
    function basePath() {
        var base = window.__NEOXWEB_BASE__;
        if (!base) {
            var p = location.pathname || '/';
            var s = p.lastIndexOf('/');
            base = s >= 0 ? p.slice(0, s + 1) : '/';
        }
        return base;
    }

    function appendStylesheet(id, file) {
        if (document.getElementById(id)) return;
        var link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = basePath() + 'css/' + file;
        (document.head || document.documentElement).appendChild(link);
    }

    function appendScript(id, file) {
        if (document.getElementById(id)) return;
        var s = document.createElement('script');
        s.id = id;
        s.src = basePath() + 'js/' + file;
        s.defer = true;
        (document.head || document.documentElement).appendChild(s);
    }

    function loadSiteLayers() {
        appendStylesheet('neoxweb-premium-agency-css', 'premium-agency.css');
        appendStylesheet('neoxweb-pro-split-css', 'pro-split-sections.css');
        appendStylesheet('neoxweb-rows-final-css', 'site-rows-final.css');
        appendStylesheet('neoxweb-images-row-css', 'nx-images-row.css');
        appendStylesheet('neoxweb-home-hero-css', 'home-hero-final.css');
        appendStylesheet('neoxweb-images-global-css', 'nx-images-global.css');
        appendScript('neoxweb-row-layout-js', 'row-layout.js');
        appendScript('neoxweb-hero-premium-js', 'hero-premium.js');
        appendScript('neoxweb-hero-particles-js', 'hero-particles.js');
    }

    function moveToEnd(id) {
        var el = document.getElementById(id);
        if (el && el.parentNode) {
            el.parentNode.appendChild(el);
        }
    }

    function finalizeCascade() {
        [
            'neoxweb-premium-agency-css',
            'neoxweb-pro-split-css',
            'neoxweb-rows-final-css',
            'neoxweb-images-row-css',
            'neoxweb-home-hero-css',
            'neoxweb-images-global-css'
        ].forEach(moveToEnd);
    }

    /* Critical layout CSS — inject as soon as this script runs */
    loadSiteLayers();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', finalizeCascade, { once: true });
    } else {
        finalizeCascade();
    }
})();
