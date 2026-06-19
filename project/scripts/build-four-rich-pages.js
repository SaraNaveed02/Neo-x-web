/**
 * Idempotent inject: gallery + Figma article + Web Developer article + Figma Draw
 * into industry.html, resources.html, web.html, development.html
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');
const CONTENT = path.join(PROJECT, 'content');

function read(name) {
    return fs.readFileSync(path.join(CONTENT, name), 'utf8').trim();
}

const GALLERY = read('gallery-8.html');
const FIGMA = read('figma-web-guide.html');
const WEBDEV = read('web-developer-guide.html');
const FIGMA_DRAW = read('figma-draw-guide.html');
const CSS_LINK = '<link rel="stylesheet" href="css/article-full.css">';

const MARK = {
    gallery: '<!-- RICH:GALLERY -->',
    galleryEnd: '<!-- /RICH:GALLERY -->',
    figma: '<!-- RICH:FIGMA -->',
    figmaEnd: '<!-- /RICH:FIGMA -->',
    webdev: '<!-- RICH:WEBDEV -->',
    webdevEnd: '<!-- /RICH:WEBDEV -->',
    draw: '<!-- RICH:FIGMA-DRAW -->',
    drawEnd: '<!-- /RICH:FIGMA-DRAW -->',
};

function ensureCss(html) {
    if (!html.includes('article-full.css')) {
        html = html.replace('</head>', `    ${CSS_LINK}\n</head>`);
    }
    return html;
}

function stripMarked(html, start, end) {
    const re = new RegExp(`${escapeRe(start)}[\\s\\S]*?${escapeRe(end)}\\s*`, 'g');
    return html.replace(re, '');
}

function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripAllRich(html) {
    html = stripMarked(html, MARK.gallery, MARK.galleryEnd);
    html = stripMarked(html, MARK.figma, MARK.figmaEnd);
    html = stripMarked(html, MARK.webdev, MARK.webdevEnd);
    html = stripMarked(html, MARK.draw, MARK.drawEnd);
    return html;
}

/** Remove legacy art-page wrapper blocks from earlier build runs */
function stripLegacyArtBlocks(html) {
    const re = /<section class="ui-section[^"]*\bart-page\b[^"]*">[\s\S]*?<\/section>\s*\n\s*<\/section>/g;
    return html.replace(re, '');
}

