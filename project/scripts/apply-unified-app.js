/**
 * Apply Unified web app shell to all project HTML pages
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');
const SKIP = new Set(['oauth-callback.html', 'unified-header.html', 'unified-footer.html', 'navbar.html']);

const APP_CSS = '<link rel="stylesheet" href="css/unified-app.css">';
const APP_JS = '<script defer src="js/unified-app.js"></script>';

function patchFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    const base = path.basename(filePath);

    if (!html.includes('unified-pro.css')) {
        html = html.replace(
            '<link rel="stylesheet" href="css/unified-app.css">',
            '<link rel="stylesheet" href="css/unified-app.css">\n    <link rel="stylesheet" href="css/unified-pro.css">'
        );
        if (!html.includes('unified-pro.css')) {
            html = html.replace(
                '<link rel="stylesheet" href="css/unified-theme.css">',
                '<link rel="stylesheet" href="css/unified-theme.css">\n    <link rel="stylesheet" href="css/unified-pro.css">'
            );
        }
    }

    html = html.replace(
        /fonts\.googleapis\.com\/css2\?family=Space\+Grotesk[^"']+/g,
        'fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
    );

    if (!html.includes('unified-app.css')) {
        html = html.replace(
            '<link rel="stylesheet" href="css/unified-theme.css">',
            '<link rel="stylesheet" href="css/unified-theme.css">\n    ' + APP_CSS
        );
    }

    if (!html.includes('unified-app.js')) {
        html = html.replace(
            '<script defer src="js/unified-home.js"></script>',
            '<script defer src="js/unified-home.js"></script>\n    ' + APP_JS
        );
        if (!html.includes('unified-app.js') && html.includes('unified-layout.js')) {
            html = html.replace(
                '<script defer src="js/unified-layout.js"></script>',
                APP_JS + '\n    <script defer src="js/unified-layout.js"></script>'
            );
        }
    }

    if (html.includes('<body class="')) {
        html = html.replace(/<body class="([^"]*)"/, (m, cls) => {
            const classes = cls.split(/\s+/).filter(Boolean);
            if (!classes.includes('unified-app')) classes.push('unified-app');
            if (!classes.includes('ui-ref-theme')) classes.push('ui-ref-theme');
            if (!classes.includes('has-dock')) classes.push('has-dock');
            return `<body class="${classes.join(' ')}"`;
        });
    }

    if (!html.includes('id="app-main"')) {
        html = html.replace(/<main(\s|>)/, '<main id="app-main"$1');
    }

    const APP_SCRIPTS = `
    <script defer src="js/unified-home.js"></script>
    <script defer src="js/unified-app.js"></script>
    <script defer src="js/unified-layout.js"></script>`;

    if (!html.includes('unified-layout.js')) {
        html = html.replace('</body>', APP_SCRIPTS + '\n</body>');
    }

    if (html.includes('<body class="unified-site"') && !html.includes('unified-app')) {
        html = html.replace('<body class="unified-site"', '<body class="unified-site unified-app"');
    }

    html = html.replace(/<meta name="theme-color" content="[^"]*">/g, '<meta name="theme-color" content="#050508">');

    if (!html.includes('unified-dark.css')) {
        if (html.includes('unified-pro.css')) {
            html = html.replace(
                '<link rel="stylesheet" href="css/unified-pro.css">',
                '<link rel="stylesheet" href="css/unified-pro.css">\n    <link rel="stylesheet" href="css/unified-dark.css">'
            );
        } else if (html.includes('unified-app.css')) {
            html = html.replace(
                '<link rel="stylesheet" href="css/unified-app.css">',
                '<link rel="stylesheet" href="css/unified-app.css">\n    <link rel="stylesheet" href="css/unified-dark.css">'
            );
        } else {
            html = html.replace(
                '<link rel="stylesheet" href="css/unified-theme.css">',
                '<link rel="stylesheet" href="css/unified-theme.css">\n    <link rel="stylesheet" href="css/unified-dark.css">'
            );
        }
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('App shell:', base);
}

fs.readdirSync(PROJECT)
    .filter((f) => f.endsWith('.html') && !SKIP.has(f))
    .forEach((f) => patchFile(path.join(PROJECT, f)));

console.log('Done — web app shell applied to all pages.');
