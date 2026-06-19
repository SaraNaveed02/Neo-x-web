/**
 * Professional hardening — all project HTML pages
 * - NEOXWEB branding
 * - Unified header/footer slots
 * - Remove duplicate scripts
 * - Standard asset stack
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');
const SKIP = new Set(['oauth-callback.html', 'unified-header.html', 'unified-footer.html', 'navbar.html', 'app.html']);

const STANDARD_HEAD = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous">
    <link rel="stylesheet" href="css/unified-theme.css">
    <link rel="stylesheet" href="css/unified-app.css">
    <link rel="stylesheet" href="css/unified-pro.css">
    <link rel="stylesheet" href="css/unified-dark.css">
    <link rel="stylesheet" href="css/unified-pages.css">`;

const APP_SCRIPTS = `
    <script defer src="js/unified-home.js"></script>
    <script defer src="js/unified-app.js"></script>
    <script defer src="js/unified-layout.js"></script>`;

function dedupeScripts(html) {
    ['js/unified-home.js', 'js/unified-app.js', 'js/unified-layout.js'].forEach((src) => {
        const re = new RegExp(`\\s*<script defer src="${src.replace('.', '\\.')}"><\\/script>`, 'g');
        const matches = html.match(re);
        if (matches && matches.length > 1) {
            let first = true;
            html = html.replace(re, (m) => {
                if (first) { first = false; return m; }
                return '';
            });
        }
    });
    return html;
}

function ensureFooterSlot(html) {
    if (html.includes('id="ui-footer-slot"')) return html;
    if (/<footer class="site-footer[\s\S]*?<\/footer>/i.test(html)) {
        return html.replace(/<footer class="site-footer[\s\S]*?<\/footer>/gi, '<div id="ui-footer-slot"></div>');
    }
    if (/<footer class="ui-footer[\s\S]*?<\/footer>/i.test(html) && !html.includes('id="ui-footer-slot"')) {
        return html.replace(/<!-- FOOTER -->[\s\S]*?<\/footer>/i, '<div id="ui-footer-slot"></div>');
    }
    if (!html.includes('</body>')) return html;
    return html.replace('</body>', `\n    <div id="ui-footer-slot"></div>\n</body>`);
}

function ensureHeaderSlot(html) {
    if (html.includes('id="ui-header-slot"')) return html;
    if (/<header class="ui-header[\s\S]*?<\/header>/i.test(html)) {
        return html.replace(/<!-- HEADER -->[\s\S]*?<\/header>[\s\S]*?(?:<nav class="ui-mobile-nav[\s\S]*?<\/nav>\s*)?/i, '<div id="ui-header-slot"></div>\n');
    }
    return html;
}

function ensureBodyClasses(html) {
    if (!html.includes('<body class="')) return html;
    return html.replace(/<body class="([^"]*)"/, (m, cls) => {
        const classes = cls.split(/\s+/).filter(Boolean);
        if (!classes.includes('unified-site')) classes.unshift('unified-site');
        if (!classes.includes('unified-app')) classes.push('unified-app');
        if (!classes.includes('ui-ref-theme')) classes.push('ui-ref-theme');
        if (!classes.includes('has-dock')) classes.push('has-dock');
        classes.filter((c) => c !== 'nx-app-body');
        return `<body class="${[...new Set(classes.filter((c) => c !== 'nx-app-body'))].join(' ')}"`;
    });
}

function stripBootstrapApp(html) {
    html = html.replace(/<link[^>]+bootstrap[^>]+>\n?/gi, '');
    html = html.replace(/<link[^>]+bootstrap-icons[^>]+>\n?/gi, '');
    html = html.replace(/<link rel="stylesheet" href="css\/bootstrap-app\.css">\n?/gi, '');
    html = html.replace(/<script defer src="js\/bootstrap-app\.js"><\/script>\n?/gi, '');
    html = html.replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap[^<]+<\/script>\n?/gi, '');
    html = html.replace(/\s*class="nx-app-main"/g, '');
    return html;
}

function normalizeBrand(html) {
    html = html.replace(/\bNexura\b/g, 'NEOXWEB');
    html = html.replace(/Nexura App/g, 'NEOXWEB');
    html = html.replace(/<meta name="theme-color" content="[^"]*">/g, '<meta name="theme-color" content="#050508">');
    return html;
}

function ensureAppScripts(html) {
    html = dedupeScripts(html);
    if (!html.includes('unified-layout.js')) {
        html = html.replace('</body>', APP_SCRIPTS + '\n</body>');
    }
    return html;
}

function ensureFontAwesome(html) {
    if (!html.includes('font-awesome')) {
        html = html.replace('</head>', '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous">\n</head>');
    }
    return html;
}

function patchFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    const before = html;

    html = normalizeBrand(html);
    html = stripBootstrapApp(html);
    html = ensureHeaderSlot(html);
    html = ensureFooterSlot(html);
    html = ensureBodyClasses(html);
    html = ensureFontAwesome(html);
    html = ensureAppScripts(html);

    if (html !== before) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log('Professional:', path.basename(filePath));
    }
}

fs.readdirSync(PROJECT)
    .filter((f) => f.endsWith('.html') && !SKIP.has(f))
    .forEach((f) => patchFile(path.join(PROJECT, f)));

console.log('Done — professional shell applied.');
