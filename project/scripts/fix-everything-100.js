/**
 * NEOXWEB — final 100% fix pass
 * - Local images (no CDN dependency in HTML)
 * - Relative links (XAMPP + Netlify)
 * - Canonical schema URLs → netlify.app
 * - og:image → local asset
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CDN = 'https://neoxweb.pages.dev/static/images/';
const LOCAL = 'assets/images/neoxweb/';
const SITE = 'https://neoxweb.netlify.app';
const SKIP = new Set(['oauth-callback.html', 'navbar.html', 'unified-header.html', 'unified-footer.html']);

const JPG_TO_SVG = {
    'web-dev.jpg': 'web-dev.svg',
    'seo-new.jpg': 'seo-new.svg',
    'ppc.jpg': 'ppc.svg',
    'social-media-new.jpg': 'social-media-new.svg',
    'portfolio-branding.jpg': 'portfolio-branding.svg',
    'portfolio-web.jpg': 'portfolio-web.svg',
    'portfolio-seo.jpg': 'portfolio-seo.svg',
    'portfolio-ppc.jpg': 'portfolio-ppc.svg',
    'hero-bg-new.jpg': 'hero-bg-new.svg',
    'hero-tech-bg.png': 'hero-tech-bg.svg',
    'logo.png': 'logo-nx.svg',
    'logo-large.jpg': 'logo-full.svg'
};

const ROUTES = {
    '/': 'index.html',
    '/about': 'about.html',
    '/services': 'services.html',
    '/contact': 'contact.html',
    '/portfolio': 'portfolio.html',
    '/team': 'team.html',
    '/blog': 'blog.html',
    '/web': 'web.html',
    '/mobile': 'mobile.html',
    '/development': 'development.html',
    '/software-engineering': 'software-engineering.html',
    '/data-analytics': 'data-analytics.html',
    '/ecommerce-strategy': 'ecommerce-strategy.html',
    '/product-design': 'product-design.html',
    '/graphic-design': 'graphic-design.html',
    '/social-media-marketing': 'social-media-marketing.html',
    '/video-editing': 'video-editing.html',
    '/testing-qa': 'testing-qa.html',
    '/cloud': 'cloud.html',
    '/saas-platforms': 'saas-platforms.html',
    '/application-modernization': 'application-modernization.html',
    '/it-consulting': 'it-consulting.html',
    '/ai': 'ai.html',
    '/resources': 'resources.html',
    '/industry': 'industry.html',
    '/studies': 'studies.html',
    '/case-study': 'case-study.html',
    '/case-study-seo': 'case-study-seo.html',
    '/case-study-ppc': 'case-study-ppc.html',
    '/privacy-policy': 'privacy-policy.html',
    '/technologies': 'technologies.html',
    '/profile': 'profile.html'
};

function localImage(name) {
    const full = path.join(ROOT, LOCAL, name);
    if (fs.existsSync(full)) return LOCAL + name;
    const svg = JPG_TO_SVG[name];
    if (svg && fs.existsSync(path.join(ROOT, LOCAL, svg))) return LOCAL + svg;
    return LOCAL + (svg || name);
}

function patchContent(text) {
    let out = text;

    // Broken logo path only when mark file missing (keep logo-nx-mark.jpg when present)

    // CDN → local
    out = out.replace(/https:\/\/neoxweb\.pages\.dev\/static\/images\/([a-zA-Z0-9._-]+)/g, (_, name) => localImage(name));

    // Schema / meta domain (not image CDN)
    out = out.replace(/https:\/\/neoxweb\.pages\.dev\/(?!static\/images)/g, SITE);

    // og:image fallback
    out = out.replace(
        /<meta property="og:image" content="[^"]*">/g,
        '<meta property="og:image" content="assets/images/neoxweb/hero-bg-new.svg">'
    );

    // Absolute clean URLs → relative .html
    for (const [route, file] of Object.entries(ROUTES)) {
        const esc = route.replace(/\//g, '\\/');
        out = out.replace(new RegExp(`href=['"]${esc}['"]`, 'g'), `href="${file}"`);
    }

    // Phone display consistency in body text
    out = out.replace(/WhatsApp 0308 4858836/g, 'WhatsApp +92 308 4858836');

    return out;
}

function walk(dir, fn) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === 'scripts') continue;
            walk(full, fn);
        } else if (/\.(html|css|js|json|xml)$/i.test(entry.name)) {
            fn(full);
        }
    }
}

let n = 0;
walk(ROOT, (file) => {
    const base = path.basename(file);
    if (SKIP.has(base)) return;
    const before = fs.readFileSync(file, 'utf8');
    const after = patchContent(before);
    if (after !== before) {
        fs.writeFileSync(file, after);
        console.log('fixed', path.relative(ROOT, file));
        n++;
    }
});

console.log(`Done — ${n} files updated.`);
