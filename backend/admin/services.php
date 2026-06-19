<?php
$pageTitle = 'Services';
$activeNav = 'services';
include 'includes/layout-start.php';
echo ui_partial_meta($pageTitle, $activeNav);
?>

<?php echo ui_page_header('Services', 'Manage service catalog for the website', ui_btn('Add Service', 'openServiceModal()', 'primary', 'fa-plus')); ?>

<div class="mb-6"><?php echo ui_search_input('searchInput', 'Search services...'); ?></div>

<?php
echo ui_modal_shell('serviceModal', 'Add Service', '
    <form id="serviceForm" class="space-y-3">
        <input type="hidden" id="serviceId">
        <input id="serviceName" required placeholder="Service name" class="nx-input">
        <input id="serviceSlug" placeholder="slug" class="nx-input">
        <input id="serviceIcon" placeholder="fa-code" class="nx-input">
        <textarea id="serviceDescription" placeholder="Description" class="nx-input min-h-[80px]"></textarea>
        <select id="serviceActive" class="nx-input">
            <option value="1">Active</option>
            <option value="0">Inactive</option>
        </select>
        <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="nx-btn nx-btn-secondary" data-close-modal="serviceModal">Cancel</button>
            <button type="submit" class="nx-btn nx-btn-primary">Save</button>
        </div>
    </form>
');
?>

<?php
echo ui_table_wrap(
    '<tr><th>Name</th><th>Slug</th><th>Icon</th><th>Status</th><th>Actions</th></tr>',
    'servicesBody',
    '700px'
);
?>

<?php
$pageScript = <<<'SCRIPT'
<script>
let allServices = [];

function openServiceModal() {
    document.getElementById('serviceModalTitle').textContent = 'Add Service';
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceId').value = '';
    NexuraUI.openModal('serviceModal');
}

function closeServiceModal() {
    NexuraUI.closeModal('serviceModal');
}

async function loadServices() {
    try {
        const res = await AdminAPI.get('services/read.php?all=1');
        allServices = res.data || [];
        renderServices(allServices);
    } catch (err) { showToast(err.message, 'error'); }
}

function renderServices(list) {
    const body = document.getElementById('servicesBody');
    if (!list.length) {
        body.innerHTML = '<tr><td colspan="5" class="px-6 py-10 text-center text-slate-500">No services — Add Service click karein</td></tr>';
        return;
    }
    body.innerHTML = list.map(s => `
        <tr class="hover:bg-slate-800/40">
            <td class="px-6 py-4"><strong>${escapeHtml(s.name)}</strong><br><span class="text-slate-500 text-xs">${escapeHtml(s.description || '')}</span></td>
            <td class="px-6 py-4 text-slate-400">${escapeHtml(s.slug || '—')}</td>
            <td class="px-6 py-4"><i class="fas ${escapeHtml(s.icon || 'fa-circle')}"></i></td>
            <td class="px-6 py-4"><span class="px-2 py-1 rounded-full text-xs ${s.is_active == 1 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}">${s.is_active == 1 ? 'Active' : 'Inactive'}</span></td>
            <td class="px-6 py-4">
                <button onclick='editService(${JSON.stringify(s)})' class="text-violet-400 mr-3"><i class="fas fa-edit"></i></button>
                <button onclick="deleteService(${s.id})" class="text-red-400"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function editService(s) {
    openServiceModal();
    document.getElementById('serviceModalTitle').textContent = 'Edit Service';
    document.getElementById('serviceId').value = s.id;
    document.getElementById('serviceName').value = s.name || '';
    document.getElementById('serviceSlug').value = s.slug || '';
    document.getElementById('serviceIcon').value = s.icon || '';
    document.getElementById('serviceDescription').value = s.description || '';
    document.getElementById('serviceActive').value = s.is_active == 1 ? '1' : '0';
}

document.getElementById('serviceForm').addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('serviceId').value;
    const payload = {
        name: document.getElementById('serviceName').value.trim(),
        slug: document.getElementById('serviceSlug').value.trim(),
        icon: document.getElementById('serviceIcon').value.trim(),
        description: document.getElementById('serviceDescription').value.trim(),
        is_active: document.getElementById('serviceActive').value === '1'
    };
    try {
        if (id) {
            payload.id = parseInt(id, 10);
            await AdminAPI.put('services/update.php', payload);
            showToast('Service updated');
        } else {
            await AdminAPI.post('services/create.php', payload);
            showToast('Service created');
        }
        closeServiceModal();
        loadServices();
    } catch (err) { showToast(err.message, 'error'); }
});

async function deleteService(id) {
    if (!confirm('Delete this service?')) return;
    try {
        await AdminAPI.delete('services/delete.php', { id });
        showToast('Service deleted');
        loadServices();
    } catch (err) { showToast(err.message, 'error'); }
}

document.getElementById('searchInput').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderServices(allServices.filter(s => (s.name || '').toLowerCase().includes(q) || (s.slug || '').toLowerCase().includes(q)));
});

loadServices();
</script>
SCRIPT;

include 'includes/layout-end.php';
?>
