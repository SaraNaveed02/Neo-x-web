/**
 * Complete NEOXWEB site — PWA + mobile app shell on phone, classic site on laptop
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');
const SKIP = new Set(['oauth-callback.html', 'navbar.html', 'unified-header.html', 'unified-footer.html']);

const EARLY_MOBILE = `<script>(function(){if(window.matchMedia('(max-width:900px)').matches)document.documentElement.classList.add('mobile-view');})();</script>`;

const SHELL_CSS = '<link rel="stylesheet" href="css/responsive-shell.css">';

const PWA_HEAD = `
    <link rel="manifest" href="manifest.json">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="apple-touch-icon" href="assets/pwa/icon.svg">`;

const SHELL_SCRIPTS = `
    <script defer src="js/mobile-app.js"></script>
    <script defer src="js/pwa.js"></script>`;

const PWA_BANNER = `
<div id="pwaInstallBanner" role="region" aria-label="Install app">
    <span><i class="fas fa-mobile-alt"></i> Install NEOXWEB app on your phone</span>
    <button type="button" class="pwa-install-btn" id="pwaInstallBtn">Install</button>
    <button type="button" class="pwa-dismiss-btn" id="pwaDismissBtn" aria-label="Dismiss">✕</button>
</div>`;

function patchHtml(html, basename) {
    if (!html.includes('responsive-shell.css')) {
        html = html.replace('</head>', `    ${SHELL_CSS}\n</head>`);
    }

    if (!html.includes('rel="manifest"')) {
        html = html.replace('</head>', `${PWA_HEAD}\n</head>`);
    }

    if (!html.includes('mobile-view')) {
        html = html.replace('<head>', `<head>\n    ${EARLY_MOBILE}`);
    }

    if (!html.includes('mobile-app.js')) {
        html = html.replace('</body>', `${SHELL_SCRIPTS}\n</body>`);
    }

    if (!html.includes('pwaInstallBanner') && basename !== 'oauth-callback.html') {
        html = html.replace('</body>', `\n${PWA_BANNER}\n</body>`);
    }

    if (!html.includes('mobile-app.css')) {
        html = html.replace('</head>', '    <link rel="stylesheet" href="css/mobile-app.css">\n</head>');
    }

    return html;
}

for (const f of fs.readdirSync(PROJECT).filter((x) => x.endsWith('.html') && !SKIP.has(x))) {
    const fp = path.join(PROJECT, f);
    const patched = patchHtml(fs.readFileSync(fp, 'utf8'), f);
    fs.writeFileSync(fp, patched, 'utf8');
    console.log('Finalized:', f);
}

console.log('Done — PWA + responsive shell added to all pages.');
