/*
    FILE: main.js
    PURPOSE: Core site interactions, theme toggle, cursor and mobile menu
*/

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeCursor();
    initializeMobileMenu();
    initializeCookieBanner();
    initializePageLoader();
    initializeLoginTriggers();
    initializeNavHighlight();
});

function initializeTheme() {
    const storedTheme = localStorage.getItem('nexuraTheme');
    const rootBody = document.body;
    const themeToggleButtons = qsa('[id^="themeToggle"]');

    const currentThemeIsLight = storedTheme === 'light';
    if (currentThemeIsLight) {
        rootBody.classList.add('light-mode');
    }

    themeToggleButtons.forEach(button => {
        button.textContent = currentThemeIsLight ? 'Light' : 'Dark';
        button.addEventListener('click', () => {
            rootBody.classList.toggle('light-mode');
            const isLight = rootBody.classList.contains('light-mode');
            button.textContent = isLight ? 'Light' : 'Dark';
            localStorage.setItem('nexuraTheme', isLight ? 'light' : 'dark');
        });
    });
}

function initializeCursor() {
    const cursor = qs('#customCursor');
    if (!cursor) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let pending = false;
    let lastX = 0;
    let lastY = 0;

    document.addEventListener('mousemove', (event) => {
        lastX = event.clientX;
        lastY = event.clientY;
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            cursor.style.transform = `translate(${lastX}px, ${lastY}px)`;
            pending = false;
        });
    }, { passive: true });

    document.body.addEventListener('mouseover', (event) => {
        const target = event.target.closest('button, a, .btn, .nav-link');
        if (!target) return;
        cursor.style.width = '42px';
        cursor.style.height = '42px';
        cursor.style.background = 'rgba(16,185,129,0.15)';
    });

    document.body.addEventListener('mouseout', (event) => {
        const from = event.target.closest('button, a, .btn, .nav-link');
        const to = event.relatedTarget && event.relatedTarget.closest('button, a, .btn, .nav-link');
        if (!from || to) return;
        cursor.style.width = '28px';
        cursor.style.height = '28px';
        cursor.style.background = 'rgba(255,255,255,0.12)';
    });
}

function initializeMobileMenu() {
    const mobileToggle = qs('#mobileMenu');
    const mobilePanel = qs('#mobileMenuPanel');
    const mobileLogin = qs('#mobileLogin');

    if (!mobileToggle || !mobilePanel) return;

    mobileToggle.addEventListener('click', () => {
        const open = mobilePanel.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', open);
    });

    if (mobileLogin) {
        mobileLogin.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
}

function initializeCookieBanner() {
    const banner = qs('#cookieBanner');
    const accept = qs('#acceptCookies');
    const manage = qs('#manageCookies');

    if (!banner) return;
    if (localStorage.getItem('nexuraCookiesAccepted') === 'true') {
        banner.classList.add('hide');
        return;
    }

    accept.addEventListener('click', () => {
        localStorage.setItem('nexuraCookiesAccepted', 'true');
        banner.classList.add('hide');
    });

    manage.addEventListener('click', () => {
        alert('Cookie settings will be available in the next release.');
    });
}

function initializePageLoader() {
    const loader = qs('#pageLoader');
    if (!loader) return;
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hide'), 400);
    });
}

function initializeLoginTriggers() {
    const loginTrigger = qs('#loginTrigger');
    if (loginTrigger) {
        loginTrigger.addEventListener('click', () => window.location.href = 'login.html');
    }
}

function initializeNavHighlight() {
    const path = location.pathname.split('/').pop();
    qsa('.nav-link').forEach(link => {
        if (link.getAttribute('href') === path || (path === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

(function loadCoreAssets() {
    const scriptBase = (() => {
        const s = document.querySelector('script[src*="js/main.js"]');
        return s ? s.src.replace(/main\.js.*$/, '') : 'js/';
    })();

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const el = document.createElement('script');
            el.src = src;
            el.defer = true;
            el.onload = resolve;
            el.onerror = reject;
            document.head.appendChild(el);
        });
    }

    if (!window.NexuraConfig) {
        loadScript(scriptBase + 'config.js')
            .then(() => loadScript(scriptBase + 'seo-mobile.js'))
            .catch(() => {});
    } else {
        loadScript(scriptBase + 'seo-mobile.js').catch(() => {});
    }

    const needsStats = document.querySelector('.hero-statcards, .auth-brand-stats, .stat-grid, section.web-stats-band[data-site-stats]');
    if (needsStats) {
        Promise.resolve()
            .then(() => (window.NexuraAPI ? null : loadScript(scriptBase + 'api.js')))
            .then(() => loadScript(scriptBase + 'site-stats.js'))
            .catch(() => {});
    }
})();

(function initMobileAppShell() {
    if (window.__NEOXWEB_MOBILE_INIT__) return;
    if (document.querySelector('script[src*="mobile-app.js"], script[src*="bootstrap-app.js"]')) return;

    const scriptBase = (() => {
        const s = document.querySelector('script[src*="js/main.js"]');
        return s ? s.src.replace(/main\.js.*$/, '') : 'js/';
    })();

    const el = document.createElement('script');
    el.src = scriptBase + 'mobile-app.js';
    el.defer = true;
    document.head.appendChild(el);
})();
