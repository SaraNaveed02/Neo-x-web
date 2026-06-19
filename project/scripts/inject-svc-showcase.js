/**
 * Inject 3×2 showcase gallery on web-hero mega-menu service pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const POOL = [
    'assets/images/neoxweb/web-dev.jpg',
    'assets/images/neoxweb/portfolio-web.jpg',
    'assets/images/neoxweb/seo-new.jpg',
    'assets/images/neoxweb/social-media-new.jpg',
    'assets/images/neoxweb/ppc.jpg',
    'assets/images/neoxweb/portfolio-branding.jpg',
    'assets/images/neoxweb/portfolio-seo.jpg',
    'assets/images/neoxweb/portfolio-ppc.jpg',
    'assets/images/neoxweb/hero-bg-new.jpg',
];

const PAGE_CONFIG = {
    'software-engineering.html': {
        tag: 'Project gallery',
        title: 'Engineering work at a glance',
        images: ['web-dev.jpg', 'portfolio-web.jpg', 'seo-new.jpg', 'ppc.jpg', 'social-media-new.jpg', 'hero-bg-new.jpg'],
        captions: [
            ['Custom web apps', 'Scalable platforms and APIs'],
            ['Mobile engineering', 'Native and cross-platform builds'],
            ['Cloud architecture', 'Microservices and DevOps'],
            ['QA automation', 'Test coverage and CI/CD'],
            ['API integrations', 'Third-party and payment flows'],
            ['Enterprise delivery', 'Long-term product support'],
        ],
    },
    'cloud.html': {
        tag: 'Cloud gallery',
        title: 'Cloud infrastructure and deployments',
        images: ['web-dev.jpg', 'seo-new.jpg', 'portfolio-web.jpg', 'ppc.jpg', 'social-media-new.jpg', 'hero-bg-new.jpg'],
        captions: [
            ['AWS & Azure', 'Multi-cloud architecture'],
            ['Kubernetes', 'Container orchestration'],
            ['CI/CD pipelines', 'Automated deployments'],
            ['Monitoring', 'Observability and alerts'],
            ['Security', 'IAM and compliance'],
            ['Migration', 'Lift-and-shift to cloud-native'],
        ],
    },
    'ai.html': {
        tag: 'AI gallery',
        title: 'AI and automation deliverables',
        images: ['seo-new.jpg', 'web-dev.jpg', 'social-media-new.jpg', 'portfolio-web.jpg', 'ppc.jpg', 'hero-bg-new.jpg'],
        captions: [
            ['ML models', 'Predictive analytics'],
            ['Chatbots', 'Conversational AI'],
            ['Automation', 'Workflow intelligence'],
            ['Data pipelines', 'ETL and feature stores'],
            ['NLP', 'Text and document AI'],
            ['Dashboards', 'AI-powered insights'],
        ],
    },
    'data-analytics.html': {
        tag: 'Analytics gallery',
        title: 'Data and reporting highlights',
        images: ['seo-new.jpg', 'portfolio-seo.jpg', 'ppc.jpg', 'web-dev.jpg', 'social-media-new.jpg', 'portfolio-ppc.jpg'],
        captions: [
            ['Dashboards', 'Executive KPI views'],
            ['SEO analytics', 'Traffic and ranking data'],
            ['PPC reporting', 'Campaign performance'],
            ['Data warehouses', 'Centralized business data'],
            ['Social metrics', 'Engagement tracking'],
            ['Custom reports', 'Automated client reporting'],
        ],
    },
    'application-modernization.html': {
        tag: 'Modernization gallery',
        title: 'Legacy to modern transformations',
        images: ['web-dev.jpg', 'portfolio-web.jpg', 'seo-new.jpg', 'hero-bg-new.jpg', 'ppc.jpg', 'social-media-new.jpg'],
        captions: [
            ['Legacy migration', 'Monolith to microservices'],
            ['UI refresh', 'Modern responsive interfaces'],
            ['API layer', 'REST and GraphQL gateways'],
            ['Cloud rehost', 'Scalable infrastructure'],
            ['Performance', 'Speed and reliability gains'],
            ['DevOps', 'Automated release cycles'],
        ],
    },
    'it-consulting.html': {
        tag: 'Consulting gallery',
        title: 'Advisory and strategy outcomes',
        images: ['seo-new.jpg', 'web-dev.jpg', 'portfolio-web.jpg', 'hero-bg-new.jpg', 'ppc.jpg', 'social-media-new.jpg'],
        captions: [
            ['IT audits', 'Infrastructure assessment'],
            ['Roadmaps', 'Digital transformation plans'],
            ['Architecture', 'Solution design reviews'],
            ['Vendor selection', 'Technology evaluation'],
            ['Cost optimization', 'Cloud spend analysis'],
            ['Change management', 'Team enablement'],
        ],
    },
    'social-media-marketing.html': {
        tag: 'Social gallery',
        title: 'Campaign creative and results',
        images: ['social-media-new.jpg', 'portfolio-branding.jpg', 'portfolio-web.jpg', 'seo-new.jpg', 'ppc.jpg', 'portfolio-seo.jpg'],
        captions: [
            ['Social creatives', 'Platform-native content'],
            ['Brand campaigns', 'Consistent visual identity'],
            ['Community growth', 'Engagement strategies'],
            ['Influencer kits', 'Collaboration assets'],
            ['Paid social', 'Targeted ad creative'],
            ['Analytics', 'Performance reporting'],
        ],
    },
    'graphic-design.html': {
        tag: 'Design gallery',
        title: 'Brand and visual design work',
        images: ['portfolio-branding.jpg', 'social-media-new.jpg', 'portfolio-web.jpg', 'seo-new.jpg', 'ppc.jpg', 'hero-bg-new.jpg'],
        captions: [
            ['Brand identity', 'Logo and style guides'],
            ['Social graphics', 'Posts and stories'],
            ['Print design', 'Brochures and collateral'],
            ['Web visuals', 'Landing page artwork'],
            ['Ad banners', 'Display and PPC creative'],
            ['Packaging', 'Product and retail design'],
        ],
    },
    'product-design.html': {
        tag: 'UX gallery',
        title: 'Product and UX design deliverables',
        images: ['social-media-new.jpg', 'portfolio-web.jpg', 'portfolio-branding.jpg', 'web-dev.jpg', 'seo-new.jpg', 'hero-bg-new.jpg'],
        captions: [
            ['Wireframes', 'User flow mapping'],
            ['Prototypes', 'Interactive Figma builds'],
            ['Design systems', 'Component libraries'],
            ['Mobile UX', 'App screen designs'],
            ['Usability tests', 'Research insights'],
            ['Handoff', 'Developer-ready specs'],
        ],
    },
    'video-editing.html': {
        tag: 'Video gallery',
        title: 'Video production highlights',
        images: ['portfolio-web.jpg', 'social-media-new.jpg', 'portfolio-branding.jpg', 'ppc.jpg', 'seo-new.jpg', 'hero-bg-new.jpg'],
        captions: [
            ['Brand films', 'Corporate storytelling'],
            ['Social reels', 'Short-form content'],
            ['Product demos', 'SaaS walkthroughs'],
            ['Ad spots', 'Paid media videos'],
            ['Motion graphics', 'Animated explainers'],
            ['Post-production', 'Color and sound polish'],
        ],
    },
    'testing-qa.html': {
        tag: 'QA gallery',
        title: 'Quality assurance in action',
        images: ['web-dev.jpg', 'portfolio-web.jpg', 'seo-new.jpg', 'ppc.jpg', 'social-media-new.jpg', 'hero-bg-new.jpg'],
        captions: [
            ['Test automation', 'Selenium and Playwright'],
            ['Regression suites', 'Release confidence'],
            ['Performance QA', 'Load and stress tests'],
            ['Security testing', 'Vulnerability scans'],
            ['Mobile QA', 'Device lab coverage'],
            ['CI integration', 'Pipeline quality gates'],
        ],
    },
};

function buildShowcase(cfg) {
    const cards = cfg.images.map((file, i) => {
        const src = file.startsWith('assets/') ? file : `assets/images/neoxweb/${file}`;
        const [title, desc] = cfg.captions[i] || ['Project', 'Deliverable'];
        return `                <figure class="svc-showcase-card fade-up${i ? ` delay-${Math.min(i, 3)}` : ''}">
                    <div class="svc-showcase-card__img"><img src="${src}" alt="" class="nx-photo" loading="lazy"></div>
                    <figcaption><h3>${title}</h3><p>${desc}</p></figcaption>
                </figure>`;
    }).join('\n');

    return `
        <section class="section-padding gray-bg svc-showcase-section">
            <div class="container section-header">
                <span class="section-tag">${cfg.tag}</span>
                <h2>${cfg.title}</h2>
            </div>
            <div class="svc-showcase-grid ui-fade-up">
${cards}
            </div>
        </section>`;
}

function injectShowcase(html, showcase) {
    const start = html.indexOf('<div class="service-grid">');
    if (start === -1) return null;
    const close = html.indexOf('</section>', start);
    if (close === -1) return null;
    const insertAt = close + '</section>'.length;
    return html.slice(0, insertAt) + showcase + html.slice(insertAt);
}

let updated = 0;
for (const [file, cfg] of Object.entries(PAGE_CONFIG)) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) {
        console.warn('Skip missing:', file);
        continue;
    }
    let html = fs.readFileSync(filePath, 'utf8');
    if (html.includes('svc-showcase-section')) {
        console.log('Already has showcase:', file);
        continue;
    }
    const showcase = buildShowcase(cfg);
    const next = injectShowcase(html, showcase);
    if (!next) {
        console.warn('service-grid not found:', file);
        continue;
    }
    fs.writeFileSync(filePath, next, 'utf8');
    updated++;
    console.log('Updated:', file);
}

console.log(`Done. ${updated} pages updated.`);
