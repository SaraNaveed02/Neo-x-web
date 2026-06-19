/**
 * Apply neoxweb.pages.dev photos site-wide — NO human portraits
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const photoMap = {
    'assets/images/neoxweb/web-dev.svg': 'assets/images/neoxweb/web-dev.jpg',
    'assets/images/neoxweb/seo-new.svg': 'assets/images/neoxweb/seo-new.jpg',
    'assets/images/neoxweb/ppc.svg': 'assets/images/neoxweb/ppc.jpg',
    'assets/images/neoxweb/social-media-new.svg': 'assets/images/neoxweb/social-media-new.jpg',
    'assets/images/neoxweb/portfolio-branding.svg': 'assets/images/neoxweb/portfolio-branding.jpg',
    'assets/images/neoxweb/portfolio-web.svg': 'assets/images/neoxweb/portfolio-web.jpg',
    'assets/images/neoxweb/portfolio-seo.svg': 'assets/images/neoxweb/portfolio-seo.jpg',
    'assets/images/neoxweb/portfolio-ppc.svg': 'assets/images/neoxweb/portfolio-ppc.jpg',
    'assets/images/neoxweb/hero-bg-new.svg': 'assets/images/neoxweb/hero-bg-new.jpg',
    'assets/services/web-platform.svg': 'assets/images/neoxweb/web-dev.jpg',
    'assets/services/data-analytics.svg': 'assets/images/neoxweb/seo-new.jpg',
    'assets/services/ecommerce-strategy.svg': 'assets/images/neoxweb/ppc.jpg',
    'assets/services/product-design.svg': 'assets/images/neoxweb/social-media-new.jpg',
    'assets/services/mobile-app.svg': 'assets/images/neoxweb/portfolio-branding.jpg',
    'assets/services/development.svg': 'assets/images/neoxweb/web-dev.jpg',
    'assets/services/software-engineering.svg': 'assets/images/neoxweb/web-dev.jpg',
    'assets/services/testing-qa.svg': 'assets/images/neoxweb/web-dev.jpg',
    'assets/services/saas-platforms.svg': 'assets/images/neoxweb/web-dev.jpg',
    'assets/services/application-modernization.svg': 'assets/images/neoxweb/web-dev.jpg',
    'assets/services/it-consulting.svg': 'assets/images/neoxweb/seo-new.jpg',
    'assets/services/cloud-engineering.svg': 'assets/images/neoxweb/portfolio-web.jpg',
    'assets/services/ai-automation.svg': 'assets/images/neoxweb/seo-new.jpg',
    'assets/images/project-01.svg': 'assets/images/neoxweb/portfolio-seo.jpg',
    'assets/images/project-02.svg': 'assets/images/neoxweb/portfolio-ppc.jpg',
    'assets/images/project-03.svg': 'assets/images/neoxweb/portfolio-web.jpg'
};

const humanPhotos = [
    'aisha.jpg', 'michael.jpg', 'alex.jpg', 'james.jpg', 'jason.jpg',
    'maya.jpg', 'priya.jpg', 'sarah.jpg', 'team-', 'portrait', 'unsplash.com'
];

const skipFiles = new Set(['navbar.html', 'unified-header.html', 'unified-footer.html', 'oauth-callback.html']);

function addPhotoCss(html) {
    if (html.includes('neoxweb-photos.css')) return html;
    if (html.includes('css/neoxweb-theme.css')) {
        return html.replace(
            /(<link rel="stylesheet" href="css\/neoxweb-theme\.css">)/,
            '$1\n    <link rel="stylesheet" href="css/neoxweb-photos.css">'
        );
    }
    if (html.includes('css/main.css')) {
        return html.replace(
            /(<link rel="stylesheet" href="css\/main\.css">)/,
            '$1\n    <link rel="stylesheet" href="css/neoxweb-photos.css">'
        );
    }
    return html;
}

function addNxPhotoClass(html) {
    return html.replace(
        /(<img[^>]+src="assets\/images\/neoxweb\/[^"]+\.jpg"[^>]*class=")([^"]*)"/g,
        (m, pre, cls) => {
            if (cls.includes('nx-photo')) return m;
            return `${pre}${cls} nx-photo"`;
        }
    ).replace(
        /(<img[^>]+src="assets\/images\/neoxweb\/[^"]+\.jpg"(?![^>]*class=))/g,
        '$1 class="nx-photo"'
    );
}

function stripHumanRefs(html) {
    let out = html;
    for (const human of humanPhotos) {
        if (!out.includes(human)) continue;
        out = out.replace(new RegExp(`<img[^>]*${human.replace('.', '\\.')}[^>]*>`, 'gi'), '');
        out = out.replace(new RegExp(human.replace('.', '\\.'), 'g'), '');
    }
    return out;
}

function processFile(filename) {
    const full = path.join(root, filename);
    let html = fs.readFileSync(full, 'utf8');
    const before = html;

    html = stripHumanRefs(html);

    for (const [from, to] of Object.entries(photoMap)) {
        html = html.split(from).join(to);
    }

    html = addPhotoCss(html);
    html = addNxPhotoClass(html);

    if (html !== before) {
        fs.writeFileSync(full, html);
        console.log('updated:', filename);
    }
}

function walkHtml(dir) {
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) {
            if (name === 'content' || name === 'templates') walkHtml(full);
            continue;
        }
        if (!name.endsWith('.html') || skipFiles.has(name)) continue;
        processFile(path.relative(root, full));
    }
}

fs.readdirSync(root)
    .filter((f) => f.endsWith('.html') && !skipFiles.has(f))
    .forEach(processFile);

walkHtml(path.join(root, 'content'));
walkHtml(path.join(root, 'templates'));

console.log('Done — live photos applied, no human images.');
