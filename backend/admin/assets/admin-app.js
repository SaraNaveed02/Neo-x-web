/**
 * Nexura Admin — API client, JWT, Socket.io realtime
 */

const AdminAPI = {
    base: '../api',
    csrfToken: localStorage.getItem('nexuraAdminCsrf') || '',

    getToken() {
        return localStorage.getItem('nexuraAdminToken') || '';
    },

    setToken(token) {
        if (token) localStorage.setItem('nexuraAdminToken', token);
        else localStorage.removeItem('nexuraAdminToken');
    },

    setCsrf(token) {
        this.csrfToken = token || '';
        if (token) localStorage.setItem('nexuraAdminCsrf', token);
        else localStorage.removeItem('nexuraAdminCsrf');
    },

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers || {})
        };
        const token = this.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const method = (options.method || 'GET').toUpperCase();
        if (this.csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
            headers['X-CSRF-Token'] = this.csrfToken;
        }

        const config = { credentials: 'include', ...options, headers };
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        let res;
        try {
            res = await fetch(`${this.base}/${endpoint}`, config);
        } catch {
            throw new Error('Server connect nahi hua — XAMPP Apache + MySQL on karein');
        }

        const data = await res.json().catch(() => ({
            success: false,
            error: res.status === 404 ? 'API file not found' : 'Invalid server response'
        }));

        if (!data.success) {
            const msg = data.error || data.message || 'Request failed';
            if (res.status === 401 || res.status === 403) {
                throw new Error(msg + ' — Dobara login karein (admin / admin123)');
            }
            if (res.status === 503 && String(msg).toLowerCase().includes('database')) {
                throw new Error('Database not connected — install.php run karein');
            }
            throw new Error(msg);
        }

        return data;
    },

    get: (e) => AdminAPI.request(e, { method: 'GET' }),
    post: (e, b) => AdminAPI.request(e, { method: 'POST', body: b }),
    put: (e, b) => AdminAPI.request(e, { method: 'PUT', body: b }),
    delete: (e, b) => AdminAPI.request(e, { method: 'DELETE', body: b })
};

let realtimeSocket = null;

function initRealtime(callbacks = {}) {
    if (typeof io === 'undefined') return;
    if (realtimeSocket) return;
    realtimeSocket = io('http://localhost:3001', { transports: ['websocket', 'polling'] });

    realtimeSocket.on('connect', () => {
        const el = document.getElementById('liveIndicator');
        if (el) el.classList.remove('hidden');
    });

    realtimeSocket.on('stats:update', (stats) => callbacks.onStats?.(stats));
    realtimeSocket.on('message:new', (payload) => {
        callbacks.onMessage?.(payload);
        NexuraUI?.pushNotification('New message', payload?.name || 'Contact form');
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar?.classList.toggle('-translate-x-full');
    overlay?.classList.toggle('hidden');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function adminLogout() {
    try { await AdminAPI.post('auth/logout.php', {}); } catch (_) {}
    AdminAPI.setToken('');
    AdminAPI.setCsrf('');
    window.location.href = '../index.php';
}

window.AdminAPI = AdminAPI;
window.initRealtime = initRealtime;
window.toggleSidebar = toggleSidebar;
window.escapeHtml = escapeHtml;
window.adminLogout = adminLogout;
