/*
    FILE: google-auth.js
    PURPOSE: Google Sign-In — instant, no hang (visible GSI button)
*/

const GOOGLE_CLIENT_FALLBACK = '99201620546-16nvbeh9uspnr8117m1ijeqj5up3e4kg.apps.googleusercontent.com';

function redirectAfterLogin() {
    const home = window.location.href.replace(/[^/]*$/, 'index.html');
    window.location.replace(home);
}

function getGoogleApiUrl() {
    const base = window.NexuraAPI?.baseUrl || window.NexuraConfig?.apiBase || '';
    return `${base}/auth/google-login.php`;
}

function showAuthMessage(msg, type = 'error') {
    let el = document.getElementById('authGoogleToast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'authGoogleToast';
        el.className = 'auth-google-toast';
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = `auth-google-toast auth-google-toast--${type} auth-google-toast--show`;
    clearTimeout(showAuthMessage._t);
    showAuthMessage._t = setTimeout(() => el.classList.remove('auth-google-toast--show'), 5000);
}

function setGoogleLoading(loading) {
    document.body.classList.toggle('auth-google-loading', loading);
    document.querySelectorAll('.google-signin-slot').forEach(slot => {
        slot.classList.toggle('is-busy', loading);
    });
}

function handleCredentialResponse(response) {
    if (!response?.credential) {
        showAuthMessage('Google sign-in cancelled.');
        return;
    }

    setGoogleLoading(true);

    fetch(getGoogleApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: response.credential })
    })
        .then(res => res.json())
        .then(result => {
            if (!result.success) {
                setGoogleLoading(false);
                showAuthMessage(result.error || 'Google login failed.');
                return;
            }

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
                auth_provider: 'google',
                lastActive: Date.now()
            });

            showAuthMessage('Welcome! Redirecting...', 'success');
            redirectAfterLogin();
        })
        .catch(() => {
            setGoogleLoading(false);
            showAuthMessage('Server error — XAMPP MySQL ON karein aur setup.php chalayein.');
        });
}

function showOriginSetupHelp() {
    const origin = window.location.origin;
    let box = document.getElementById('googleOriginHelp');
    if (!box) {
        box = document.createElement('div');
        box.id = 'googleOriginHelp';
        box.className = 'auth-origin-help';
        box.innerHTML =
            '<p><strong>Google Login fix:</strong> Google Cloud Console → APIs &amp; Services → Credentials → OAuth client → <em>Authorized JavaScript origins</em> — yeh URL add karein:</p>' +
            '<code id="googleOriginCode"></code>' +
            '<p class="auth-origin-hint">Save ke baad 5 minute wait karein, phir page refresh.</p>';
        const slot = document.querySelector('.auth-google-block');
        if (slot) slot.appendChild(box);
        else document.body.appendChild(box);
    }
    const code = document.getElementById('googleOriginCode');
    if (code) code.textContent = origin;
    box.hidden = false;
}

function handleGoogleError(err) {
    const msg = String(err?.message || err?.type || err || '').toLowerCase();
    if (msg.includes('origin') || msg.includes('mismatch') || msg.includes('403')) {
        showOriginSetupHelp();
        showAuthMessage('Google origin mismatch — neeche wala URL Console mein add karein.', 'error');
        return;
    }
    showAuthMessage('Google sign-in error — dubara try karein.', 'error');
}

function renderGoogleButtons(clientId, options = {}) {
    if (!window.google?.accounts?.id) {
        return false;
    }

    const context = options.context || 'signin';
    const selector = options.selector || '.google-signin-slot';

    google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        error_callback: handleGoogleError,
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: 'popup',
        context,
        itp_support: true
    });

    document.querySelectorAll(selector).forEach(slot => {
        if (slot.dataset.rendered === '1' && !options.force) return;

        const isSignup = slot.id === 'googleBtnSignup' || context === 'signup';
        const width = Math.min(slot.offsetWidth || 360, 400);

        slot.innerHTML = '';
        google.accounts.id.renderButton(slot, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: isSignup ? 'signup_with' : 'continue_with',
            shape: 'pill',
            width: width,
            logo_alignment: 'left'
        });
        slot.dataset.rendered = '1';
    });

    document.querySelectorAll(selector).forEach(slot => {
        slot.classList.add('google-signin-slot--ready');
    });

    return true;
}

async function loadGoogleClientId() {
    try {
        const base = window.NexuraAPI?.baseUrl || window.NexuraConfig?.apiBase || '';
        const res = await fetch(`${base}/auth/social-config-public.php`);
        const json = await res.json();
        if (json.data?.google_client_id) {
            return json.data.google_client_id;
        }
    } catch {
        /* fallback */
    }
    return GOOGLE_CLIENT_FALLBACK;
}

function bootGoogleAuth() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'origin_mismatch' || params.get('error') === 'redirect_uri_mismatch') {
        showOriginSetupHelp();
    }

    let attempts = 0;
    const maxAttempts = 40;

    loadGoogleClientId().then(clientId => {
        window.__nexuraGoogleClientId = clientId;

        const tryInit = () => {
            if (renderGoogleButtons(clientId)) {
                return;
            }
            attempts += 1;
            if (attempts < maxAttempts) {
                setTimeout(tryInit, 150);
            } else {
                showAuthMessage('Google button load nahi hua — page refresh karein.');
            }
        };

        tryInit();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootGoogleAuth);
} else {
    bootGoogleAuth();
}

/* Re-render Google button when signup tab opens (width + signup text) */
document.addEventListener('DOMContentLoaded', () => {
    const rerenderSignup = () => {
        setTimeout(() => {
            const clientId = window.__nexuraGoogleClientId || GOOGLE_CLIENT_FALLBACK;
            document.querySelectorAll('#paneSignup .google-signin-slot').forEach(slot => {
                slot.dataset.rendered = '0';
            });
            renderGoogleButtons(clientId, {
                context: 'signup',
                selector: '#paneSignup .google-signin-slot',
                force: true
            });
        }, 100);
    };

    document.getElementById('tabSignup')?.addEventListener('click', rerenderSignup);
    document.getElementById('switchToSignup')?.addEventListener('click', rerenderSignup);
});
