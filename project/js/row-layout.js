/**
 * NEOXWEB — Convert ALL image+text blocks to rows: text LEFT, image RIGHT
 */
(function () {
    var IMGS = [
        'assets/images/neoxweb/web-dev.jpg',
        'assets/images/neoxweb/seo-new.jpg',
        'assets/images/neoxweb/ppc.jpg',
        'assets/images/neoxweb/social-media-new.jpg',
        'assets/images/neoxweb/portfolio-branding.jpg',
        'assets/images/neoxweb/portfolio-web.jpg'
    ];

    function imgFor(i) {
        return IMGS[i % IMGS.length];
    }

    function makeMediaFromImg(img, alt) {
        var wrap = document.createElement('div');
        wrap.className = 'nx-portfolio-row__media nx-portfolio-row__media--full';
        if (img) {
            var clone = img.cloneNode(true);
            clone.removeAttribute('style');
            wrap.appendChild(clone);
        } else {
            var el = document.createElement('img');
            el.src = imgFor(0);
            el.alt = alt || '';
            el.className = 'nx-photo';
            el.loading = 'lazy';
            wrap.appendChild(el);
        }
        return wrap;
    }

    function buildRow(copyNodes, mediaEl) {
        var row = document.createElement('article');
        row.className = 'nx-portfolio-row nx-service-row nx-auto-row';
        var copy = document.createElement('div');
        copy.className = 'nx-portfolio-row__copy';
        copyNodes.forEach(function (n) {
            if (n) copy.appendChild(n);
        });
        row.appendChild(copy);
        row.appendChild(mediaEl);
        return row;
    }

    function reorderExistingRow(row) {
        if (!row || row.dataset.nxRowFixed) return;
        var copy = row.querySelector('.nx-portfolio-row__copy, .nx-pro-split__body');
        var media = row.querySelector('.nx-portfolio-row__media, .nx-pro-split__media, .nx-team-card__img');
        if (copy && media && row.firstElementChild !== copy) {
            row.appendChild(copy);
            row.appendChild(media);
        }
        row.dataset.nxRowFixed = '1';
    }

    function serviceCardToRow(card, i) {
        if (card.classList.contains('nx-portfolio-row')) return null;
        var body = card.querySelector('.neox-service-card__body');
        var mediaBlock = card.querySelector('.neox-service-card__media');
        if (!body) return null;

        var copy = document.createElement('div');
        copy.className = 'nx-portfolio-row__copy';
        var badge = card.querySelector('.neox-service-card__badge');
        if (badge) {
            var tag = document.createElement('span');
            tag.className = 'ui-cs-card__tag ui-cs-card__tag--inline';
            tag.innerHTML = badge.innerHTML;
            copy.appendChild(tag);
        }
        body.querySelectorAll('h3, p, a').forEach(function (n) {
            copy.appendChild(n.cloneNode(true));
        });

        var img = mediaBlock && mediaBlock.querySelector('img');
        var alt = copy.querySelector('h3') ? copy.querySelector('h3').textContent : '';
        var row = document.createElement('article');
        row.className = 'nx-portfolio-row nx-service-row nx-auto-row';
        row.appendChild(copy);
        row.appendChild(makeMediaFromImg(img, alt || imgFor(i)));
        return row;
    }

    function convertServiceCardsGrid(container) {
        if (container.classList.contains('nx-service-rows')) return;
        var cards = Array.from(container.querySelectorAll(':scope > .neox-service-card'));
        if (!cards.length) return;
        var wrap = document.createElement('div');
        wrap.className = 'nx-service-rows nx-portfolio-showcase';
        cards.forEach(function (card, i) {
            var row = serviceCardToRow(card, i);
            if (row) wrap.appendChild(row);
        });
        if (wrap.children.length) container.replaceWith(wrap);
    }

    function showcaseToRow(fig, i) {
        if (fig.classList.contains('nx-portfolio-row')) return null;
        var cap = fig.querySelector('figcaption');
        var imgWrap = fig.querySelector('.svc-showcase-card__img');
        if (!cap) return null;
        var copy = document.createElement('div');
        copy.className = 'nx-portfolio-row__copy';
        cap.querySelectorAll('h3, p').forEach(function (n) {
            copy.appendChild(n.cloneNode(true));
        });
        var img = imgWrap && imgWrap.querySelector('img');
        var row = document.createElement('article');
        row.className = 'nx-portfolio-row nx-service-row nx-auto-row';
        row.appendChild(copy);
        row.appendChild(makeMediaFromImg(img, copy.textContent || imgFor(i)));
        return row;
    }

    function convertShowcase(grid) {
        var items = Array.from(grid.querySelectorAll(':scope > .svc-showcase-card'));
        if (!items.length) return;
        var wrap = document.createElement('div');
        wrap.className = 'nx-portfolio-showcase';
        items.forEach(function (fig, i) {
            var row = showcaseToRow(fig, i);
            if (row) wrap.appendChild(row);
        });
        if (wrap.children.length) grid.replaceWith(wrap);
    }

    function panelToRow(panel, i) {
        var h3 = panel.querySelector('h3');
        var p = panel.querySelector('p');
        if (!h3 || !p) return null;
        var copy = document.createElement('div');
        copy.className = 'nx-portfolio-row__copy';
        copy.appendChild(h3.cloneNode(true));
        copy.appendChild(p.cloneNode(true));
        panel.querySelectorAll('.list-bullet').forEach(function (lb) {
            copy.appendChild(lb.cloneNode(true));
        });
        var iconImg = panel.querySelector('.service-panel-icon img');
        var media;
        if (iconImg) {
            var full = document.createElement('img');
            full.src = imgFor(i);
            full.alt = h3.textContent;
            full.className = 'nx-photo';
            full.loading = 'lazy';
            media = makeMediaFromImg(full, h3.textContent);
        } else {
            media = makeMediaFromImg(null, h3.textContent);
            var img = media.querySelector('img');
            if (img) img.src = imgFor(i);
        }
        var row = document.createElement('article');
        row.className = 'nx-portfolio-row nx-service-row nx-auto-row';
        row.appendChild(copy);
        row.appendChild(media);
        return row;
    }

    function fixSvcBannerHero() {
        /* svc-banner-hero upgraded by hero-premium.js */
    }
    function fixWebHero() {
        document.querySelectorAll('.web-hero-grid').forEach(function (grid) {
            var copy = grid.querySelector('.web-hero-copy');
            var visual = grid.querySelector('.web-hero-visual');
            if (copy && visual && grid.firstElementChild !== copy) {
                grid.appendChild(copy);
                grid.appendChild(visual);
            }
        });
    }

    function fixPageHero() {
        /* Handled by hero-premium.js — same bg + particles as home */
    }

    function convertSlide(slide, i) {
        if (slide.classList.contains('nx-portfolio-row')) return;
        var p = slide.querySelector(':scope > p');
        var author = slide.querySelector('.testimonial-author');
        if (!p) return;
        var icon = slide.querySelector('.testimonial-brand-icon');
        if (icon) icon.remove();
        p.classList.add('nx-quote');
        var copy = document.createElement('div');
        copy.className = 'nx-portfolio-row__copy';
        copy.appendChild(p);
        if (author) copy.appendChild(author);
        var alt = author && author.querySelector('span') ? author.querySelector('span').textContent : 'Client';
        var media = makeMediaFromImg(null, alt);
        var img = media.querySelector('img');
        if (img) img.src = imgFor(i);
        var row = document.createElement('article');
        row.className = 'nx-portfolio-row nx-service-row nx-auto-row';
        row.appendChild(copy);
        row.appendChild(media);
        slide.replaceWith(row);
    }

    function fixTeamCards() {
        document.querySelectorAll('.nx-team-card').forEach(function (card) {
            var body = card.querySelector('.nx-team-card__body');
            var img = card.querySelector('.nx-team-card__img');
            if (body && img && card.firstElementChild !== body) {
                card.insertBefore(body, img);
            }
        });
    }

    function buildImageStrips() {
        document.querySelectorAll('.nx-service-rows, .nx-portfolio-showcase, .nx-team-grid').forEach(function (container) {
            if (container.dataset.nxStripBuilt || container.querySelector('.nx-img-strip')) return;
            if (container.closest('.contact-hero-row, .hero-section, .nx-page-hero, .contact-page-hero')) return;

            var rows = Array.from(container.querySelectorAll(
                ':scope > .nx-portfolio-row, :scope > .nx-service-row, :scope > .nx-auto-row, :scope > .nx-team-card'
            ));
            if (rows.length < 2) return;

            var wrap = document.createElement('div');
            wrap.className = 'nx-img-strip-wrap';
            wrap.dataset.nxStripBuilt = '1';

            for (var i = 0; i < rows.length; i += 4) {
                var chunk = rows.slice(i, i + 4);
                var strip = document.createElement('div');
                strip.className = 'nx-img-strip';
                chunk.forEach(function (row) {
                    var card = document.createElement('article');
                    card.className = 'nx-img-strip__card';
                    var media = row.querySelector('.nx-portfolio-row__media, .nx-pro-split__media, .nx-team-card__img');
                    var copy = row.querySelector('.nx-portfolio-row__copy, .nx-pro-split__body, .nx-team-card__body');
                    if (media) {
                        var m = document.createElement('div');
                        m.className = 'nx-img-strip__media';
                        var img = media.querySelector('img');
                        if (img) m.appendChild(img.cloneNode(true));
                        card.appendChild(m);
                    }
                    if (copy) {
                        var b = document.createElement('div');
                        b.className = 'nx-img-strip__body';
                        Array.from(copy.childNodes).forEach(function (n) {
                            b.appendChild(n.cloneNode(true));
                        });
                        card.appendChild(b);
                    }
                    strip.appendChild(card);
                });
                wrap.appendChild(strip);
            }

            container.replaceWith(wrap);
        });
    }

    function run() {
        document.querySelectorAll('.neox-service-cards').forEach(convertServiceCardsGrid);
        document.querySelectorAll('.svc-showcase-grid').forEach(convertShowcase);
        document.querySelectorAll('.service-grid').forEach(function (grid) {
            var items = Array.from(grid.querySelectorAll(':scope > .service-panel'));
            if (!items.length) return;
            var wrap = document.createElement('div');
            wrap.className = 'nx-portfolio-showcase';
            items.forEach(function (p, i) {
                var row = panelToRow(p, i);
                if (row) wrap.appendChild(row);
            });
            if (wrap.children.length) grid.replaceWith(wrap);
        });
        document.querySelectorAll('.web-cases').forEach(function (grid) {
            var items = Array.from(grid.querySelectorAll(':scope > .web-case-card'));
            if (!items.length) return;
            var wrap = document.createElement('div');
            wrap.className = 'nx-portfolio-showcase';
            items.forEach(function (card, i) {
                var h3 = card.querySelector('h3');
                var p = card.querySelector('p');
                if (!h3 || !p) return;
                var copy = document.createElement('div');
                copy.className = 'nx-portfolio-row__copy';
                var badge = card.querySelector('.web-case-badge');
                if (badge) {
                    var tag = document.createElement('span');
                    tag.className = 'ui-cs-card__tag ui-cs-card__tag--inline';
                    tag.textContent = badge.textContent;
                    copy.appendChild(tag);
                }
                copy.appendChild(h3.cloneNode(true));
                copy.appendChild(p.cloneNode(true));
                var media = makeMediaFromImg(null, h3.textContent);
                var caseImg = media.querySelector('img');
                if (caseImg) caseImg.src = imgFor(i);
                var row = document.createElement('article');
                row.className = 'nx-portfolio-row nx-service-row nx-auto-row';
                row.appendChild(copy);
                row.appendChild(media);
                wrap.appendChild(row);
            });
            if (wrap.children.length) grid.replaceWith(wrap);
        });
        document.querySelectorAll('.testimonial-slider > .slide').forEach(function (el, i) {
            convertSlide(el, i);
        });
        document.querySelectorAll('.nx-portfolio-row, .nx-pro-split, .contact-hero-row').forEach(reorderExistingRow);
        fixTeamCards();
        fixWebHero();
        fixSvcBannerHero();
        fixPageHero();
        buildImageStrips();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
        run();
    }
})();
