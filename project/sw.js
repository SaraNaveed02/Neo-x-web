/**
 * NEOXWEB Service Worker — offline cache for mobile PWA
 */
const CACHE = 'neoxweb-v9';
const ASSETS = [
    './index.html',
    './services.html',
    './contact.html',
    './resources.html',
    './industry.html',
    './portfolio.html',
    './manifest.json',
    './css/main.css',
    './css/neoxweb-theme.css',
    './css/navbar-pro.css',
    './css/bootstrap-app.css',
    './css/mobile-app.css',
    './css/responsive-shell.css',
    './js/navbar.js',
    './js/main.js',
    './js/mobile-app.js',
    './js/bootstrap-app.js',
    './js/seo.js',
    './js/seo-mobile.js',
    './js/whatsapp-widget.js',
    './assets/pwa/icon.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll(ASSETS).catch(() => {}))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    if (url.pathname.includes('/backend/api/')) return;

    const sameOrigin = url.origin === self.location.origin;
    const isPage = request.mode === 'navigate'
        || request.destination === 'document'
        || /\.html?$/i.test(url.pathname)
        || url.pathname.endsWith('/');

    if (sameOrigin && isPage) {
        event.respondWith(
            fetch(request)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE).then((cache) => cache.put(request, copy));
                    return res;
                })
                .catch(() => caches.match(request).then((r) => r || caches.match('./index.html')))
        );
    }
});
