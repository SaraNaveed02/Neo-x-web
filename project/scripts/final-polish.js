/**
 * Final polish — SEO meta, seo.js, SVG visuals on all pages
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const iconMap = {
    'fa-code': 'assets/services/web-platform.svg',
    'fa-chart-line': 'assets/services/data-analytics.svg',
    'fa-search': 'assets/services/data-analytics.svg',
    'fa-bullhorn': 'assets/services/ecommerce-strategy.svg',
    'fa-ad': 'assets/services/ecommerce-strategy.svg',
    'fa-share-alt': 'assets/services/product-design.svg',
    'fa-palette': 'assets/services/product-design.svg',
    'fa-layer-group': 'assets/services/development.svg',
    'fa-globe': 'assets/images/project-03.svg',
    'fa-video': 'assets/services/mobile-app.svg',
    'fa-mobile-alt': 'assets/services/mobile-app.svg',
    'fa-cloud': 'assets/services/cloud-engineering.svg',
    'fa-robot': 'assets/services/ai-automation.svg',
    'fa-cogs': 'assets/services/software-engineering.svg',
    'fa-laptop-code': 'assets/services/development.svg',
    'fa-shopping-cart': 'assets/services/ecommerce-strategy.svg',
    'fa-users': 'assets/services/it-consulting.svg',
    'fa-briefcase': 'assets/services/it-consulting.svg',
    'fa-server': 'assets/services/saas-platforms.svg',
    'fa-vial': 'assets/services/testing-qa.svg',
    'fa-sync-alt': 'assets/services/application-modernization.svg',
    'fa-pen-nib': 'assets/services/product-design.svg',
    'fa-image': 'assets/services/product-design.svg',
    'fa-newspaper': 'assets/images/project-01.svg',
    'fa-book': 'assets/images/project-02.svg',
    'fa-lightbulb': 'assets/images/project-03.svg',
    'fa-handshake': 'assets/services/it-consulting.svg',
    'fa-star': 'assets/images/project-01.svg',
    'fa-envelope': 'assets/images/project-02.svg',
    'fa-phone': 'assets/images/project-03.svg'
};

const heroByFile = {
    'web.html': 'assets/services/web-platform.svg',
    'development.html': 'assets/services/development.svg',
    'software-engineering.html': 'assets/services/software-engineering.svg',
    'data-analytics.html': 'assets/services/data-analytics.svg',
    'ecommerce-strategy.html': 'assets/services/ecommerce-strategy.svg',
    'ai.html': 'assets/services/ai-automation.svg',
    'testing-qa.html': 'assets/services/testing-qa.svg',
    'saas-platforms.html': 'assets/services/saas-platforms.svg',
    'mobile.html': 'assets/services/mobile-app.svg',
    'application-modernization.html': 'assets/services/application-modernization.svg',
    'it-consulting.html': 'assets/services/it-consulting.svg',
    'cloud.html': 'assets/services/cloud-engineering.svg',
    'product-design.html': 'assets/services/product-design.svg'
};

const portfolioCycle = [
    'assets/images/project-01.svg',
    'assets/images/project-02.svg',
    'assets/images/project-03.svg'
];

function artImg(src, alt = '', extra = '') {
    const altAttr = alt ? ` alt="${alt}"` : ' alt=""';
    return `<img src="${src}"${altAttr} class="visual-art${extra ? ' ' + extra : ''}" loading="lazy">`;
}

function wrapClassFromContext(before) {
    if (before.includes('project-card') || before.includes('visual-art-wrap--project')) return 'visual-art-wrap visual-art-wrap--project';
    if (before.includes('neox-service-card') || before.includes('service-card')) return 'visual-art-wrap visual-art-wrap--card';
    if (before.includes('blog') || before.includes('resource')) return 'visual-art-wrap visual-art-wrap--blog';
    return 'visual-art-wrap';
}

function replacePlaceholders(html) {
    let cycle = 0;
    return html.replace(
        /<div class="media-icon-placeholder" aria-hidden="true"><i class="fas ([^"]+)"><\/i><\/div>/g,
        (match, icon, offset) => {
            const before = html.slice(Math.max(0, offset - 200), offset);
            let src = iconMap[icon];
            if (!src) {
                src = portfolioCycle[cycle++ % portfolioCycle.length];
            }
            const wrap = wrapClassFromContext(before);
            return `<div class="${wrap}" aria-hidden="true">${artImg(src)}</div>`;
        }
    );
}

function ensureSeo(html, filename) {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
    const title = titleMatch ? titleMatch[1] : 'NEOXWEB';
    const desc = descMatch ? descMatch[1] : 'NEOXWEB — web development, SEO & digital marketing in Pakistan.';

    if (!html.includes('name="robots"')) {
        html = html.replace(
            /<meta name="description" content="[^"]*">/,
            `$&\n    <meta name="robots" content="index, follow">`
        );
    }

    if (!html.includes('rel="canonical"')) {
        html = html.replace(
            /<meta name="robots"[^>]*>/,
            `$&\n    <link rel="canonical" href="./">`
        );
    }

    if (!html.includes('property="og:title"')) {
        const og = `
    <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
    <meta property="og:description" content="${desc.replace(/"/g, '&quot;')}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_PK">
    <meta property="og:site_name" content="NEOXWEB">
    <meta property="og:image" content="assets/images/hero-coil.svg">
    <meta name="twitter:card" content="summary_large_image">`;
        html = html.replace(/<meta name="description"[^>]*>/, `$&${og}`);
    }

    if (!html.includes('js/seo.js')) {
        html = html.replace(
            /(<script defer src="js\/whatsapp-widget\.js"><\/script>)/,
            `$1\n    <script defer src="js/seo.js"></script>`
        );
        if (!html.includes('js/seo.js')) {
            html = html.replace('</head>', '    <script defer src="js/seo.js"></script>\n</head>');
        }
    }

    return html;
}

function fixHeroIcons(html, filename) {
    const heroSrc = heroByFile[filename];
    if (heroSrc) {
        html = html.replace(
            /<div class="web-hero-visual-icon" aria-hidden="true"><i class="fas [^"]+"><\/i><\/div>/,
            `<div class="web-hero-visual-icon" aria-hidden="true">${artImg(heroSrc, '', 'visual-art--hero')}</div>`
        );
    }
    return html;
}

function processFile(filename) {
    const full = path.join(root, filename);
    if (!fs.existsSync(full)) return;
    let html = fs.readFileSync(full, 'utf8');
    const before = html;

    if (filename !== 'index.html') {
        html = replacePlaceholders(html);
        html = fixHeroIcons(html, filename);
        html = ensureSeo(html, filename);
    }

    if (html !== before) {
        fs.writeFileSync(full, html);
        console.log('polished', filename);
    }
}

const skip = new Set(['navbar.html', 'unified-header.html', 'unified-footer.html', 'oauth-callback.html']);

fs.readdirSync(root)
    .filter((f) => f.endsWith('.html') && !skip.has(f))
    .forEach(processFile);

console.log('Done.');
