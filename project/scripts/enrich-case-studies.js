/**
 * Inject dense supplemental sections into case study pages (no human photos)
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');

const SERVICES_STRIP = `
        <section class="cs-section cs-section--alt">
            <div class="cs-container">
                <div class="cs-section-head cs-reveal">
                    <span class="cs-section-label">NEOXWEB Services</span>
                    <h2>More ways we help businesses grow</h2>
                </div>
                <div class="cs-services-strip cs-reveal">
                    <a href="web.html" class="cs-service-chip" data-app-link="1"><img src="assets/images/neoxweb/web-dev.jpg" alt="" loading="lazy"><div><strong>Web Development</strong><span>2–4 week launch</span></div></a>
                    <a href="data-analytics.html" class="cs-service-chip" data-app-link="1"><img src="assets/images/neoxweb/seo-new.jpg" alt="" loading="lazy"><div><strong>SEO</strong><span>150% avg growth</span></div></a>
                    <a href="ecommerce-strategy.html" class="cs-service-chip" data-app-link="1"><img src="assets/images/neoxweb/ppc.jpg" alt="" loading="lazy"><div><strong>PPC Ads</strong><span>3× ROI average</span></div></a>
                    <a href="product-design.html" class="cs-service-chip" data-app-link="1"><img src="assets/images/neoxweb/social-media-new.jpg" alt="" loading="lazy"><div><strong>Social Media</strong><span>Engagement growth</span></div></a>
                </div>
            </div>
        </section>
        <section class="cs-section">
            <div class="cs-container">
                <div class="cs-section-head cs-reveal">
                    <span class="cs-section-label">Contact NEOXWEB</span>
                    <h2>Start your project in Pakistan</h2>
                </div>
                <div class="cs-contact-strip cs-reveal">
                    <div class="cs-contact-item"><i class="fab fa-whatsapp"></i><div><strong>WhatsApp</strong><a href="https://wa.me/923084858836" target="_blank" rel="noopener">0308 4858836</a><br><a href="https://wa.me/923084858836" target="_blank" rel="noopener">0308 4858836</a></div></div>
                    <div class="cs-contact-item"><i class="fas fa-envelope"></i><div><strong>Email</strong><a href="mailto:supportneoxweb@gmail.com">supportneoxweb@gmail.com</a></div></div>
                    <div class="cs-contact-item"><i class="fas fa-map-marker-alt"></i><div><strong>Locations</strong><span>Lahore · Karachi · Islamabad · Rawalpindi</span></div></div>
                    <div class="cs-contact-item"><i class="fas fa-gift"></i><div><strong>Free Audit</strong><span>No-obligation website &amp; SEO review</span></div></div>
                </div>
                <div class="cs-trust-strip cs-reveal" style="margin-top:1rem">
                    <span>Dezara Fashion</span><span>BoltSolar</span><span>MezzoK</span><span>Web Dev</span><span>SEO Pakistan</span><span>PPC</span><span>Graphic Design</span><span>Video Editing</span>
                </div>
            </div>
        </section>`;

const SUPPLEMENTS = {
    'case-study.html': {
        galleryExtra: `
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/social-media-new.jpg" alt="Mobile learner experience" loading="lazy"><span>Mobile Experience</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/ppc.jpg" alt="Enrollment funnel analytics" loading="lazy"><span>Enrollment Funnel</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/portfolio-branding.jpg" alt="Design system components" loading="lazy"><span>Design System</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/hero-bg-new.jpg" alt="Cloud infrastructure dashboard" loading="lazy"><span>Cloud Dashboard</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/portfolio-seo.jpg" alt="Performance monitoring" loading="lazy"><span>Performance Monitoring</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/portfolio-ppc.jpg" alt="Subscription analytics" loading="lazy"><span>Subscription Analytics</span></div>`,
        deliverables: [
            ['fa-sitemap', 'Platform Architecture', 'Cloud-native microservices with zero-downtime migration from legacy monolith.'],
            ['fa-palette', 'Design System', '200+ reusable UI components deployed across web, tablet, and mobile.'],
            ['fa-mobile-screen', 'Mobile-First UX', 'Responsive learner journeys optimized for enrollment conversion.'],
            ['fa-chart-line', 'Analytics Layer', 'Real-time dashboards for subscriptions, revenue, and learner engagement.'],
            ['fa-shield-halved', 'Security & Compliance', 'Enterprise-grade auth, data encryption, and audit logging.'],
            ['fa-headset', '24/7 Support', 'Post-launch monitoring, incident response, and continuous optimization.']
        ],
        timeline: [
            ['Month 1', 'Discovery & Audit', 'Technical debt mapping, user research, and prioritized roadmap.'],
            ['Month 2', 'UX & Design System', 'Wireframes, prototypes, and component library foundation.'],
            ['Month 3–4', 'Core Platform Build', 'Microservices, API layer, and frontend rebuild in agile sprints.'],
            ['Month 5', 'Migration & Testing', 'Zero-downtime data migration, load testing, and QA cycles.'],
            ['Month 6', 'Phased Launch', 'Regional rollout with A/B testing and analytics instrumentation.'],
            ['Month 7–8', 'Optimize & Scale', 'Performance tuning, feature expansion, and team handoff.']
        ],
        metrics: [['200%', 'Subscription Growth'], ['300%', 'Revenue Increase'], ['1.8s', 'LCP Load Time'], ['12', 'Engineers Deployed']],
        faq: [
            ['How long did the platform rebuild take?', '8 months from discovery to full launch, with phased rollout starting at month 6.'],
            ['What tech stack was used?', 'React, Next.js, Node.js, PostgreSQL, Redis, AWS, Docker, and CI/CD pipelines.'],
            ['Did learners experience downtime?', 'Zero-downtime migration — live learners continued without interruption.'],
            ['Can NEOXWEB do similar work for my business?', 'Yes — contact us on WhatsApp 0308 4858836 for a free consultation.']
        ],
        quote: 'NEOXWEB didn\'t just rebuild our platform — they rebuilt our confidence. Revenue tripled, our team ships faster, and learners finally get the experience they deserve.',
        brand: 'EdTech Global',
        brandSub: 'Platform Engineering Client · North America & APAC',
        brandInitial: 'ET'
    },
    'case-study-seo.html': {
        galleryExtra: `
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/social-media-new.jpg" alt="Content strategy dashboard" loading="lazy"><span>Content Strategy</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/portfolio-branding.jpg" alt="Category page optimization" loading="lazy"><span>Category Pages</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/ppc.jpg" alt="SERP visibility report" loading="lazy"><span>SERP Visibility</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/hero-bg-new.jpg" alt="Mobile SEO performance" loading="lazy"><span>Mobile SEO</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/portfolio-web.jpg" alt="Site architecture map" loading="lazy"><span>Site Architecture</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/portfolio-ppc.jpg" alt="Conversion tracking setup" loading="lazy"><span>Conversion Tracking</span></div>`,
        deliverables: [
            ['fa-search', 'Technical SEO Audit', 'Full crawl analysis, indexation fixes, and schema implementation.'],
            ['fa-file-lines', 'Content Roadmap', 'Intent-mapped articles, category pages, and collection landing pages.'],
            ['fa-gauge-high', 'Core Web Vitals', 'Image optimization, script deferral, and mobile performance fixes.'],
            ['fa-link', 'Internal Linking', 'Strategic link architecture to boost category and product page authority.'],
            ['fa-map-marker-alt', 'Local SEO', 'Google Business Profile optimization for Pakistani fashion market.'],
            ['fa-chart-simple', 'Monthly Reporting', 'Ranking trackers, traffic dashboards, and conversion attribution.']
        ],
        timeline: [
            ['Week 1–2', 'SEO Audit', 'Technical crawl, competitor analysis, and keyword research.'],
            ['Week 3–4', 'Quick Wins', 'Indexation fixes, meta optimization, and speed improvements.'],
            ['Month 2', 'Content Launch', 'Category pages, blog articles, and collection landing pages.'],
            ['Month 3', 'Link Building', 'Internal linking strategy and topical authority expansion.'],
            ['Month 4–5', 'Scale & Refine', 'Content scaling, CWV optimization, and ranking monitoring.'],
            ['Month 6', 'Results Review', '150% traffic growth achieved — ongoing optimization retainer.']
        ],
        metrics: [['150%', 'Organic Traffic'], ['#1', 'Priority Keywords'], ['2×', 'Conversion Rate'], ['45%', 'Faster Pages']],
        faq: [
            ['How long until SEO results appear?', 'Dezara Fashion saw meaningful ranking improvements within 8–12 weeks, with 150% traffic growth at 6 months.'],
            ['What was the biggest SEO fix?', 'Core Web Vitals optimization and site architecture restructuring for category pages.'],
            ['Do you do SEO for Pakistani businesses?', 'Yes — local SEO for Lahore, Karachi, Islamabad with Urdu/English content strategy.'],
            ['How do I get a free SEO audit?', 'WhatsApp 0308 4858836 or email supportneoxweb@gmail.com — completely free.']
        ],
        quote: 'NEOXWEB gave us a clear SEO roadmap and executed it with precision. Stronger rankings, faster pages, and more conversions from organic traffic than we had in years.',
        brand: 'Dezara Fashion',
        brandSub: 'Fashion E-commerce · Pakistan',
        brandInitial: 'DF'
    },
    'case-study-ppc.html': {
        galleryExtra: `
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/social-media-new.jpg" alt="Meta ads creative variants" loading="lazy"><span>Meta Ad Creatives</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/portfolio-branding.jpg" alt="Brand-aligned ad assets" loading="lazy"><span>Brand Ad Assets</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/seo-new.jpg" alt="GA4 conversion tracking" loading="lazy"><span>GA4 Tracking</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/hero-bg-new.jpg" alt="Regional targeting map" loading="lazy"><span>Regional Targeting</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/portfolio-web.jpg" alt="Lead qualification flow" loading="lazy"><span>Lead Qualification</span></div>
                    <div class="cs-gallery-full__item"><img src="assets/images/neoxweb/portfolio-seo.jpg" alt="Weekly optimization report" loading="lazy"><span>Weekly Reports</span></div>`,
        deliverables: [
            ['fa-crosshairs', 'Audience Segmentation', 'Region, household profile, and purchase-intent targeting for solar leads.'],
            ['fa-window-maximize', 'Landing Pages', 'High-converting pages with message match and simplified lead forms.'],
            ['fa-chart-pie', 'Conversion Tracking', 'GA4 events, platform pixels, and UTM governance for true ROI.'],
            ['fa-vial', 'Ad Creative Testing', 'Weekly A/B tests on headlines, images, and call-to-action variants.'],
            ['fa-coins', 'Smart Bidding', 'Automated bid strategies optimized for qualified lead volume.'],
            ['fa-arrows-rotate', 'Weekly Optimization', 'Continuous refinement of budgets, audiences, and funnel stages.']
        ],
        timeline: [
            ['Week 1', 'Account Audit', 'Campaign structure review, tracking audit, and baseline metrics.'],
            ['Week 2', 'Audience Rebuild', 'New segmentation by region, intent, and household profile.'],
            ['Week 3–4', 'Landing Pages', 'Conversion-focused pages with proof points and simplified forms.'],
            ['Month 2', 'Creative Testing', 'Ad variant testing across Google and Meta platforms.'],
            ['Month 3', 'Scale Winners', 'Budget reallocation to top-performing audiences and ads.'],
            ['Month 4', '3× ROI Achieved', '62% lower CPA, 4× lead volume — ongoing optimization retainer.']
        ],
        metrics: [['3×', 'ROI Improvement'], ['62%', 'Lower CPA'], ['4×', 'Lead Volume'], ['28%', 'Conversion Rate']],
        faq: [
            ['How quickly did BoltSolar see PPC results?', 'Meaningful CPA improvements within 3–4 weeks; 3× ROI achieved at 4 months.'],
            ['Which ad platforms were used?', 'Google Ads and Meta Ads with GA4 conversion tracking and Hotjar funnel analysis.'],
            ['Do you manage PPC for Pakistani businesses?', 'Yes — solar, fashion, services, real estate across Lahore, Karachi, Islamabad.'],
            ['What is the minimum PPC budget?', 'Flexible packages for startups — contact us for a free strategy call.']
        ],
        quote: 'NEOXWEB brought discipline and clarity to our paid media. We reduced waste, improved lead quality, and finally had a reliable system for scaling growth with confidence.',
        brand: 'BoltSolar',
        brandSub: 'Renewable Energy · Pakistan',
        brandInitial: 'BS'
    }
};

function deliverablesHtml(items) {
    return items.map(([icon, title, desc]) =>
        `<div class="cs-deliverable cs-reveal"><i class="fas ${icon}"></i><h4>${title}</h4><p>${desc}</p></div>`
    ).join('\n                    ');
}

function timelineHtml(items) {
    return items.map(([label, title, desc]) =>
        `<div class="cs-timeline__item cs-reveal"><label>${label}</label><h4>${title}</h4><p>${desc}</p></div>`
    ).join('\n                    ');
}

function metricsHtml(items) {
    return items.map(([val, label]) =>
        `<div class="cs-metric-box cs-reveal"><strong>${val}</strong><span>${label}</span></div>`
    ).join('\n                    ');
}

function faqHtml(items) {
    return items.map(([q, a], i) =>
        `<details${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`
    ).join('\n                    ');
}

function buildSupplement(data) {
    return `
        <!-- EXPANDED GALLERY -->
        <section class="cs-section">
            <div class="cs-container">
                <div class="cs-section-head cs-reveal">
                    <span class="cs-section-label">Project Gallery</span>
                    <h2>Full project visuals &amp; deliverables</h2>
                    <p>Every screen, dashboard, and asset from this engagement — click to expand.</p>
                </div>
                <div class="cs-gallery-full cs-reveal">${data.galleryExtra}
                </div>
            </div>
        </section>

        <!-- KEY DELIVERABLES -->
        <section class="cs-section cs-section--alt">
            <div class="cs-container">
                <div class="cs-section-head cs-reveal">
                    <span class="cs-section-label">Key Deliverables</span>
                    <h2>Everything we built &amp; optimized</h2>
                </div>
                <div class="cs-deliverables">
                    ${deliverablesHtml(data.deliverables)}
                </div>
            </div>
        </section>

        <!-- PROJECT TIMELINE -->
        <section class="cs-section">
            <div class="cs-container">
                <div class="cs-section-head cs-reveal">
                    <span class="cs-section-label">Project Timeline</span>
                    <h2>Phase-by-phase execution</h2>
                </div>
                <div class="cs-timeline cs-reveal">
                    ${timelineHtml(data.timeline)}
                </div>
            </div>
        </section>

        <!-- SECONDARY METRICS -->
        <section class="cs-section cs-section--alt">
            <div class="cs-container">
                <div class="cs-section-head cs-reveal">
                    <span class="cs-section-label">Impact Metrics</span>
                    <h2>Numbers that tell the story</h2>
                </div>
                <div class="cs-metrics-row cs-reveal">
                    ${metricsHtml(data.metrics)}
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section class="cs-section">
            <div class="cs-container">
                <div class="cs-section-head cs-reveal">
                    <span class="cs-section-label">FAQ</span>
                    <h2>Questions about this project</h2>
                </div>
                <div class="cs-faq-compact cs-reveal">
                    ${faqHtml(data.faq)}
                </div>
            </div>
        </section>`;
}

function patchFile(filename) {
    const data = SUPPLEMENTS[filename];
    if (!data) return;
    const filePath = path.join(PROJECT, filename);
    let html = fs.readFileSync(filePath, 'utf8');

    if (!html.includes('css/dock-pages.css')) {
        html = html.replace(
            '<link rel="stylesheet" href="css/case-study.css">',
            '<link rel="stylesheet" href="css/case-study.css">\n    <link rel="stylesheet" href="css/dock-pages.css">'
        );
    }

    if (html.includes('<!-- KEY DELIVERABLES -->')) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log('Already enriched:', filename);
        return;
    }

    const supplement = buildSupplement(data);

    html = html.replace(
        /(\s*<\/section>\s*\n\s*<!-- 7\. TESTIMONIAL -->)/,
        supplement + '$1'
    );

    // Update testimonial to company-only (no human photo/name)
    html = html.replace(
        /<div class="cs-testimonial__avatar" aria-hidden="true">[^<]*<\/div>\s*<div class="cs-testimonial__info">\s*<strong>[^<]*<\/strong>\s*<span>[^<]*<\/span>/,
        `<div class="cs-testimonial__avatar cs-testimonial__avatar--brand" aria-hidden="true">${data.brandInitial}</div>
                        <div class="cs-testimonial__info">
                            <strong>${data.brand}</strong>
                            <span>${data.brandSub}</span>`
    );

    html = html.replace(
        /<blockquote>[^<]*<\/blockquote>/,
        `<blockquote>${data.quote}</blockquote>`
    );

    // Insert services + contact before CTA
    if (!html.includes('<!-- NEOXWEB Services -->')) {
        html = html.replace(
            /\s*<!-- CTA -->/,
            SERVICES_STRIP + '\n\n        <!-- CTA -->'
        );
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Enriched:', filename);
}

Object.keys(SUPPLEMENTS).forEach(patchFile);
console.log('Done — case studies packed with content, no human photos.');
