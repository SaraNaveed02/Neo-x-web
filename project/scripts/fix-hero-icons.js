const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && !['node_modules', 'scripts'].includes(entry.name)) {
            walk(full);
        } else if (entry.name.endsWith('.html')) {
            let html = fs.readFileSync(full, 'utf8');
            const updated = html.replace(
                /(<div class="web-hero-visual[^"]*">\s*)<div class="media-icon-placeholder"/g,
                '$1<div class="web-hero-visual-icon"'
            );
            if (updated !== html) {
                fs.writeFileSync(full, updated);
                console.log('hero icon', path.relative(root, full));
            }
        }
    }
}

walk(root);
