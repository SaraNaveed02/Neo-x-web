/*
    FILE: auth.js
    PURPOSE: Local authentication simulation, signup/login, profile state, and session persistence
*/

document.addEventListener('DOMContentLoaded', () => {
    initializeAuthPages();
    initializeProfilePage();
});

function initializeAuthPages() {
    const loginForm = qs('#loginForm');
    const signupForm = qs('#signupForm');
    const passwordInput = qs('#signupPassword');
    const strengthLabel = qs('#passwordStrength');
    const strengthBar = qs('#passwordStrengthBar');

    initializeAuthTabs();
    initializePasswordToggles();

    if (passwordInput && strengthLabel) {
        passwordInput.addEventListener('input', () => {
            const strength = getPasswordStrength(passwordInput.value);
            const colors = { weak: '#f87171', medium: '#fbbf24', strong: '#22c55e' };
            const widths = { weak: '33%', medium: '66%', strong: '100%' };
            strengthLabel.textContent = `Strength: ${strength}`;
            strengthLabel.style.color = colors[strength];
            if (strengthBar) {
                strengthBar.style.width = widths[strength];
                strengthBar.style.background = colors[strength];
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', event => {
            event.preventDefault();
            handleLogin();
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', event => {
            event.preventDefault();
            handleSignup();
        });
    }
}

function initializeAuthTabs() {
    const tabLogin = qs('#tabLogin');
    const tabSignup = qs('#tabSignup');
    const paneLogin = qs('#paneLogin');
    const paneSignup = qs('#paneSignup');
    const switchToSignup = qs('#switchToSignup');
    const switchToLogin = qs('#switchToLogin');
    const authTitle = qs('#authTitle');
    const authSubtitle = qs('#authSubtitle');

    if (!tabLogin || !tabSignup || !paneLogin || !paneSignup) {
        return;
    }

    const showLogin = () => {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        tabLogin.setAttribute('aria-selected', 'true');
        tabSignup.setAttribute('aria-selected', 'false');
        paneLogin.classList.add('active');
        paneSignup.classList.remove('active');
        paneLogin.hidden = false;
        paneSignup.hidden = true;
        if (authTitle) authTitle.textContent = 'Sign in to NEOXWEB';
        if (authSubtitle) authSubtitle.textContent = 'Google se instant login, ya email & password';
    };

    const showSignup = () => {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        tabSignup.setAttribute('aria-selected', 'true');
        tabLogin.setAttribute('aria-selected', 'false');
        paneSignup.classList.add('active');
        paneLogin.classList.remove('active');
        paneSignup.hidden = false;
        paneLogin.hidden = true;
        if (authTitle) authTitle.textContent = 'Create your NEOXWEB account';
        if (authSubtitle) authSubtitle.textContent = 'Google se sign up — ya email se free account';
    };

    tabLogin.addEventListener('click', showLogin);
    tabSignup.addEventListener('click', showSignup);
    if (switchToSignup) switchToSignup.addEventListener('click', e => { e.preventDefault(); showSignup(); });
    if (switchToLogin) switchToLogin.addEventListener('click', e => { e.preventDefault(); showLogin(); });
}

function initializePasswordToggles() {
    document.querySelectorAll('.auth-toggle-pw').forEach(button => {
        button.addEventListener('click', () => {
            const input = qs(`#${button.dataset.target}`);
            if (!input) return;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
            }
            button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    });
}

function getPasswordStrength(password) {
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
        return 'strong';
    }
    if (password.length >= 8) {
        return 'medium';
    }
    return 'weak';
}

function redirectAfterLogin() {
    const home = window.location.href.replace(/[^/]*$/, 'index.html');
    window.location.replace(home);
}

function handleLogin() {
    const email = qs('#loginEmail').value.trim();
    const password = qs('#loginPassword').value;
    const remember = qs('#rememberMe').checked;

    clearError('#loginEmailError');
    clearError('#loginPasswordError');

    if (!emailIsValid(email)) {
        return showError('#loginEmailError', 'Enter a valid email address.');
    }
    if (password.length < 6) {
        return showError('#loginPasswordError', 'Password must be at least 6 characters.');
    }

    NexuraAPI.login(email, password)
        .then(result => {
            const user = result.data.user || result.data;
            const session = { email: user.email, name: user.name, role: user.is_admin ? 'admin' : (user.role || 'user'), lastActive: Date.now() };
            setStorage('nexuraSession', session);
            if (remember) setStorage('nexuraRemember', true);
            redirectAfterLogin();
        })
        .catch(err => {
            showError('#loginPasswordError', err.message || 'Unable to login right now.');
        });
}

function handleSignup() {
    const name = qs('#signupName').value.trim();
    const email = qs('#signupEmail').value.trim();
    const password = qs('#signupPassword').value;

    clearError('#signupNameError');
    clearError('#signupEmailError');
    clearError('#signupPasswordError');

    if (name.length < 2) {
        return showError('#signupNameError', 'Enter your full name.');
    }
    if (!emailIsValid(email)) {
        return showError('#signupEmailError', 'Enter a valid email address.');
    }
    if (password.length < 6) {
        return showError('#signupPasswordError', 'Password must be at least 6 characters.');
    }

    NexuraAPI.signup(name, email, password)
        .then(result => {
            const user = result.data?.user || { email, name, role: 'client' };
            if (result.data?.token && window.NexuraAPI) {
                NexuraAPI.setToken(result.data.token);
            }
            const session = { email: user.email, name: user.name, role: user.role || 'user', lastActive: Date.now() };
            setStorage('nexuraSession', session);
            redirectAfterLogin();
        })
        .catch(err => {
            showError('#signupEmailError', err.message || 'Unable to register right now.');
        });
}

function clearError(selector) {
    const element = qs(selector);
    if (element) element.textContent = '';
}

function showError(selector, message) {
    const element = qs(selector);
    if (element) element.textContent = message;
}

const PROVIDER_META = {
    google: { icon: 'fab fa-google', label: 'Google', color: '#ea4335' },
    facebook: { icon: 'fab fa-facebook-f', label: 'Facebook', color: '#1877f2' },
    instagram: { icon: 'fab fa-instagram', label: 'Instagram', color: '#e1306c' },
    github: { icon: 'fab fa-github', label: 'GitHub', color: '#f0f6fc' },
    email: { icon: 'fas fa-envelope', label: 'Email & Password', color: '#22c55e' }
};

function renderProviderChips(providers) {
    const el = qs('#profileProviders');
    if (!el) return;
    if (!providers.length) {
        el.innerHTML = '<span class="profile-provider-chip"><i class="fas fa-envelope"></i> Email</span>';
        return;
    }
    el.innerHTML = providers.map(p => {
        const meta = PROVIDER_META[p] || { icon: 'fas fa-link', label: p, color: '#94a3b8' };
        return `<span class="profile-provider-chip"><i class="${meta.icon}" style="color:${meta.color}"></i> ${meta.label}</span>`;
    }).join('');
}

function postApiJson(url, payload) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    })
    .then(response => response.json());
}

