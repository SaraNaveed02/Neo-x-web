/**
 * Inject premium-redesign.css on all HTML pages (after site-polish)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const link = '<link rel="stylesheet" href="css/premium-redesign.css">';
const skip = new Set(['navbar.html', 'unified-footer.html', 'oauth-callback.html']);

let n = 0;
for (const f of fs.readdirSync(root)) {
    if (!f.endsWith('.html') || skip.has(f)) continue;
    const full = path.join(root, f);
    let html = fs.readFileSync(full, 'utf8');
    if (html.includes('premium-redesign.css')) continue;
    if (html.includes('site-polish.css')) {
        html = html.replace(
            '<link rel="stylesheet" href="css/site-polish.css">',
            '<link rel="stylesheet" href="css/site-polish.css">\n    ' + link
        );
    } else if (html.includes('</head>')) {
        html = html.replace('</head>', `    ${link}\n</head>`);
    } else {
        continue;
    }
    fs.writeFileSync(full, html);
    n++;
}
console.log('premium-redesign.css added to', n, 'files');
