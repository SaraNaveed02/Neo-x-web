/**
 * Inject Unified-style full content into NEOXWEB service pages
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');
const CSS_LINK = '<link rel="stylesheet" href="css/unified-service-full.css">';
const CSS_LINK_DOCK = '<link rel="stylesheet" href="css/dock-pages.css">';

const LOGO_STRIP = `<div class="svc-logo-strip"><span>Dezara Fashion</span><span>BoltSolar</span><span>MezzoK</span><span>Lahore</span><span>Karachi</span><span>Islamabad</span><span>Rawalpindi</span></div>`;

const PROCESS_6 = `
        <section class="ui-section ui-section--soft">
            <div class="ui-container">
                <span class="ui-section-tag">Our Process</span>
                <h2 class="ui-section-title">Maximizing output with our <strong>people-focused process</strong></h2>
                <div class="ui-process-grid ui-fade-up">
                    <div class="ui-process-card"><div class="step">P01</div><h4>Discovery Workshop</h4><p>We explore your goals, audience, and competitive landscape — co-creating solutions tailored to your business in Pakistan.</p></div>
                    <div class="ui-process-card"><div class="step">P02</div><h4>Predictive Planning</h4><p>Meticulous planning with clear milestones, content strategy, branding guidelines, and user acquisition roadmap.</p></div>
                    <div class="ui-process-card"><div class="step">P03</div><h4>IA &amp; UX/UI Design</h4><p>Wireframes, prototypes, and responsive designs for mobile, tablet, and web — approved before development begins.</p></div>
                    <div class="ui-process-card"><div class="step">P04</div><h4>Development</h4><p>Agile sprints every 2–3 weeks with client reviews. Clean code, API integrations, and performance optimization.</p></div>
                    <div class="ui-process-card"><div class="step">P05</div><h4>Testing</h4><p>Manual and automated QA, regression testing, security checks, and sprint demos before each release.</p></div>
                    <div class="ui-process-card"><div class="step">P06</div><h4>Support &amp; Maintenance</h4><p>24/7 monitoring, bug fixes, updates, and ongoing SEO/ads optimization after launch.</p></div>
                </div>
            </div>
        </section>`;

const ENGAGEMENT = `
        <section class="ui-section">
            <div class="ui-container">
                <div class="ui-services-intro ui-fade-up">
                    <span class="ui-section-tag">Engagement Models</span>
                    <h2>Flexible collaboration that fits your project</h2>
                </div>
                <div class="svc-engage-grid ui-fade-up">
                    <div class="svc-engage-card"><h4>Fixed Budget Model</h4><p>Pre-determined scope and cost with signed contract. Scope changes integrated with timeline revisions.</p><a href="contact.html">Learn More →</a></div>
                    <div class="svc-engage-card"><h4>IT Staff Augmentation</h4><p>Supplement your in-house team with NEOXWEB developers. Scale up for seasonal demands without full-time hires.</p><a href="contact.html">Learn More →</a></div>
                    <div class="svc-engage-card"><h4>Dedicated Team Model</h4><p>Long-term projects with a dedicated squad functioning as an extension of your team.</p><a href="contact.html">Learn More →</a></div>
                    <div class="svc-engage-card"><h4>Time &amp; Material</h4><p>Specialized experts at agreed hourly rates. Ideal for discovery before moving to fixed-price.</p><a href="contact.html">Learn More →</a></div>
                    <div class="svc-engage-card"><h4>Services Retainer</h4><p>Regular cross-workflow support — technical assistance to keep systems running 24/7.</p><a href="contact.html">Learn More →</a></div>
                    <div class="svc-engage-card"><h4>Support &amp; Maintenance</h4><p>Continuous updates, troubleshooting, and technical support for existing systems.</p><a href="contact.html">Learn More →</a></div>
                </div>
            </div>
        </section>`;

const CASE_STUDIES = `
        <section class="ui-section ui-section--soft">
            <div class="ui-container">
                <div class="ui-services-intro ui-fade-up"><span class="ui-section-tag">Case Studies</span><h2>Proven results for real clients</h2></div>
                <div class="nx-stack-cards ui-fade-up">
                    <a href="case-study-seo.html" class="nx-stack-card"><img src="assets/images/neoxweb/portfolio-seo.jpg" alt="" loading="lazy"><div class="nx-stack-card__body"><span class="nx-tag">SEO</span><h3>150% Traffic — Dezara Fashion</h3><p>Technical SEO &amp; content strategy for Pakistani fashion brand.</p><span class="nx-stack-card__link">View case study →</span></div></a>
                    <a href="case-study-ppc.html" class="nx-stack-card"><img src="assets/images/neoxweb/portfolio-ppc.jpg" alt="" loading="lazy"><div class="nx-stack-card__body"><span class="nx-tag">PPC</span><h3>3× ROI — BoltSolar</h3><p>Google Ads &amp; landing pages for solar leads across Pakistan.</p><span class="nx-stack-card__link">View case study →</span></div></a>
                </div>
            </div>
        </section>`;

const CTA = `
        <section class="ui-cta-band">
            <div class="ui-container">
                <div class="ui-cta-band__inner" style="text-align:center">
                    <h2>Ready to embrace <strong>digital change?</strong></h2>
                    <p>WhatsApp 0308 4858836 · supportneoxweb@gmail.com · Free audit</p>
                    <div class="ui-cta-stats" style="margin:1.25rem 0">
                        <div><strong>300+</strong><span>Projects</span></div>
                        <div><strong>150%</strong><span>SEO Growth</span></div>
                        <div><strong>3×</strong><span>PPC ROI</span></div>
                    </div>
                    <a href="contact.html" class="ui-btn-getstarted">Talk To Our Experts <i class="fas fa-chevron-right"></i></a>
                </div>
            </div>
        </section>`;

const PAGES = {
    'web.html': {
        breadcrumb: 'Web Design &amp; Development',
        tag: 'Website Development',
        title: 'Custom Web Design and <span class="ui-gradient-text">Development Services</span>',
        lead: 'Forward-thinking businesses in Pakistan know the power of web technologies to drive growth. Partner with NEOXWEB for seamless performance, scalable websites, and resilient digital infrastructure.',
        bg: 'web-dev.jpg',
        pains: ['A slow, clunky website that frustrates visitors and hurts Google rankings', 'Limited control over your backend, slowing down updates and innovation', 'No SEO or analytics — missing leads and business intelligence', 'Outdated design that fails on mobile and loses customers to competitors'],
        intro: 'Leveraging a consulting-led approach, our experts analyze your objectives, craft strategic plans, and deliver high-performance web solutions. We blend world-class UI/UX with responsive design — from simple business sites to e-commerce and SaaS platforms across Lahore, Karachi, and Islamabad.',
        verticals: [
            ['portfolio-web.jpg', 'Website Revamp & Redesign', 'Transform dated websites into high-converting performers with personalized content, SEO-optimized landing pages, and modern UX.'],
            ['hero-bg-new.jpg', 'Website Migration', 'Move your domain, hosting, or platform with zero downtime. We preserve SEO, SSL, analytics, and user experience throughout.'],
            ['seo-new.jpg', 'Maintenance & Optimization', 'Proactive monitoring, speed enhancements, security updates, and content refreshes to keep your site at peak performance.'],
            ['web-dev.jpg', 'E-Commerce Development', 'Custom WooCommerce, Shopify &amp; headless stores with JazzCash, EasyPaisa, and optimized checkout for Pakistani shoppers.'],
            ['portfolio-branding.jpg', 'CMS & Content Management', 'WordPress, headless CMS, and content systems that blend aesthetics with easy admin control.'],
            ['social-media-new.jpg', 'Front-End Development', 'Pixel-perfect, responsive interfaces with React, Next.js, and Tailwind — built for engagement and conversions.'],
            ['ppc.jpg', 'Back-End Development', 'Robust Node.js, Laravel, and PostgreSQL architectures with secure APIs and scalable cloud deployment.'],
            ['portfolio-seo.jpg', 'SEO-Ready Launch', 'Every site built with Core Web Vitals, schema markup, and local SEO for Pakistan markets built in from day one.']
        ],
        advantages: [
            ['fa-bolt', 'Agile Process', 'High-quality, sustainable delivery with DevOps best practices and transparent client communication.'],
            ['fa-comments', 'Proactive Consulting', 'Maximum ROI through data-driven strategy — from discovery to launch and beyond.'],
            ['fa-shield-halved', 'Security First', 'Customer, app, and data security are non-negotiable on every NEOXWEB project.'],
            ['fa-face-smile', 'Seamless CX', 'Compelling aesthetics and frictionless functionality from concept to launch.'],
            ['fa-headset', 'Post-Launch Support', 'Ongoing maintenance, updates, and 24/7 WhatsApp support for active clients.']
        ],
        faq: [
            ['How long does a business website take?', 'Most business websites launch in 2–4 weeks. E-commerce and custom platforms take 4–8 weeks depending on features.'],
            ['Do you provide SEO with web development?', 'Yes — every NEOXWEB website includes SEO-ready structure, speed optimization, and optional ongoing SEO retainers.'],
            ['How much does a website cost in Pakistan?', 'Packages start affordably for startups. Contact us for a free quote — WhatsApp 0308 4858836.'],
            ['Do you work with startups and MSMEs?', 'Absolutely — we specialize in affordable, high-impact solutions for startups, SMBs, and enterprises.'],
            ['What technologies do you use?', 'React, Next.js, WordPress, Laravel, Node.js, WooCommerce, Shopify — chosen for your specific needs.']
        ]
    },
    'development.html': {
        breadcrumb: 'Web App Development',
        tag: 'Web Application Development',
        title: 'Custom Web Application Development <span class="ui-gradient-text">Company</span>',
        lead: 'Tired of off-the-shelf solutions? Get scalable, secure, and user-centric web apps tailored to your business needs — streamline operations, enhance engagement, and drive growth.',
        bg: 'portfolio-web.jpg',
        pains: ['Outdated web apps that crash under traffic spikes or business growth', 'High bounce rates from slow load times and confusing navigation', 'Siloed data and manual workflows between Excel, CRM, and other tools', 'Security vulnerabilities from unpatched platforms or weak authentication'],
        intro: 'NEOXWEB delivers custom web application development that transforms digital challenges into competitive advantages. Cloud-native architecture, seamless API integrations, and intelligent analytics — from startups in Lahore to enterprises across Pakistan.',
        verticals: [
            ['portfolio-web.jpg', 'Custom Web Application Development', 'Bespoke applications tailored to your unique needs — scalable, maintainable, and built for high ROI.'],
            ['web-dev.jpg', 'Web Portals & Dashboards', 'Resilient, feature-rich portals for enterprise, B2B, and e-commerce with real-time analytics.'],
            ['seo-new.jpg', 'Web App Consulting', 'Strategic planning to architect high-impact digital solutions — SaaS, portals, PWAs, and integrations.'],
            ['hero-bg-new.jpg', 'Web App Revamp & Modernization', 'Transform outdated systems into high-performing apps with modern UX and cloud-native architecture.'],
            ['social-media-new.jpg', 'Progressive Web Apps (PWA)', 'App-like browser experiences with offline capabilities, push notifications, and fast load times.'],
            ['ppc.jpg', 'Single Page Applications (SPA)', 'React, Angular, Vue SPAs with no full-page reloads — faster interactions and smoother UX.'],
            ['portfolio-branding.jpg', 'API & Microservices', 'Modular backend architectures for scale, third-party integrations, and future growth.'],
            ['portfolio-seo.jpg', 'Support & Maintenance', '24/7 monitoring, security patches, performance tuning, and feature enhancements post-launch.']
        ],
        advantages: [
            ['fa-comments', 'Proactive Consulting', 'Data-driven roadmaps emphasizing scalability, ROI, and user adoption.'],
            ['fa-code', 'Quality Development', 'SOLID principles, microservices, and clean code for MVPs and enterprise apps.'],
            ['fa-shield-halved', 'Testing & Security', 'Rigorous QA and security-first development for reliable uptime.'],
            ['fa-headset', 'Post-Development Support', 'Continuous updates and rapid resolution of critical issues.']
        ],
        faq: [
            ['How long does web app development take?', 'MVPs: 6–10 weeks. Enterprise apps: 3–6 months depending on scope.'],
            ['Should I use frameworks or pure code?', 'We recommend modern frameworks (React, Next.js, Laravel) for maintainability and speed — chosen per project.'],
            ['How much does web app development cost?', 'Varies by scope. Free discovery call — contact us on WhatsApp for a tailored estimate.'],
            ['Do you build PWAs?', 'Yes — progressive web apps with offline support, push notifications, and app-store-free deployment.']
        ]
    },
    'mobile.html': {
        breadcrumb: 'Mobile App Development',
        tag: 'Mobile App Development',
        title: 'Mobile App Development <span class="ui-gradient-text">Services &amp; Solutions</span>',
        lead: 'Supercharge your business with powerful, feature-rich mobile applications. Native iOS, Android, Flutter, and React Native — built for performance, engagement, and ROI.',
        bg: 'social-media-new.jpg',
        pains: ['Apps that crash, lag, or fail App Store review on launch day', 'Poor UI/UX causing low retention and bad reviews', 'No analytics or push notification strategy for user engagement', 'Legacy apps that cannot scale with your growing user base'],
        intro: 'As a top-tier mobile app development company in Pakistan, NEOXWEB empowers businesses with solutions that promise performance and user delight. Our developers build across iOS, Android, Flutter, and React Native for startups and enterprises.',
        verticals: [
            ['web-dev.jpg', 'iOS App Development', 'Swift, Flutter, React Native apps for Apple devices — engaging, scalable, and App Store ready.'],
            ['portfolio-web.jpg', 'Android App Development', 'Kotlin and cross-platform apps that captivate users across geographies and devices.'],
            ['social-media-new.jpg', 'Hybrid App Solutions', 'Cross-platform apps with seamless UI/UX, smart features, and powerful security.'],
            ['ppc.jpg', 'Enterprise Mobility', 'Remote workforce apps with secure connectivity, push notifications, and offline support.'],
            ['hero-bg-new.jpg', 'Mobile App Modernization', 'Upgrade legacy apps with reengineering, refactoring, and cloud migration.'],
            ['portfolio-branding.jpg', 'App Modernization Strategy', 'Assessment, roadmap, and phased modernization to future-proof your mobile products.'],
            ['seo-new.jpg', 'UI/UX for Mobile', 'User-centric design with prototypes, usability testing, and conversion-focused flows.'],
            ['portfolio-seo.jpg', 'App Store Launch', 'Submission, ASO optimization, analytics setup, and post-launch support.']
        ],
        advantages: [
            ['fa-diagram-project', 'Our Process', 'Integrates business needs, user pain points, and market landscape into every build.'],
            ['fa-lightbulb', 'Proactive Approach', 'Future-ready lifecycle — not just surviving the market, but thriving in it.'],
            ['fa-palette', 'UX/UI Priority', 'Aesthetics, usability, and functionality — never an afterthought.'],
            ['fa-shield-halved', 'Testing & Security', 'Stringent QA from day one for secure, reliable app performance.'],
            ['fa-headset', 'Post-Development Support', 'Updates aligned with user feedback and latest platform requirements.']
        ],
        faq: [
            ['How much does a mobile app cost?', 'Simple apps from affordable packages. Complex apps quoted after free discovery call.'],
            ['iOS, Android, or cross-platform?', 'We recommend Flutter/React Native for most projects — single codebase, dual platform launch.'],
            ['How long does app development take?', 'Simple apps: 8–12 weeks. Complex enterprise apps: 4–6 months.'],
            ['Do you handle App Store submission?', 'Yes — full submission, ASO, and launch support included.']
        ]
    },
    'saas-platforms.html': {
        breadcrumb: 'SaaS Development',
        tag: 'SaaS Development',
        title: 'Top-Rated <span class="ui-gradient-text">SaaS Development</span> Company',
        lead: 'For years, NEOXWEB SaaS experts have built cloud solutions that help businesses unlock new avenues and real value — from MVP to multi-tenant enterprise platforms.',
        bg: 'portfolio-web.jpg',
        pains: ['Limited scalability from rigid architecture and outdated cloud setup', 'Operational bottlenecks from manual processes and no real-time analytics', 'Fragmented systems causing poor integration and inefficient workflows', 'Subpar UX from lack of personalization and modern design patterns'],
        intro: 'We turn your SaaS vision into powerful cloud-based solutions. Flexible architectures, automated workflows, and advanced capabilities — comprehensive support from strategy and design through deployment for startups and growing SaaS companies in Pakistan.',
        verticals: [
            ['seo-new.jpg', 'SaaS Consulting', 'Market analysis, strategic planning, and roadmaps aligned with scalability and innovation.'],
            ['portfolio-web.jpg', 'Custom SaaS Application Development', 'Bespoke apps with seamless integration, scalable architecture, and high ROI.'],
            ['web-dev.jpg', 'SaaS Product Development', 'End-to-end from design to deployment — MVPs to multi-tenant enterprise apps.'],
            ['hero-bg-new.jpg', 'SaaS Cloud Migration', 'Smooth transitions to cloud with zero downtime and optimized performance.'],
            ['portfolio-branding.jpg', 'SaaS Architecture Design', 'Multi-tenant and mixed-tenant architectures for security, compliance, and growth.'],
            ['social-media-new.jpg', 'SaaS UI/UX Design', 'Wireframes to usability-tested prototypes — intuitive, engaging interfaces.'],
            ['ppc.jpg', 'SaaS Integration Services', 'Custom APIs for secure data exchange and third-party tool connectivity.'],
            ['portfolio-seo.jpg', 'SaaS Optimization', 'Performance tuning, feature enhancement, and reengineering for market traction.']
        ],
        advantages: [
            ['fa-chart-line', 'Performance Optimization', 'Scalable architectures with API integrations for global reach.'],
            ['fa-users', 'User Engagement', 'Zero-downtime strategy and secure, user-focused experiences that boost retention.'],
            ['fa-lock', 'Data Privacy', 'Security best practices and compliance-ready architecture.'],
            ['fa-rocket', 'Fast Time-to-Market', 'Agile methodologies and reusable frameworks for quick, quality launches.']
        ],
        faq: [
            ['What is SaaS development?', 'Building subscription-based cloud software with multi-tenant architecture, billing, and user management.'],
            ['How much does SaaS development cost?', 'MVPs start from flexible packages. Enterprise SaaS quoted after discovery workshop.'],
            ['Can you migrate legacy software to SaaS?', 'Yes — full migration planning, cloud adaptation, and phased rollout.'],
            ['Do you offer ongoing SaaS support?', 'Yes — maintenance, feature updates, and 24/7 monitoring retainers available.']
        ]
    },
    'ecommerce-strategy.html': {
        breadcrumb: 'E-Commerce Development',
        tag: 'E-Commerce Development',
        title: 'eCommerce Web Development <span class="ui-gradient-text">Services</span>',
        lead: 'Drive tangible business transformation with eCommerce experiences that resonate with customers and deliver market success — optimized for Pakistani shoppers.',
        bg: 'portfolio-branding.jpg',
        pains: ['88% of users won\'t return after a bad experience — slow or ugly stores lose sales', 'Poor mobile UX causing cart abandonment on phones', 'No local payment options (JazzCash, EasyPaisa, COD) limiting conversions', 'Weak SEO and security leaving stores invisible and vulnerable'],
        intro: 'As a premier eCommerce development company in Pakistan, NEOXWEB blends brand vision with robust tech stacks. We analyze your needs, define objectives, and build digital commerce platforms that convert — serving fashion, retail, solar, and startups nationwide.',
        verticals: [
            ['web-dev.jpg', 'Custom eCommerce Website Development', 'WordPress, WooCommerce, Shopify, and custom stores that turn visitors into loyal customers.'],
            ['social-media-new.jpg', 'Mobile Commerce Solutions', 'Mobile-first stores with push notifications, voice shopping, and faster checkout.'],
            ['portfolio-web.jpg', 'B2B eCommerce Solutions', 'Enterprise portals with inventory, pricing tiers, and multi-user account management.'],
            ['hero-bg-new.jpg', 'Platform Migration', 'Upgrade legacy systems to modern platforms with 10× performance improvement.'],
            ['seo-new.jpg', 'Conversion & SEO Optimization', 'Data-driven CRO, SEO strategy, and security measures that boost rankings and sales.'],
            ['ppc.jpg', 'Payment Integration', 'JazzCash, EasyPaisa, Stripe, PayPal, and cash-on-delivery for Pakistani markets.'],
            ['portfolio-seo.jpg', 'Inventory & Fulfillment', 'Multi-channel inventory, shipping integrations, and order management systems.'],
            ['portfolio-branding.jpg', 'Store Maintenance', '24/7 monitoring, security patches, and performance optimization for peak uptime.']
        ],
        advantages: [
            ['fa-diagram-project', 'DevOps Process', 'Streamlined stages with DevSecOps for secure payment gateway integration.'],
            ['fa-comments', 'Proactive Consulting', 'Data-driven commerce consultancy for value-driven success.'],
            ['fa-layer-group', 'Best-in-Class Tech', 'Magento, WooCommerce, Shopify, and custom headless commerce.'],
            ['fa-vial', 'Rigorous Testing', 'Automated and manual QA for performance under real traffic stress.'],
            ['fa-headset', 'Support & Maintenance', 'Continuous monitoring and proactive vulnerability fixes 24/7.']
        ],
        faq: [
            ['How long to build an eCommerce site?', 'Standard stores: 3–5 weeks. Custom platforms: 6–10 weeks depending on features.'],
            ['WooCommerce or Shopify?', 'We recommend based on your budget, scale, and customization needs — both supported.'],
            ['Do you integrate Pakistani payment gateways?', 'Yes — JazzCash, EasyPaisa, bank transfer, and COD built into every store.'],
            ['How much does an eCommerce website cost?', 'Flexible packages for startups. Free quote on WhatsApp 0308 4858836.']
        ]
    }
};

function buildHero(p) {
    return `
        <section class="svc-banner-hero">
            <div class="svc-banner-hero__bg" style="background-image:url('assets/images/neoxweb/${p.bg}')"></div>
            <div class="svc-banner-hero__overlay"></div>
            <div class="svc-banner-hero__inner">
                <nav class="svc-breadcrumb"><a href="index.html">Home</a> / <a href="services.html">Services</a> / <span>${p.breadcrumb}</span></nav>
                <span class="ui-section-tag">${p.tag}</span>
                <h1>${p.title}</h1>
                <p class="svc-banner-hero__lead">${p.lead}</p>
                <a href="contact.html" class="ui-btn-getstarted">Let's Get Started <i class="fas fa-chevron-right"></i></a>
            </div>
        </section>
        ${LOGO_STRIP}`;
}

function buildPainsIntro(p) {
    const pains = p.pains.map(t => `<div class="svc-pain-item"><i class="fas fa-circle-xmark"></i><p>${t}</p></div>`).join('');
    return `
        <section class="ui-section">
            <div class="ui-container">
                <div class="ui-services-intro ui-fade-up"><span class="ui-section-tag">The Challenge</span><h2>You may have experienced</h2></div>
                <div class="svc-pain-grid ui-fade-up">${pains}</div>
                <div class="svc-intro-block ui-fade-up" style="margin-top:1.5rem"><p>${p.intro}</p></div>
            </div>
        </section>`;
}

function buildVerticals(p) {
    const items = p.verticals.map(([img, title, desc]) => `
                    <article class="svc-vertical-item">
                        <div class="svc-vertical-item__icon"><img src="assets/images/neoxweb/${img}" alt="" loading="lazy"></div>
                        <div><h3>${title}</h3><p>${desc}</p></div>
                    </article>`).join('');
    return `
        <section class="ui-section ui-section--soft">
            <div class="ui-container">
                <div class="ui-services-intro ui-fade-up"><span class="ui-section-tag">Our Services</span><h2>End-to-end solutions for your business</h2></div>
                <div class="svc-vertical-list ui-fade-up">${items}</div>
            </div>
        </section>`;
}

function buildAdvantages(p) {
    const cards = p.advantages.map(([icon, title, desc]) => `
                    <div class="svc-advantage-card"><i class="fas ${icon}"></i><h4>${title}</h4><p>${desc}</p></div>`).join('');
    return `
        <section class="ui-section">
            <div class="ui-container">
                <div class="ui-services-intro ui-fade-up"><span class="ui-section-tag">The NEOXWEB Advantage</span><h2>Why choose us as your digital partner</h2>
                <p class="ui-section-desc" style="max-width:640px">We collaborate with startups, MSMEs, and ambitious brands across Pakistan to deliver tailored, high-performance digital solutions built on collaboration and results.</p></div>
                <div class="svc-advantage-grid ui-fade-up">${cards}</div>
            </div>
        </section>`;
}

function buildIndustries() {
    const ind = [
        ['Fashion & Retail', 'E-commerce & SEO for brands like Dezara Fashion across Pakistan.'],
        ['Solar & Energy', 'PPC & web solutions for lead generation — BoltSolar case study.'],
        ['E-Commerce', 'Stores with JazzCash, EasyPaisa, and conversion optimization.'],
        ['EdTech', 'Learning platforms with video, assessments, and analytics.'],
        ['Healthcare', 'Patient portals, telehealth, and HIPAA-aware architecture.'],
        ['FinTech', 'Secure payment flows and compliance-ready fintech solutions.'],
        ['SaaS & Startups', 'MVPs, subscription billing, and scalable cloud apps.'],
        ['Real Estate', 'Property listings, CRM integration, and lead capture sites.']
    ];
    const html = ind.map(([t, d]) => `<article><h4>${t}</h4><p>${d}</p></article>`).join('');
    return `
        <section class="ui-section ui-section--soft">
            <div class="ui-container">
                <div class="ui-services-intro ui-fade-up"><span class="ui-section-tag">Industries</span><h2>Serving businesses across Pakistan</h2></div>
                <div class="svc-industry-compact ui-fade-up">${html}</div>
            </div>
        </section>`;
}

function buildTech() {
    return `
        <section class="ui-section">
            <div class="ui-container ui-text-center">
                <span class="ui-section-tag">Technologies</span>
                <h2 class="ui-section-title">The stack that powers our <strong>success</strong></h2>
                <div class="ui-tech-tabs ui-fade-up" style="margin-top:1rem">
                    <button type="button" class="ui-tech-tab active">Frontend</button>
                    <button type="button" class="ui-tech-tab">Backend</button>
                    <button type="button" class="ui-tech-tab">Mobile</button>
                    <button type="button" class="ui-tech-tab">Cloud</button>
                    <button type="button" class="ui-tech-tab">CMS</button>
                </div>
                <div class="ui-tech-panel ui-fade-up" style="display:block"><h4>Frontend</h4><p>React, Next.js, Vue.js, Tailwind CSS, Figma — smooth interfaces for seamless experiences.</p></div>
                <div class="ui-tech-panel"><h4>Backend</h4><p>Node.js, Laravel, Python, PostgreSQL, Redis, GraphQL — scalable server architecture.</p></div>
                <div class="ui-tech-panel"><h4>Mobile</h4><p>Swift, Kotlin, Flutter, React Native, Firebase — native and cross-platform apps.</p></div>
                <div class="ui-tech-panel"><h4>Cloud</h4><p>AWS, Docker, CI/CD, Datadog — cloud-native deployment and monitoring.</p></div>
                <div class="ui-tech-panel"><h4>CMS</h4><p>WordPress, headless CMS, Contentful, WooCommerce, Shopify.</p></div>
            </div>
        </section>`;
}

function buildFaq(p) {
    const items = p.faq.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('');
    return `
        <section class="ui-section ui-section--soft">
            <div class="ui-container">
                <div class="ui-services-intro ui-fade-up"><span class="ui-section-tag">FAQ</span><h2>Frequently asked questions</h2></div>
                <div class="pr-faq ui-fade-up" style="max-width:720px;margin-inline:auto">${items}</div>
            </div>
        </section>`;
}

function buildResources() {
    return `
        <section class="ui-section">
            <div class="ui-container">
                <div class="ui-services-intro ui-fade-up"><span class="ui-section-tag">Resources</span><h2>Explore our digital resources</h2></div>
                <div class="ui-resources-grid ui-fade-up">
                    <article class="ui-resource-card"><div class="thumb" style="padding:0;overflow:hidden"><img src="assets/images/neoxweb/web-dev.jpg" alt="" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div><div class="body"><span class="type">Guide</span><h4>Launch Your Business Website in 2–4 Weeks</h4><span class="meta">Planning &amp; go-live checklist</span></div></article>
                    <article class="ui-resource-card"><div class="thumb" style="padding:0;overflow:hidden"><img src="assets/images/neoxweb/seo-new.jpg" alt="" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div><div class="body"><span class="type">Guide</span><h4>SEO for Pakistani Businesses in 2025</h4><span class="meta">Local keywords &amp; Google Business</span></div></article>
                    <article class="ui-resource-card"><div class="thumb" style="padding:0;overflow:hidden"><img src="assets/images/neoxweb/ppc.jpg" alt="" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div><div class="body"><span class="type">Guide</span><h4>Google Ads for Local Leads</h4><span class="meta">Budget, targeting &amp; ROI</span></div></article>
                    <article class="ui-resource-card"><div class="thumb" style="padding:0;overflow:hidden"><img src="assets/images/neoxweb/social-media-new.jpg" alt="" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div><div class="body"><span class="type">Guide</span><h4>Social Media Growth Playbook</h4><span class="meta">Instagram, reels &amp; engagement</span></div></article>
                </div>
                <div class="ui-text-center" style="margin-top:1.25rem"><a href="resources.html" class="ui-btn-outline">Explore All Resources</a></div>
            </div>
        </section>`;
}

function buildMain(p) {
    return buildHero(p) + buildPainsIntro(p) + buildVerticals(p) + buildAdvantages(p) + CASE_STUDIES + buildIndustries() + buildTech() + PROCESS_6 + ENGAGEMENT + buildFaq(p) + buildResources() + CTA;
}

function patchFile(filename) {
    const p = PAGES[filename];
    if (!p) return;
    const fp = path.join(PROJECT, filename);
    let html = fs.readFileSync(fp, 'utf8');

    // Clean head — unified CSS only
    html = html.replace(/<link rel="stylesheet" href="css\/service-page\.css">\n?/g, '');
    html = html.replace(/<link rel="stylesheet" href="css\/page-rich\.css">\n?/g, '');
    html = html.replace(/<script defer src="js\/utils\.js"><\/script>\n?/g, '');
    html = html.replace(/<script defer src="js\/main\.js"><\/script>\n?/g, '');
    html = html.replace(/<script defer src="js\/animations\.js"><\/script>\n?/g, '');
    html = html.replace(/\s*<script defer src="js\/page-rich\.js"><\/script>/g, '');

    if (!html.includes('unified-service-full.css')) {
        html = html.replace('</head>', `    ${CSS_LINK}\n    ${CSS_LINK_DOCK}\n</head>`);
    }

    // Remove PAGE-RICH block if present
    html = html.replace(/<!-- PAGE-RICH-START -->[\s\S]*?<!-- PAGE-RICH-END -->/g, '');

    const mainContent = buildMain(p);
    html = html.replace(/<main id="app-main">[\s\S]*?<\/main>/, `<main id="app-main">\n${mainContent}\n    </main>`);

    // Ensure scripts
    if (!html.includes('unified-home.js')) {
        html = html.replace('</body>', `<script defer src="js/unified-home.js"></script>\n    <script defer src="js/unified-app.js"></script>\n    <script defer src="js/unified-layout.js"></script>\n</body>`);
    }

    fs.writeFileSync(fp, html, 'utf8');
    console.log('Built:', filename);
}

Object.keys(PAGES).forEach(patchFile);
console.log('Done — Unified-style service pages for NEOXWEB.');
