/**
 * Restore NEOXWEB project — remove Unified Infotech clone + Figma/article injections
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT = path.join(__dirname, '..');

const NEOX_HEADER = `<!-- NEOXWEB — header -->
<header class="ui-header" id="uiHeader">
    <div class="ui-container ui-header__inner">
        <a href="index.html" class="ui-logo" data-app-link="1">
            <span class="ui-logo-mark" aria-hidden="true">N</span>
            <span class="ui-logo-text">NEOX<span>WEB</span></span>
        </a>

        <ul class="ui-nav" id="uiNav">
            <li data-menu="services">
                <button type="button" class="ui-nav-link">Services <i class="fas fa-chevron-down"></i></button>
                <div class="ui-mega">
                    <div class="ui-mega-grid">
                        <div class="ui-mega-col">
                            <h4>Core Services</h4>
                            <a href="web.html">Web Development</a>
                            <a href="development.html">Web App Development</a>
                            <a href="mobile.html">Mobile Apps</a>
                            <a href="data-analytics.html">SEO &amp; Growth</a>
                            <a href="ecommerce-strategy.html">PPC Advertising</a>
                            <a href="product-design.html">Social Media</a>
                        </div>
                        <div class="ui-mega-col">
                            <h4>Engineering</h4>
                            <a href="software-engineering.html">Custom Software</a>
                            <a href="cloud.html">Cloud &amp; DevOps</a>
                            <a href="ai.html">AI &amp; Automation</a>
                            <a href="saas-platforms.html">SaaS Platforms</a>
                        </div>
                        <div class="ui-mega-case">
                            <span class="tag">Case Study</span>
                            <h5>Dezara Fashion — 150% SEO traffic growth</h5>
                            <a href="case-study-seo.html" class="ui-cs-link">Read case study →</a>
                        </div>
                    </div>
                </div>
            </li>
            <li><a href="industry.html">Industries</a></li>
            <li><a href="portfolio.html">Case Studies</a></li>
            <li><a href="resources.html">Resources</a></li>
            <li><a href="contact.html">Contact</a></li>
        </ul>

        <div class="ui-header__actions">
            <button type="button" class="ui-btn-icon" id="appSearchOpen" aria-label="Search"><i class="fas fa-search"></i></button>
            <a href="contact.html" class="ui-btn-contact">Get a Quote</a>
            <button type="button" class="ui-hamburger ui-btn-icon" id="uiHamburger" aria-label="Menu"><i class="fas fa-bars"></i></button>
        </div>
    </div>
</header>

<nav class="ui-mobile-nav" id="uiMobileNav" aria-label="Mobile menu">
    <a href="index.html">Home</a>
    <a href="services.html">Services</a>
    <a href="portfolio.html">Case Studies</a>
    <a href="resources.html">Resources</a>
    <a href="industry.html">Industry</a>
    <a href="contact.html">Enquire</a>
</nav>
`;

const NEOX_FOOTER = `<footer class="ui-footer ui-footer-unified">
    <div class="ui-container">
        <h3 style="color:#fff;margin-bottom:1.25rem;font-size:1.25rem">Let's Grow Your Business Online</h3>
        <div class="ui-footer-grid">
            <div>
                <h4>Core Services</h4>
                <a href="web.html">Web Development</a>
                <a href="data-analytics.html">SEO &amp; Growth</a>
                <a href="ecommerce-strategy.html">PPC Advertising</a>
                <a href="product-design.html">Social Media</a>
                <a href="development.html">Web App Development</a>
            </div>
            <div>
                <h4>Company</h4>
                <a href="about.html">About</a>
                <a href="portfolio.html">Case Studies</a>
                <a href="blog.html">Blog</a>
                <a href="team.html">Our Team</a>
                <a href="contact.html">Contact</a>
            </div>
            <div>
                <h4>Resources</h4>
                <a href="resources.html">Resources Hub</a>
                <a href="industry.html">Industries</a>
                <a href="services.html">All Services</a>
            </div>
            <div class="ui-footer-offices">
                <div><strong>Pakistan</strong>Lahore · Karachi · Islamabad · Rawalpindi</div>
                <div class="ui-footer-mail" style="margin-top:1rem">
                    <h4>Contact</h4>
                    <a href="mailto:supportneoxweb@gmail.com">supportneoxweb@gmail.com</a><br>
                    <a href="https://wa.me/923084858836">WhatsApp: 0308 4858836</a>
                </div>
            </div>
        </div>
    </div>
    <div class="ui-container ui-footer-bottom">
        <span>&copy; 2026 NEOXWEB. All rights reserved.</span>
        <a href="contact.html">Privacy Policy</a>
    </div>
</footer>
`;

function stripRichContent(html) {
    html = html.replace(/<!-- RICH:[\s\S]*?<!-- \/RICH:[\s\S]*?-->\s*/g, '');
    html = html.replace(/<link rel="stylesheet" href="css\/article-full\.css">\n?/g, '');
    html = html.replace(/<link rel="stylesheet" href="css\/unified-home-full\.css">\n?/g, '');
    html = html.replace(/<link rel="stylesheet" href="css\/industry-page\.css">\n?/g, '');
    html = html.replace(/<section class="ui-section[^"]*\bart-page\b[^"]*">[\s\S]*?<\/section>\s*\n\s*<\/section>/g, '');
    html = html.replace(/\n\s*\n\s*<\/div>\s*\n\s*<\/section>\s*(?=\n\s*<!-- RICH:|\n\s*<section class="ui-cta)/g, '\n');
    html = html.replace(/Unified Infotech/g, 'NEOXWEB');
    html = html.replace(/hello@unifiedinfotech\.net/g, 'supportneoxweb@gmail.com');
    return html;
}

function restoreIndex() {
    const tpl = path.join(PROJECT, 'templates', 'index-neoxweb.html');
    fs.copyFileSync(tpl, path.join(PROJECT, 'index.html'));
    console.log('Restored: index.html');
}

function restoreResources() {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="theme-color" content="#050508">
    <title>Resources Hub | Web &amp; App Development | NEOXWEB</title>
    <meta name="description" content="Curated learning resources for web development, app development, backend, design, DevOps and hosting — plus NEOXWEB guides for businesses in Pakistan.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous">
    <link rel="stylesheet" href="css/unified-theme.css">
    <link rel="stylesheet" href="css/unified-app.css">
    <link rel="stylesheet" href="css/unified-pro.css">
    <link rel="stylesheet" href="css/unified-dark.css">
    <link rel="stylesheet" href="css/unified-pages.css">
    <link rel="stylesheet" href="css/dock-pages.css">
    <link rel="stylesheet" href="css/resources-hub.css">
    <script defer src="js/config.js"></script>
    <script defer src="js/api.js"></script>
</head>
<body class="unified-site unified-app ui-ref-theme has-dock" data-ui-nav="resources.html">

    <div id="ui-header-slot"></div>

    <main id="app-main">
        <section class="nx-hero-img">
            <div class="nx-hero-img__bg" aria-hidden="true"></div>
            <div class="nx-hero-img__overlay" aria-hidden="true"></div>
            <div class="nx-hero-img__inner">
                <span class="ui-section-tag">Resources Hub</span>
                <h1>📚 <span class="ui-gradient-text">Resources</span> Hub</h1>
                <p>Web Development &amp; App Development — curated learning materials, docs, and tools. Learn, build, and grow with NEOXWEB.</p>
                <a href="#resources-hub" class="ui-btn-getstarted">Browse Resources <i class="fas fa-chevron-down"></i></a>
            </div>
        </section>

        <section class="ui-section ui-section--soft" id="resources-hub" style="padding-top:1.5rem">
            <div class="ui-container rh-hub">
                <div class="ui-services-intro ui-fade-up" style="margin-bottom:1.25rem">
                    <span class="ui-section-tag">Curated Links</span>
                    <h2>Web &amp; app development <span class="ui-gradient-text">learning library</span></h2>
                    <p style="color:var(--ui-muted,#888);max-width:640px;margin-top:0.5rem">Search and filter 22+ hand-picked resources — MDN, freeCodeCamp, Flutter, React Native, Figma, Docker, and more.</p>
                </div>
                <div id="resourcesHub" class="ui-fade-up" aria-live="polite"></div>
            </div>
        </section>

        <section class="ui-section">
            <div class="ui-container">
                <div class="ui-services-intro ui-fade-up">
                    <span class="ui-section-tag">NEOXWEB</span>
                    <h2>Our guides &amp; <span class="ui-gradient-text">services</span></h2>
                </div>
                <div class="ui-resource-categories ui-fade-up">
                    <a href="portfolio.html" class="ui-resource-cat" data-app-link="1">
                        <div class="ui-resource-cat__icon"><i class="fas fa-book-open"></i></div>
                        <h3>Case Studies</h3>
                        <p>Dezara Fashion 150% traffic, BoltSolar 3× ROI — real metrics from NEOXWEB projects.</p>
                        <span class="ui-resource-cat__link">Browse cases <i class="fas fa-arrow-right"></i></span>
                    </a>
                    <a href="blog.html" class="ui-resource-cat" data-app-link="1">
                        <div class="ui-resource-cat__icon"><i class="fas fa-pen-nib"></i></div>
                        <h3>Blog &amp; Insights</h3>
                        <p>SEO tips for Pakistan, web design trends, PPC strategies, and social media playbooks.</p>
                        <span class="ui-resource-cat__link">Read articles <i class="fas fa-arrow-right"></i></span>
                    </a>
                    <a href="services.html" class="ui-resource-cat" data-app-link="1">
                        <div class="ui-resource-cat__icon"><i class="fas fa-layer-group"></i></div>
                        <h3>Service Guides</h3>
                        <p>Web development, SEO, PPC, social media, graphic design &amp; video editing.</p>
                        <span class="ui-resource-cat__link">View services <i class="fas fa-arrow-right"></i></span>
                    </a>
                    <a href="contact.html" class="ui-resource-cat" data-app-link="1">
                        <div class="ui-resource-cat__icon"><i class="fas fa-gift"></i></div>
                        <h3>Free Website Audit</h3>
                        <p>No-obligation review — speed, SEO, mobile UX, and conversion opportunities.</p>
                        <span class="ui-resource-cat__link">Claim free audit <i class="fas fa-arrow-right"></i></span>
                    </a>
                </div>
            </div>
        </section>

        <section class="ui-section ui-section--soft">
            <div class="ui-container">
                <div class="ui-services-intro ui-fade-up">
                    <span class="ui-section-tag">Free Guides</span>
                    <h2>Download-ready <span class="ui-gradient-text">knowledge</span></h2>
                </div>
                <div class="ui-resources-grid ui-fade-up">
                    <article class="ui-resource-card">
                        <div class="thumb" style="padding:0;overflow:hidden"><img src="assets/images/neoxweb/seo-new.jpg" alt="Pakistan SEO guide" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
                        <div class="body"><span class="type">Guide</span><h4>SEO for Pakistani Businesses — Rank on Google in 2025</h4><span class="meta">Local keywords, Google Business, Urdu/English content</span></div>
                    </article>
                    <article class="ui-resource-card">
                        <div class="thumb" style="padding:0;overflow:hidden"><img src="assets/images/neoxweb/web-dev.jpg" alt="Website launch guide" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
                        <div class="body"><span class="type">Guide</span><h4>Launch Your Business Website in 2–4 Weeks</h4><span class="meta">Planning, design, development &amp; go-live checklist</span></div>
                    </article>
                    <article class="ui-resource-card">
                        <div class="thumb" style="padding:0;overflow:hidden"><img src="assets/images/neoxweb/ppc.jpg" alt="PPC guide Pakistan" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
                        <div class="body"><span class="type">Guide</span><h4>Google Ads for Local Leads in Pakistan</h4><span class="meta">Budget, targeting, landing pages &amp; ROI tracking</span></div>
                    </article>
                    <article class="ui-resource-card">
                        <div class="thumb" style="padding:0;overflow:hidden"><img src="assets/images/neoxweb/social-media-new.jpg" alt="Social media guide" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
                        <div class="body"><span class="type">Guide</span><h4>Social Media Growth for Pakistani Brands</h4><span class="meta">Instagram, Facebook, reels &amp; engagement strategy</span></div>
                    </article>
                </div>
            </div>
        </section>

        <section class="ui-cta-band">
            <div class="ui-container">
                <div class="ui-cta-band__inner ui-fade-up" style="text-align:center">
                    <h2>Need help building your project?</h2>
                    <p>Email supportneoxweb@gmail.com or WhatsApp 0308 4858836 — free audit, no pressure.</p>
                    <a href="contact.html" class="ui-btn-getstarted" data-app-link="1">Get Started <i class="fas fa-chevron-right"></i></a>
                </div>
            </div>
        </section>
    </main>

    <div id="ui-footer-slot"></div>

    <script defer src="js/resources-hub.js"></script>
    <script defer src="js/unified-home.js"></script>
    <script defer src="js/unified-app.js"></script>
    <script defer src="js/unified-layout.js"></script>
</body>
</html>
`;
    fs.writeFileSync(path.join(PROJECT, 'resources.html'), html, 'utf8');
    console.log('Restored: resources.html');
}

function restoreIndustry() {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="theme-color" content="#050508">
    <title>Industries We Serve | NEOXWEB</title>
    <meta name="description" content="NEOXWEB delivers tailored digital solutions for FinTech, Healthcare, EdTech, E-commerce, SaaS, and Enterprise — from strategy to engineering.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous">
    <link rel="stylesheet" href="css/unified-theme.css">
    <link rel="stylesheet" href="css/unified-app.css">
    <link rel="stylesheet" href="css/unified-pro.css">
    <link rel="stylesheet" href="css/unified-dark.css">
    <link rel="stylesheet" href="css/unified-pages.css">
    <link rel="stylesheet" href="css/dock-pages.css">
    <script defer src="js/config.js"></script>
    <script defer src="js/api.js"></script>
</head>
<body class="unified-site unified-app ui-ref-theme has-dock" data-ui-nav="industry.html">

    <div id="ui-header-slot"></div>

    <main id="app-main">
        <section class="ui-hero ui-hero--inner">
            <div class="ui-container">
                <span class="ui-section-tag">Industries</span>
                <h1>Digital solutions built for <span class="ui-gradient-text">your sector.</span></h1>
                <p class="ui-hero__sub">We partner with ambitious organizations across regulated and high-growth industries — combining domain insight with enterprise-grade engineering.</p>
                <a href="contact.html" class="ui-btn-getstarted" data-app-link="1">Discuss Your Industry <i class="fas fa-chevron-right"></i></a>
            </div>
        </section>

        <section class="ui-section">
            <div class="ui-container">
                <div class="ui-industry-grid ui-fade-up">
                    <article class="ui-industry-card">
                        <div class="ui-industry-card__icon"><i class="fas fa-university"></i></div>
                        <h3>FinTech &amp; Banking</h3>
                        <p>Secure platforms, payment integrations, compliance-ready architecture, and real-time analytics for financial services.</p>
                        <ul><li>PCI-aligned payment flows</li><li>API banking &amp; open finance</li><li>Risk &amp; fraud dashboards</li></ul>
                        <a href="cloud.html" data-app-link="1">Explore FinTech solutions <i class="fas fa-arrow-right"></i></a>
                    </article>
                    <article class="ui-industry-card">
                        <div class="ui-industry-card__icon"><i class="fas fa-heartbeat"></i></div>
                        <h3>Healthcare &amp; Life Sciences</h3>
                        <p>Patient portals, telehealth platforms, and data systems designed for privacy, accessibility, and clinical workflows.</p>
                        <ul><li>HIPAA-aware architecture</li><li>Patient engagement apps</li><li>Clinical data pipelines</li></ul>
                        <a href="mobile.html" data-app-link="1">Healthcare engineering <i class="fas fa-arrow-right"></i></a>
                    </article>
                    <article class="ui-industry-card">
                        <div class="ui-industry-card__icon"><i class="fas fa-graduation-cap"></i></div>
                        <h3>EdTech &amp; E-Learning</h3>
                        <p>Scalable learning platforms, LMS integrations, and content delivery systems that drive engagement and retention.</p>
                        <ul><li>Multi-tenant LMS platforms</li><li>Video &amp; assessment tools</li><li>Analytics for learner success</li></ul>
                        <a href="saas-platforms.html" data-app-link="1">EdTech platforms <i class="fas fa-arrow-right"></i></a>
                    </article>
                    <article class="ui-industry-card">
                        <div class="ui-industry-card__icon"><i class="fas fa-shopping-cart"></i></div>
                        <h3>E-Commerce &amp; Retail</h3>
                        <p>High-converting storefronts, headless commerce, inventory systems, and growth marketing integrations.</p>
                        <ul><li>Headless &amp; composable commerce</li><li>Checkout optimization</li><li>Multi-channel inventory</li></ul>
                        <a href="ecommerce-strategy.html" data-app-link="1">Commerce solutions <i class="fas fa-arrow-right"></i></a>
                    </article>
                    <article class="ui-industry-card">
                        <div class="ui-industry-card__icon"><i class="fas fa-cloud"></i></div>
                        <h3>SaaS &amp; Technology</h3>
                        <p>Multi-tenant SaaS products with billing, onboarding, analytics, and API ecosystems built for scale.</p>
                        <ul><li>Subscription &amp; billing engines</li><li>Product-led growth funnels</li><li>Developer API platforms</li></ul>
                        <a href="saas-platforms.html" data-app-link="1">SaaS engineering <i class="fas fa-arrow-right"></i></a>
                    </article>
                    <article class="ui-industry-card">
                        <div class="ui-industry-card__icon"><i class="fas fa-industry"></i></div>
                        <h3>Enterprise &amp; Manufacturing</h3>
                        <p>Legacy modernization, ERP integrations, IoT dashboards, and operational software for global enterprises.</p>
                        <ul><li>Application modernization</li><li>Supply chain visibility</li><li>Workflow automation</li></ul>
                        <a href="application-modernization.html" data-app-link="1">Enterprise modernization <i class="fas fa-arrow-right"></i></a>
                    </article>
                </div>
            </div>
        </section>

        <section class="ui-section ui-section--soft">
            <div class="ui-container ui-who-grid">
                <div class="ui-fade-up">
                    <span class="ui-section-tag">Why NEOXWEB</span>
                    <h2 class="ui-section-title">Industry expertise meets <strong>engineering excellence</strong></h2>
                    <p class="ui-section-desc">We don't just write code — we understand your market, compliance requirements, and growth goals to deliver solutions that perform long after launch.</p>
                    <div class="ui-stats-row">
                        <div class="ui-stat-box"><strong>15+</strong><span>Years Experience</span></div>
                        <div class="ui-stat-box"><strong>12+</strong><span>Industries Served</span></div>
                        <div class="ui-stat-box"><strong>300+</strong><span>Projects Delivered</span></div>
                    </div>
                </div>
                <div class="ui-benefits-grid ui-fade-up">
                    <div class="ui-benefit-card"><h4>Regulatory Awareness</h4><p>Security, privacy, and compliance built into architecture from day one.</p></div>
                    <div class="ui-benefit-card"><h4>Domain Specialists</h4><p>Teams with experience in your industry's unique challenges and workflows.</p></div>
                    <div class="ui-benefit-card"><h4>Scalable Delivery</h4><p>Agile squads that scale with your roadmap — from MVP to enterprise.</p></div>
                    <div class="ui-benefit-card"><h4>Long-term Partnership</h4><p>Ongoing support, optimization, and feature evolution after go-live.</p></div>
                </div>
            </div>
        </section>

        <section class="ui-cta-band">
            <div class="ui-container">
                <div class="ui-cta-band__inner ui-fade-up">
                    <h2>Ready to transform your industry?</h2>
                    <p>Schedule a consultation with our industry specialists and discover what's possible for your organization.</p>
                    <a href="contact.html" class="ui-btn-getstarted" data-app-link="1">Get a Free Consultation <i class="fas fa-chevron-right"></i></a>
                </div>
            </div>
        </section>
    </main>

    <div id="ui-footer-slot"></div>

    <script defer src="js/unified-home.js"></script>
    <script defer src="js/unified-app.js"></script>
    <script defer src="js/unified-layout.js"></script>
</body>
</html>
`;
    fs.writeFileSync(path.join(PROJECT, 'industry.html'), html, 'utf8');
    console.log('Restored: industry.html');
}

// Run
fs.writeFileSync(path.join(PROJECT, 'unified-header.html'), NEOX_HEADER, 'utf8');
fs.writeFileSync(path.join(PROJECT, 'unified-footer.html'), NEOX_FOOTER, 'utf8');
console.log('Restored: unified-header.html, unified-footer.html');

restoreIndex();
restoreResources();
restoreIndustry();

try {
    execSync('node "' + path.join(__dirname, 'build-unified-service-pages.js') + '"', { stdio: 'inherit' });
} catch (e) {
    console.warn('Service pages rebuild skipped:', e.message);
}

// Strip injected content from any remaining pages
['web.html', 'development.html', 'mobile.html', 'saas-platforms.html', 'ecommerce-strategy.html'].forEach((f) => {
    const fp = path.join(PROJECT, f);
    if (!fs.existsSync(fp)) return;
    let html = fs.readFileSync(fp, 'utf8');
    const cleaned = stripRichContent(html);
    if (cleaned !== html) {
        fs.writeFileSync(fp, cleaned, 'utf8');
        console.log('Cleaned:', f);
    }
});

console.log('Done — NEOXWEB project restored.');
