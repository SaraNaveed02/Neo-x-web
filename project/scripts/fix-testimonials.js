/**
 * Replace personal names in testimonials with company-only (no human references)
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');

const REPLACEMENTS = [
    [/— Aisha R\., Dezara Fashion/g, '— Dezara Fashion Team'],
    [/— Michael T\., BoltSolar/g, '— BoltSolar Team'],
    [/<strong>Aisha R\.<\/strong><span>Dezara Fashion/g, '<strong>Dezara Fashion</strong><span>Fashion E-commerce · Pakistan'],
    [/<strong>Michael T\.<\/strong><span>BoltSolar/g, '<strong>BoltSolar</strong><span>Renewable Energy · Pakistan'],
    [/<strong>MezzoK Client<\/strong><span>E-Commerce/g, '<strong>MezzoK</strong><span>E-Commerce · Pakistan'],
    [/alt="NEOXWEB team at work"/g, 'alt="NEOXWEB project dashboard"'],
    [/alt="NEOXWEB development team"/g, 'alt="NEOXWEB web development project"'],
];

fs.readdirSync(PROJECT)
    .filter((f) => f.endsWith('.html'))
    .forEach((f) => {
        const fp = path.join(PROJECT, f);
        let html = fs.readFileSync(fp, 'utf8');
        let changed = false;
        REPLACEMENTS.forEach(([re, rep]) => {
            if (re.test(html)) {
                html = html.replace(re, rep);
                changed = true;
            }
        });
        if (changed) {
            fs.writeFileSync(fp, html, 'utf8');
            console.log('Fixed testimonials:', f);
        }
    });

console.log('Done — company-only testimonials, no human photo alts.');