/** Remove duplicate unmarked galleries and orphan closing tags left by partial strips */
function cleanupHtml(html) {
    html = html.replace(/<!-- 8 Web Development images[\s\S]*?<div class="art-gallery-8[\s\S]*?<\/div>\s*(?=<!-- RICH:GALLERY -->)/g, '');
    html = html.replace(/(\n\s*){1,3}<\/div>\s*\n\s*<\/section>\s*(?=\n\s*\n\s*<\/div>\s*\n\s*<\/section>|\n\s*<!-- RICH:|\n\s*<section class="ui-cta-band">)/g, '\n\n');
    return html;
}

function wrap(sectionClass, inner) {
    return `<section class="${sectionClass}">
            <div class="ui-container ui-container--article ui-fade-up">
${inner}
            </div>
        </section>`;
}

function block(start, end, body) {
    return `${start}\n${body}\n${end}\n\n        `;
}

function patchFile(filename, mutator) {
    const file = path.join(PROJECT, filename);
    let html = fs.readFileSync(file, 'utf8');
    html = ensureCss(html);
    html = stripAllRich(html);
    html = stripLegacyArtBlocks(html);
    html = cleanupHtml(html);
    html = mutator(html);
    html = cleanupHtml(html);
    fs.writeFileSync(file, html, 'utf8');
    console.log('Patched:', filename);
}

function patchIndustry(html) {
    const figmaBlock = block(MARK.figma, MARK.figmaEnd,
        wrap('ui-section ui-section--soft art-page',
            `<div class="ui-container ui-container--wide ui-fade-up" style="margin-bottom:1.5rem">
                <span class="ui-section-tag">Resource Library</span>
                <h2 class="ui-section-title">What is Web design and <span class="ui-gradient-text">development?</span></h2>
            </div>\n${FIGMA}`));

    const webdevBlock = block(MARK.webdev, MARK.webdevEnd, wrap('ui-section art-page', WEBDEV));
    const drawBlock = block(MARK.draw, MARK.drawEnd, wrap('ui-section ui-section--soft art-page', FIGMA_DRAW));

    html = html.replace(
        '<section class="ui-cta-band">',
        `${figmaBlock}${webdevBlock}${drawBlock}<section class="ui-cta-band">`
    );

    html = html.replace(
        /(<div class="ind-webapp-fullbleed[^"]*"[^>]*>)[\s\S]*?(\n\s*<\/div>\s*\n\s*<\/section>\s*\n\s*<section class="ui-section ui-section--soft">\s*\n\s*<div class="ui-container ui-text-center">)/,
        `$1\n${block(MARK.gallery, MARK.galleryEnd, GALLERY)}$2`
    );
    return html;
}

function patchResources(html) {
    const galleryBlock = block(MARK.gallery, MARK.galleryEnd,
        `<section class="ui-section ui-section--soft" style="padding-top:0;padding-bottom:0">\n            ${GALLERY}\n        </section>`);

    const figmaBlock = block(MARK.figma, MARK.figmaEnd, wrap('ui-section art-page ui-section--soft', FIGMA));
    const webdevBlock = block(MARK.webdev, MARK.webdevEnd, wrap('ui-section art-page', WEBDEV));
    const drawBlock = block(MARK.draw, MARK.drawEnd, wrap('ui-section ui-section--soft art-page', FIGMA_DRAW));

    html = html.replace(
        /(<section class="nx-hero-img">[\s\S]*?<\/section>)\s*\n\s*(<section class="ui-section ui-section--soft" id="resources-hub"[^>]*>)/,
        `$1\n\n        ${galleryBlock}\n        ${figmaBlock}\n        $2`
    );

    html = html.replace(
        '<section class="ui-cta-band">',
        `${webdevBlock}${drawBlock}<section class="ui-cta-band">`
    );

    html = html.replace(
        "nx-hero-img__bg\" aria-hidden=\"true\"></div>",
        "nx-hero-img__bg\" style=\"background-image:url('assets/images/web-dev/web-development-hex.png');background-size:cover;background-position:center\" aria-hidden=\"true\"></div>"
    );
    return html;
}

function patchWeb(html) {
    html = html.replace(
        "background-image:url('assets/images/neoxweb/web-dev.jpg')",
        "background-image:url('assets/images/web-dev/web-magnify.png')"
    );

    html = html.replace(
        '<div class="svc-logo-strip">',
        `${block(MARK.gallery, MARK.galleryEnd, GALLERY)}\n        <div class="svc-logo-strip">`
    );

    const figmaBlock = block(MARK.figma, MARK.figmaEnd, wrap('ui-section art-page ui-section--soft', FIGMA));
    const drawBlock = block(MARK.draw, MARK.drawEnd, wrap('ui-section art-page', FIGMA_DRAW));

    html = html.replace(
        '<section class="ui-section ui-section--soft">\n            <div class="ui-container">\n                <div class="ui-services-intro ui-fade-up"><span class="ui-section-tag">Our Services</span>',
        `${figmaBlock}${drawBlock}<section class="ui-section ui-section--soft">\n            <div class="ui-container">\n                <div class="ui-services-intro ui-fade-up"><span class="ui-section-tag">Our Services</span>`
    );
    return html;
}

function patchDevelopment(html) {
    html = html.replace(
        "background-image:url('assets/images/neoxweb/portfolio-web.jpg')",
        "background-image:url('assets/images/web-dev/web-development-hex.png')"
    );

    html = html.replace(
        '<div class="svc-logo-strip">',
        `${block(MARK.gallery, MARK.galleryEnd, GALLERY)}\n        <div class="svc-logo-strip">`
    );

    const webdevBlock = block(MARK.webdev, MARK.webdevEnd, wrap('ui-section art-page ui-section--soft', WEBDEV));
    const figmaBlock = block(MARK.figma, MARK.figmaEnd, wrap('ui-section art-page', FIGMA));
    const drawBlock = block(MARK.draw, MARK.drawEnd, wrap('ui-section ui-section--soft art-page', FIGMA_DRAW));

    html = html.replace(
        '<section class="ui-section ui-section--soft">\n            <div class="ui-container">\n                <div class="ui-services-intro ui-fade-up"><span class="ui-section-tag">Our Services</span>',
        `${webdevBlock}${figmaBlock}${drawBlock}<section class="ui-section ui-section--soft">\n            <div class="ui-container">\n                <div class="ui-services-intro ui-fade-up"><span class="ui-section-tag">Our Services</span>`
    );
    return html;
}

patchFile('industry.html', patchIndustry);
patchFile('resources.html', patchResources);
patchFile('web.html', patchWeb);
patchFile('development.html', patchDevelopment);
console.log('Done — 4 pages filled with images + full articles (idempotent)');
