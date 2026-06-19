<?php
$pageTitle = 'Messages';
$activeNav = 'messages';
include 'includes/layout-start.php';
echo ui_partial_meta($pageTitle, $activeNav);
?>

<?php echo ui_page_header('Inbox', 'Contact form messages and manual entries'); ?>

<div class="flex flex-col sm:flex-row gap-3 justify-between mb-6">
    <div class="flex flex-col sm:flex-row gap-2 flex-1">
        <?php echo ui_search_input('searchInput', 'Search messages...'); ?>
        <?php echo ui_select('readFilter', ['' => 'All', 'unread' => 'Unread only', 'read' => 'Read only']); ?>
    </div>
    <div class="flex gap-2">
        <?php echo ui_btn('Add', 'NexuraUI.openModal(\'msgModal\')', 'primary', 'fa-plus'); ?>
        <?php echo ui_btn('Refresh', 'loadMessages()', 'secondary', 'fa-sync-alt'); ?>
    </div>
</div>

<?php echo ui_error_banner('loadError'); ?>

<?php
echo ui_modal_shell('msgModal', 'Add Message', '
    <form id="msgForm" class="space-y-3">
        <input id="msgName" required placeholder="Name" class="nx-input">
        <input id="msgEmail" type="email" required placeholder="Email" class="nx-input">
        <input id="msgPhone" placeholder="Phone" class="nx-input">
        <textarea id="msgText" required placeholder="Message (min 10 chars)" class="nx-input min-h-[100px]"></textarea>
        <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="nx-btn nx-btn-secondary" data-close-modal="msgModal">Cancel</button>
            <button type="submit" class="nx-btn nx-btn-primary">Save</button>
        </div>
    </form>
');
?>

<?php
echo ui_table_wrap(
    '<tr>
        <th class="sortable" data-sort="name">From</th>
        <th class="sortable" data-sort="email">Email</th>
        <th>Phone</th>
        <th>Message</th>
        <th class="sortable" data-sort="is_read">Status</th>
        <th class="sortable" data-sort="created_at">Date</th>
        <th>Actions</th>
    </tr>',
    'messagesBody',
    '900px'
);
?>

<?php
$pageScript = <<<'SCRIPT'
<script>
(function initMessagesPage() {
    if (window.__nxMessagesTimer) {
        clearInterval(window.__nxMessagesTimer);
        window.__nxMessagesTimer = null;
    }

    let messages = [];
    let messagesTable = null;

    async function loadMessages() {
        const errEl = document.getElementById('loadError');
        if (!document.getElementById('messagesBody')) return;
        errEl?.classList.add('hidden');
        try {
            const res = await AdminAPI.get('messages/read.php?limit=200');
            messages = res.data || [];
            filterMessages();
        } catch (err) {
            if (errEl) {
                errEl.textContent = err.message;
                errEl.classList.remove('hidden');
            }
            showToast(err.message, 'error');
        }
    }

    function filterMessages() {
        const searchEl = document.getElementById('searchInput');
        const filterEl = document.getElementById('readFilter');
        const q = (searchEl?.value || '').toLowerCase();
        const readFilter = filterEl?.value || '';
        let list = messages;
        if (q) {
            list = list.filter(m =>
                (m.name || '').toLowerCase().includes(q) ||
                (m.email || '').toLowerCase().includes(q) ||
                (m.message || '').toLowerCase().includes(q)
            );
        }
        if (readFilter === 'unread') list = list.filter(m => !m.is_read || m.is_read == 0);
        if (readFilter === 'read') list = list.filter(m => m.is_read == 1);
        renderMessages(list);
    }

    function renderMessages(list) {
        if (!document.getElementById('messagesBody')) return;
        if (!messagesTable) {
            messagesTable = NexuraUI.createDataTable({
                data: list,
                tbodyId: 'messagesBody',
                paginationId: 'messagesBodyPagination',
                searchInputId: null,
                pageSize: 12,
                columns: [{ key: 'name' }, { key: 'email' }, { key: 'message' }],
                renderRow: (m) => `
                <tr class="hover:bg-slate-800/40 ${m.is_read == 1 ? '' : 'bg-violet-500/5'}">
                    <td class="font-medium">${escapeHtml(m.name)}</td>
                    <td class="text-slate-300">${escapeHtml(m.email)}</td>
                    <td class="text-slate-400">${escapeHtml(m.phone || '—')}</td>
                    <td class="text-slate-300 max-w-xs"><span class="line-clamp-2">${escapeHtml(m.message)}</span></td>
                    <td><span class="text-xs px-2 py-1 rounded-full ${m.is_read == 1 ? 'bg-slate-700 text-slate-300' : 'bg-violet-500/20 text-violet-300'}">${m.is_read == 1 ? 'Read' : 'Unread'}</span></td>
                    <td class="text-slate-400 whitespace-nowrap">${new Date(m.created_at).toLocaleString()}</td>
                    <td class="whitespace-nowrap">
                        <button onclick="toggleRead(${m.id}, ${m.is_read == 1 ? 0 : 1})" class="text-cyan-400 hover:text-cyan-300 mr-3" title="Mark read"><i class="fas fa-check"></i></button>
                        <button onclick="deleteMessage(${m.id})" class="text-red-400 hover:text-red-300" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`
            });
        } else {
            messagesTable.setData(list);
        }
    }

    window.toggleRead = async function(id, isRead) {
        try {
            await AdminAPI.put('messages/update.php', { id, is_read: !!isRead });
            showToast('Message updated');
            loadMessages();
        } catch (err) { showToast(err.message, 'error'); }
    };

    window.deleteMessage = async function(id) {
        if (!confirm('Delete this message?')) return;
        try {
            await AdminAPI.delete('messages/delete.php', { id });
            showToast('Message deleted');
            loadMessages();
        } catch (err) { showToast(err.message, 'error'); }
    };

    document.getElementById('searchInput')?.addEventListener('input', filterMessages);
    document.getElementById('readFilter')?.addEventListener('change', filterMessages);

    initRealtime({
        onMessage: (payload) => {
            showToast('Naya message: ' + (payload.message?.name || 'contact form'));
            loadMessages();
        }
    });

    loadMessages();
    window.__nxMessagesTimer = setInterval(loadMessages, 15000);

    document.addEventListener('nexura:page-unload', () => {
        if (window.__nxMessagesTimer) {
            clearInterval(window.__nxMessagesTimer);
            window.__nxMessagesTimer = null;
        }
    }, { once: true });

    document.getElementById('msgForm')?.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            await AdminAPI.post('messages/create.php', {
                name: document.getElementById('msgName').value.trim(),
                email: document.getElementById('msgEmail').value.trim(),
                phone: document.getElementById('msgPhone').value.trim(),
                message: document.getElementById('msgText').value.trim()
            });
            showToast('Message added');
            NexuraUI.closeModal('msgModal');
            loadMessages();
        } catch (err) { showToast(err.message, 'error'); }
    });
})();
</script>
SCRIPT;

include 'includes/layout-end.php';
?>
