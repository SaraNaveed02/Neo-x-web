/**
 * NEOXWEB navbar — Login modal only
 */
(function () {
    let initialized = false;

    function isDesktopNav() {
        return window.matchMedia('(min-width: 901px)').matches;
    }

    function getEls() {
        return {
            backdrop: document.getElementById('navModalBackdrop'),
            loginModal: document.getElementById('loginModal')
        };
    }

    function openModal(modal, backdrop) {
        backdrop.classList.add('active');
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('nav-modal-open');
    }

    function closeAllModals() {
        const { backdrop, loginModal } = getEls();
        if (!backdrop) return;
        backdrop.classList.remove('active');
        loginModal?.classList.remove('active');
        loginModal?.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nav-modal-open');
    }

    function openLoginModal() {
        if (!isDesktopNav()) {
            window.location.href = 'login.html';
            return;
        }
        const { backdrop, loginModal } = getEls();
        if (!backdrop || !loginModal) return;
        openModal(loginModal, backdrop);
    }

    function bindModalEvents() {
        if (initialized) return;
        const { backdrop, loginModal } = getEls();
        if (!backdrop || !loginModal) return;
        initialized = true;

        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-open-login-modal]')) {
                e.preventDefault();
                openLoginModal();
            }
            if (e.target.closest('[data-close-nav-modal]')) {
                e.preventDefault();
                closeAllModals();
            }
        });

        backdrop.addEventListener('click', closeAllModals);

        document.getElementById('navLoginForm')?.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const email = document.getElementById('loginEmail')?.value.trim();
            const pwd = document.getElementById('loginPassword')?.value.trim();
            if (!email || !pwd) return;
            try {
                localStorage.setItem('nexuraSession', JSON.stringify({ name: email.split('@')[0], email }));
            } catch (_) { /* ignore */ }
            closeAllModals();
            if (typeof renderNavbarAuth === 'function') renderNavbarAuth();
            window.location.href = 'profile.html';
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const { loginModal } = getEls();
        if (loginModal?.classList.contains('active')) closeAllModals();
    });

    window.initNxNavModals = function initNxNavModals() {
        bindModalEvents();
    };

    window.NxNavModals = { openLoginModal, closeAllModals };
})();
