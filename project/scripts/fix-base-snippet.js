const fs = require('fs');
const path = require('path');
const P = path.join(__dirname, '..');
const OLD = '(document.head||document.documentElement).insertBefore(e,(document.head||document.documentElement).firstChild)';
const NEW = 'var h=document.head||document.documentElement;var c=document.querySelector("meta[charset]");if(c)c.after(e);else h.insertBefore(e,h.firstChild)';

for (const f of fs.readdirSync(P).filter((x) => x.endsWith('.html'))) {
    const file = path.join(P, f);
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes(OLD)) {
        html = html.replace(OLD, NEW);
        fs.writeFileSync(file, html);
        console.log('updated:', f);
    }
}
