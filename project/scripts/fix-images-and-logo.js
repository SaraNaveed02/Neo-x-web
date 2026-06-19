/**
 * Replace missing .jpg/.png image refs with local SVG assets + fix logo paths
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const REPLACEMENTS = [
    ['assets/images/neoxweb/web-dev.jpg', 'assets/images/neoxweb/web-dev.svg'],
    ['assets/images/neoxweb/seo-new.jpg', 'assets/images/neoxweb/seo-new.svg'],
    ['assets/images/neoxweb/ppc.jpg', 'assets/images/neoxweb/ppc.svg'],
    ['assets/images/neoxweb/social-media-new.jpg', 'assets/images/neoxweb/social-media-new.svg'],
    ['assets/images/neoxweb/portfolio-branding.jpg', 'assets/images/neoxweb/portfolio-branding.svg'],
    ['assets/images/neoxweb/portfolio-web.jpg', 'assets/images/neoxweb/portfolio-web.svg'],
    ['assets/images/neoxweb/portfolio-seo.jpg', 'assets/images/neoxweb/portfolio-seo.svg'],
    ['assets/images/neoxweb/portfolio-ppc.jpg', 'assets/images/neoxweb/portfolio-ppc.svg'],
    ['assets/images/neoxweb/hero-bg-new.jpg', 'assets/images/neoxweb/hero-bg-new.svg'],
    ['assets/images/neoxweb/hero-tech-bg.png', 'assets/images/neoxweb/hero-tech-bg.svg'],
    ['assets/images/neoxweb/logo-nx-mark.jpg', 'assets/images/neoxweb/logo-unified-mark.svg'],
    ['assets/images/neoxweb/logo-nx-mark.jpg', 'assets/images/neoxweb/logo-unified-mark.svg'],
    ["url('../assets/images/neoxweb/hero-bg-new.jpg')", "url('../assets/images/neoxweb/hero-bg-new.svg')"],
    ["url('assets/images/neoxweb/hero-bg-new.jpg')", "url('assets/images/neoxweb/hero-bg-new.svg')"],
];

function patchFile(filePath) {
    let text = fs.readFileSync(filePath, 'utf8');
    let next = text;
    REPLACEMENTS.forEach(([from, to]) => {
        next = next.split(from).join(to);
    });
    if (next !== text) {
        fs.writeFileSync(filePath, next, 'utf8');
        console.log('patched', path.relative(ROOT, filePath));
    }
}

function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            if (name === 'node_modules') continue;
            walk(full);
        } else if (/\.(html|css|js)$/i.test(name)) {
            patchFile(full);
        }
    }
}

walk(ROOT);
console.log('Done — images and logo paths updated.');
