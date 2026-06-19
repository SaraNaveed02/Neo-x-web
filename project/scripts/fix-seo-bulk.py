#!/usr/bin/env python3
"""Bulk SEO fixes for NEOXWEB HTML pages."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
SITE_URL = 'https://neoxweb.netlify.app'
OG_IMAGE = f'{SITE_URL}/assets/images/neoxweb/hero-bg-new.jpg'

LINK_FIXES = [
    # Marketing cards — SEO/PPC must match destination pages
    (r'href="data-analytics\.html">Learn More', 'href="case-study-seo.html">Learn More'),
    (r'href="ecommerce-strategy\.html">Learn More', 'href="case-study-ppc.html">Learn More'),
    # Portfolio / project cards
    (r"class='project-card' href=\"data-analytics\.html\"", "class='project-card' href=\"case-study-seo.html\""),
    (r'class="project-card" href="data-analytics\.html"', 'class="project-card" href="case-study-seo.html"'),
    (r"class='project-card' href=\"ecommerce-strategy\.html\"", "class='project-card' href=\"case-study-ppc.html\""),
    (r'class="project-card" href="ecommerce-strategy\.html"', 'class="project-card" href="case-study-ppc.html"'),
    # Footer service links — labels match pages
    (r'>E-Commerce &amp; PPC <i', '>E-Commerce Strategy <i'),
    (r'href="data-analytics\.html">SEO &amp; Growth', 'href="case-study-seo.html">SEO Services'),
    # Navbar mega menu SEO/PPC items
    (r'href="data-analytics\.html">SEO &amp; Growth Analytics', 'href="case-study-seo.html">SEO &amp; Growth'),
    (r'href="data-analytics\.html">SEO &amp; Digital Growth', 'href="case-study-seo.html">SEO &amp; Digital Growth'),
    (r'href="ecommerce-strategy\.html">E-Commerce Strategy &amp; PPC', 'href="case-study-ppc.html">PPC Advertising'),
    # Placeholder social — remove broken root profile links
    (r'href="https://www\.facebook\.com/"', 'href="https://wa.me/923084858836"'),
    (r'href="https://www\.instagram\.com/"', 'href="mailto:supportneoxweb@gmail.com"'),
    (r'aria-label="Facebook"', 'aria-label="WhatsApp"'),
    (r'aria-label="Instagram"', 'aria-label="Email"'),
    (r'fab fa-facebook-f', 'fab fa-whatsapp'),
    (r'fab fa-instagram', 'fas fa-envelope'),
]

SKIP = {'content', 'node_modules', '.git'}


def page_canonical(name: str) -> str:
    if name == 'index.html':
        return './index.html'
    return f'./{name}'


def fix_file(path: Path) -> list[str]:
    text = path.read_text(encoding='utf-8')
    original = text
    changes = []

    name = path.name
    if name == '404.html':
        text = re.sub(r'\s*<link rel="canonical"[^>]*>\s*', '\n', text)
        text = re.sub(r'\s*<script defer src="js/seo\.js"></script>\s*', '\n', text)
        if text != original:
            changes.append('404 cleanup')
    else:
        # Fix broken canonical ./
        if 'rel="canonical" href="./"' in text or "rel='canonical' href='./'" in text:
            canon = page_canonical(name)
            text = text.replace('rel="canonical" href="./"', f'rel="canonical" href="{canon}"')
            changes.append(f'canonical -> {canon}')

        if 'name="neoxweb-site-url"' not in text and '<head>' in text:
            text = text.replace(
                '<head>',
                f'<head>\n    <meta name="neoxweb-site-url" content="{SITE_URL}">',
                1
            )
            changes.append('site-url meta')

        # Absolute og:image in static HTML for crawlers
        text = re.sub(
            r'(<meta property="og:image" content=")assets/images/neoxweb/hero-bg-new\.jpg(")',
            rf'\1{OG_IMAGE}\2',
            text
        )
        text = re.sub(
            r'(<meta name="twitter:image" content=")assets/images/neoxweb/hero-bg-new\.jpg(")',
            rf'\1{OG_IMAGE}\2',
            text
        )

        for pattern, repl in LINK_FIXES:
            new_text = re.sub(pattern, repl, text)
            if new_text != text:
                changes.append(f'link: {pattern[:40]}')
                text = new_text

        # Remove duplicate home-pro.css (keep first stylesheet link only)
        if name == 'index.html':
            seen = 0
            lines = text.splitlines()
            out = []
            for line in lines:
                if 'href="css/home-pro.css"' in line and 'stylesheet' in line:
                    seen += 1
                    if seen > 1 and 'preload' not in line:
                        continue
                out.append(line)
            text = '\n'.join(out)
            if seen > 1:
                changes.append('dedupe home-pro.css')

    if text != original:
        path.write_text(text, encoding='utf-8')
    return changes


def main():
    total = 0
    for path in sorted(ROOT.glob('*.html')):
        fixes = fix_file(path)
        if fixes:
            print(f'{path.name}: {", ".join(fixes)}')
            total += 1
    # navbar embed
    embed = ROOT / 'js' / 'navbar-embed.js'
    if embed.exists():
        text = embed.read_text(encoding='utf-8')
        original = text
        for pattern, repl in LINK_FIXES:
            text = re.sub(pattern, repl, text)
        if text != original:
            embed.write_text(text, encoding='utf-8')
            print('navbar-embed.js: link fixes')
            total += 1
    print(f'Done — {total} files updated')


if __name__ == '__main__':
    main()
