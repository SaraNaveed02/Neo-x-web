/**
 * Generate sitemap.xml with absolute URLs (Netlify: URL env auto-set at build).
 * Manual: node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const base = (process.env.URL || process.env.DEPLOY_PRIME_URL || '').replace(/\/$/, '');

const pages = [
    { loc: '', changefreq: 'weekly', priority: '1.0' },
    { loc: 'services.html', changefreq: 'weekly', priority: '0.9' },
    { loc: 'web.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'development.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'mobile.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'data-analytics.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'ecommerce-strategy.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'product-design.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'graphic-design.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'social-media-marketing.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'video-editing.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'privacy-policy.html', changefreq: 'yearly', priority: '0.4' },
    { loc: 'software-engineering.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'testing-qa.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'cloud.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'saas-platforms.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'application-modernization.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'it-consulting.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'technologies.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'ai.html', changefreq: 'monthly', priority: '0.85' },
    { loc: 'tech-nodejs.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-laravel.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-python.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-javascript.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-angular.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-react.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-vue.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-react-native.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-ios.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-android.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-flutter.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-aws.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-azure.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-wordpress.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-drupal.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-woocommerce.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-mongodb.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-mysql.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'tech-playwright.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'portfolio.html', changefreq: 'weekly', priority: '0.9' },
    { loc: 'case-study.html', changefreq: 'monthly', priority: '0.8' },
    { loc: 'case-study-seo.html', changefreq: 'monthly', priority: '0.8' },
    { loc: 'case-study-ppc.html', changefreq: 'monthly', priority: '0.8' },
    { loc: 'studies.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'resources.html', changefreq: 'weekly', priority: '0.85' },
    { loc: 'industry.html', changefreq: 'monthly', priority: '0.8' },
    { loc: 'about.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'team.html', changefreq: 'monthly', priority: '0.75' },
    { loc: 'contact.html', changefreq: 'monthly', priority: '0.9' },
    { loc: 'blog.html', changefreq: 'weekly', priority: '0.7' }
];

function locUrl(page) {
    if (!base) return page.loc || 'index.html';
    return page.loc ? `${base}/${page.loc}` : `${base}/`;
}

const urls = pages.map((p) =>
    `  <url><loc>${locUrl(p)}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`
).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), xml, 'utf8');
console.log(base ? `sitemap.xml → ${base}` : 'sitemap.xml updated (relative loc — set URL env on Netlify build for absolute URLs)');
