/**
 * Har page par mobile app shell load karta hai (bottom 4 tabs + header)
 */
(function () {
    if (window.__NEOXWEB_MOBILE_INIT__ && document.querySelector('script[src*="bootstrap-app.js"]')) {
        return;
    }

    function projectBase() {
        if (window.NexuraConfig?.siteRoot !== undefined) {
            const root = window.NexuraConfig.siteRoot;
            return root ? `${root.replace(/\/$/, '')}/` : './';
        }
        const path = window.location.pathname;
        const i = path.indexOf('/project/');
        if (i >= 0) return path.substring(0, i + '/project/'.length);
        const s = document.querySelector('script[src*="mobile-app.js"], script[src*="bootstrap-app.js"], script[src*="main.js"]');
        if (s?.src) return s.src.replace(/js\/[^/]+\.js.*$/, '');
        return './';
    }

    function loadBootstrapApp() {
        if (document.querySelector('script[src*="bootstrap-app.js"]') || window.NexuraApp) {
            return;
        }
        const script = document.createElement('script');
        script.src = projectBase() + 'js/bootstrap-app.js';
        script.defer = true;
        document.head.appendChild(script);
    }

    function loadWhatsAppWidget() {
        if (document.querySelector('script[src*="whatsapp-widget.js"]')) return;
        const link = document.querySelector('link[href*="neoxweb-theme.css"]');
        if (!link) {
            const css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = projectBase() + 'css/neoxweb-theme.css';
            document.head.appendChild(css);
        }
        const wa = document.createElement('script');
        wa.src = projectBase() + 'js/whatsapp-widget.js';
        wa.defer = true;
        document.head.appendChild(wa);
    }

    if (!document.querySelector('link[rel="manifest"]')) {
        const manifest = document.createElement('link');
        manifest.rel = 'manifest';
        manifest.href = projectBase() + 'manifest.json';
        document.head.appendChild(manifest);
    }

    if (!document.querySelector('script[src*="pwa.js"]')) {
        const pwa = document.createElement('script');
        pwa.src = projectBase() + 'js/pwa.js';
        pwa.defer = true;
        document.head.appendChild(pwa);
    }

    function syncViewportClass() {
        const mobile = window.matchMedia('(max-width: 900px)').matches;
        document.documentElement.classList.toggle('mobile-view', mobile);
        document.documentElement.classList.toggle('desktop-view', !mobile);
    }

    syncViewportClass();
    window.addEventListener('resize', syncViewportClass);

    /* Desktop par app shell band, mobile par load */
    if (window.matchMedia('(max-width: 900px)').matches) {
        loadBootstrapApp();
    } else {
        document.documentElement.classList.add('desktop-view');
    }

    window.addEventListener('resize', () => {
        if (window.matchMedia('(max-width: 900px)').matches) {
            loadBootstrapApp();
        }
    });
    loadWhatsAppWidget();

    window.showAppToast = function (message, type) {
        if (window.NexuraApp?.toast) NexuraApp.toast(message, type || 'success');
    };
})();
