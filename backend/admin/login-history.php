<?php
$pageTitle = 'Login History';
$activeNav = 'logins';
include 'includes/layout-start.php';
echo ui_partial_meta($pageTitle, $activeNav);
?>

<?php echo ui_page_header('Login History', 'All client and admin sign-in events'); ?>

<div class="flex flex-col sm:flex-row gap-3 justify-between mb-6">
    <div class="flex flex-col sm:flex-row gap-2 flex-1">
        <?php echo ui_search_input('searchInput', 'Search email or name...'); ?>
        <?php echo ui_select('typeFilter', ['' => 'All types', 'client' => 'Client', 'admin' => 'Admin'], 'nx-input w-full sm:w-44'); ?>
    </div>
    <?php echo ui_btn('Clear All', 'clearAllHistory()', 'danger', 'fa-trash'); ?>
</div>

<?php
echo ui_table_wrap(
    '<tr><th>User</th><th>Email</th><th>Type</th><th>IP</th><th>Date</th><th>Actions</th></tr>',
    'historyBody',
    '700px'
);
?>

<?php
$pageScript = <<<'SCRIPT'
<script>
let history = [];

async function loadHistory() {
    const search = document.getElementById('searchInput').value.trim();
    const type = document.getElementById('typeFilter').value;
    let url = 'login-history/read.php?limit=100';
    if (search) url += '&search=' + encodeURIComponent(search);
    if (type) url += '&type=' + encodeURIComponent(type);
    try {
        const res = await AdminAPI.get(url);
        history = res.data || [];
        renderHistory();
    } catch (err) { showToast(err.message, 'error'); }
}

function renderHistory() {
    const body = document.getElementById('historyBody');
    if (!history.length) {
        body.innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-slate-500">No login history</td></tr>';
        return;
    }
    body.innerHTML = history.map(h => `
        <tr class="hover:bg-slate-800/50">
            <td class="px-6 py-4 font-medium">${escapeHtml(h.user_name || '—')}</td>
            <td class="px-6 py-4 text-slate-300">${escapeHtml(h.email)}</td>
            <td class="px-6 py-4"><span class="px-2.5 py-1 rounded-full text-xs ${h.login_type === 'admin' ? 'bg-violet-500/20 text-violet-300' : 'bg-emerald-500/20 text-emerald-300'}">${h.login_type}</span></td>
            <td class="px-6 py-4 text-slate-400">${escapeHtml(h.ip_address || '—')}</td>
            <td class="px-6 py-4 text-slate-400">${new Date(h.created_at).toLocaleString()}</td>
            <td class="px-6 py-4"><button onclick="deleteHistory(${h.id})" class="text-red-400 hover:text-red-300"><i class="fas fa-trash"></i></button></td>
        </tr>
    `).join('');
}

document.getElementById('searchInput').addEventListener('input', () => clearTimeout(window._sh) || (window._sh = setTimeout(loadHistory, 300)));
document.getElementById('typeFilter').addEventListener('change', loadHistory);

async function deleteHistory(id) {
    if (!confirm('Delete this login record?')) return;
    try {
        await AdminAPI.delete('login-history/delete.php', { id });
        showToast('Deleted');
        loadHistory();
    } catch (err) { showToast(err.message, 'error'); }
}

async function clearAllHistory() {
    if (!confirm('Clear ALL login history?')) return;
    try {
        await AdminAPI.delete('login-history/delete.php', { clear_all: true });
        showToast('All history cleared');
        loadHistory();
    } catch (err) { showToast(err.message, 'error'); }
}

initRealtime({ onLogin: () => { loadHistory(); showToast('New login'); } });
loadHistory();
</script>
SCRIPT;

include 'includes/layout-end.php';
?>
