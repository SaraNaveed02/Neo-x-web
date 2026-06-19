/**
 * Restore visible content — remove broken idle loaders, blocking CSS + scripts
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const skip = new Set(['navbar.html', 'unified-header.html', 'unified-footer.html', 'oauth-callback.html']);

const idleBlock = /\s*<script>\s*\(function\(\)\{function ld\(s\)[\s\S]*?window\.addEventListener\('load',go\);\}\)\(\);[\s\S]*?<\/script>/g;

const asyncToSync = [
    'css/animations.css',
    'css/dark-mode.css',
    'css/pages-advanced.css',
    'css/mobile-friendly.css',
    'css/mobile-app.css',
    'css/page-rich.css',
    'css/about-rich.css',
];

function patch(html, file) {
    let out = html;
    out = out.replace(idleBlock, '');

    asyncToSync.forEach((href) => {
        const esc = href.replace(/\//g, '\\/');
        const block = new RegExp(
            `<link rel="preload" href="${esc}" as="style" onload="this\\.onload=null;this\\.rel='stylesheet'">\\s*<noscript><link rel="stylesheet" href="${esc}"><\\/noscript>`,
            'g'
        );
        out = out.replace(block, `<link rel="stylesheet" href="${href}">`);
    });

    if (file !== 'index.html' && file !== 'login.html') {
        const footerScripts =
            '    <script defer src="js/utils.js"></script>\n' +
            '    <script defer src="js/main.js"></script>\n' +
            '    <script defer src="js/animations.js"></script>\n';

        if (!out.includes('js/animations.js') && (out.includes('fade-up') || out.includes('pr-reveal'))) {
            out = out.replace(
                /(<script defer src="js\/main\.js"><\/script>)/,
                `$1\n    <script defer src="js/animations.js"></script>`
            );
        }
        if (!out.includes('js/page-rich.js') && out.includes('pr-reveal')) {
            out = out.replace(
                /(<script defer src="js\/animations\.js"><\/script>)/,
                `$1\n    <script defer src="js/page-rich.js"></script>`
            );
        }
    }

    return out;
}

fs.readdirSync(root)
    .filter((f) => f.endsWith('.html') && !skip.has(f))
    .forEach((file) => {
        const full = path.join(root, file);
        const before = fs.readFileSync(full, 'utf8');
        const after = patch(before, file);
        if (after !== before) {
            fs.writeFileSync(full, after);
            console.log('restore', file);
        }
    });

console.log('Done');
