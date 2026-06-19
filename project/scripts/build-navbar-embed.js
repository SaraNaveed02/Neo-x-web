const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'navbar.html'), 'utf8').trim();
const escaped = html
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, '\\n');

fs.writeFileSync(
    path.join(root, 'js', 'navbar-embed.js'),
    `window.NAVBAR_EMBED_HTML = "${escaped}";\n`
);

console.log('navbar-embed.js updated');
