const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const heroIcons = {
    'web-dev.jpg': 'fa-code',
    'seo-new.jpg': 'fa-chart-line',
    'ppc.jpg': 'fa-bullhorn',
    'portfolio-web.jpg': 'fa-globe',
    'portfolio-seo.jpg': 'fa-search',
    'portfolio-ppc.jpg': 'fa-ad',
    'portfolio-branding.jpg': 'fa-palette',
    'logo-large.jpg': 'fa-lightbulb',
    'social-media-new.jpg': 'fa-share-alt',
    'hero-bg-new.jpg': 'fa-layer-group'
};

const teamIcons = {
    'seo-new.jpg': 'fa-search',
    'web-dev.jpg': 'fa-code',
    'portfolio-branding.jpg': 'fa-palette',
    'ppc.jpg': 'fa-chart-line',
    'social-media-new.jpg': 'fa-share-alt'
};

function iconPlaceholder(icon, extraClass) {
    return `<div class="media-icon-placeholder${extraClass ? ' ' + extraClass : ''}" aria-hidden="true"><i class="fas ${icon}"></i></div>`;
}

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && !['node_modules', 'scripts', 'content', 'templates'].includes(entry.name)) {
            walk(full);
            continue;
        }
        if (!entry.name.endsWith('.html')) continue;

        let html = fs.readFileSync(full, 'utf8');
        const before = html;

        for (const [jpg, icon] of Object.entries(heroIcons)) {
            const re = new RegExp(`<img src="assets/images/neoxweb/${jpg.replace('.', '\\.')}"[^>]*>`, 'g');
            html = html.replace(re, iconPlaceholder(icon));
        }

        html = html.replace(
            /<div class="svc-banner-hero__bg" style="background-image:url\('assets\/images\/neoxweb\/[^']+'\)"><\/div>/g,
            '<div class="svc-banner-hero__bg svc-banner-hero__bg--gradient" aria-hidden="true"></div>'
        );

        html = html.replace(
            /style="background-image:url\('assets\/images\/neoxweb\/[^']+'\)"/g,
            ''
        );

        html = html.replace(
            /<div class="nx-team-card__img"><img src="assets\/images\/neoxweb\/([^"]+)"[^>]*><\/div>/g,
            (_, jpg) => {
                const icon = teamIcons[jpg] || 'fa-user-gear';
                return `<div class="nx-team-card__img nx-team-card__img--icon">${iconPlaceholder(icon, 'nx-team-icon')}</div>`;
            }
        );

        html = html.replace(
            /<img src="assets\/images\/neoxweb\/logo\.png"[^>]*>/g,
            '<span class="brand-text-logo brand-text-logo--sm">NEOX<span>WEB</span></span>'
        );

        html = html.replace(
            /<img src="assets\/images\/neoxweb\/web-dev\.jpg" alt="" class="auth-brand-art"[^>]*>/g,
            ''
        );

        html = html.replace(
            /<div class="pr-split__media"><img src="assets\/images\/neoxweb\/[^"]+"[^>]*><\/div>/g,
            `<div class="pr-split__media">${iconPlaceholder('fa-laptop-code')}</div>`
        );

        html = html.replace(
            /<div class="pr-media-grid__item"><img src="assets\/images\/neoxweb\/([^"]+)"[^>]*><span>/g,
            (_, jpg) => {
                const icon = heroIcons[jpg] || 'fa-star';
                return `<div class="pr-media-grid__item">${iconPlaceholder(icon, 'pr-media-icon')}<span>`;
            }
        );

        html = html.replace(
            /<a href="([^"]+)" class="pr-mini-case"><img src="assets\/images\/neoxweb\/([^"]+)"[^>]*><div>/g,
            (_, href, jpg) => {
                const icon = heroIcons[jpg] || 'fa-folder-open';
                return `<a href="${href}" class="pr-mini-case">${iconPlaceholder(icon, 'pr-mini-icon')}<div>`;
            }
        );

        html = html.replace(
            /<a href="([^"]+)" class="nx-stack-card"><img src="assets\/images\/neoxweb\/([^"]+)"[^>]*><div/g,
            (_, href, jpg) => {
                const icon = heroIcons[jpg] || 'fa-folder-open';
                return `<a href="${href}" class="nx-stack-card">${iconPlaceholder(icon, 'nx-stack-icon')}<div`;
            }
        );

        html = html.replace(
            /<div class="thumb" style="padding:0;overflow:hidden"><img src="assets\/images\/neoxweb\/([^"]+)"[^>]*><\/div>/g,
            (_, jpg) => {
                const icon = heroIcons[jpg] || 'fa-book';
                return `<div class="thumb">${iconPlaceholder(icon, 'ui-resource-thumb')}</div>`;
            }
        );

        html = html.replace(
            /<div class="svc-vertical-item__icon"><img src="assets\/images\/neoxweb\/([^"]+)"[^>]*><\/div>/g,
            (_, jpg) => {
                const icon = heroIcons[jpg] || 'fa-star';
                return `<div class="svc-vertical-item__icon">${iconPlaceholder(icon)}</div>`;
            }
        );

        html = html.replace(
            /<img src="assets\/images\/neoxweb\/[^"]+" alt="" style="width:100%;height:100%;object-fit:cover" loading="lazy">/g,
            iconPlaceholder('fa-image', 'ui-resource-thumb')
        );

        if (html !== before) {
            fs.writeFileSync(full, html);
            console.log('no photos:', path.relative(root, full));
        }
    }
}

walk(root);
