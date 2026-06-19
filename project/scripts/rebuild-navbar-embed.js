const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '../navbar.html'), 'utf8').trim();
fs.writeFileSync(
    path.join(__dirname, '../js/navbar-embed.js'),
    'window.NAVBAR_EMBED_HTML = ' + JSON.stringify(html) + ';\n'
);
console.log('navbar-embed.js rebuilt');
