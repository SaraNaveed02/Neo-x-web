/**
 * Download original NEOXWEB photo assets (JPG/PNG) from CDN
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = path.join(__dirname, '..', 'assets', 'images', 'neoxweb');
const base = 'https://neoxweb.pages.dev/static/images/';

const files = [
    'web-dev.jpg',
    'seo-new.jpg',
    'ppc.jpg',
    'social-media-new.jpg',
    'portfolio-branding.jpg',
    'portfolio-web.jpg',
    'portfolio-seo.jpg',
    'portfolio-ppc.jpg',
    'hero-bg-new.jpg',
    'hero-tech-bg.png',
    'logo.png'
];

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function download(url, dest) {
    return new Promise((resolve) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                file.close();
                try { fs.unlinkSync(dest); } catch (_) {}
                return download(res.headers.location, dest).then(resolve);
            }
            if (res.statusCode !== 200) {
                file.close();
                try { fs.unlinkSync(dest); } catch (_) {}
                console.warn('FAIL', path.basename(dest), res.statusCode);
                resolve(false);
                return;
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log('OK', path.basename(dest));
                resolve(true);
            });
        }).on('error', (e) => {
            file.close();
            console.warn('ERR', path.basename(dest), e.message);
            resolve(false);
        });
    });
}

(async () => {
    for (const f of files) {
        await download(base + f, path.join(outDir, f));
    }
    const markSrc = path.join(outDir, 'logo-nx-mark.jpg');
    const logoPng = path.join(outDir, 'logo.png');
    if (!fs.existsSync(markSrc) && fs.existsSync(logoPng)) {
        fs.copyFileSync(logoPng, markSrc);
        console.log('OK logo-nx-mark.jpg (from logo.png)');
    }
    console.log('Done');
})();
