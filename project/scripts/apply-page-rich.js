/**
 * Fill all pages with rich text + image sections (no empty gaps)
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');
const SKIP = new Set(['oauth-callback.html', 'app.html', 'unified-header.html', 'unified-footer.html', 'navbar.html', 'case-study.html', 'case-study-seo.html', 'case-study-ppc.html', 'index.html', 'portfolio.html', 'resources.html', 'industry.html', 'contact.html']);

const CSS = '<link rel="stylesheet" href="css/page-rich.css">';
const JS = '<script defer src="js/page-rich.js"></script>';

const BLOCKS = {
    stats: `
        <section class="pr-section pr-section--alt">
            <div class="pr-container">
                <div class="pr-stats pr-reveal">
                    <div class="pr-stat"><strong>300+</strong><span>Projects Delivered</span></div>
                    <div class="pr-stat"><strong>15+</strong><span>Years Experience</span></div>
                    <div class="pr-stat"><strong>99%</strong><span>Client Satisfaction</span></div>
                    <div class="pr-stat"><strong>24/7</strong><span>Support Available</span></div>
                </div>
            </div>
        </section>`,

    gallery: `
        <section class="pr-section">
            <div class="pr-container">
                <div class="pr-head pr-reveal">
                    <span class="pr-label">Our Work</span>
                    <h2>Real projects, real results</h2>
                    <p>From web platforms to SEO campaigns — see the quality we deliver for clients across Pakistan and globally.</p>
                </div>
                <div class="pr-media-grid pr-reveal">
                    <div class="pr-media-grid__item"><img src="assets/images/neoxweb/web-dev.jpg" alt="Web development" loading="lazy"><span>Web Dev</span></div>
                    <div class="pr-media-grid__item"><img src="assets/images/neoxweb/seo-new.jpg" alt="SEO" loading="lazy"><span>SEO</span></div>
                    <div class="pr-media-grid__item"><img src="assets/images/neoxweb/ppc.jpg" alt="PPC" loading="lazy"><span>PPC</span></div>
                    <div class="pr-media-grid__item"><img src="assets/images/neoxweb/social-media-new.jpg" alt="Social media" loading="lazy"><span>Social</span></div>
                </div>
            </div>
        </section>`,

    serviceCards: `
        <section class="pr-section pr-section--alt">
            <div class="pr-container">
                <div class="pr-head pr-reveal">
                    <span class="pr-label">Services</span>
                    <h2>Everything your business needs to grow online</h2>
                    <p>End-to-end digital solutions — from stunning websites to data-driven marketing campaigns.</p>
                </div>
                <div class="neox-service-cards pr-reveal">
                    <article class="neox-service-card">
                        <div class="neox-service-card__media"><img src="assets/images/neoxweb/web-dev.jpg" alt="Web Development" loading="lazy"><span class="neox-service-card__badge"><i class="fas fa-code"></i> Web</span></div>
                        <div class="neox-service-card__body"><h3>Custom Websites</h3><p>High-converting sites that turn visitors into customers.</p><a href="web.html">Learn More <i class="fas fa-arrow-right"></i></a></div>
                    </article>
                    <article class="neox-service-card">
                        <div class="neox-service-card__media"><img src="assets/images/neoxweb/seo-new.jpg" alt="SEO" loading="lazy"><span class="neox-service-card__badge"><i class="fas fa-search"></i> SEO</span></div>
                        <div class="neox-service-card__body"><h3>Search Engine Optimization</h3><p>Boost Google rankings and organic traffic.</p><a href="data-analytics.html">Learn More <i class="fas fa-arrow-right"></i></a></div>
                    </article>
                    <article class="neox-service-card">
                        <div class="neox-service-card__media"><img src="assets/images/neoxweb/ppc.jpg" alt="PPC" loading="lazy"><span class="neox-service-card__badge"><i class="fas fa-chart-line"></i> PPC</span></div>
                        <div class="neox-service-card__body"><h3>Pay Per Click Ads</h3><p>Instant leads with targeted campaigns.</p><a href="ecommerce-strategy.html">Learn More <i class="fas fa-arrow-right"></i></a></div>
                    </article>
                    <article class="neox-service-card">
                        <div class="neox-service-card__media"><img src="assets/images/neoxweb/social-media-new.jpg" alt="Social Media" loading="lazy"><span class="neox-service-card__badge"><i class="fas fa-share-alt"></i> Social</span></div>
                        <div class="neox-service-card__body"><h3>Social Media Marketing</h3><p>Grow followers and engagement.</p><a href="product-design.html">Learn More <i class="fas fa-arrow-right"></i></a></div>
                    </article>
                </div>
            </div>
        </section>`,

    process: `
        <section class="pr-section">
            <div class="pr-container">
                <div class="pr-head pr-head--center pr-reveal">
                    <span class="pr-label">How We Work</span>
                    <h2>Simple process, exceptional results</h2>
                    <p>From first call to launch — transparent, fast, and focused on your business goals.</p>
                </div>
                <div class="pr-steps pr-reveal">
                    <div class="pr-step"><h4>Discovery Call</h4><p>We learn your goals, audience, and timeline in a free consultation.</p></div>
                    <div class="pr-step"><h4>Strategy &amp; Design</h4><p>Custom plan with wireframes, content strategy, and clear milestones.</p></div>
                    <div class="pr-step"><h4>Build &amp; Launch</h4><p>Agile development with regular updates and quality assurance.</p></div>
                    <div class="pr-step"><h4>Grow &amp; Support</h4><p>SEO, ads, analytics, and ongoing optimization after go-live.</p></div>
                </div>
            </div>
        </section>`,

    faq: `
        <section class="pr-section pr-section--alt">
            <div class="pr-container">
                <div class="pr-head pr-reveal">
                    <span class="pr-label">FAQ</span>
                    <h2>Frequently asked questions</h2>
                    <p>Quick answers to common questions about working with NEOXWEB.</p>
                </div>
                <div class="pr-faq pr-reveal">
                    <details><summary>How long does a typical project take?</summary><p>Websites: 2–4 weeks. SEO campaigns: 3–6 months for results. Custom software: 2–6 months depending on scope. We provide a clear timeline after discovery.</p></details>
                    <details><summary>Do you work with startups and small businesses?</summary><p>Yes — we specialize in affordable, high-impact solutions for startups, SMBs, and enterprises. Flexible packages for every budget.</p></details>
                    <details><summary>What technologies do you use?</summary><p>React, Next.js, Node.js, Laravel, WordPress, AWS, Google Ads, and modern SEO tools — always chosen for your specific needs.</p></details>
                    <details><summary>Do you provide ongoing support?</summary><p>Absolutely. We offer maintenance plans, SEO retainers, hosting support, and 24/7 emergency assistance for active clients.</p></details>
                    <details><summary>How do I get started?</summary><p>Contact us via WhatsApp, email, or the form on our contact page. We respond within minutes and offer a free website audit.</p></details>
                </div>
            </div>
        </section>`,

    testimonials: `
        <section class="pr-section">
            <div class="pr-container">
                <div class="pr-head pr-head--center pr-reveal">
                    <span class="pr-label">Testimonials</span>
                    <h2>Trusted by businesses across Pakistan</h2>
                </div>
                <div class="pr-testimonial-strip pr-reveal">
                    <div class="pr-tcard"><p>&ldquo;NEOXWEB transformed our online presence — traffic increased 150% and sales skyrocketed.&rdquo;</p><cite>— Aisha R., Dezara Fashion</cite></div>
                    <div class="pr-tcard"><p>&ldquo;Outstanding PPC results — our ROI tripled and lead quality improved dramatically.&rdquo;</p><cite>— Michael T., BoltSolar</cite></div>
                    <div class="pr-tcard"><p>&ldquo;Professional team, fast delivery, and a website that actually converts visitors.&rdquo;</p><cite>— MezzoK Client</cite></div>
                </div>
            </div>
        </section>`,

    miniCases: `
        <section class="pr-section pr-section--alt">
            <div class="pr-container">
                <div class="pr-head pr-reveal">
                    <span class="pr-label">Case Studies</span>
                    <h2>Proven results for real clients</h2>
                </div>
                <div class="pr-mini-cases pr-reveal">
                    <a href="case-study.html" class="pr-mini-case"><img src="assets/images/neoxweb/portfolio-web.jpg" alt="EdTech case" loading="lazy"><div><h4>3× Revenue — EdTech Platform</h4><p>Platform modernization for global leader</p></div></a>
                    <a href="case-study-seo.html" class="pr-mini-case"><img src="assets/images/neoxweb/portfolio-seo.jpg" alt="SEO case" loading="lazy"><div><h4>150% Traffic — Dezara Fashion</h4><p>Technical SEO &amp; content strategy</p></div></a>
                    <a href="case-study-ppc.html" class="pr-mini-case"><img src="assets/images/neoxweb/portfolio-ppc.jpg" alt="PPC case" loading="lazy"><div><h4>3× ROI — BoltSolar PPC</h4><p>Targeted ads &amp; landing pages</p></div></a>
                </div>
            </div>
        </section>`,

    trust: `
        <section class="pr-section">
            <div class="pr-container pr-reveal">
                <div class="pr-trust-logos">
                    <span>Dezara Fashion</span><span>BoltSolar</span><span>MezzoK</span><span>EdTech Global</span><span>Fortune 500</span><span>SaaS Startups</span>
                </div>
            </div>
        </section>`
};

const SERVICE_PAGES = new Set([
    'web.html', 'ai.html', 'mobile.html', 'cloud.html', 'software-engineering.html',
    'development.html', 'it-consulting.html', 'data-analytics.html', 'application-modernization.html',
    'saas-platforms.html', 'product-design.html', 'testing-qa.html', 'ecommerce-strategy.html'
]);

const MARKER = '<!-- PAGE-RICH-START -->';
const MARKER_END = '<!-- PAGE-RICH-END -->';

function richBundle(extra) {
    return MARKER + BLOCKS.stats + BLOCKS.gallery + (extra || '') + BLOCKS.process + BLOCKS.testimonials + BLOCKS.miniCases + BLOCKS.faq + BLOCKS.trust + MARKER_END;
}

function patchFile(filePath) {
    const base = path.basename(filePath);
    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (!html.includes('page-rich.css')) {
        html = html.replace('</head>', '    ' + CSS + '\n</head>');
        changed = true;
    }
    if (!html.includes('page-rich.js')) {
        html = html.replace('</body>', '    ' + JS + '\n</body>');
        changed = true;
    }

    if (html.includes(MARKER)) {
        if (changed) fs.writeFileSync(filePath, html, 'utf8');
        return;
    }

    let bundle = '';
    if (SERVICE_PAGES.has(base)) {
        bundle = richBundle(BLOCKS.serviceCards);
    } else if (base === 'services.html') {
        bundle = richBundle(BLOCKS.process + BLOCKS.testimonials);
    } else if (base === 'contact.html') {
        bundle = richBundle(BLOCKS.process + BLOCKS.miniCases);
    } else if (['team.html', 'about.html', 'profile.html', 'resources.html', 'industry.html', 'studies.html', 'blog.html', 'login.html'].includes(base)) {
        bundle = richBundle(BLOCKS.serviceCards);
    } else {
        bundle = richBundle('');
    }

    if (html.includes('<section class="web-cta">')) {
        html = html.replace('<section class="web-cta">', bundle + '\n        <section class="web-cta">');
        changed = true;
    } else if (html.includes('<section class="site-cta-band">')) {
        html = html.replace('<section class="site-cta-band">', bundle + '\n        <section class="site-cta-band">');
        changed = true;
    } else if (html.includes('<section class="ui-cta-band">')) {
        html = html.replace('<section class="ui-cta-band">', bundle + '\n        <section class="ui-cta-band">');
        changed = true;
    } else if (html.includes('<section class="cs-cta">')) {
        html = html.replace('<section class="cs-cta">', bundle + '\n        <section class="cs-cta">');
        changed = true;
    } else if (html.includes('</main>')) {
        html = html.replace('</main>', bundle + '\n    </main>');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log('Rich content:', base);
    }
}

fs.readdirSync(PROJECT)
    .filter((f) => f.endsWith('.html') && !SKIP.has(f))
    .forEach((f) => patchFile(path.join(PROJECT, f)));

console.log('Done — all pages enriched with text + images.');
