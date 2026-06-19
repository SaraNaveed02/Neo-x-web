/**
 * Restore original JPG/PNG image paths across the site
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const REPLACEMENTS = [
    ['assets/images/neoxweb/web-dev.svg', 'assets/images/neoxweb/web-dev.jpg'],
    ['assets/images/neoxweb/seo-new.svg', 'assets/images/neoxweb/seo-new.jpg'],
    ['assets/images/neoxweb/ppc.svg', 'assets/images/neoxweb/ppc.jpg'],
    ['assets/images/neoxweb/social-media-new.svg', 'assets/images/neoxweb/social-media-new.jpg'],
    ['assets/images/neoxweb/portfolio-branding.svg', 'assets/images/neoxweb/portfolio-branding.jpg'],
    ['assets/images/neoxweb/portfolio-web.svg', 'assets/images/neoxweb/portfolio-web.jpg'],
    ['assets/images/neoxweb/portfolio-seo.svg', 'assets/images/neoxweb/portfolio-seo.jpg'],
    ['assets/images/neoxweb/portfolio-ppc.svg', 'assets/images/neoxweb/portfolio-ppc.jpg'],
    ['assets/images/neoxweb/hero-bg-new.svg', 'assets/images/neoxweb/hero-bg-new.jpg'],
    ['assets/images/neoxweb/hero-tech-bg.svg', 'assets/images/neoxweb/hero-tech-bg.png'],
    ['assets/images/neoxweb/logo-unified-mark.svg', 'assets/images/neoxweb/logo-nx-mark.jpg'],
    ['assets/images/neoxweb/logo-nx-mark.svg', 'assets/images/neoxweb/logo-nx-mark.jpg'],
    ["url('../assets/images/neoxweb/hero-bg-new.svg')", "url('../assets/images/neoxweb/hero-bg-new.jpg')"],
    ["url('assets/images/neoxweb/hero-bg-new.svg')", "url('assets/images/neoxweb/hero-bg-new.jpg')"],
];

function walk(dir) {
    let count = 0;
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            if (name === 'node_modules') continue;
            count += walk(full);
        } else if (/\.(html|css|js|json)$/i.test(name) && !name.includes('restore-original-images')) {
            let text = fs.readFileSync(full, 'utf8');
            let next = text;
            REPLACEMENTS.forEach(([from, to]) => {
                next = next.split(from).join(to);
            });
            if (next !== text) {
                fs.writeFileSync(full, next, 'utf8');
                count++;
                console.log('restored', path.relative(ROOT, full));
            }
        }
    }
    return count;
}

const n = walk(ROOT);
console.log('Modified files:', n);
