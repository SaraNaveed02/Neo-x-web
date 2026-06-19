/**
 * NEOXWEB SEO — canonical URLs, Open Graph, Twitter cards
 * Works on localhost (XAMPP), Netlify, and production.
 */
(function () {
    const robots = document.querySelector('meta[name="robots"]')?.content || '';
    if (/noindex/i.test(robots)) return;

    const PRODUCTION_ORIGIN = (function () {
        const meta = document.querySelector('meta[name="neoxweb-site-url"]')?.content?.trim();
        if (meta) return meta.replace(/\/$/, '');
        if (window.NexuraConfig && window.NexuraConfig.siteUrl) {
            return String(window.NexuraConfig.siteUrl).replace(/\/$/, '');
        }
        const host = window.location.hostname;
        if (host === 'localhost' || host === '127.0.0.1') return '';
        if (host.endsWith('.netlify.app') || host.endsWith('.netlify.live')) {
            return window.location.origin;
        }
        return window.location.origin;
    })();

    function pageFile() {
        const path = window.location.pathname || '/';
        const file = path.split('/').pop() || '';
        if (!file || file === '/') return 'index.html';
        return file;
    }

    function absoluteUrl(relative) {
        const clean = String(relative || '').replace(/^\.\//, '');
        if (/^https?:\/\//i.test(clean)) return clean;
        if (PRODUCTION_ORIGIN) {
            return PRODUCTION_ORIGIN + '/' + clean.replace(/^\//, '');
        }
        const base = window.location.origin + (window.__NEOXWEB_BASE__ || '/');
        return new URL(clean, base).href.split('#')[0].split('?')[0];
    }

    function pageUrl() {
        if (PRODUCTION_ORIGIN) {
            const file = pageFile();
            return file === 'index.html'
                ? PRODUCTION_ORIGIN + '/'
                : PRODUCTION_ORIGIN + '/' + file;
        }
        return window.location.href.split('#')[0].split('?')[0];
    }

    function ensureLink(rel, href) {
        let el = document.querySelector(`link[rel="${rel}"]`);
        if (!el) {
            el = document.createElement('link');
            el.rel = rel;
            document.head.appendChild(el);
        }
        el.href = href;
    }

    function ensureMeta(attr, key, value) {
        if (!value) return;
        let el = document.querySelector(`meta[${attr}="${key}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute(attr, key);
            document.head.appendChild(el);
        }
        el.setAttribute('content', value);
    }

    const canonicalHref = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
    const canonicalBroken = !canonicalHref
        || canonicalHref === './'
        || canonicalHref === '.'
        || canonicalHref.endsWith('/');

    if (canonicalBroken) {
        ensureLink('canonical', pageUrl());
    } else if (PRODUCTION_ORIGIN && !/^https?:\/\//i.test(canonicalHref)) {
        ensureLink('canonical', absoluteUrl(canonicalHref));
    }

    const pageCanonical = document.querySelector('link[rel="canonical"]')?.href || pageUrl();
    ensureMeta('property', 'og:url', pageCanonical);

    const title = document.title || 'NEOXWEB';
    const description = document.querySelector('meta[name="description"]')?.content || '';

    ensureMeta('property', 'og:title', document.querySelector('meta[property="og:title"]')?.content || title);
    ensureMeta('property', 'og:description', document.querySelector('meta[property="og:description"]')?.content || description);

    if (!document.querySelector('meta[property="og:type"]')) {
        ensureMeta('property', 'og:type', 'website');
    }

    const ogImage = document.querySelector('meta[property="og:image"]')?.content
        || 'assets/images/neoxweb/hero-bg-new.jpg';
    const absImage = absoluteUrl(ogImage);
    ensureMeta('property', 'og:image', absImage);

    if (!document.querySelector('meta[name="twitter:card"]')) {
        ensureMeta('name', 'twitter:card', 'summary_large_image');
    }
    ensureMeta('name', 'twitter:title', document.querySelector('meta[name="twitter:title"]')?.content || title);
    ensureMeta('name', 'twitter:description', document.querySelector('meta[name="twitter:description"]')?.content || description);
    ensureMeta('name', 'twitter:image', absoluteUrl(
        document.querySelector('meta[name="twitter:image"]')?.content || ogImage
    ));

    document.querySelectorAll('script[type="application/ld+json"]').forEach(function (node) {
        try {
            const data = JSON.parse(node.textContent);
            let changed = false;
            function walk(obj) {
                if (!obj || typeof obj !== 'object') return;
                if (typeof obj.url === 'string' && /netlify\.app/i.test(obj.url) && PRODUCTION_ORIGIN) {
                    const path = obj.url.replace(/^https?:\/\/[^/]+/, '');
                    obj.url = PRODUCTION_ORIGIN + (path || '/');
                    changed = true;
                }
                Object.values(obj).forEach(walk);
            }
            walk(data);
            if (changed) node.textContent = JSON.stringify(data);
        } catch (_) { /* ignore invalid JSON-LD */ }
    });
})();
