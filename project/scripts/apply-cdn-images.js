/**
 * Saari neoxweb JPG/PNG → live CDN (Netlify par images kabhi missing na hon)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const CDN = 'https://neoxweb.pages.dev/static/images/';
const skip = new Set(['navbar.html', 'unified-header.html', 'unified-footer.html', 'oauth-callback.html']);

const files = [
    'web-dev.jpg', 'seo-new.jpg', 'ppc.jpg', 'social-media-new.jpg',
    'portfolio-branding.jpg', 'portfolio-web.jpg', 'portfolio-seo.jpg', 'portfolio-ppc.jpg',
    'hero-bg-new.jpg', 'logo.png', 'logo-large.jpg'
];

function patchContent(text) {
    let out = text;
    files.forEach((name) => {
        const local = `assets/images/neoxweb/${name}`;
        const remote = CDN + name;
        out = out.split(local).join(remote);
        out = out.split(local.replace(/\//g, '\\')).join(remote);
    });
    out = out.replace(/\.\.\/https:\/\/neoxweb\.pages\.dev/g, 'https://neoxweb.pages.dev');
    return out;
}

function walk(dir, fn) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'scripts') {
            walk(full, fn);
        } else if (entry.isFile() && /\.(html|css)$/i.test(entry.name)) {
            fn(full);
        }
    }
}

walk(root, (file) => {
    if (skip.has(path.basename(file))) return;
    const before = fs.readFileSync(file, 'utf8');
    const after = patchContent(before);
    if (after !== before) {
        fs.writeFileSync(file, after);
        console.log('cdn', path.relative(root, file));
    }
});

// navbar logo — CDN logo.png
const navbarPath = path.join(root, 'navbar.html');
if (fs.existsSync(navbarPath)) {
    let nav = fs.readFileSync(navbarPath, 'utf8');
    const before = nav;
    nav = nav.replace(/assets\/images\/neoxweb\/logo-nx\.png/g, CDN + 'logo.png');
    nav = nav.replace(/class="navbar__logo-img navbar__logo-img--nx"/g, 'class="navbar__logo-img navbar__logo-img--nx"');
    if (nav !== before) {
        fs.writeFileSync(navbarPath, nav);
        console.log('cdn navbar.html');
    }
}

console.log('Done');
