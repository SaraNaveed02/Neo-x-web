/**
 * Live / local overrides — API + Google OAuth origins
 */
(function () {
    var host = location.hostname;
    var path = location.pathname || '/';

    if (!window.NEXWEB_API_BASE && (host === 'localhost' || host === '127.0.0.1')) {
        var idx = path.indexOf('/project/');
        window.NEXWEB_API_BASE = idx >= 0 ? path.slice(0, idx) + '/backend/api' : '/backend/api';
    }

    if (host.endsWith('.netlify.app') || host.endsWith('.netlify.live')) {
        try {
            var saved = localStorage.getItem('nexuraApiBase');
            if (saved && /localhost|127\.0\.0\.1|192\.168\./i.test(saved)) {
                localStorage.removeItem('nexuraApiBase');
            }
        } catch (_) { /* ignore */ }
    }

    window.NEOXWEB_GOOGLE_ORIGINS = [
        'http://localhost',
        'http://127.0.0.1',
        'https://neoxweb.netlify.app',
        'https://neo-x-web.netlify.app',
        'https://astounding-banoffee-387242.netlify.app'
    ];
})();
