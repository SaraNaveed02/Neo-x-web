/**
 * Complete NEOXWEB site: missing pages, footer fixes, SEO cleanup, encoding.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TEMPLATE = path.join(ROOT, 'product-design.html');

const NEW_PAGES = {
    'graphic-design.html': {
        title: 'Graphic Design',
        description: 'Professional graphic design, branding, logos and social creatives for businesses in Pakistan.',
        tag: 'Graphic Design',
        h1: 'Visual branding that makes your business <span class="highlight">unforgettable</span>.',
        lead: 'Logos, social creatives, brochures, and complete brand systems that help Pakistani businesses stand out online and offline.',
        image: 'portfolio-branding.jpg',
        metrics: ['Brand identity', 'Social creatives', 'Print design'],
        floats: ['Brand Kits', '+40% Recognition'],
        tech: ['Adobe Illustrator', 'Photoshop', 'Canva Pro', 'Brand Guidelines', 'Social Templates', 'Print Ready'],
        cta: 'Brand your business',
        ctaSub: 'Get a cohesive visual identity that builds trust and drives conversions.',
    },
    'social-media-marketing.html': {
        title: 'Social Media Marketing',
        description: 'Social media marketing for Instagram, Facebook, TikTok and LinkedIn — grow engagement and leads in Pakistan.',
        tag: 'Social Media Marketing',
        h1: 'Grow your audience on <span class="highlight">Instagram, Facebook &amp; TikTok</span>.',
        lead: 'Content calendars, paid social campaigns, and community management that turn followers into loyal customers.',
        image: 'social-media-new.jpg',
        metrics: ['Content strategy', 'Paid social', 'Community mgmt'],
        floats: ['Viral Reels', '+200% Engagement'],
        tech: ['Instagram', 'Facebook Ads', 'TikTok', 'LinkedIn', 'Content Calendar', 'Analytics'],
        cta: 'Grow your social presence',
        ctaSub: 'Strategies that increase followers, engagement, and qualified leads.',
    },
    'video-editing.html': {
        title: 'Video Editing',
        description: 'Professional video editing for reels, YouTube, ads and promo videos — fast turnaround in Pakistan.',
        tag: 'Video Editing',
        h1: 'Professional video editing for <span class="highlight">reels, ads &amp; YouTube</span>.',
        lead: 'Promo videos, social reels, product demos, and ad creatives edited for maximum impact on every platform.',
        image: 'portfolio-web.jpg',
        metrics: ['Reels & shorts', 'YouTube edits', 'Ad creatives'],
        floats: ['4K Export', '48h Turnaround'],
        tech: ['Premiere Pro', 'After Effects', 'CapCut Pro', 'Color Grading', 'Motion Graphics', 'Subtitles'],
        cta: 'Edit your next video',
        ctaSub: 'Polished videos that capture attention and drive action.',
    },
};

function buildServicePage(cfg, filename) {
    let html = fs.readFileSync(TEMPLATE, 'utf8');
    const slug = filename.replace('.html', '');
    html = html.replace(/Product Design/g, cfg.title);
    html = html.replace(/product-design\.html/g, filename);
    html = html.replace(
        /<title>[^<]*<\/title>/,
        `<title>${cfg.title} | NEOXWEB</title>`
    );
    html = html.replace(
        /<meta name="description" content="[^"]*">/,
        `<meta name="description" content="${cfg.description}">`
    );
    html = html.replace(
        /<meta property="og:title" content="[^"]*">/,
        `<meta property="og:title" content="${cfg.title} | NEOXWEB">`
    );
    html = html.replace(
        /<meta property="og:description" content="[^"]*">/,
        `<meta property="og:description" content="${cfg.description}">`
    );
    html = html.replace(
        /<link rel="canonical" href="[^"]*">/,
        `<link rel="canonical" href="./${filename}">`
    );
    html = html.replace(
        /<span class="section-tag">[^<]*<\/span>\s*<h1>[\s\S]*?<\/h1>/,
        `<span class="section-tag">${cfg.tag}</span>\n                    <h1>${cfg.h1}</h1>`
    );
    html = html.replace(
        /<p class="web-hero-lead">[^<]*<\/p>/,
        `<p class="web-hero-lead">${cfg.lead}</p>`
    );
    html = html.replace(/social-media-new\.jpg/g, cfg.image);
    html = html.replace(
        /<div class="web-hero-metrics">[\s\S]*?<\/div>/,
        `<div class="web-hero-metrics">${cfg.metrics.map((m) => `<div class="web-metric"><i class="fas fa-check-circle" aria-hidden="true"></i> ${m}</div>`).join('')}</div>`
    );
    html = html.replace(
        /<div class="web-hero-float-card web-hero-float-card--top">[\s\S]*?<\/div><div class="web-hero-float-card web-hero-float-card--bottom">[\s\S]*?<\/div>/,
        `<div class="web-hero-float-card web-hero-float-card--top"><i class="fas fa-star" aria-hidden="true"></i> ${cfg.floats[0]}</div><div class="web-hero-float-card web-hero-float-card--bottom"><i class="fas fa-arrow-up" aria-hidden="true"></i> ${cfg.floats[1]}</div>`
    );
    html = html.replace(
        /<section class="web-tech-strip"[\s\S]*?<\/section>/,
        `<section class="web-tech-strip" aria-label="Tools"><div class="container"><span class="label">Tools</span>${cfg.tech.map((t) => `<span class="web-tech-pill"><i class="fas fa-check" aria-hidden="true"></i> ${t}</span>`).join('')}</div></section>`
    );
    html = html.replace(
        /<h2>Design your next product<\/h2>\s*<p>[^<]*<\/p>/,
        `<h2>${cfg.cta}</h2>\n                    <p>${cfg.ctaSub}</p>`
    );
    html = html.replace(
        /<a href="product-design\.html">Social Media Marketing<\/a>/g,
        '<a href="social-media-marketing.html">Social Media Marketing</a>'
    );
    html = html.replace(
        /<a href="product-design\.html">Graphic Design<\/a>/g,
        '<a href="graphic-design.html">Graphic Design</a>'
    );
    html = html.replace(
        /<a href="contact\.html">Video Editing<\/a>/g,
        '<a href="video-editing.html">Video Editing</a>'
    );
    return html;
}

function buildPrivacyPage() {
    const footer = fs.readFileSync(path.join(ROOT, 'scripts', 'apply-footer-pro.js'), 'utf8');
    const footerMatch = footer.match(/const footerHtml = `([\s\S]*?)`;/);
    const footerHtml = footerMatch ? footerMatch[1] : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <script defer src="js/config.js"></script>
    <script defer src="js/mobile-init.js"></script>
    <meta charset="UTF-8">
    <script>(function(){var p=location.pathname||'/';var s=p.lastIndexOf('/');var b=s>=0?p.slice(0,s+1):'/';window.__NEOXWEB_BASE__=b;var e=document.createElement('base');e.id='neoxweb-base';e.href=b;var h=document.head||document.documentElement;var c=document.querySelector('meta[charset]');if(c)c.after(e);else h.insertBefore(e,h.firstChild);})();</script>
    <script src="js/perf-load.js"></script>
    <script src="js/image-fallback.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
    <title>Privacy Policy | NEOXWEB</title>
    <meta name="description" content="NEOXWEB privacy policy — how we collect, use and protect your data when you use our website and services in Pakistan.">
    <meta property="og:title" content="Privacy Policy | NEOXWEB">
    <meta property="og:description" content="NEOXWEB privacy policy — how we collect, use and protect your data.">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_PK">
    <meta property="og:site_name" content="NEOXWEB">
    <meta property="og:image" content="https://neoxweb.pages.dev/static/images/hero-bg-new.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="./privacy-policy.html">
    <meta name="theme-color" content="#0a0a0a">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/responsive.css">
    <link rel="stylesheet" href="css/navbar-pro.css">
    <link rel="stylesheet" href="css/neoxweb-theme.css">
    <link rel="stylesheet" href="css/footer-pro.css">
    <link rel="stylesheet" href="css/pages-advanced.css">
    <link rel="stylesheet" href="css/mobile-friendly.css">
    <link rel="stylesheet" href="css/mobile-app.css">
    <script defer src="js/seo.js"></script>
</head>
<body class="neoxweb-site nx-advanced-page">
    <div id="navbar-container"></div>
    <main>
        <section class="section-padding" style="padding-top:clamp(5rem,10vw,7rem)">
            <div class="container" style="max-width:760px">
                <span class="section-tag">Legal</span>
                <h1>Privacy Policy</h1>
                <p class="section-desc" style="margin-bottom:2rem">Last updated: June 2026</p>
                <div class="glass-panel" style="padding:2rem;line-height:1.75">
                    <h2>1. Information We Collect</h2>
                    <p>When you contact NEOXWEB via our website, WhatsApp, or email, we may collect your name, email, phone number, and project details you voluntarily provide.</p>
                    <h2>2. How We Use Your Information</h2>
                    <p>We use your information to respond to inquiries, provide quotes, deliver services, and improve our website experience. We do not sell your personal data.</p>
                    <h2>3. Cookies &amp; Analytics</h2>
                    <p>Our site may use cookies and analytics tools to understand traffic and improve performance. You can disable cookies in your browser settings.</p>
                    <h2>4. Data Security</h2>
                    <p>We take reasonable measures to protect your information. Contact form submissions are stored securely on our servers.</p>
                    <h2>5. Third-Party Services</h2>
                    <p>We may use trusted third-party tools (e.g. WhatsApp, email providers, hosting) to operate our business. These services have their own privacy policies.</p>
                    <h2>6. Your Rights</h2>
                    <p>You may request access, correction, or deletion of your personal data by emailing <a href="mailto:supportneoxweb@gmail.com">supportneoxweb@gmail.com</a>.</p>
                    <h2>7. Contact</h2>
                    <p>Questions about this policy? Email <a href="mailto:supportneoxweb@gmail.com">supportneoxweb@gmail.com</a> or WhatsApp <a href="https://wa.me/923084858836">+92 308 4858836</a>.</p>
                </div>
            </div>
        </section>
    </main>
${footerHtml}
    <script defer src="js/utils.js"></script>
    <script defer src="js/main.js"></script>
    <script defer src="js/navbar-embed.js"></script>
    <script defer src="js/navbar.js"></script>
    <script defer src="js/pwa.js"></script>
</body>
</html>`;
}

function fixEncoding(text) {
    return text
        .replace(/\uFFFD/g, '—')
        .replace(/Lahore, Karachi &amp; Islamabad/g, 'Pakistan')
        .replace(/Lahore, Karachi, Islamabad/g, 'Pakistan')
        .replace(/Lahore · Karachi · Islamabad · Pakistan/g, 'Pakistan')
        .replace(/Lahore, Karachi & Islamabad/g, 'Pakistan');
}

function patchAllHtml() {
    const skip = new Set(['navbar.html', 'unified-header.html', 'unified-footer.html', 'oauth-callback.html', '404.html']);
    const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html') && !skip.has(f));

    const footerFixes = [
        ['<a href="product-design.html">Social Media Marketing</a>', '<a href="social-media-marketing.html">Social Media Marketing</a>'],
        ["<a href='/product-design'>Social Media Marketing</a>", "<a href='/social-media-marketing'>Social Media Marketing</a>"],
        ['<a href="product-design.html">Graphic Design</a>', '<a href="graphic-design.html">Graphic Design</a>'],
        ["<a href='/product-design'>Graphic Design</a>", "<a href='/graphic-design'>Graphic Design</a>"],
        ['<a href="contact.html">Video Editing</a>', '<a href="video-editing.html">Video Editing</a>'],
        ["<a href='/contact'>Video Editing</a>", "<a href='/video-editing'>Video Editing</a>"],
        ["href='/product-design'>Learn More", "href='/social-media-marketing'>Learn More"],
    ];

    // Fix second product-design link on index (graphic design card) - need specific context
    let patched = 0;
    for (const file of files) {
        let html = fs.readFileSync(path.join(ROOT, file), 'utf8');
        const orig = html;
        html = fixEncoding(html);
        for (const [from, to] of footerFixes) {
            html = html.split(from).join(to);
        }
        // Index graphic design card (second product-design link)
        if (file === 'index.html') {
            html = html.replace(
                /<span class="neox-service-card__badge"><i class="fas fa-palette"><\/i> Graphic Design<\/span>[\s\S]*?href='\/product-design'/,
                (m) => m.replace("href='/product-design'", "href='/graphic-design'")
            );
            html = html.replace(
                /<span class="neox-service-card__badge"><i class="fas fa-video"><\/i> Video Editing<\/span>[\s\S]*?href='\/contact'/,
                (m) => m.replace("href='/contact'", "href='/video-editing'")
            );
        }
        if (file === 'services.html') {
            html = html.replace(
                /Social Media Marketing Pakistan[\s\S]*?href="product-design\.html"/,
                (m) => m.replace('href="product-design.html"', 'href="social-media-marketing.html"')
            );
        }
        // Add privacy link in footer bottom if missing
        if (html.includes('footer-pro__bottom') && !html.includes('privacy-policy')) {
            html = html.replace(
                /<p>&copy; 2026 NEOXWEB\. All rights reserved\.<\/p>/,
                '<p>&copy; 2026 NEOXWEB. All rights reserved. · <a href="privacy-policy.html">Privacy Policy</a></p>'
            );
        }
        if (html !== orig) {
            fs.writeFileSync(path.join(ROOT, file), html, 'utf8');
            patched++;
            console.log('patched', file);
        }
    }
    console.log(`Patched ${patched} HTML files`);
}

// Create new service pages
for (const [file, cfg] of Object.entries(NEW_PAGES)) {
    const out = path.join(ROOT, file);
    if (!fs.existsSync(out)) {
        fs.writeFileSync(out, buildServicePage(cfg, file), 'utf8');
        console.log('created', file);
    } else {
        fs.writeFileSync(out, buildServicePage(cfg, file), 'utf8');
        console.log('updated', file);
    }
}

// Privacy policy
fs.writeFileSync(path.join(ROOT, 'privacy-policy.html'), buildPrivacyPage(), 'utf8');
console.log('created privacy-policy.html');

patchAllHtml();

// Update apply-footer-pro.js footer links
const applyFooter = path.join(ROOT, 'scripts', 'apply-footer-pro.js');
let af = fs.readFileSync(applyFooter, 'utf8');
af = af.replace('<a href="product-design.html">Social Media Marketing</a>', '<a href="social-media-marketing.html">Social Media Marketing</a>');
af = af.replace('<a href="product-design.html">Graphic Design</a>', '<a href="graphic-design.html">Graphic Design</a>');
af = af.replace('<a href="contact.html">Video Editing</a>', '<a href="video-editing.html">Video Editing</a>');
af = af.replace(
    /<p>&copy; 2026 NEOXWEB\. All rights reserved\.<\/p>/,
    '<p>&copy; 2026 NEOXWEB. All rights reserved. · <a href="privacy-policy.html">Privacy Policy</a></p>'
);
fs.writeFileSync(applyFooter, af, 'utf8');
console.log('updated apply-footer-pro.js');

console.log('Done.');
