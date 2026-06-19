<?php
$pageTitle = 'Microsoft 365 Inbox';
$activeNav = 'ms-inbox';
include 'includes/layout-start.php';
echo ui_partial_meta($pageTitle, $activeNav);

$connectUrl = '../api/microsoft/connect.php';
?>

<div id="statusBanner" class="hidden nx-alert mb-6"></div>

<div id="connectionCard" class="nx-card p-5 mb-6">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
            <h3 class="font-bold text-lg flex items-center gap-2">
                <i class="fab fa-microsoft text-sky-400"></i> Microsoft 365 Mailbox
            </h3>
            <p id="connectionText" class="text-slate-400 text-sm mt-1">Checking connection…</p>
            <p class="text-xs text-slate-500 mt-2">Official OAuth — user consent required. Tokens stored encrypted.</p>
        </div>
        <div id="connectionActions" class="flex flex-wrap gap-2"></div>
    </div>
</div>

<div id="inboxPanel" class="hidden">
    <?php echo ui_page_header('Inbox', 'Synced from Microsoft Graph'); ?>

    <div class="flex flex-col sm:flex-row gap-3 justify-between mb-6">
        <div class="flex flex-col sm:flex-row gap-2 flex-1">
            <?php echo ui_search_input('searchInput', 'Search mail...'); ?>
        </div>
        <div class="flex gap-2">
            <?php echo ui_btn('Compose', 'openCompose()', 'primary', 'fa-pen'); ?>
            <?php echo ui_btn('Sync', 'syncMail()', 'secondary', 'fa-sync-alt'); ?>
            <?php echo ui_btn('Refresh', 'loadMail()', 'secondary', 'fa-redo'); ?>
        </div>
    </div>

    <?php echo ui_error_banner('loadError'); ?>

    <?php
    echo ui_table_wrap(
        '<tr>
            <th>From</th>
            <th>Subject</th>
            <th>Preview</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
        </tr>',
        'mailBody',
        '900px'
    );
    ?>
</div>

