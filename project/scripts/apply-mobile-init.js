/**
 * Add mobile-init.js to all project HTML pages (early mobile app shell)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const skip = new Set(['navbar.html', 'unified-header.html', 'unified-footer.html', 'oauth-callback.html']);
const oldInline = /(<script>\(function\(\)\{if\(window\.matchMedia\('\(max-width:900px\)'\)\.matches\)document\.documentElement\.classList\.add\('mobile-view'\);\}\)\(\);<\/script>\s*)/g;
const tag = '<script src="js/mobile-init.js"></script>\n    ';

fs.readdirSync(root)
    .filter((f) => f.endsWith('.html') && !skip.has(f))
    .forEach((file) => {
        const full = path.join(root, file);
        let html = fs.readFileSync(full, 'utf8');
        const before = html;

        if (html.includes('mobile-init.js')) return;

        if (oldInline.test(html)) {
            html = html.replace(oldInline, tag);
        } else if (html.includes('<head>')) {
            html = html.replace('<head>', `<head>\n    ${tag.trim()}`);
        }

        if (html !== before) {
            fs.writeFileSync(full, html);
            console.log('mobile-init', file);
        }
    });

console.log('Done');