function fetchApiJson(url) {
    return fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json());
}

function initializeProfilePage() {
    const profileForm = qs('#profileForm');
    const logoutButton = qs('#logoutButton');
    const profileName = qs('#profileName');
    const profileFullName = qs('#profileFullName');
    const profileEmail = qs('#profileEmail');
    const profileRole = qs('#profileRole');
    const profileSession = qs('#profileSession');
    const profileLastActive = qs('#profileLastActive');

    if (!window.location.pathname.includes('profile.html')) {
        return;
    }

    NexuraAPI.getSession()
        .then(result => {
            const session = result.data;
            if (!session) {
                window.location.href = 'login.html';
                return;
            }
            setStorage('nexuraSession', session);
            if (result.data?.token) {
                /* session endpoint does not return token */
            }

            const initials = session.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            const initialsEl = qs('#profileInitials');

            if (initialsEl) {
                initialsEl.textContent = initials;
                initialsEl.style.display = '';
            }

            renderProviderChips(session.providers || []);

            if (profileName) profileName.textContent = `Welcome back, ${session.name}`;
            if (profileFullName) profileFullName.value = session.name;
            if (profileEmail) profileEmail.value = session.email;
            if (profileRole) profileRole.value = session.role || 'user';
            if (profileSession) profileSession.textContent = session.role || 'user';
            if (profileLastActive) profileLastActive.textContent = formatDate(session.lastActive);

            if (profileForm) {
                profileForm.addEventListener('submit', event => {
                    event.preventDefault();
                    const updatedName = profileFullName.value.trim();
                    if (updatedName.length < 2) return;
                    NexuraAPI.updateProfile({ name: updatedName })
                        .then(() => {
                            session.name = updatedName;
                            session.lastActive = Date.now();
                            setStorage('nexuraSession', session);
                            if (profileName) profileName.textContent = `Welcome back, ${session.name}`;
                            if (profileLastActive) profileLastActive.textContent = formatDate(session.lastActive);
                            alert('Profile updated successfully.');
                        })
                        .catch(err => alert(err.message || 'Profile update failed.'));
                });
            }
        })
        .catch(() => {
            window.location.href = 'login.html';
        });

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            NexuraAPI.logout().finally(() => {
                removeStorage('nexuraSession');
                removeStorage('nexuraRemember');
                window.location.href = 'login.html';
            });
        });
    }
}
