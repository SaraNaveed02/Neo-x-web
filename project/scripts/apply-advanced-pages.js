/**
 * Inject pages-advanced.css on core pages if missing
 */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const pages = ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html'];

pages.forEach((file) => {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) return;
    let html = fs.readFileSync(full, 'utf8');
    if (!html.includes('pages-advanced.css')) {
        html = html.replace(
            /(<link rel="stylesheet" href="css\/neoxweb-theme\.css">)/,
            '$1\n    <link rel="stylesheet" href="css/pages-advanced.css">'
        );
    }
    if (!html.includes('nx-advanced-page')) {
        html = html.replace(/<body class="([^"]*)">/, (m, cls) => {
            if (cls.includes('nx-advanced-page')) return m;
            return `<body class="${cls} nx-advanced-page">`;
        });
    }
    fs.writeFileSync(full, html);
    console.log('ok', file);
});
