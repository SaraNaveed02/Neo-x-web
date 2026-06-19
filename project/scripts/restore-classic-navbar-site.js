/**
 * Restore classic NEOXWEB site — top navbar + Services mega menu (no app shell / bottom dock)
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');

const SKIP = new Set([
    'oauth-callback.html',
    'app.html',
    'unified-header.html',
    'unified-footer.html',
    'navbar.html'
]);

const CLASSIC_FONTS = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap';

const CLASSIC_CSS = [
    'css/main.css',
    'css/components.css',
    'css/animations.css',
    'css/dark-mode.css',
    'css/responsive.css',
    'css/navbar-pro.css',
    'css/neoxweb-theme.css'
];

const CLASSIC_SCRIPTS = [
    'js/utils.js',
    'js/main.js',
    'js/animations.js',
    'js/navbar.js'
];

const REMOVE_CSS = [
    'unified-app.css',
    'dock-pages.css',
    'unified-theme.css',
    'unified-pages.css'
];

const REMOVE_JS = [
    'unified-app.js',
    'unified-layout.js',
    'unified-home.js'
];

const SERVICE_PAGES = new Set([
    'web.html', 'development.html', 'mobile.html', 'ai.html', 'cloud.html',
    'software-engineering.html', 'it-consulting.html', 'application-modernization.html',
    'data-analytics.html', 'ecommerce-strategy.html', 'product-design.html',
    'testing-qa.html', 'saas-platforms.html', 'services.html'
]);

const CLASSIC_FOOTER = `
<footer class="site-footer">
    <div class="container footer-grid">
        <a href="index.html" class="footer-logo">NEOX<span>WEB</span></a>
        <div class="footer-links">
            <a href="services.html">Services</a>
            <a href="portfolio.html">Portfolio</a>
            <a href="resources.html">Resources</a>
            <a href="contact.html">Contact</a>
            <a href="login.html">Login</a>
        </div>
    </div>
    <div class="footer-bottom container"><p>&copy; 2026 NEOXWEB. All rights reserved. · WhatsApp 0308 4858836</p></div>
</footer>
<div class="custom-cursor" id="customCursor"></div>`;

function removeLink(html, file) {
    const re = new RegExp(`\\s*<link[^>]*href="${file.replace(/\./g, '\\.')}"[^>]*>\\s*`, 'gi');
    return html.replace(re, '\n');
}

function removeScript(html, file) {
    const re = new RegExp(`\\s*<script[^>]*src="${file.replace(/\./g, '\\.')}"[^>]*><\\/script>\\s*`, 'gi');
    return html.replace(re, '\n');
}

function ensureClassicHead(html) {
    html = html.replace(/https:\/\/https:\/\//g, 'https://');
    html = html.replace(
        /href="https:\/\/fonts\.googleapis\.com\/css2\?family=[^"]+"/g,
        `href="${CLASSIC_FONTS}"`
    );
    html = html.replace(
        /fonts\.googleapis\.com\/css2\?family=[^"']+/g,
        CLASSIC_FONTS
    );

    REMOVE_CSS.forEach((f) => { html = removeLink(html, f); });
    REMOVE_JS.forEach((f) => { html = removeScript(html, f); });

    const faMatch = html.match(/<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome[^"]+">/);
    const faLink = faMatch ? faMatch[0] : '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous">';

    if (!html.includes('css/main.css')) {
        const block = CLASSIC_CSS.map((c) => `    <link rel="stylesheet" href="${c}">`).join('\n');
        html = html.replace(faLink, `${block}\n    ${faLink}`);
    }

    CLASSIC_CSS.forEach((c) => {
        if (!html.includes(c)) {
            html = html.replace(faLink, `    <link rel="stylesheet" href="${c}">\n    ${faLink}`);
        }
    });

    if (!html.includes('js/navbar.js')) {
        const block = CLASSIC_SCRIPTS.map((s) => `    <script defer src="${s}"></script>`).join('\n');
        html = html.replace('</body>', `${block}\n</body>`);
    }

    html = html.replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#0a0a0a">');

    return html;
}

function patchBodyClasses(html, basename) {
    html = html.replace(/<body([^>]*)>/, (match, attrs) => {
        let cls = '';
        const classMatch = attrs.match(/class="([^"]*)"/);
        if (classMatch) {
            cls = classMatch[1]
                .split(/\s+/)
                .filter((c) => !['unified-site', 'unified-app', 'has-dock', 'ui-ref-theme'].includes(c))
                .join(' ');
        }
        if (!cls.includes('neoxweb-site')) cls = ('neoxweb-site ' + cls).trim();
        if (SERVICE_PAGES.has(basename) && html.includes('ui-section')) {
            cls = (cls + ' ui-ref-theme').trim();
        }
        let rest = attrs.replace(/\s*class="[^"]*"/, '').replace(/\s*data-ui-nav="[^"]*"/, '');
        return `<body class="${cls}"${rest}>`;
    });
    return html;
}

function patchShell(html) {
    html = html.replace(/<div id="ui-header-slot"><\/div>/g, '<div id="navbar-container"></div>');
    html = html.replace(/<div id="ui-footer-slot"><\/div>/g, CLASSIC_FOOTER);
    html = html.replace(/\s*id="app-main"/g, '');
    html = html.replace(/\s*data-app-link="1"/g, '');
    return html;
}

function patchFile(filePath) {
    const basename = path.basename(filePath);
    let html = fs.readFileSync(filePath, 'utf8');

    html = ensureClassicHead(html);
    html = patchBodyClasses(html, basename);
    html = patchShell(html);

    if (!html.includes('custom-cursor') && !html.includes('ui-footer-slot')) {
        html = html.replace('</body>', `\n${CLASSIC_FOOTER}\n</body>`);
    }

    if (!html.includes('js/navbar.js')) {
        html = html.replace('</body>', '    <script defer src="js/navbar.js"></script>\n</body>');
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Classic navbar:', basename);
}

function restoreIndex() {
    const src = path.join(PROJECT, 'templates', 'index-classic.html');
    const dest = path.join(PROJECT, 'index.html');
    fs.copyFileSync(src, dest);
    console.log('Restored: index.html (classic homepage)');
}

function removeApp() {
    const appPath = path.join(PROJECT, 'app.html');
    if (fs.existsSync(appPath)) {
        fs.unlinkSync(appPath);
        console.log('Deleted: app.html');
    }
}

restoreIndex();

fs.readdirSync(PROJECT)
    .filter((f) => f.endsWith('.html') && !SKIP.has(f) && f !== 'index.html')
    .forEach((f) => patchFile(path.join(PROJECT, f)));

/* second pass — strip any remaining app references */
fs.readdirSync(PROJECT)
    .filter((f) => f.endsWith('.html') && !SKIP.has(f))
    .forEach((f) => {
        let html = fs.readFileSync(path.join(PROJECT, f), 'utf8');
        REMOVE_CSS.forEach((file) => { html = removeLink(html, file); });
        REMOVE_JS.forEach((file) => { html = removeScript(html, file); });
        html = html.replace(/https:\/\/https:\/\//g, 'https://');
        html = html.replace(/\s*<script[^>]*src="js\/unified-layout\.js"[^>]*><\/script>\s*/gi, '\n');
        fs.writeFileSync(path.join(PROJECT, f), html, 'utf8');
    });

removeApp();

console.log('\nDone — classic NEOXWEB site with top navbar restored.');
