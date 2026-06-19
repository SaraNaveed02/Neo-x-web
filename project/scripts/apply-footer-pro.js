const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const link = (href, label) =>
    `<a href="${href}">${label} <i class="fas fa-chevron-right" aria-hidden="true"></i></a>`;

const footerHtml = `<footer class="site-footer site-footer--pro" role="contentinfo">
    <div class="footer-uni__top container">
        <h2 class="footer-uni__title">Let's Grow Your <strong>Brand</strong></h2>
        <div class="footer-uni__grid">
            <nav class="footer-uni__col" aria-label="Core Services">
                <h3>Core Services</h3>
                ${link('web.html', 'Web Development')}
                ${link('mobile.html', 'Mobile App Development')}
                ${link('ecommerce-strategy.html', 'E-Commerce &amp; PPC')}
                ${link('data-analytics.html', 'SEO &amp; Growth')}
                ${link('development.html', 'Custom Software Development')}
            </nav>
            <nav class="footer-uni__col" aria-label="Technology">
                <h3>Technology</h3>
                ${link('cloud.html', 'Cloud Engineering')}
                ${link('saas-platforms.html', 'SaaS Platforms')}
                ${link('software-engineering.html', 'Software Engineering')}
                ${link('product-design.html', 'UI/UX Design')}
                ${link('ai.html', 'AI Solutions')}
            </nav>
            <nav class="footer-uni__col" aria-label="Company">
                <h3>Company</h3>
                ${link('about.html', 'About')}
                ${link('portfolio.html', 'Case Studies')}
                ${link('blog.html', 'Blogs')}
                ${link('team.html', 'Our Team')}
                ${link('contact.html', 'Contact')}
                ${link('privacy-policy.html', 'Privacy Policy')}
            </nav>
        </div>
    </div>
    <div class="footer-uni__bar container">
        <a href="index.html" class="footer-uni__mark" aria-label="NEOXWEB Home">
            <img src="assets/images/neoxweb/logo-nx-mark.jpg" alt="" width="40" height="40" loading="lazy">
        </a>
        <div class="footer-uni__office">
            <strong class="footer-uni__country">PAK</strong>
            <div>
                <span>Pakistan</span>
                <a href="tel:+923084858836">+92 308 4858836</a>
            </div>
        </div>
        <div class="footer-uni__mail">
            <span>Mail us at</span>
            <a href="mailto:supportneoxweb@gmail.com">supportneoxweb@gmail.com</a>
        </div>
        <div class="footer-uni__social-block">
            <span>Get Connected</span>
            <div class="footer-uni__social">
                <a href="https://wa.me/923084858836" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>
                <a href="mailto:supportneoxweb@gmail.com" aria-label="Email"><i class="fas fa-envelope" aria-hidden="true"></i></a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
            </div>
        </div>
    </div>
    <div class="footer-uni__copy container">
        <p>&copy; 2026 NEOXWEB. All rights reserved. · <a href="privacy-policy.html">Privacy Policy</a></p>
    </div>
</footer>`;

const footerRe = /<footer class="site-footer[^"]*"[^>]*>[\s\S]*?<\/footer>/;

function addFooterCss(html) {
    if (html.includes('footer-pro.css')) return html;
    return html.replace(
        /(<link rel="stylesheet" href="css\/neoxweb-theme\.css">)/,
        '$1\n    <link rel="stylesheet" href="css/footer-pro.css">'
    );
}

const skip = new Set(['navbar.html', 'unified-header.html', 'unified-footer.html', 'oauth-callback.html']);

fs.readdirSync(root)
    .filter((f) => f.endsWith('.html') && !skip.has(f))
    .forEach((file) => {
        const full = path.join(root, file);
        let html = fs.readFileSync(full, 'utf8');
        if (!footerRe.test(html)) return;
        html = html.replace(footerRe, footerHtml);
        html = addFooterCss(html);
        fs.writeFileSync(full, html);
        console.log('footer', file);
    });

console.log('Done.');
