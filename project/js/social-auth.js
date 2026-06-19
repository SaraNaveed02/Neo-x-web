/**
 * Social auth — Google, Facebook, Instagram, GitHub (database + config)
 */
(function () {
    let config = { providers: {} };

    function apiBase() {
        return window.NexuraAPI?.baseUrl || window.NexuraConfig?.apiBase || '';
    }

    function setLoading(btn, loading) {
        if (!btn) return;
        btn.classList.toggle('is-loading', loading);
        btn.disabled = loading;
    }

    function finishLogin(result) {
        const data = result.data || {};
        const user = data.user || data;
        if (data.token && window.NexuraAPI) {
            NexuraAPI.setToken(data.token);
        }
        setStorage('nexuraSession', {
            email: user.email,
            name: user.name,
            role: user.is_admin ? 'admin' : (user.role || 'user'),
            avatar_url: user.avatar_url || '',
            auth_provider: data.provider || user.auth_provider || 'email',
            lastActive: Date.now()
        });
        window.location.replace(window.location.href.replace(/[^/]*$/, 'index.html'));
    }

    function socialLogin(provider, body) {
        return fetch(`${apiBase()}/auth/social-login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ provider, ...body })
        }).then(r => r.json());
    }

    function showAuthToast(msg, type = 'error') {
        let el = document.getElementById('authSocialToast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'authSocialToast';
            el.className = 'auth-social-toast';
            document.body.appendChild(el);
        }
        el.innerHTML = msg;
        el.className = `auth-social-toast auth-social-toast--${type} auth-social-toast--show`;
        setTimeout(() => el.classList.remove('auth-social-toast--show'), 6000);
    }

    function notConfigured(name) {
        showAuthToast(
            `<strong>${name}</strong> keys missing.<br>
            <small>Add in <code>backend/config/social-config.local.php</code><br>
            OR Admin → <a href="/time/backend/admin/oauth.php" style="color:#4ade80">OAuth Settings</a></small>`,
            'info'
        );
    }

    function oauthState() {
        const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem('oauth_state', state);
        return state;
    }

    function markProviderButtons() {
        const map = {
            btnGoogleCustom: 'google',
            btnFacebook: 'facebook',
            btnInstagram: 'instagram',
            btnGithub: 'github',
            btnGoogleSignup: 'google',
            btnFacebookSignup: 'facebook',
            btnInstagramSignup: 'instagram',
            btnGithubSignup: 'github'
        };
        Object.entries(map).forEach(([id, key]) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const ready = config.providers?.[key];
            btn.classList.toggle('auth-social-btn--ready', !!ready);
            btn.classList.toggle('auth-social-btn--disabled', !ready);
            if (!ready) {
                btn.setAttribute('title', 'OAuth keys add karein — social-config.local.php');
            } else {
                btn.removeAttribute('title');
            }
        });
    }

    window.loginWithFacebook = function () {
        if (!config.facebook_app_id) return notConfigured('Facebook');
        const state = oauthState();
        sessionStorage.setItem('oauth_provider', 'facebook');
        const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${encodeURIComponent(config.facebook_app_id)}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&scope=email,public_profile&response_type=code&state=${state}`;
        window.location.href = url;
    };

    window.loginWithInstagram = function () {
        if (!config.instagram_app_id) return notConfigured('Instagram');
        const state = oauthState();
        sessionStorage.setItem('oauth_provider', 'instagram');
        const url = `https://api.instagram.com/oauth/authorize?client_id=${encodeURIComponent(config.instagram_app_id)}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&scope=user_profile&response_type=code&state=${state}`;
        window.location.href = url;
    };

    window.loginWithGithub = function () {
        if (!config.github_client_id) return notConfigured('GitHub');
        const state = oauthState();
        sessionStorage.setItem('oauth_provider', 'github');
        const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(config.github_client_id)}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&scope=user:email&state=${state}`;
        const w = 520, h = 680;
        const left = (screen.width - w) / 2;
        const top = (screen.height - h) / 2;
        window.open(url, 'github_oauth', `width=${w},height=${h},left=${left},top=${top}`);
    };

    window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) return;
        const data = event.data || {};
        if (data.type !== 'nexura_oauth') return;
        if (data.error) return showAuthToast(data.error);
        socialLogin(data.provider || 'github', { code: data.code })
            .then(r => r.success ? finishLogin(r) : showAuthToast(r.error || 'Login failed'))
            .catch(() => showAuthToast('Server error — XAMPP MySQL check karein'));
    });

    function bindButtons() {
        const pairs = [
            ['btnFacebook', loginWithFacebook],
            ['btnFacebookSignup', loginWithFacebook],
            ['btnInstagram', loginWithInstagram],
            ['btnInstagramSignup', loginWithInstagram],
            ['btnGithub', loginWithGithub],
            ['btnGithubSignup', loginWithGithub]
        ];
        pairs.forEach(([id, fn]) => document.getElementById(id)?.addEventListener('click', fn));
        document.getElementById('btnGoogleSignup')?.addEventListener('click', () => {
            document.getElementById('btnGoogleCustom')?.click();
        });
    }

    async function init() {
        try {
            const res = await fetch(`${apiBase()}/auth/social-config-public.php`);
            const json = await res.json();
            config = json.data || {};
        } catch {
            config = {};
        }
        if (config.google_client_id) {
            window.__nexuraGoogleClientId = config.google_client_id;
        }
        markProviderButtons();
        bindButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