<?php
echo ui_modal_shell('viewModal', 'Message', '
    <div id="viewContent" class="space-y-3 text-sm"></div>
    <div class="flex justify-end gap-2 pt-4">
        <button type="button" class="nx-btn nx-btn-secondary" data-close-modal="viewModal">Close</button>
        <button type="button" id="replyBtn" class="nx-btn nx-btn-primary"><i class="fas fa-reply mr-1"></i> Reply</button>
    </div>
');

echo ui_modal_shell('composeModal', 'Send Email', '
    <form id="composeForm" class="space-y-3">
        <input id="composeTo" type="email" required placeholder="To" class="nx-input">
        <input id="composeSubject" required placeholder="Subject" class="nx-input">
        <textarea id="composeBody" required placeholder="Message" class="nx-input min-h-[140px]"></textarea>
        <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="nx-btn nx-btn-secondary" data-close-modal="composeModal">Cancel</button>
            <button type="submit" class="nx-btn nx-btn-primary"><i class="fas fa-paper-plane mr-1"></i> Send</button>
        </div>
    </form>
');
?>

<?php
$pageScript = <<<'SCRIPT'
<script>
let mailMessages = [];
let currentConnection = null;
let viewingMessage = null;

function showBanner(type, html) {
    const el = document.getElementById('statusBanner');
    el.className = 'nx-alert mb-6 ' + (type === 'success' ? 'nx-alert-success' : type === 'error' ? 'nx-alert-error' : 'nx-alert-info');
    el.innerHTML = html;
    el.classList.remove('hidden');
}

async function loadStatus() {
    try {
        const res = await AdminAPI.get('microsoft/status.php');
        const conn = res.data?.connection || {};
        currentConnection = conn;
        const configured = res.data?.configured;
        const text = document.getElementById('connectionText');
        const actions = document.getElementById('connectionActions');
        const panel = document.getElementById('inboxPanel');

        if (conn.connected) {
            text.innerHTML = `<span class="text-emerald-400 font-medium">${escapeHtml(conn.email || 'Connected')}</span>`
                + (conn.last_sync_at ? ` · Last sync: ${escapeHtml(conn.last_sync_at)}` : '');
            actions.innerHTML = `
                <a href="../api/microsoft/connect.php" class="nx-btn nx-btn-secondary"><i class="fas fa-link mr-1"></i> Reconnect</a>
                <button type="button" onclick="disconnectMicrosoft()" class="nx-btn nx-btn-secondary text-red-400 border-red-500/40"><i class="fas fa-unlink mr-1"></i> Disconnect</button>`;
            panel.classList.remove('hidden');
            loadMail();
        } else {
            panel.classList.add('hidden');
            if (!configured) {
                text.textContent = 'Azure app keys missing — Admin → OAuth Keys mein Microsoft Client ID & Secret add karein.';
                actions.innerHTML = `<a href="oauth.php" data-spa-link class="nx-btn nx-btn-primary"><i class="fas fa-key mr-1"></i> OAuth Keys</a>`;
            } else {
                text.textContent = 'Mailbox connect nahi hai. Microsoft login se authorize karein.';
                actions.innerHTML = `<a href="../api/microsoft/connect.php" class="nx-btn nx-btn-primary"><i class="fab fa-microsoft mr-1"></i> Connect Microsoft 365</a>`;
            }
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function disconnectMicrosoft() {
    if (!confirm('Disconnect Microsoft mailbox? Synced messages delete ho jayengi.')) return;
    try {
        await AdminAPI.post('microsoft/disconnect.php', {});
        showToast('Disconnected');
        loadStatus();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function loadMail() {
    const errEl = document.getElementById('loadError');
    errEl.classList.add('hidden');
    try {
        const q = document.getElementById('searchInput')?.value?.trim() || '';
        const url = 'microsoft/messages/list.php?limit=100' + (q ? '&search=' + encodeURIComponent(q) : '');
        const res = await AdminAPI.get(url);
        mailMessages = res.data?.messages || [];
        renderMail();
    } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove('hidden');
    }
}

function renderMail() {
    const tbody = document.getElementById('mailBody');
    if (!mailMessages.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-slate-500 py-8">No messages — Sync click karein</td></tr>';
        return;
    }
    tbody.innerHTML = mailMessages.map(m => `
        <tr class="hover:bg-slate-800/50">
            <td>
                <div class="font-medium">${escapeHtml(m.from_name || m.from_email || '—')}</div>
                <div class="text-xs text-slate-500">${escapeHtml(m.from_email || '')}</div>
            </td>
            <td class="font-medium max-w-[200px] truncate">${escapeHtml(m.subject || '(No subject)')}</td>
            <td class="text-slate-400 text-sm max-w-[240px] truncate">${escapeHtml(m.body_preview || '')}</td>
            <td>${m.is_read == 1 ? '<span class="text-slate-500">Read</span>' : '<span class="text-emerald-400">Unread</span>'}</td>
            <td class="text-sm text-slate-400 whitespace-nowrap">${escapeHtml(m.received_at || '')}</td>
            <td>
                <button type="button" onclick="viewMail(${m.id})" class="nx-btn nx-btn-secondary text-xs py-1 px-2"><i class="fas fa-eye"></i></button>
            </td>
        </tr>
    `).join('');
}

async function syncMail() {
    try {
        const res = await AdminAPI.post('microsoft/messages/sync.php', { limit: 50 });
        showToast(res.message || 'Synced');
        loadStatus();
        loadMail();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function viewMail(id) {
    try {
        const res = await AdminAPI.get('microsoft/messages/read.php?id=' + id);
        viewingMessage = res.data;
        const body = viewingMessage.body_html || viewingMessage.body_text || viewingMessage.body_preview || '';
        document.getElementById('viewContent').innerHTML = `
            <div><strong>From:</strong> ${escapeHtml(viewingMessage.from_name || '')} &lt;${escapeHtml(viewingMessage.from_email || '')}&gt;</div>
            <div><strong>Subject:</strong> ${escapeHtml(viewingMessage.subject || '')}</div>
            <div><strong>Date:</strong> ${escapeHtml(viewingMessage.received_at || '')}</div>
            <hr class="border-slate-700">
            <div class="prose prose-invert max-w-none text-sm">${viewingMessage.body_html ? body : escapeHtml(body).replace(/\\n/g, '<br>')}</div>`;
        NexuraUI.openModal('viewModal');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function openCompose(to = '', subject = '') {
    document.getElementById('composeTo').value = to;
    document.getElementById('composeSubject').value = subject;
    document.getElementById('composeBody').value = '';
    NexuraUI.openModal('composeModal');
}

document.getElementById('replyBtn')?.addEventListener('click', () => {
    if (!viewingMessage) return;
    const subj = viewingMessage.subject || '';
    const replySubj = subj.toLowerCase().startsWith('re:') ? subj : 'Re: ' + subj;
    NexuraUI.closeModal('viewModal');
    openCompose(viewingMessage.from_email || '', replySubj);
});

document.getElementById('composeForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        await AdminAPI.post('microsoft/send.php', {
            to: document.getElementById('composeTo').value.trim(),
            subject: document.getElementById('composeSubject').value.trim(),
            body: document.getElementById('composeBody').value.trim()
        });
        showToast('Email sent');
        NexuraUI.closeModal('composeModal');
    } catch (err) {
        showToast(err.message, 'error');
    }
});

document.getElementById('searchInput')?.addEventListener('input', () => {
    clearTimeout(window._mailSearchTimer);
    window._mailSearchTimer = setTimeout(loadMail, 300);
});

const params = new URLSearchParams(window.location.search);
if (params.get('connected') === '1') {
    showBanner('success', '<i class="fas fa-check-circle mr-2"></i> Microsoft 365 connected successfully.');
    history.replaceState({}, '', 'microsoft-inbox.php');
}
if (params.get('error')) {
    showBanner('error', '<i class="fas fa-exclamation-circle mr-2"></i> ' + escapeHtml(decodeURIComponent(params.get('error'))));
    history.replaceState({}, '', 'microsoft-inbox.php');
}
if (params.get('error') === 'keys') {
    showBanner('error', 'Microsoft Client ID / Secret missing. OAuth Keys page se add karein.');
}

loadStatus();
</script>
SCRIPT;
include 'includes/layout-end.php';
?>
