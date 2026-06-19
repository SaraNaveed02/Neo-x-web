/**
 * Inject premium hero CSS/JS + global image CSS into all HTML pages (except navbar embed).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const skip = new Set(['navbar.html', 'unified-footer.html']);

const PREMIUM_BLOCK = `    <link rel="stylesheet" href="css/nx-images-row.css">
    <link rel="stylesheet" href="css/home-hero-final.css">
    <link rel="stylesheet" href="css/nx-images-global.css">
    <script defer src="js/hero-premium.js"></script>
    <script defer src="js/hero-particles.js"></script>`;

function hasPremiumAssets(html) {
    return html.includes('home-hero-final.css') &&
        html.includes('nx-images-global.css') &&
        html.includes('hero-premium.js') &&
        html.includes('hero-particles.js');
}

function injectAfterRowsFinal(html) {
    if (html.includes('site-rows-final.css')) {
        return html.replace(
            /(<link[^>]*href="css\/site-rows-final\.css"[^>]*>)/,
            `$1\n${PREMIUM_BLOCK}`
        );
    }
    return html.replace('</head>', `${PREMIUM_BLOCK}\n</head>`);
}

function ensureNxImagesRow(html) {
    if (html.includes('nx-images-row.css')) return html;
    if (html.includes('site-rows-final.css')) {
        return html.replace(
            /(<link[^>]*href="css\/site-rows-final\.css"[^>]*>)/,
            `$1\n    <link rel="stylesheet" href="css/nx-images-row.css">`
        );
    }
    return html;
}

function patchHeroPremiumClass(html) {
    let changed = false;
    const heroPatterns = [
        [/class="nx-page-hero hero-section--neoxweb hero-section--pro"/g, 'class="nx-page-hero hero-section--neoxweb hero-section--pro hero-section--premium"'],
        [/class="cs-index-hero nx-page-hero hero-section--neoxweb hero-section--pro"(?! hero-section--premium)/g, 'class="cs-index-hero nx-page-hero hero-section--neoxweb hero-section--pro hero-section--premium"'],
        [/class="web-hero"/g, 'class="web-hero hero-section--neoxweb hero-section--pro hero-section--premium"']
    ];
    heroPatterns.forEach(function (pair) {
        if (pair[0].test(html)) {
            html = html.replace(pair[0], pair[1]);
            changed = true;
        }
    });
    return { html, changed };
}

function patchFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    const base = path.basename(filePath);
    if (skip.has(base)) return false;

    let changed = false;

    if (!hasPremiumAssets(html)) {
        html = ensureNxImagesRow(html);
        html = injectAfterRowsFinal(html);
        changed = true;
    }

    const heroPatch = patchHeroPremiumClass(html);
    if (heroPatch.changed) {
        html = heroPatch.html;
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, html, 'utf8');
        return true;
    }
    return false;
}

function walk(dir) {
    let count = 0;
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            if (name === 'node_modules' || name === 'scripts') continue;
            count += walk(full);
        } else if (name.endsWith('.html')) {
            if (patchFile(full)) {
                console.log('patched:', path.relative(root, full));
                count++;
            }
        }
    }
    return count;
}

const n = walk(root);
console.log('Done. Patched', n, 'files.');
