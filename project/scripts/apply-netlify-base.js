/**
 * Inject site base script into all HTML pages (Netlify + XAMPP paths)
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');
const SKIP = new Set(['navbar.html', 'unified-header.html', 'unified-footer.html', 'oauth-callback.html']);
const BASE_SNIPPET = `<script>(function(){var p=location.pathname||'/';var s=p.lastIndexOf('/');var b=s>=0?p.slice(0,s+1):'/';window.__NEOXWEB_BASE__=b;var e=document.createElement('base');e.id='neoxweb-base';e.href=b;var h=document.head||document.documentElement;var c=document.querySelector('meta[charset]');if(c)c.after(e);else h.insertBefore(e,h.firstChild);})();</script>`;

for (const file of fs.readdirSync(PROJECT).filter((f) => f.endsWith('.html') && !SKIP.has(f))) {
    let html = fs.readFileSync(path.join(PROJECT, file), 'utf8');
    if (html.includes('id="neoxweb-base"') || html.includes('__NEOXWEB_BASE__')) {
        console.log('skip (has base):', file);
        continue;
    }
    if (html.includes('<meta charset="UTF-8">')) {
        html = html.replace('<meta charset="UTF-8">', `<meta charset="UTF-8">\n    ${BASE_SNIPPET}`);
    } else if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>\n    ${BASE_SNIPPET}`);
    } else {
        console.log('skip (no head):', file);
        continue;
    }
    if (!html.includes('navbar-embed.js') && html.includes('navbar.js') && !html.includes('navbar-embed.js')) {
        html = html.replace('<script defer src="js/navbar.js">', '<script defer src="js/navbar-embed.js"></script>\n    <script defer src="js/navbar.js">');
    }
    fs.writeFileSync(path.join(PROJECT, file), html, 'utf8');
    console.log('patched:', file);
}
console.log('Done.');
