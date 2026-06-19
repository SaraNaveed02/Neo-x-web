/**
 * Generate technologies.html hub + individual tech-*.html pages
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const CATEGORIES = {
    Backend: [
        { file: 'tech-nodejs.html', name: 'Node.js (Express/Nest)', lead: 'Scalable APIs, real-time apps and microservices with Node.js — built for performance and rapid delivery.' },
        { file: 'tech-laravel.html', name: 'Laravel', lead: 'Robust PHP applications, admin panels and business platforms with Laravel best practices.' },
        { file: 'tech-python.html', name: 'Python', lead: 'Data pipelines, automation, AI integrations and backend services powered by Python.' }
    ],
    Frontend: [
        { file: 'tech-javascript.html', name: 'JavaScript', lead: 'Modern interactive web experiences with clean, maintainable JavaScript architecture.' },
        { file: 'tech-angular.html', name: 'Angular', lead: 'Enterprise-grade SPAs with Angular — structured, scalable and type-safe.' },
        { file: 'tech-react.html', name: 'ReactJS', lead: 'High-performance React applications with component-driven UI and fast UX.' },
        { file: 'tech-vue.html', name: 'Vue.JS', lead: 'Lightweight, flexible Vue.js apps that ship fast and scale smoothly.' }
    ],
    Mobile: [
        { file: 'tech-react-native.html', name: 'React Native', lead: 'Cross-platform iOS and Android apps from a single React Native codebase.' },
        { file: 'tech-ios.html', name: 'iOS Native', lead: 'Swift-based native iOS apps optimized for Apple ecosystem performance.' },
        { file: 'tech-android.html', name: 'Android Native', lead: 'Kotlin/Android native apps built for reliability and Play Store growth.' },
        { file: 'tech-flutter.html', name: 'Flutter', lead: 'Beautiful cross-platform mobile apps with Flutter and Dart.' }
    ],
    Cloud: [
        { file: 'tech-aws.html', name: 'AWS Cloud', lead: 'AWS architecture, deployment, scaling and DevOps for cloud-native products.' },
        { file: 'tech-azure.html', name: 'Azure', lead: 'Microsoft Azure cloud solutions for secure, enterprise-ready infrastructure.' }
    ],
    CMS: [
        { file: 'tech-wordpress.html', name: 'WordPress', lead: 'Custom WordPress websites, themes and plugins for content-driven growth.' },
        { file: 'tech-drupal.html', name: 'Drupal', lead: 'Enterprise CMS builds with Drupal — flexible, secure and scalable.' },
        { file: 'tech-woocommerce.html', name: 'WooCommerce', lead: 'WooCommerce stores with Pakistani payment gateways and conversion-focused UX.' }
    ],
    Database: [
        { file: 'tech-mongodb.html', name: 'MongoDB', lead: 'Flexible NoSQL data models for modern apps and real-time analytics.' },
        { file: 'tech-mysql.html', name: 'MySQL', lead: 'Reliable relational databases optimized for business-critical applications.' }
    ],
    Automation: [
        { file: 'tech-playwright.html', name: 'Playwright', lead: 'End-to-end test automation with Playwright for faster, confident releases.' }
    ]
};

const ALL_TECH = Object.entries(CATEGORIES).flatMap(([cat, items]) =>
    items.map((t) => ({ ...t, category: cat }))
);

function getFooter() {
    const sample = fs.readFileSync(path.join(ROOT, 'graphic-design.html'), 'utf8');
    const m = sample.match(/<footer class="site-footer[\s\S]*?<\/footer>/);
    return m ? m[0] : '';
}

function headBlock(title, desc, canonical) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <script defer src="js/config.js"></script>
    <script defer src="js/config.live.js"></script>
    <script defer src="js/mobile-init.js"></script>
    <meta charset="UTF-8">
    <script>(function(){var p=location.pathname||'/';var s=p.lastIndexOf('/');var b=s>=0?p.slice(0,s+1):'/';window.__NEOXWEB_BASE__=b;var e=document.createElement('base');e.id='neoxweb-base';e.href=b;var h=document.head||document.documentElement;var c=document.querySelector('meta[charset]');if(c)c.after(e);else h.insertBefore(e,h.firstChild);})();</script>
    <script src="js/perf-load.js"></script>
    <script src="js/image-fallback.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
    <title>${title} | NEOXWEB</title>
    <meta name="description" content="${desc}">
    <meta property="og:title" content="${title} | NEOXWEB">
    <meta property="og:description" content="${desc}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_PK">
    <meta property="og:site_name" content="NEOXWEB">
    <meta property="og:image" content="https://neoxweb.pages.dev/static/images/hero-bg-new.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="./${canonical}">
    <meta name="theme-color" content="#0a0a0a">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/service-page.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/responsive.css">
    <link rel="stylesheet" href="css/navbar-pro.css">
    <link rel="stylesheet" href="css/neoxweb-theme.css">
    <link rel="stylesheet" href="css/footer-pro.css">
    <link rel="stylesheet" href="css/unified-pro.css">
    <link rel="stylesheet" href="css/unified-dark.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"></noscript>
    <link rel="stylesheet" href="css/mobile-friendly.css">
    <link rel="stylesheet" href="css/mobile-app.css">
    <link rel="manifest" href="manifest.json">
    <script defer src="js/seo.js"></script>
</head>`;
}

function scriptsBlock() {
    return `
    <script defer src="js/utils.js"></script>
    <script defer src="js/main.js"></script>
    <script defer src="js/navbar-embed.js"></script>
    <script defer src="js/navbar.js"></script>
    <script defer src="js/pwa.js"></script>
</body>
</html>`;
}

function buildTechPage(tech) {
    const footer = getFooter();
    const desc = `${tech.name} development services in Pakistan — NEOXWEB builds scalable, secure solutions.`;
    return `${headBlock(tech.name + ' Development', desc, tech.file)}
<body class="neoxweb-site service-page nx-advanced-page">
    <div id="navbar-container"></div>
    <main>
        <section class="web-hero">
            <div class="container web-hero-grid">
                <div class="web-hero-copy fade-up">
                    <span class="section-tag">${tech.category}</span>
                    <h1>${tech.name} <span class="highlight">Development</span></h1>
                    <p class="web-hero-lead">${tech.lead}</p>
                    <div class="web-hero-actions">
                        <a href="contact.html" class="btn btn-primary btn-large">Start a Project</a>
                        <a href="technologies.html" class="btn btn-outline btn-large">All Technologies</a>
                    </div>
                </div>
                <div class="web-hero-visual fade-up delay-1">
                    <div class="web-hero-visual-icon" aria-hidden="true"><img src="https://neoxweb.pages.dev/static/images/web-dev.jpg" alt="" class="visual-art visual-art--hero nx-photo" loading="lazy"></div>
                </div>
            </div>
        </section>
        <section class="section-padding">
            <div class="container section-header text-center">
                <span class="section-tag">Why ${tech.name}</span>
                <h2>Expert ${tech.name} solutions for growing businesses.</h2>
                <p class="section-desc">NEOXWEB delivers production-ready code, clear timelines and ongoing support — from startups to enterprises in Pakistan.</p>
            </div>
            <div class="service-grid">
                <article class="service-panel tilt-card fade-up"><span class="service-panel-num">01</span><h3>Architecture</h3><p>Scalable, secure structure built for long-term growth.</p></article>
                <article class="service-panel tilt-card fade-up delay-1"><span class="service-panel-num">02</span><h3>Development</h3><p>Clean code, best practices and fast iteration cycles.</p></article>
                <article class="service-panel tilt-card fade-up delay-2"><span class="service-panel-num">03</span><h3>Launch &amp; Support</h3><p>Deployment, monitoring and post-launch optimization.</p></article>
            </div>
        </section>
        <section class="web-cta">
            <div class="container">
                <div class="web-cta-card fade-up">
                    <h2>Ready to build with ${tech.name}?</h2>
                    <p>Talk to our team — free consultation and project estimate.</p>
                    <a href="contact.html" class="btn btn-white btn-large">Get Started &rarr;</a>
                </div>
            </div>
        </section>
    </main>
${footer}
${scriptsBlock()}`;
}

function buildHubPage() {
    const footer = getFooter();
    const cols = Object.entries(CATEGORIES).map(([cat, items]) => {
        const links = items.map((t) => `<a href="${t.file}">${t.name} <i class="fas fa-chevron-right" aria-hidden="true"></i></a>`).join('\n                ');
        return `<div class="tech-hub__col"><h3>${cat}</h3>${links}</div>`;
    }).join('\n            ');

    return `${headBlock('Technologies &amp; Platforms', 'NEOXWEB technology expertise — backend, frontend, mobile, cloud, CMS, databases and automation for Pakistani businesses.', 'technologies.html')}
<body class="neoxweb-site nx-advanced-page">
    <div id="navbar-container"></div>
    <main>
        <section class="section-padding" style="padding-top:clamp(5.5rem,10vw,7rem)">
            <div class="container">
                <span class="section-tag">Technologies</span>
                <h1>Our expertise spans all major <span class="text-neox-green">technologies</span></h1>
                <p class="section-desc" style="max-width:640px;margin-bottom:2rem">Backend, frontend, mobile, cloud, CMS, databases and test automation — we build with the stack that fits your product and budget.</p>
                <a href="contact.html" class="btn btn-primary btn-large" style="margin-bottom:2.5rem">All Technology Expertise <i class="fas fa-chevron-right"></i></a>
                <div class="tech-hub__grid">${cols}</div>
            </div>
        </section>
    </main>
${footer}
<style>.tech-hub__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1.75rem 2rem}.tech-hub__col h3{font-size:1rem;font-weight:700;color:#4ade80;margin:0 0 .75rem}.tech-hub__col a{display:flex;justify-content:space-between;align-items:center;color:rgba(255,255,255,.75);text-decoration:none;padding:.4rem 0;font-size:.9rem;border-bottom:1px solid rgba(255,255,255,.06)}.tech-hub__col a:hover{color:#fff}</style>
${scriptsBlock()}`;
}

ALL_TECH.forEach((tech) => {
    const out = path.join(ROOT, tech.file);
    fs.writeFileSync(out, buildTechPage(tech), 'utf8');
    console.log('created', tech.file);
});

fs.writeFileSync(path.join(ROOT, 'technologies.html'), buildHubPage(), 'utf8');
console.log('created technologies.html');
console.log('Done.', ALL_TECH.length, 'tech pages');
