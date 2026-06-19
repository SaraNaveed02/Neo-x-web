<?php
$pageTitle = 'Settings';
$activeNav = 'settings';
include 'includes/layout-start.php';
echo ui_partial_meta($pageTitle, $activeNav);
?>

<?php echo ui_page_header('Site Settings', 'Contact info, support coverage, and custom settings', ui_btn('Save All', 'saveAllSettings()', 'primary', 'fa-save') . ui_btn('Add Setting', 'openAddModal()', 'secondary', 'fa-plus')); ?>

<div id="settingsList" class="space-y-3"></div>

<?php
echo ui_modal_shell('addModal', 'Add Setting', '
    <form id="addForm" class="space-y-3">
        <input id="newKey" required placeholder="setting_key" class="nx-input">
        <input id="newValue" placeholder="Value" class="nx-input">
        <input id="newGroup" placeholder="Group (general, contact...)" value="general" class="nx-input">
        <div class="flex justify-end gap-2">
            <button type="button" class="nx-btn nx-btn-secondary" data-close-modal="addModal">Cancel</button>
            <button type="submit" class="nx-btn nx-btn-primary">Add</button>
        </div>
    </form>
');
?>

<?php
$pageScript = <<<'SCRIPT'
<script>
const protectedKeys = ['site_name', 'contact_email', 'maintenance_mode'];
let allSettings = [];

const fieldLabels = {
    site_name: 'Site Name',
    site_tagline: 'Tagline',
    contact_email: 'Contact Email',
    contact_phone: 'Contact Phone',
    contact_address: 'Office Address',
    contact_response_time: 'Response Time',
    support_coverage: 'Support Coverage (frontend stats)',
    social_linkedin: 'LinkedIn URL',
    social_twitter: 'Twitter URL',
    maintenance_mode: 'Maintenance Mode (0 or 1)',
    google_client_id: 'Google Client ID',
    google_client_secret: 'Google Client Secret',
    facebook_app_id: 'Facebook App ID',
    facebook_app_secret: 'Facebook App Secret',
    instagram_app_id: 'Instagram App ID',
    instagram_app_secret: 'Instagram App Secret',
    github_client_id: 'GitHub Client ID',
    github_client_secret: 'GitHub Client Secret',
    oauth_redirect_uri: 'OAuth Redirect URI'
};

async function loadSettings() {
    try {
        const res = await AdminAPI.get('settings/read.php');
        allSettings = res.data || [];
        renderSettings();
    } catch (err) { showToast(err.message, 'error'); }
}

function renderSettings() {
    const el = document.getElementById('settingsList');
    if (!allSettings.length) {
        el.innerHTML = '<p class="text-slate-500 text-sm">No settings found</p>';
        return;
    }
    el.innerHTML = allSettings.map(s => {
        const label = fieldLabels[s.setting_key] || s.setting_key;
        const isProtected = protectedKeys.includes(s.setting_key);
        const isTextarea = s.setting_key === 'contact_address';
        const input = isTextarea
            ? `<textarea data-key="${escapeHtml(s.setting_key)}" class="setting-input nx-input min-h-[80px]">${escapeHtml(s.setting_value || '')}</textarea>`
            : `<input data-key="${escapeHtml(s.setting_key)}" value="${escapeHtml(s.setting_value || '')}" class="setting-input nx-input">`;
        return `
        <div class="nx-card p-4 flex flex-col sm:flex-row gap-3 sm:items-start">
            <div class="flex-1 min-w-0">
                <label class="block text-sm font-medium text-slate-300 mb-1.5">${escapeHtml(label)} <span class="text-slate-500 text-xs">(${escapeHtml(s.setting_group)})</span></label>
                ${input}
            </div>
            ${isProtected ? '' : `<button onclick="deleteSetting('${escapeHtml(s.setting_key)}')" class="shrink-0 px-3 py-2 rounded-xl border border-red-500/40 text-red-400 text-sm hover:bg-red-500/10"><i class="fas fa-trash"></i> Delete</button>`}
        </div>`;
    }).join('');
}

async function saveAllSettings() {
    const payload = {};
    document.querySelectorAll('.setting-input').forEach(el => {
        payload[el.dataset.key] = el.value.trim();
    });
    try {
        await AdminAPI.put('settings/update.php', { settings: payload });
        showToast('Settings saved');
        loadSettings();
    } catch (err) { showToast(err.message, 'error'); }
}

function openAddModal() {
    document.getElementById('addForm').reset();
    document.getElementById('newGroup').value = 'general';
    NexuraUI.openModal('addModal');
}

function closeAddModal() {
    NexuraUI.closeModal('addModal');
}

document.getElementById('addForm').addEventListener('submit', async e => {
    e.preventDefault();
    const key = document.getElementById('newKey').value.trim();
    const value = document.getElementById('newValue').value.trim();
    const group = document.getElementById('newGroup').value.trim() || 'general';
    if (!key) return showToast('Key required', 'error');
    try {
        await AdminAPI.put('settings/update.php', { settings: { [key]: value } });
        showToast('Setting added');
        closeAddModal();
        loadSettings();
    } catch (err) { showToast(err.message, 'error'); }
});

async function deleteSetting(key) {
    if (!confirm('Delete setting "' + key + '"?')) return;
    try {
        await AdminAPI.delete('settings/delete.php', { key });
        showToast('Setting deleted');
        loadSettings();
    } catch (err) { showToast(err.message, 'error'); }
}

loadSettings();
</script>
SCRIPT;

include 'includes/layout-end.php';
?>
