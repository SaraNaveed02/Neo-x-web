/**
 * Netlify-ready — config.js har page par + hardcoded /time/ paths hatao
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');
const SKIP = new Set(['oauth-callback.html', 'navbar.html', 'unified-header.html', 'unified-footer.html']);

const CONFIG_BLOCK = `    <script src="js/config.js"></script>
    <script src="js/config.live.js"></script>`;

const NETLIFY_META = `    <!-- Netlify: optional PHP API URL (backend alag host par) -->
    <meta name="neoxweb-api-base" content="">`;

function patchHtml(html, basename) {
    html = html.replace(/<link rel="canonical" href="\/time\/project\/([^"]+)">/g,
        '<link rel="canonical" href="./$1">');

    html = html.replace(/window\.NexuraAPI\?\.baseUrl \|\| '\/time\/backend\/api'/g,
        '(window.NexuraAPI?.baseUrl || window.NexuraConfig?.apiBase || \'\')');

    html = html.replace(/fetch\(\(window\.NexuraAPI\?\.baseUrl \|\| '[^']*'\)/g,
        'fetch((window.NexuraAPI?.baseUrl || window.NexuraConfig?.apiBase || \'\')');

    if (!html.includes('js/config.js')) {
        html = html.replace('<head>', `<head>\n${CONFIG_BLOCK}`);
    }

    if (!html.includes('neoxweb-api-base')) {
        html = html.replace('<meta charset="UTF-8">', `<meta charset="UTF-8">\n${NETLIFY_META}`);
    }

    if (!html.includes('js/api.js') && html.includes('js/forms.js')) {
        html = html.replace('<script defer src="js/forms.js">',
            '<script defer src="js/api.js"></script>\n    <script defer src="js/forms.js">');
    }

    return html;
}

for (const f of fs.readdirSync(PROJECT).filter((x) => x.endsWith('.html') && !SKIP.has(x))) {
    const fp = path.join(PROJECT, f);
    const out = patchHtml(fs.readFileSync(fp, 'utf8'), f);
    fs.writeFileSync(fp, out, 'utf8');
    console.log('Netlify-ready:', f);
}

console.log('\nDone — deploy "project" folder to Netlify.');
