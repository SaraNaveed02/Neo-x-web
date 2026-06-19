/**
 * Apply Unified Infotech theme to all HTML pages
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');
const SKIP = new Set([
    'index.html',
    'oauth-callback.html',
    'app.html',
    'unified-header.html',
    'unified-footer.html',
    'navbar.html'
]);

const REMOVE_CSS = [
    'css/main.css',
    'css/components.css',
    'css/animations.css',
    'css/dark-mode.css',
    'css/responsive.css',
    'css/neoxweb-theme.css',
    'css/site-pages.css',
    'css/navbar-pro.css'
];

const UNIFIED_SCRIPTS = `
    <script defer src="js/unified-home.js"></script>
    <script defer src="js/unified-layout.js"></script>`;

const UNIFIED_CSS = `
    <link rel="stylesheet" href="css/unified-theme.css">
    <link rel="stylesheet" href="css/unified-pages.css">`;

function patchFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    const base = path.basename(filePath);

    if (!html.includes('unified-theme.css')) {
        const faLink = html.match(/<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome[^"]*"[^>]*>/);
        if (faLink) {
            html = html.replace(faLink[0], faLink[0] + UNIFIED_CSS);
        } else {
            html = html.replace('</head>', UNIFIED_CSS + '\n</head>');
        }
    }

    REMOVE_CSS.forEach((css) => {
        html = html.replace(new RegExp(`\\s*<link rel="stylesheet" href="${css.replace('.', '\\.')}">\\s*`, 'g'), '\n');
    });

    html = html.replace(/<meta name="theme-color" content="[^"]*">/g, '<meta name="theme-color" content="#0057ff">');

    if (html.includes('<body class="')) {
        html = html.replace(/<body class="([^"]*)">/, (m, cls) => {
            const classes = cls.split(/\s+/).filter((c) => c && c !== 'site-page');
            if (!classes.includes('unified-site')) classes.unshift('unified-site');
            return `<body class="${classes.join(' ')}" data-ui-nav="${base}">`;
        });
    } else {
        html = html.replace('<body>', `<body class="unified-site" data-ui-nav="${base}">`);
    }

    html = html.replace(/<div id="navbar-container"><\/div>/g, '<div id="ui-header-slot"></div>');
    html = html.replace(/<div id="navbar-container">[\s\S]*?<\/header>\s*\n\s*<\/div>/g, '<div id="ui-header-slot"></div>');

    if (!html.includes('ui-footer-slot')) {
        html = html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>\s*/g, '<div id="ui-footer-slot"></div>\n');
    }

    ['navbar.js', 'navbar-embed.js', 'mobile-app.js', 'hero-particles.js'].forEach((js) => {
        html = html.replace(new RegExp(`\\s*<script defer src="js/${js.replace('.', '\\.')}"><\\/script>\\s*`, 'g'), '\n');
    });

    if (!html.includes('unified-layout.js')) {
        html = html.replace('</body>', UNIFIED_SCRIPTS + '\n</body>');
    }

    html = html.replace(/\s*<div class="custom-cursor" id="customCursor"><\/div>\s*/g, '\n');

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Updated:', base);
}

fs.readdirSync(PROJECT)
    .filter((f) => f.endsWith('.html') && !SKIP.has(f))
    .forEach((f) => patchFile(path.join(PROJECT, f)));

console.log('Done — unified theme applied.');
