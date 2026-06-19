/**
 * Unified-style site interactions (nav, tabs, animations, contact)
 */
(function (global) {
    'use strict';

    let navBound = false;

    function initTechTabs() {
        document.querySelectorAll('.ui-tech-tabs').forEach((wrap) => {
            const tabs = wrap.querySelectorAll('.ui-tech-tab');
            const panels = wrap.parentElement.querySelectorAll('.ui-tech-panel');
            tabs.forEach((tab, i) => {
                tab.addEventListener('click', () => {
                    tabs.forEach((t) => t.classList.remove('active'));
                    panels.forEach((p) => p.classList.remove('active'));
                    tab.classList.add('active');
                    if (panels[i]) panels[i].classList.add('active');
                });
            });
            if (tabs[0]) tabs[0].classList.add('active');
            if (panels[0]) panels[0].classList.add('active');
        });
    }

    function initIndustryTabs() {
        document.querySelectorAll('.ui-industry-tabs').forEach((wrap) => {
            const tabs = wrap.querySelectorAll('.ui-industry-tab');
            const panels = wrap.parentElement.querySelectorAll('.ui-industry-panel');
            tabs.forEach((tab, i) => {
                tab.addEventListener('click', () => {
                    tabs.forEach((t) => t.classList.remove('active'));
                    panels.forEach((p) => p.classList.remove('active'));
                    tab.classList.add('active');
                    if (panels[i]) panels[i].classList.add('active');
                });
            });
            if (tabs[0]) tabs[0].classList.add('active');
            if (panels[0]) panels[0].classList.add('active');
        });
    }

    function initScrollAnimations() {
        const fadeEls = document.querySelectorAll('.ui-fade-up');
        if (fadeEls.length && 'IntersectionObserver' in window) {
            const obs = new IntersectionObserver(
                (entries) => {
                    entries.forEach((en) => {
                        if (en.isIntersecting) {
                            en.target.classList.add('visible');
                            obs.unobserve(en.target);
                        }
                    });
                },
                { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
            );
            fadeEls.forEach((el) => obs.observe(el));
        } else {
            fadeEls.forEach((el) => el.classList.add('visible'));
        }
    }

    function initContactForm() {
        const contactForm = document.getElementById('uiContactForm');
        if (!contactForm) return;

        const msgField = contactForm.querySelector('#cMessage, textarea[name="message"]');
        const charCount = document.getElementById('uiCharCount');
        if (msgField && charCount) {
            const updateCount = () => {
                charCount.textContent = `${msgField.value.length}/750 characters`;
            };
            msgField.addEventListener('input', updateCount);
            updateCount();
        }

        if (typeof NexuraAPI !== 'undefined') {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const captcha = contactForm.querySelector('#uiCaptcha');
                if (captcha && captcha.value.trim() !== '6') {
                    captcha.setCustomValidity('Incorrect answer');
                    captcha.reportValidity();
                    return;
                }
                if (captcha) captcha.setCustomValidity('');
                const btn = contactForm.querySelector('button[type="submit"]');
                const orig = btn.textContent;
                btn.disabled = true;
                btn.textContent = 'Sending...';
                try {
                    await NexuraAPI.post('messages/create.php', {
                        name: contactForm.name.value.trim(),
                        email: contactForm.email.value.trim(),
                        phone: contactForm.phone?.value?.trim() || '',
                        message: contactForm.message.value.trim()
                    });
                    btn.textContent = 'Message Sent!';
                    contactForm.reset();
                    if (charCount) charCount.textContent = '0/750 characters';
                    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
                } catch (err) {
                    btn.textContent = err.message || 'Failed — try again';
                    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
                }
            });
        } else {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const captcha = contactForm.querySelector('#uiCaptcha');
                if (captcha && captcha.value.trim() !== '6') {
                    captcha.setCustomValidity('Incorrect answer');
                    captcha.reportValidity();
                    return;
                }
                if (captcha) captcha.setCustomValidity('');
                const btn = contactForm.querySelector('button[type="submit"]');
                const orig = btn.textContent;
                btn.textContent = 'Submit';
                btn.disabled = true;
                setTimeout(() => {
                    btn.textContent = orig;
                    btn.disabled = false;
                    contactForm.reset();
                    if (charCount) charCount.textContent = '0/750 characters';
                }, 1500);
            });
        }
    }

    function initUnifiedNav() {
        if (!document.querySelector('.ui-nav')) return;
        if (navBound) return;
        navBound = true;

        document.querySelectorAll('.ui-nav > li[data-menu]').forEach((item) => {
            const trigger = item.querySelector('button.ui-nav-link, > a');
            if (!trigger) return;

            trigger.addEventListener('click', (e) => {
                if (global.innerWidth <= 1100) return;
                const hasPanel = item.querySelector('.ui-mega, .ui-dropdown');
                if (!hasPanel) return;
                e.preventDefault();
                const wasOpen = item.classList.contains('open');
                document.querySelectorAll('.ui-nav > li.open').forEach((el) => el.classList.remove('open'));
                if (!wasOpen) item.classList.add('open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.ui-nav > li[data-menu]')) {
                document.querySelectorAll('.ui-nav > li.open').forEach((el) => el.classList.remove('open'));
            }
        });

        const hamburger = document.getElementById('uiHamburger');
        const mobileNav = document.getElementById('uiMobileNav');
        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', () => {
                const open = mobileNav.classList.toggle('open');
                hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            mobileNav.querySelectorAll('a').forEach((a) => {
                a.addEventListener('click', () => mobileNav.classList.remove('open'));
            });
        }

        initTechTabs();
        initIndustryTabs();
        initScrollAnimations();
        initContactForm();
    }

    global.initUnifiedNav = initUnifiedNav;
    global.initUnifiedNav.__reset = function () { navBound = false; };
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('uiHeader')) initUnifiedNav();
    });
})(window);
