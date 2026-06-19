<?php
$pageTitle = 'Site Stats';
$activeNav = 'stats';
include 'includes/layout-start.php';
echo ui_partial_meta($pageTitle, $activeNav);
?>

<?php echo ui_page_header('Site Statistics', 'Frontend numbers — computed values update live from the database', ui_btn('Add Stat', 'openStatModal()', 'primary', 'fa-plus')); ?>
<?php
echo ui_table_wrap(
    '<tr><th>Page</th><th>Label</th><th>Value (live)</th><th>Type</th><th>Order</th><th>Actions</th></tr>',
    'statsBody',
    '900px'
);

echo ui_modal_shell('statModal', 'Add Stat', '
    <form id="statForm" class="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        <input type="hidden" id="statId">
        <input id="statKey" required placeholder="Unique key e.g. home_clients" class="nx-input">
        <input id="statLabel" required placeholder="Display label" class="nx-input">
        <input id="statPage" placeholder="Page slug: home, login, about, global, web..." class="nx-input">
        <input id="statOrder" type="number" value="0" placeholder="Sort order" class="nx-input">
        <label class="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" id="statComputed" class="rounded"> Live from database (computed)
        </label>
        <select id="statComputeType" class="nx-input">
            <option value="">— Manual value —</option>
            <option value="services_count">Active services count</option>
            <option value="clients_count">Registered clients</option>
            <option value="users_count">Total users</option>
            <option value="messages_count">Messages count</option>
            <option value="logins_count">Login events</option>
            <option value="client_retention">Client retention %</option>
            <option value="support_coverage">Support coverage (from settings)</option>
        </select>
        <input id="statValue" placeholder="Manual value e.g. 24/7" class="nx-input">
        <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="nx-btn nx-btn-secondary" data-close-modal="statModal">Cancel</button>
            <button type="submit" class="nx-btn nx-btn-primary">Save</button>
        </div>
    </form>
');
?>
<?php
$pageScript = <<<'SCRIPT'
<script>
let stats = [];

function openStatModal() {
    document.getElementById('statModalTitle').textContent = 'Add Stat';
    document.getElementById('statForm').reset();
    document.getElementById('statId').value = '';
    document.getElementById('statPage').value = 'global';
    NexuraUI.openModal('statModal');
}

function closeStatModal() {
    NexuraUI.closeModal('statModal');
}

async function loadStats() {
    try {
        const res = await AdminAPI.get('stats/read.php');
        stats = res.data || [];
        renderStats();
    } catch (err) { showToast(err.message, 'error'); }
}

function renderStats() {
    const body = document.getElementById('statsBody');
    if (!stats.length) {
        body.innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-slate-500">No stats — Add Stat click karein</td></tr>';
        return;
    }
    body.innerHTML = stats.map(s => `
        <tr class="hover:bg-slate-800/40">
            <td class="px-6 py-4"><code class="text-violet-300">${escapeHtml(s.page_slug)}</code></td>
            <td class="px-6 py-4 font-medium">${escapeHtml(s.stat_label)}</td>
            <td class="px-6 py-4 text-emerald-300 font-bold">${escapeHtml(s.display_value)}</td>
            <td class="px-6 py-4 text-slate-400 text-xs">${s.is_computed == 1 ? '<span class="text-emerald-400">Computed</span>: ' + escapeHtml(s.compute_type || '') : 'Manual'}</td>
            <td class="px-6 py-4 text-slate-400">${s.sort_order}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button onclick='editStat(${JSON.stringify(s)})' class="text-violet-400 mr-3"><i class="fas fa-edit"></i></button>
                <button onclick="deleteStat(${s.id})" class="text-red-400"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function editStat(s) {
    openStatModal();
    document.getElementById('statModalTitle').textContent = 'Edit Stat';
    document.getElementById('statId').value = s.id;
    document.getElementById('statKey').value = s.stat_key;
    document.getElementById('statKey').readOnly = true;
    document.getElementById('statLabel').value = s.stat_label;
    document.getElementById('statPage').value = s.page_slug;
    document.getElementById('statOrder').value = s.sort_order;
    document.getElementById('statComputed').checked = s.is_computed == 1;
    document.getElementById('statComputeType').value = s.compute_type || '';
    document.getElementById('statValue').value = s.stat_value || '';
}

document.getElementById('statForm').addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('statId').value;
    const payload = {
        stat_key: document.getElementById('statKey').value.trim(),
        stat_label: document.getElementById('statLabel').value.trim(),
        page_slug: document.getElementById('statPage').value.trim() || 'global',
        sort_order: parseInt(document.getElementById('statOrder').value, 10) || 0,
        is_computed: document.getElementById('statComputed').checked,
        compute_type: document.getElementById('statComputeType').value,
        stat_value: document.getElementById('statValue').value.trim()
    };
    try {
        if (id) {
            payload.id = parseInt(id, 10);
            await AdminAPI.put('stats/update.php', payload);
            showToast('Stat updated');
        } else {
            await AdminAPI.post('stats/create.php', payload);
            showToast('Stat added');
        }
        document.getElementById('statKey').readOnly = false;
        closeStatModal();
        loadStats();
    } catch (err) { showToast(err.message, 'error'); }
});

async function deleteStat(id) {
    if (!confirm('Delete this stat?')) return;
    try {
        await AdminAPI.delete('stats/delete.php', { id });
        showToast('Stat deleted');
        loadStats();
    } catch (err) { showToast(err.message, 'error'); }
}

loadStats();
</script>
SCRIPT;

include 'includes/layout-end.php';
?>
