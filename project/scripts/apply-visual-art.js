const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const indexServices = [
    ['fa-code', 'assets/services/web-platform.svg'],
    ['fa-chart-line', 'assets/services/data-analytics.svg'],
    ['fa-bullhorn', 'assets/services/ecommerce-strategy.svg'],
    ['fa-share-alt', 'assets/services/product-design.svg']
];

const indexProjects = [
    ['fa-globe', 'assets/images/project-01.svg'],
    ['fa-search', 'assets/images/project-01.svg'],
    ['fa-ad', 'assets/images/project-02.svg']
];

const portfolioArts = [
    'assets/images/project-01.svg',
    'assets/images/project-03.svg',
    'assets/images/project-01.svg',
    'assets/images/project-02.svg'
];

const blogArts = [
    'assets/images/project-01.svg',
    'assets/images/project-02.svg',
    'assets/services/ai-automation.svg'
];

const heroByFile = {
    'web.html': 'assets/services/web-platform.svg',
    'development.html': 'assets/services/development.svg',
    'software-engineering.html': 'assets/services/software-engineering.svg',
    'data-analytics.html': 'assets/services/data-analytics.svg',
    'ecommerce-strategy.html': 'assets/services/ecommerce-strategy.svg',
    'ai.html': 'assets/services/ai-automation.svg',
    'testing-qa.html': 'assets/services/testing-qa.svg',
    'saas-platforms.html': 'assets/services/saas-platforms.svg',
    'mobile.html': 'assets/services/mobile-app.svg',
    'application-modernization.html': 'assets/services/application-modernization.svg',
    'it-consulting.html': 'assets/services/it-consulting.svg',
    'cloud.html': 'assets/services/cloud-engineering.svg',
    'product-design.html': 'assets/services/product-design.svg'
};

function artImg(src, extraClass = '') {
    return `<img src="${src}" alt="" class="visual-art${extraClass ? ' ' + extraClass : ''}" loading="lazy">`;
}

function replaceIconBlock(html, className, iconClass, src, wrapClass) {
    const re = new RegExp(
        `<div class="${className}(?:[^"]*)?" aria-hidden="true"><i class="fas ${iconClass}"></i></div>`,
        'g'
    );
    return html.replace(
        re,
        `<div class="visual-art-wrap ${wrapClass}" aria-hidden="true">${artImg(src)}</div>`
    );
}

function processFile(relPath) {
    const full = path.join(root, relPath);
    if (!fs.existsSync(full)) return false;
    let html = fs.readFileSync(full, 'utf8');
    const before = html;

    if (relPath === 'index.html') {
        indexServices.forEach(([icon, src]) => {
            html = replaceIconBlock(html, 'service-card-icon', icon, src, 'visual-art-wrap--card');
        });
        indexProjects.forEach(([icon, src]) => {
            html = html.replace(
                new RegExp(`<div class="media-icon-placeholder" aria-hidden="true"><i class="fas ${icon}"></i></div>`, 'g'),
                `<div class="visual-art-wrap visual-art-wrap--project" aria-hidden="true">${artImg(src)}</div>`
            );
        });
    }

    if (relPath === 'portfolio.html') {
        let i = 0;
        html = html.replace(
            /<div class="media-icon-placeholder" aria-hidden="true"><i class="fas [^"]+"><\/i><\/div>/g,
            () => {
                const src = portfolioArts[i++] || portfolioArts[0];
                return `<div class="visual-art-wrap visual-art-wrap--media" aria-hidden="true">${artImg(src)}</div>`;
            }
        );
    }

    if (relPath === 'blog.html') {
        let i = 0;
        html = html.replace(
            /<div class="media-icon-placeholder" aria-hidden="true"><i class="fas [^"]+"><\/i><\/div>/g,
            () => {
                const src = blogArts[i++] || blogArts[0];
                return `<div class="visual-art-wrap visual-art-wrap--blog" aria-hidden="true">${artImg(src)}</div>`;
            }
        );
    }

    const heroSrc = heroByFile[relPath];
    if (heroSrc) {
        html = html.replace(
            /<div class="web-hero-visual-icon" aria-hidden="true"><i class="fas [^"]+"><\/i><\/div>/,
            `<div class="web-hero-visual-icon" aria-hidden="true">${artImg(heroSrc, 'visual-art--hero')}</div>`
        );
    }

    if (html !== before) {
        fs.writeFileSync(full, html);
        console.log('updated', relPath);
        return true;
    }
    return false;
}

const files = [
    'index.html', 'portfolio.html', 'blog.html',
    ...Object.keys(heroByFile)
];

files.forEach(processFile);
