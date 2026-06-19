/**
 * Remove duplicate nav bars and injected PAGE-RICH clutter from all pages
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const skip = new Set(['oauth-callback.html', 'navbar.html', 'unified-footer.html']);

const QUICK_NAV_RE = /\s*<nav class="nx-quick-nav"[\s\S]*?<\/nav>\s*/g;
const PAGE_RICH_RE = /\s*<!-- PAGE-RICH-START -->[\s\S]*?<!-- PAGE-RICH-END -->\s*/g;

let n = 0;
for (const f of fs.readdirSync(root)) {
    if (!f.endsWith('.html') || skip.has(f)) continue;
    const full = path.join(root, f);
    let html = fs.readFileSync(full, 'utf8');
    const before = html;
    html = html.replace(QUICK_NAV_RE, '\n');
    html = html.replace(PAGE_RICH_RE, '\n');
    if (html !== before) {
        fs.writeFileSync(full, html);
        console.log('cleaned', f);
        n++;
    }
}
console.log('Done —', n, 'files cleaned');
