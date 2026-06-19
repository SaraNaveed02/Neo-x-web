/**
 * PWA — service worker + install prompt
 */
(function () {
    const SW_PATH = 'sw.js';

    function getBasePath() {
        if (window.__NEOXWEB_BASE__) return window.__NEOXWEB_BASE__;
        const scripts = document.querySelector('script[src*="pwa.js"]');
        if (scripts) {
            return scripts.src.replace(/js\/pwa\.js.*$/, '');
        }
        const path = window.location.pathname;
        const idx = path.lastIndexOf('/');
        return path.substring(0, idx + 1);
    }

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        window.addEventListener('load', () => {
            const base = getBasePath();
            navigator.serviceWorker.register(base + SW_PATH, { scope: base }).catch(() => {});
        });
    }

    let deferredPrompt = null;
    const DISMISS_KEY = 'nexuraPwaDismissed';

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallBanner();
    });

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        hideInstallBanner();
        localStorage.setItem('nexuraPwaInstalled', '1');
    });

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        document.documentElement.classList.add('standalone');
        document.body?.classList.add('standalone-app');
    }

    function showInstallBanner() {
        if (!window.matchMedia('(max-width: 900px)').matches) return;
        if (localStorage.getItem('nexuraPwaInstalled') || localStorage.getItem(DISMISS_KEY)) return;
        const banner = document.getElementById('pwaInstallBanner');
        if (banner) banner.classList.add('show');
    }

    function hideInstallBanner() {
        const banner = document.getElementById('pwaInstallBanner');
        if (banner) banner.classList.remove('show');
    }

    window.NexuraPWA = {
        async install() {
            if (!deferredPrompt) {
                alert('Install: Browser menu → "Add to Home Screen" / "Install app"');
                return false;
            }
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
            hideInstallBanner();
            return outcome === 'accepted';
        },
        dismiss() {
            localStorage.setItem(DISMISS_KEY, '1');
            hideInstallBanner();
        },
        canInstall: () => !!deferredPrompt
    };

    document.addEventListener('DOMContentLoaded', () => {
        const installBtn = document.getElementById('pwaInstallBtn');
        const dismissBtn = document.getElementById('pwaDismissBtn');
        const headerInstall = document.getElementById('headerInstallBtn');

        installBtn?.addEventListener('click', () => window.NexuraPWA.install());
        dismissBtn?.addEventListener('click', () => window.NexuraPWA.dismiss());
        headerInstall?.addEventListener('click', () => window.NexuraPWA.install());

        if (window.NexuraPWA.canInstall()) showInstallBanner();
    });
})();
