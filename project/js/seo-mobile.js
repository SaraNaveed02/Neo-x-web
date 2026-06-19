/**
 * SEO + mobile meta — fills gaps only; does not override existing head tags.
 */
(function () {
    const SITE_NAME = 'NEOXWEB';

    function ensureMeta(name, content) {
        if (!content) return;
        let el = document.querySelector(`meta[name="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute('name', name);
            document.head.appendChild(el);
        }
        if (!el.getAttribute('content')) el.setAttribute('content', content);
    }

    function ensureProperty(prop, content) {
        if (!content) return;
        let el = document.querySelector(`meta[property="${prop}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute('property', prop);
            document.head.appendChild(el);
        }
        if (!el.getAttribute('content')) el.setAttribute('content', content);
    }

    if (!document.querySelector('meta[name="viewport"]')) {
        ensureMeta('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover');
    }
    if (!document.querySelector('meta[name="theme-color"]')) {
        ensureMeta('theme-color', '#0a0a0a');
    }
    ensureMeta('apple-mobile-web-app-capable', 'yes');
    ensureMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
    ensureMeta('mobile-web-app-capable', 'yes');
    ensureMeta('format-detection', 'telephone=yes');
    if (!document.querySelector('meta[name="robots"]')) {
        ensureMeta('robots', 'index, follow');
    }

    if (!document.querySelector('link[rel="manifest"]')) {
        const m = document.createElement('link');
        m.rel = 'manifest';
        const script = document.querySelector('script[src*="seo-mobile.js"]');
        m.href = script
            ? script.src.replace(/js\/seo-mobile\.js.*/, 'manifest.json')
            : 'manifest.json';
        document.head.appendChild(m);
    }

    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
        const icon = document.createElement('link');
        icon.rel = 'apple-touch-icon';
        icon.href = 'assets/pwa/icon.svg';
        document.head.appendChild(icon);
    }

    const title = document.title || SITE_NAME;
    const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
    const canonUrl = document.querySelector('link[rel="canonical"]')?.href
        || (window.location.origin + window.location.pathname);

    ensureProperty('og:title', title);
    ensureProperty('og:description', desc);
    ensureProperty('og:type', 'website');
    ensureProperty('og:url', canonUrl);
    if (ogImage) ensureProperty('og:image', ogImage);

    ensureMeta('twitter:card', 'summary_large_image');
    ensureMeta('twitter:title', title);
    ensureMeta('twitter:description', desc);
    if (ogImage) ensureMeta('twitter:image', ogImage);

    document.querySelectorAll('script[type="application/ld+json"]').forEach((node) => {
        try {
            const data = JSON.parse(node.textContent);
            if (data.url && /netlify\.app|pages\.dev|localhost/i.test(data.url)) {
                data.url = window.location.origin + '/';
                node.textContent = JSON.stringify(data);
            }
        } catch {
            /* ignore invalid JSON-LD */
        }
    });
})();
