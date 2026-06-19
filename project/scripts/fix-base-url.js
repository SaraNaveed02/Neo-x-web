/**
 * Fix <base> URL — har page ke folder se assets resolve (images/CSS paths)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const skip = new Set(['navbar.html', 'unified-header.html', 'unified-footer.html', 'oauth-callback.html']);

const OLD = /\(function\(\)\{var p=location\.pathname\|\|'\/';var i=p\.indexOf\('\/project\/'\);var b=i>=0\?p\.substring\(0,i\+9\):'\/';if\(!b\.endsWith\('\/'\)\)b\+='\/';window\.__NEOXWEB_BASE__=b;var e=document\.createElement\('base'\);e\.id='neoxweb-base';e\.href=b;var h=document\.head\|\|document\.documentElement;var c=document\.querySelector\(['"]meta\[charset\]['"]\);if\(c\)c\.after\(e\);else h\.insertBefore\(e,h\.firstChild\);\}\)\(\);/g;

const NEW = `(function(){var p=location.pathname||'/';var s=p.lastIndexOf('/');var b=s>=0?p.slice(0,s+1):'/';window.__NEOXWEB_BASE__=b;var e=document.createElement('base');e.id='neoxweb-base';e.href=b;var h=document.head||document.documentElement;var c=document.querySelector('meta[charset]');if(c)c.after(e);else h.insertBefore(e,h.firstChild);})();`;

const IMAGE_SCRIPT = '<script src="js/image-fallback.js"></script>';

fs.readdirSync(root)
    .filter((f) => f.endsWith('.html') && !skip.has(f))
    .forEach((file) => {
        const full = path.join(root, file);
        let html = fs.readFileSync(full, 'utf8');
        const before = html;

        html = html.replace(OLD, NEW);

        if (!html.includes('image-fallback.js') && html.includes('neoxweb-base')) {
            html = html.replace(
                /<script src="js\/perf-load\.js"><\/script>/,
                `<script src="js/perf-load.js"></script>\n    ${IMAGE_SCRIPT}`
            );
            if (!html.includes('image-fallback.js')) {
                html = html.replace(
                    /(<script>\(function\(\)\{var p=location\.pathname[\s\S]*?<\/script>)/,
                    `$1\n    ${IMAGE_SCRIPT}`
                );
            }
        }

        if (html !== before) {
            fs.writeFileSync(full, html);
            console.log('fixed', file);
        }
    });

console.log('Done');
