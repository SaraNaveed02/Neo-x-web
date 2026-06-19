/**
 * Inject site-polish.css on all HTML pages
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const link = '<link rel="stylesheet" href="css/site-polish.css">';
const skip = new Set(['navbar.html', 'unified-footer.html', 'oauth-callback.html']);

let n = 0;
for (const f of fs.readdirSync(root)) {
    if (!f.endsWith('.html') || skip.has(f)) continue;
    const full = path.join(root, f);
    let html = fs.readFileSync(full, 'utf8');
    if (html.includes('site-polish.css')) continue;
    if (html.includes('</head>')) {
        html = html.replace('</head>', `    ${link}\n</head>`);
        fs.writeFileSync(full, html);
        n++;
    }
}
console.log('site-polish.css added to', n, 'files');
