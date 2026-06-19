/**
 * Nexura Admin UI — theme, tables, modals, SPA navigation, notifications
 */

(function (global) {
    'use strict';

    const NexuraUI = {
        csrfToken: '',

        init() {
            this.initTheme();
            this.initModals();
            this.initSpaNav();
            this.loadCsrfToken();
            this.initDropdowns();
        },

        initTheme() {
            const saved = localStorage.getItem('nexuraAdminTheme') || 'dark';
            document.documentElement.classList.toggle('light', saved === 'light');
            document.documentElement.classList.toggle('dark', saved !== 'light');

            document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
                const isLight = document.documentElement.classList.toggle('light');
                document.documentElement.classList.toggle('dark', !isLight);
                localStorage.setItem('nexuraAdminTheme', isLight ? 'light' : 'dark');
                showToast(isLight ? 'Light mode enabled' : 'Dark mode enabled', 'info');
            });
        },

        async loadCsrfToken() {
            const stored = localStorage.getItem('nexuraAdminCsrf');
            if (stored) {
                this.csrfToken = stored;
                if (global.AdminAPI) AdminAPI.setCsrf(stored);
            }
            try {
                const res = await fetch('../api/csrf-token.php', { credentials: 'include' });
                const data = await res.json();
                if (data.success && data.data?.token) {
                    this.csrfToken = data.data.token;
                    localStorage.setItem('nexuraAdminCsrf', data.data.token);
                    if (global.AdminAPI) AdminAPI.setCsrf(data.data.token);
                }
            } catch (_) { /* optional */ }
        },

        initModals() {
            document.addEventListener('click', (e) => {
                const closeId = e.target.closest('[data-close-modal]')?.dataset.closeModal;
                if (closeId) this.closeModal(closeId);
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.nx-modal:not(.hidden)').forEach((m) => {
                        m.classList.add('hidden');
                    });
                }
            });
        },

        openModal(id) {
            const el = document.getElementById(id);
            if (!el) return;
            el.classList.remove('hidden');
        },

        closeModal(id) {
            const el = document.getElementById(id);
            if (!el) return;
            el.classList.add('hidden');
        },

        initDropdowns() {
            document.addEventListener('click', (e) => {
                const notifBtn = e.target.closest('#notifToggleBtn');
                const profileBtn = e.target.closest('#profileToggleBtn');
                const notifPanel = document.getElementById('notifPanel');
                const profilePanel = document.getElementById('profilePanel');

                if (notifBtn) {
                    notifPanel?.classList.toggle('open');
                    profilePanel?.classList.remove('open');
                    return;
                }
                if (profileBtn) {
                    profilePanel?.classList.toggle('open');
                    notifPanel?.classList.remove('open');
                    return;
                }
                if (!e.target.closest('#notifPanel')) notifPanel?.classList.remove('open');
                if (!e.target.closest('#profilePanel')) profilePanel?.classList.remove('open');
            });
        },

        initSpaNav() {
            const content = document.getElementById('appContent');
            if (!content) return;

            document.addEventListener('click', async (e) => {
                const link = e.target.closest('[data-spa-link]');
                if (!link) return;
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                const href = link.getAttribute('href');
                if (!href || href.startsWith('http') || link.target === '_blank') return;
                e.preventDefault();
                await this.loadPage(href);
            });

            window.addEventListener('popstate', () => {
                this.loadPage(location.pathname.split('/').pop() || 'dashboard.php', false);
            });
        },

        updateShellMeta(container, file = '') {
            const meta = container.querySelector('[data-page-title]');
            const title = meta?.dataset.pageTitle || 'Admin';
            const navFile = file || (meta?.dataset.activeNav ? `${meta.dataset.activeNav}.php` : '');

            document.title = `${title} | Nexura Admin`;
            const heading = document.querySelector('header h1');
            if (heading) heading.textContent = title;

            document.querySelectorAll('aside nav [data-spa-link]').forEach((a) => {
                const href = (a.getAttribute('href') || '').split('?')[0];
                const active = navFile && href === navFile;
                a.className = `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    active
                        ? 'bg-violet-500/10 text-violet-400 nx-nav-active'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`;
            });
        },

        async loadPage(url, pushState = true) {
            const content = document.getElementById('appContent');
            if (!content) {
                window.location.href = url;
                return;
            }

            document.dispatchEvent(new CustomEvent('nexura:page-unload'));

            const file = url.split('?')[0];
            this.showPageLoader(true);
            content.classList.add('nx-loading');

            try {
                const res = await fetch(`${file}?partial=1`, {
                    credentials: 'include',
                    headers: { 'X-Partial': '1', Accept: 'text/html' }
                });
                if (!res.ok) throw new Error('Page load failed');
                const html = await res.text();
                content.innerHTML = html;
                if (pushState) history.pushState({ page: file }, '', file);
                this.updateShellMeta(content, file);
                this.runInlineScripts(content);
                document.dispatchEvent(new CustomEvent('nexura:page-loaded', { detail: { page: file } }));
            } catch (err) {
                showToast(err.message || 'Failed to load page', 'error');
                window.location.href = url;
            } finally {
                content.classList.remove('nx-loading');
                this.showPageLoader(false);
            }
        },

        runInlineScripts(container) {
            container.querySelectorAll('script').forEach((oldScript) => {
                const script = document.createElement('script');
                if (oldScript.src) script.src = oldScript.src;
                else script.textContent = oldScript.textContent;
                oldScript.replaceWith(script);
            });
        },

        showPageLoader(show) {
            document.getElementById('pageLoader')?.classList.toggle('hidden', !show);
        },

        /**
         * Client-side table: search, sort, pagination
         */
        createDataTable(options) {
            const {
                data = [],
                tbodyId,
                paginationId,
                searchInputId,
                pageSize = 10,
                columns = [],
                renderRow
            } = options;

            let filtered = [...data];
            let sortKey = null;
            let sortDir = 1;
            let page = 1;

            const tbody = document.getElementById(tbodyId);
            const pagination = paginationId ? document.getElementById(paginationId) : null;
            const searchInput = searchInputId ? document.getElementById(searchInputId) : null;

            const applySearch = () => {
                const q = (searchInput?.value || '').toLowerCase().trim();
                filtered = data.filter((row) => {
                    if (!q) return true;
                    return columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(q));
                });
                if (sortKey) {
                    filtered.sort((a, b) => {
                        const av = a[sortKey] ?? '';
                        const bv = b[sortKey] ?? '';
                        if (av < bv) return -1 * sortDir;
                        if (av > bv) return 1 * sortDir;
                        return 0;
                    });
                }
                page = 1;
                render();
            };

            const render = () => {
                if (!tbody) return;
                const total = filtered.length;
                const pages = Math.max(1, Math.ceil(total / pageSize));
                if (page > pages) page = pages;
                const start = (page - 1) * pageSize;
                const slice = filtered.slice(start, start + pageSize);

                if (!slice.length) {
                    tbody.innerHTML = '<tr><td colspan="99" class="nx-empty">No records found</td></tr>';
                } else {
                    tbody.innerHTML = slice.map((row) => renderRow(row)).join('');
                }

                if (pagination) {
                    pagination.classList.remove('hidden');
                    pagination.innerHTML = `
                        <span>Showing ${total ? start + 1 : 0}–${Math.min(start + pageSize, total)} of ${total}</span>
                        <div class="flex gap-2">
                            <button type="button" class="nx-btn nx-btn-ghost" data-page="prev" ${page <= 1 ? 'disabled' : ''}>Prev</button>
                            <span class="px-2 py-1">Page ${page} / ${pages}</span>
                            <button type="button" class="nx-btn nx-btn-ghost" data-page="next" ${page >= pages ? 'disabled' : ''}>Next</button>
                        </div>`;
                    pagination.querySelector('[data-page="prev"]')?.addEventListener('click', () => { page--; render(); });
                    pagination.querySelector('[data-page="next"]')?.addEventListener('click', () => { page++; render(); });
                }
            };

            searchInput?.addEventListener('input', applySearch);

            return {
                setData(newData) {
                    data.length = 0;
                    data.push(...newData);
                    applySearch();
                },
                refresh: applySearch,
                sort(key) {
                    if (sortKey === key) sortDir *= -1;
                    else { sortKey = key; sortDir = 1; }
                    applySearch();
                },
                render
            };
        },

        pushNotification(title, description = '') {
            const list = document.getElementById('notifList');
            const badge = document.getElementById('notifBadge');
            if (!list) return;
            const empty = list.querySelector('.nx-notif-empty');
            if (empty) empty.remove();
            const item = document.createElement('div');
            item.className = 'nx-notif-item';
            item.innerHTML = `<strong class="block text-slate-200">${escapeHtml(title)}</strong><span class="text-slate-400 text-xs">${escapeHtml(description)}</span>`;
            list.prepend(item);
            if (badge) {
                badge.textContent = String(Math.min(99, Number(badge.textContent || 0) + 1));
                badge.classList.remove('hidden');
            }
        }
    };

    function showToast(msg, type = 'success') {
        let stack = document.getElementById('toastStack');
        if (!stack) {
            stack = document.createElement('div');
            stack.id = 'toastStack';
            document.body.appendChild(stack);
        }
        const el = document.createElement('div');
        el.className = `nx-toast nx-toast-${type}`;
        el.textContent = msg;
        stack.appendChild(el);
        setTimeout(() => el.remove(), 3500);
    }

    document.addEventListener('DOMContentLoaded', () => NexuraUI.init());

    global.NexuraUI = NexuraUI;
    global.showToast = showToast;

})(window);
