/**
 * Mobile-friendly + fix broken HTML — har page par apply
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');
const SKIP = new Set(['oauth-callback.html', 'navbar.html', 'unified-header.html', 'unified-footer.html']);

const VIEWPORT = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover';
const MOBILE_CSS = '<link rel="stylesheet" href="css/mobile-friendly.css">';

function patch(html) {
    html = html.replace(
        /<div class="svc-banner-hero__bg" class="svc-banner-hero__bg svc-banner-hero__bg--gradient"><\/div>/g,
        '<div class="svc-banner-hero__bg svc-banner-hero__bg--gradient" aria-hidden="true"></div>'
    );

    html = html.replace(
        /<meta name="viewport" content="[^"]*">/,
        `<meta name="viewport" content="${VIEWPORT}">`
    );

    if (!html.includes('mobile-friendly.css')) {
        if (html.includes('responsive-shell.css')) {
            html = html.replace(
                '<link rel="stylesheet" href="css/responsive-shell.css">',
                `<link rel="stylesheet" href="css/responsive-shell.css">\n    ${MOBILE_CSS}`
            );
        } else {
            html = html.replace('</head>', `    ${MOBILE_CSS}\n</head>`);
        }
    }

    if (!html.includes('mobile-view')) {
        html = html.replace('<head>', `<head>\n    <script>(function(){if(window.matchMedia('(max-width:900px)').matches)document.documentElement.classList.add('mobile-view');})();</script>`);
    }

    return html;
}

for (const f of fs.readdirSync(PROJECT).filter((x) => x.endsWith('.html') && !SKIP.has(x))) {
    const fp = path.join(PROJECT, f);
    const out = patch(fs.readFileSync(fp, 'utf8'));
    fs.writeFileSync(fp, out, 'utf8');
    console.log('Mobile-friendly:', f);
}

console.log('\nDone — mobile + laptop layout applied.');
