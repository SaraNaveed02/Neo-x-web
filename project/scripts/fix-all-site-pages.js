/**
 * Fix all NEOXWEB site pages — broken images, missing rich content, assets
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const SKIP = new Set([
    'oauth-callback.html', 'navbar.html', 'unified-header.html', 'unified-footer.html'
]);

const IMAGE_MAP = {
    'assets/images/neoxweb/web-dev.jpg': 'assets/images/neoxweb/web-dev.svg',
    'assets/images/neoxweb/seo-new.jpg': 'assets/images/neoxweb/seo-new.svg',
    'assets/images/neoxweb/ppc.jpg': 'assets/images/neoxweb/ppc.svg',
    'assets/images/neoxweb/social-media-new.jpg': 'assets/images/neoxweb/social-media-new.svg',
    'assets/images/neoxweb/portfolio-branding.jpg': 'assets/images/neoxweb/portfolio-branding.svg',
    'assets/images/neoxweb/portfolio-web.jpg': 'assets/images/neoxweb/portfolio-web.svg',
    'assets/images/neoxweb/portfolio-seo.jpg': 'assets/images/neoxweb/portfolio-seo.svg',
    'assets/images/neoxweb/portfolio-ppc.jpg': 'assets/images/neoxweb/portfolio-ppc.svg',
    'assets/images/neoxweb/hero-bg-new.jpg': 'assets/images/neoxweb/hero-bg-new.svg',
    'assets/images/neoxweb/hero-tech-bg.png': 'assets/images/neoxweb/hero-tech-bg.svg',
    'assets/images/neoxweb/logo.png': 'assets/images/neoxweb/logo-unified-mark.svg',
    'assets/images/neoxweb/logo-nx-mark.jpg': 'assets/images/neoxweb/logo-unified-mark.svg',
    '../images/neoxweb/hero-tech-bg.png': '../images/neoxweb/hero-tech-bg.svg'
};

const MARKER = '<!-- PAGE-RICH-START -->';

function replaceImages(text) {
    let out = text;
    for (const [from, to] of Object.entries(IMAGE_MAP)) {
        out = out.split(from).join(to);
    }
    return out;
}

function ensureLink(html, href, tag) {
    if (html.includes(href)) return html;
    return html.replace('</head>', `    ${tag}\n</head>`);
}

function ensureScript(html, src) {
    if (html.includes(src)) return html;
    return html.replace('</body>', `    <script defer src="${src}"></script>\n</body>`);
}

function ensureBodyClass(html) {
    if (html.includes('auth-page') || html.includes('oauth')) return html;
    return html.replace(/<body class="([^"]*)">/, (m, cls) => {
        if (cls.includes('nx-advanced-page')) return m;
        return `<body class="${cls} nx-advanced-page">`;
    });
}

function ensureQuickNav(html) {
    return html;
}

function richBlock() {
    return `${MARKER}
        <section class="pr-section pr-section--alt">
            <div class="pr-container">
                <div class="pr-stats pr-reveal">
                    <div class="pr-stat"><strong>300+</strong><span>Projects Delivered</span></div>
                    <div class="pr-stat"><strong>15+</strong><span>Years Experience</span></div>
                    <div class="pr-stat"><strong>99%</strong><span>Client Satisfaction</span></div>
                    <div class="pr-stat"><strong>24/7</strong><span>Support Available</span></div>
                </div>
            </div>
        </section>
        <section class="pr-section">
            <div class="pr-container">
                <div class="pr-head pr-reveal">
                    <span class="pr-label">Our Work</span>
                    <h2>Real projects, real results</h2>
                    <p>From web platforms to SEO campaigns — quality delivery for clients across Pakistan.</p>
                </div>
                <div class="pr-media-grid pr-reveal">
                    <div class="pr-media-grid__item"><div class="visual-art-wrap" aria-hidden="true"><img src="assets/images/neoxweb/web-dev.svg" alt="" class="visual-art" loading="lazy"></div><span>Web Dev</span></div>
                    <div class="pr-media-grid__item"><div class="visual-art-wrap" aria-hidden="true"><img src="assets/images/neoxweb/seo-new.svg" alt="" class="visual-art" loading="lazy"></div><span>SEO</span></div>
                    <div class="pr-media-grid__item"><div class="visual-art-wrap" aria-hidden="true"><img src="assets/images/neoxweb/ppc.svg" alt="" class="visual-art" loading="lazy"></div><span>PPC</span></div>
                    <div class="pr-media-grid__item"><div class="visual-art-wrap" aria-hidden="true"><img src="assets/images/neoxweb/social-media-new.svg" alt="" class="visual-art" loading="lazy"></div><span>Social</span></div>
                </div>
            </div>
        </section>
        <section class="pr-section pr-section--alt">
            <div class="pr-container">
                <div class="pr-head pr-reveal">
                    <span class="pr-label">Services</span>
                    <h2>Everything your business needs to grow online</h2>
                </div>
                <div class="neox-service-cards pr-reveal">
                    <article class="neox-service-card">
                        <div class="neox-service-card__media"><div class="visual-art-wrap visual-art-wrap--card" aria-hidden="true"><img src="assets/images/neoxweb/web-dev.svg" alt="" class="visual-art" loading="lazy"></div><span class="neox-service-card__badge"><i class="fas fa-code"></i> Web</span></div>
                        <div class="neox-service-card__body"><h3>Custom Websites</h3><p>High-converting sites that turn visitors into customers.</p><a href="web.html">Learn More <i class="fas fa-arrow-right"></i></a></div>
                    </article>
                    <article class="neox-service-card">
                        <div class="neox-service-card__media"><div class="visual-art-wrap visual-art-wrap--card" aria-hidden="true"><img src="assets/images/neoxweb/seo-new.svg" alt="" class="visual-art" loading="lazy"></div><span class="neox-service-card__badge"><i class="fas fa-search"></i> SEO</span></div>
                        <div class="neox-service-card__body"><h3>Search Engine Optimization</h3><p>Boost Google rankings and organic traffic.</p><a href="data-analytics.html">Learn More <i class="fas fa-arrow-right"></i></a></div>
                    </article>
                    <article class="neox-service-card">
                        <div class="neox-service-card__media"><div class="visual-art-wrap visual-art-wrap--card" aria-hidden="true"><img src="assets/images/neoxweb/ppc.svg" alt="" class="visual-art" loading="lazy"></div><span class="neox-service-card__badge"><i class="fas fa-chart-line"></i> PPC</span></div>
                        <div class="neox-service-card__body"><h3>Pay Per Click Ads</h3><p>Instant leads with targeted campaigns.</p><a href="ecommerce-strategy.html">Learn More <i class="fas fa-arrow-right"></i></a></div>
                    </article>
                    <article class="neox-service-card">
                        <div class="neox-service-card__media"><div class="visual-art-wrap visual-art-wrap--card" aria-hidden="true"><img src="assets/images/neoxweb/social-media-new.svg" alt="" class="visual-art" loading="lazy"></div><span class="neox-service-card__badge"><i class="fas fa-share-alt"></i> Social</span></div>
                        <div class="neox-service-card__body"><h3>Social Media Marketing</h3><p>Grow followers and engagement.</p><a href="product-design.html">Learn More <i class="fas fa-arrow-right"></i></a></div>
                    </article>
                </div>
            </div>
        </section>
        <section class="pr-section">
            <div class="pr-container">
                <div class="pr-head pr-head--center pr-reveal">
                    <span class="pr-label">How We Work</span>
                    <h2>Simple process, exceptional results</h2>
                </div>
                <div class="pr-steps pr-reveal">
                    <div class="pr-step"><h4>Discovery Call</h4><p>We learn your goals, audience, and timeline in a free consultation.</p></div>
                    <div class="pr-step"><h4>Strategy &amp; Design</h4><p>Custom plan with wireframes, content strategy, and clear milestones.</p></div>
                    <div class="pr-step"><h4>Build &amp; Launch</h4><p>Agile development with regular updates and quality assurance.</p></div>
                    <div class="pr-step"><h4>Grow &amp; Support</h4><p>SEO, ads, analytics, and ongoing optimization after go-live.</p></div>
                </div>
            </div>
        </section>
        <section class="pr-section">
            <div class="pr-container">
                <div class="pr-head pr-head--center pr-reveal">
                    <span class="pr-label">Testimonials</span>
                    <h2>Trusted by businesses across Pakistan</h2>
                </div>
                <div class="pr-testimonial-strip pr-reveal">
                    <div class="pr-tcard"><p>&ldquo;NEOXWEB transformed our online presence — traffic increased 150% and sales skyrocketed.&rdquo;</p><cite>— Dezara Fashion Team</cite></div>
                    <div class="pr-tcard"><p>&ldquo;Outstanding PPC results — our ROI tripled and lead quality improved dramatically.&rdquo;</p><cite>— BoltSolar Team</cite></div>
                    <div class="pr-tcard"><p>&ldquo;Professional team, fast delivery, and a website that actually converts visitors.&rdquo;</p><cite>— MezzoK Client</cite></div>
                </div>
            </div>
        </section>
        <section class="pr-section pr-section--alt">
            <div class="pr-container">
                <div class="pr-head pr-reveal">
                    <span class="pr-label">FAQ</span>
                    <h2>Frequently asked questions</h2>
                </div>
                <div class="pr-faq pr-reveal">
                    <details><summary>How long does a typical project take?</summary><p>Websites: 2–4 weeks. SEO: 3–6 months. Custom software: 2–6 months depending on scope.</p></details>
                    <details><summary>Do you work with small businesses?</summary><p>Yes — affordable, high-impact solutions for startups, SMBs, and enterprises across Pakistan.</p></details>
                    <details><summary>How do I get started?</summary><p>WhatsApp 0308 4858836, email, or our contact form — we reply within minutes.</p></details>
                </div>
            </div>
        </section><!-- PAGE-RICH-END -->`;
}

function injectRich(html) {
    if (html.includes(MARKER)) return html;

    const block = richBlock();
    const anchors = [
        '<section class="web-cta">',
        '<section class="site-cta-band">',
        '<section class="ui-cta-band">',
        '<section class="cs-cta">',
        '<section class="home-cta">'
    ];

    for (const anchor of anchors) {
        if (html.includes(anchor)) {
            return html.replace(anchor, block + '\n        ' + anchor);
        }
    }

    if (html.includes('</main>')) {
        return html.replace('</main>', block + '\n    </main>');
    }

    return html;
}

function patchHtml(filePath) {
    const base = path.basename(filePath);
    if (SKIP.has(base)) return;

    let html = fs.readFileSync(filePath, 'utf8');
    const before = html;

    html = replaceImages(html);
    html = ensureLink(html, 'pages-advanced.css', '<link rel="stylesheet" href="css/pages-advanced.css">');
    html = ensureLink(html, 'about-team-rich.css', '<link rel="stylesheet" href="css/about-team-rich.css">');
    html = ensureLink(html, 'page-rich.css', '<link rel="stylesheet" href="css/page-rich.css">');
    html = ensureScript(html, 'js/navbar.js');
    html = ensureScript(html, 'js/page-rich.js');
    html = ensureScript(html, 'js/page-hero.js');
    if (html.includes('fade-up') || html.includes('pr-reveal')) {
        html = ensureScript(html, 'js/animations.js');
    }

    if (base !== 'index.html') {
        html = ensureBodyClass(html);
    }

    if (!['index.html', 'oauth-callback.html'].includes(base)) {
        html = injectRich(html);
        html = ensureQuickNav(html);
    }

    if (html !== before) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log('fixed', base);
    }
}

function patchCss(filePath) {
    let css = fs.readFileSync(filePath, 'utf8');
    const next = replaceImages(css);
    if (next !== css) {
        fs.writeFileSync(filePath, next, 'utf8');
        console.log('css', path.basename(filePath));
    }
}

fs.readdirSync(ROOT)
    .filter((f) => f.endsWith('.html') && !SKIP.has(f))
    .forEach((f) => patchHtml(path.join(ROOT, f)));

fs.readdirSync(path.join(ROOT, 'css'))
    .filter((f) => f.endsWith('.css'))
    .forEach((f) => patchCss(path.join(ROOT, 'css', f)));

console.log('All pages fixed.');
