const fs = require('fs');
const path = require('path');
const PROJECT = path.join(__dirname, '..');
const SKIP = new Set(['oauth-callback.html', 'navbar.html', 'unified-header.html', 'unified-footer.html']);

const STRIP = [
    /<link[^>]+href="css\/unified-app\.css"[^>]*>\s*/gi,
    /<link[^>]+href="css\/dock-pages\.css"[^>]*>\s*/gi,
    /<link[^>]+href="css\/unified-theme\.css"[^>]*>\s*/gi,
    /<link[^>]+href="css\/unified-pages\.css"[^>]*>\s*/gi,
    /<script[^>]+src="js\/unified-app\.js"[^>]*><\/script>\s*/gi,
    /<script[^>]+src="js\/unified-layout\.js"[^>]*><\/script>\s*/gi,
    /<script[^>]+src="js\/unified-home\.js"[^>]*><\/script>\s*/gi,
];

for (const f of fs.readdirSync(PROJECT).filter((x) => x.endsWith('.html') && !SKIP.has(x))) {
    let html = fs.readFileSync(path.join(PROJECT, f), 'utf8');
    for (const re of STRIP) html = html.replace(re, '');
    html = html.replace(/https:\/\/https:\/\//g, 'https://');
    fs.writeFileSync(path.join(PROJECT, f), html, 'utf8');
    console.log('Stripped app refs:', f);
}
