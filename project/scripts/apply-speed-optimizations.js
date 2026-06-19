/**
 * PageSpeed: async non-critical CSS, defer head scripts, lighter fonts, idle heavy JS
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const skip = new Set([
    'navbar.html',
    'unified-header.html',
    'unified-footer.html',
    'oauth-callback.html',
]);

const asyncCss = [
    'css/animations.css',
    'css/dark-mode.css',
    'css/pages-advanced.css',
    'css/mobile-friendly.css',
    'css/mobile-app.css',
    'css/page-rich.css',
    'css/about-rich.css',
];

function asyncStylesheet(href) {
    return (
        `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">\n` +
        `    <noscript><link rel="stylesheet" href="${href}"></noscript>`
    );
}

function repairBrokenAsyncCss(html) {
    return html.replace(
        /<link rel="preload" href="([^"]+)" as="style" onload="this\.onload=null;this\.rel='stylesheet'">\s*<noscript><link rel="preload" href="\1" as="style" onload="this\.onload=null;this\.rel='stylesheet'">\s*<noscript><link rel="stylesheet" href="\1"><\/noscript><\/noscript>/g,
        '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">\n    <noscript><link rel="stylesheet" href="$1"></noscript>'
    );
}

function optimizeHtml(html, file) {
    let out = html;
    out = repairBrokenAsyncCss(out);

    if (!out.includes('perf-load.js')) {
        const baseTag = /(<script>\(function\(\)\{var p=location\.pathname[\s\S]*?<\/script>)/;
        if (baseTag.test(out)) {
            out = out.replace(baseTag, `$1\n    <script src="js/perf-load.js"></script>`);
        } else {
            out = out.replace('<head>', '<head>\n    <script src="js/perf-load.js"></script>');
        }
    }

    if (out.includes('cdnjs.cloudflare.com') && !out.includes('href="https://cdnjs.cloudflare.com"')) {
        if (out.includes('href="https://fonts.googleapis.com"')) {
            out = out.replace(
                '<link rel="preconnect" href="https://fonts.googleapis.com">',
                '<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>\n    <link rel="preconnect" href="https://fonts.googleapis.com">'
            );
        } else {
            out = out.replace(
                '<head>',
                '<head>\n    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>'
            );
        }
    }

    out = out.replace(
        /<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.5\.1\/css\/all\.min\.css"[^>]*>/g,
        asyncStylesheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css')
    );
    out = out.replace(
        /<noscript><link rel="preload" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.5\.1\/css\/all\.min\.css"[^>]*>\s*<noscript><link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.5\.1\/css\/all\.min\.css"><\/noscript><\/noscript>/g,
        '<noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"></noscript>'
    );

    asyncCss.forEach((href) => {
        const esc = href.replace(/\//g, '\\/');
        const ok = new RegExp(
            `<link rel="preload" href="${esc}" as="style" onload="this\\.onload=null;this\\.rel='stylesheet'">\\s*<noscript><link rel="stylesheet" href="${esc}"><\\/noscript>`
        );
        if (ok.test(out)) return;
        out = out.replace(
            new RegExp(`<link rel="stylesheet" href="${esc}">`, 'g'),
            asyncStylesheet(href)
        );
    });

    out = out.replace(
        /<script src="js\/(config\.js|config\.live\.js|mobile-init\.js)"><\/script>/g,
        '<script defer src="js/$1"></script>'
    );

    out = out.replace(/family=Space\+Grotesk:wght@[^&"]+/g, 'family=Space+Grotesk:wght@600;700;800');
    out = out.replace(/family=Inter:wght@[^&"]+/g, 'family=Inter:wght@400;600;700');

    if (file !== 'index.html') {
        out = out.replace(/\s*<script defer src="js\/animations\.js"><\/script>/g, '');
        out = out.replace(/\s*<script defer src="js\/page-rich\.js"><\/script>/g, '');
        out = out.replace(/\s*<script defer src="js\/mobile-app\.js"><\/script>/g, '');

        const headEnd = out.indexOf('</head>');
        const bodyStart = out.indexOf('<body');
        if (headEnd > 0 && bodyStart > headEnd) {
            const head = out.slice(0, headEnd);
            const rest = out.slice(headEnd);
            const cleanedHead = head
                .replace(/\s*<script defer src="js\/utils\.js"><\/script>/g, '')
                .replace(/\s*<script defer src="js\/main\.js"><\/script>/g, '');
            out = cleanedHead + rest;
        }

        if (!out.includes('js/animations.js') && (out.includes('fade-up') || out.includes('pr-reveal'))) {
            out = out.replace('</body>', '    <script defer src="js/animations.js"></script>\n</body>');
        }
        if (!out.includes('js/page-rich.js') && out.includes('pr-reveal')) {
            out = out.replace('</body>', '    <script defer src="js/page-rich.js"></script>\n</body>');
        }
    }

    return out;
}

fs.readdirSync(root)
    .filter((f) => f.endsWith('.html') && !skip.has(f))
    .forEach((file) => {
        const full = path.join(root, file);
        const before = fs.readFileSync(full, 'utf8');
        const after = optimizeHtml(before, file);
        if (after !== before) {
            fs.writeFileSync(full, after);
            console.log('speed', file);
        }
    });

console.log('Done');
