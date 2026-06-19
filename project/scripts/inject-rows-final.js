/**
 * Inject pro-split-sections.css, site-rows-final.css, row-layout.js into all HTML pages.
 * Remove service-cards-grid.css references.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const skip = new Set(['navbar.html', 'unified-footer.html']);

const ROW_BLOCK = `    <link rel="stylesheet" href="css/pro-split-sections.css">
    <link rel="stylesheet" href="css/site-rows-final.css">
    <script src="js/row-layout.js" defer></script>`;

function patchFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    const base = path.basename(filePath);
    if (skip.has(base)) return false;

    let changed = false;

    if (html.includes('service-cards-grid.css')) {
        html = html.replace(/\s*<link[^>]*href="css\/service-cards-grid\.css"[^>]*>\s*/g, '\n');
        changed = true;
    }

    if (!html.includes('site-rows-final.css')) {
        if (html.includes('pro-split-sections.css')) {
            html = html.replace(
                /(<link[^>]*href="css\/pro-split-sections\.css"[^>]*>)/,
                `$1\n    <link rel="stylesheet" href="css/site-rows-final.css">\n    <script src="js/row-layout.js" defer></script>`
            );
        } else if (html.includes('</head>')) {
            html = html.replace('</head>', `${ROW_BLOCK}\n</head>`);
        }
        changed = true;
    } else if (!html.includes('row-layout.js')) {
        html = html.replace(
            /(<link[^>]*href="css\/site-rows-final\.css"[^>]*>)/,
            `$1\n    <script src="js/row-layout.js" defer></script>`
        );
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, html, 'utf8');
        return true;
    }
    return false;
}

function walk(dir) {
    let count = 0;
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            if (name === 'node_modules' || name === 'scripts') continue;
            count += walk(full);
        } else if (name.endsWith('.html')) {
            if (patchFile(full)) {
                console.log('patched:', path.relative(root, full));
                count++;
            }
        }
    }
    return count;
}

const n = walk(root);
console.log('Done. Patched', n, 'files.');
