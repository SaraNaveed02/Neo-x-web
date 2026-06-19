/*
    FILE: api.js
    PURPOSE: JWT-enabled API client for Nexura frontend
*/

const NexuraAPI = {
    get baseUrl() {
        const saved = localStorage.getItem('nexuraApiBase');
        if (saved) return saved.replace(/\/$/, '');

        if (window.NEXWEB_API_BASE) {
            return String(window.NEXWEB_API_BASE).replace(/\/$/, '');
        }

        if (window.NexuraConfig?.apiBase) {
            return window.NexuraConfig.apiBase;
        }

        const path = window.location.pathname;
        const projectIdx = path.indexOf('/project/');
        if (projectIdx >= 0) {
            return path.substring(0, projectIdx) + '/backend/api';
        }

        return '';
    },
    tokenKey: 'nexuraToken',

    getToken() {
        return localStorage.getItem(this.tokenKey) || '';
    },

    setToken(token) {
        if (token) localStorage.setItem(this.tokenKey, token);
        else localStorage.removeItem(this.tokenKey);
    },

    async request(endpoint, options = {}) {
        const base = this.baseUrl;
        if (!base) {
            throw new Error('API not configured. Start XAMPP and open site from http://localhost/time/project/');
        }
        const url = `${base}/${endpoint.replace(/^\//, '')}`;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers || {})
        };
        const token = this.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const config = { credentials: 'include', ...options, headers };
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        let response;
        const timeoutMs = options.timeoutMs || 8000;
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

        try {
            response = await fetch(url, controller ? { ...config, signal: controller.signal } : config);
        } catch {
            if (timer) clearTimeout(timer);
            throw new Error('Network error. Please check your connection.');
        }

        if (timer) clearTimeout(timer);

        const data = await response.json().catch(() => ({
            success: false,
            error: 'Invalid server response'
        }));

        if (!data.success) {
            throw new Error(data.error || data.message || 'Request failed');
        }

        return data;
    },

    get(endpoint) { return this.request(endpoint, { method: 'GET' }); },
    post(endpoint, body) { return this.request(endpoint, { method: 'POST', body }); },
    put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body }); },
    delete(endpoint, body) { return this.request(endpoint, { method: 'DELETE', body }); },

    login(email, password) {
        return this.post('auth/login.php', { email, password }).then(res => {
            if (res.data?.token) this.setToken(res.data.token);
            return res;
        });
    },

    signup(name, email, password) {
        return this.post('auth/signup.php', { name, email, password }).then(res => {
            if (res.data?.token) this.setToken(res.data.token);
            return res;
        });
    },

    logout() {
        return this.post('auth/logout.php', {}).finally(() => this.setToken(''));
    },

    getSession() { return this.get('auth/session.php'); },
    updateProfile(payload) { return this.put('users/profile.php', payload); },
    submitContact(payload) { return this.post('messages/create.php', payload); },
    getPublicSettings() { return this.get('settings/public.php'); },
    getPublicStats() { return this.get('stats/public.php'); },
    getServices() { return this.get('services/read.php'); }
};

window.NexuraAPI = NexuraAPI;
