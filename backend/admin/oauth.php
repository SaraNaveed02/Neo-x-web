<?php
$pageTitle = 'OAuth Login Settings';
$activeNav = 'oauth';
include 'includes/layout-start.php';
echo ui_partial_meta($pageTitle, $activeNav);
?>

<div class="nx-alert nx-alert-info mb-6">
    <p class="font-semibold text-violet-200 mb-2"><i class="fas fa-key mr-2"></i>Social Login Keys</p>
    <p class="mb-2">Google, Facebook, Instagram, GitHub — keys yahan save hon gi aur database mein store hon gi.</p>
    <p class="text-slate-400 text-xs">Redirect URI har provider console mein add karein: <code id="redirectPreview" class="text-emerald-300">...</code></p>
</div>

<div id="providerStatus" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6"></div>

<form id="oauthForm" class="space-y-4 max-w-2xl">
    <div class="nx-card p-5 space-y-3">
        <h3 class="font-bold text-red-400"><i class="fab fa-google mr-2"></i>Google</h3>
        <input name="google_client_id" placeholder="Google Client ID" class="nx-input">
        <input name="google_client_secret" type="password" placeholder="Google Client Secret (optional for ID token)" class="nx-input">
    </div>
    <div class="nx-card p-5 space-y-3">
        <h3 class="font-bold text-blue-400"><i class="fab fa-facebook-f mr-2"></i>Facebook</h3>
        <input name="facebook_app_id" placeholder="Facebook App ID" class="nx-input">
        <input name="facebook_app_secret" type="password" placeholder="Facebook App Secret" class="nx-input">
    </div>
    <div class="nx-card p-5 space-y-3">
        <h3 class="font-bold text-pink-400"><i class="fab fa-instagram mr-2"></i>Instagram</h3>
        <p class="text-xs text-slate-500">Khali chhor dein to Facebook App ID use hogi (Meta same app)</p>
        <input name="instagram_app_id" placeholder="Instagram App ID (optional)" class="nx-input">
        <input name="instagram_app_secret" type="password" placeholder="Instagram App Secret (optional)" class="nx-input">
    </div>
    <div class="nx-card p-5 space-y-3">
        <h3 class="font-bold text-slate-200"><i class="fab fa-github mr-2"></i>GitHub</h3>
        <input name="github_client_id" placeholder="GitHub Client ID" class="nx-input">
        <input name="github_client_secret" type="password" placeholder="GitHub Client Secret" class="nx-input">
    </div>
    <div class="nx-card p-5 space-y-3">
        <h3 class="font-bold text-sky-400"><i class="fab fa-microsoft mr-2"></i>Microsoft 365 (Graph Inbox)</h3>
        <p class="text-xs text-slate-500">Azure Portal → App registrations → Redirect URI: <code class="text-emerald-300">http://localhost/time/backend/api/microsoft/callback.php</code></p>
        <input name="microsoft_client_id" placeholder="Microsoft / Azure Client ID" class="nx-input">
        <input name="microsoft_client_secret" type="password" placeholder="Microsoft Client Secret" class="nx-input">
        <input name="microsoft_tenant_id" placeholder="Tenant ID (common = any org)" class="nx-input">
        <input name="microsoft_redirect_uri" placeholder="http://localhost/time/backend/api/microsoft/callback.php" class="nx-input">
        <a href="microsoft-inbox.php" data-spa-link class="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300"><i class="fas fa-inbox"></i> Open MS 365 Inbox</a>
    </div>
    <div class="nx-card p-5">
        <label class="block text-sm font-medium mb-2">OAuth Redirect URI</label>
        <input name="oauth_redirect_uri" placeholder="http://localhost/time/project/oauth-callback.html" class="nx-input">
    </div>
    <div class="flex flex-wrap gap-3">
        <button type="submit" class="nx-btn nx-btn-primary"><i class="fas fa-save mr-1"></i> Save OAuth Keys</button>
        <a href="../../project/login.html" target="_blank" class="nx-btn nx-btn-secondary"><i class="fas fa-external-link-alt mr-1"></i> Test Login Page</a>
    </div>
</form>

<?php
$pageScript = <<<'SCRIPT'
<script>
const oauthKeys = [
    'google_client_id', 'google_client_secret',
    'facebook_app_id', 'facebook_app_secret',
    'instagram_app_id', 'instagram_app_secret',
    'github_client_id', 'github_client_secret',
    'oauth_redirect_uri',
    'microsoft_client_id', 'microsoft_client_secret', 'microsoft_tenant_id', 'microsoft_redirect_uri'
];

const providerMeta = {
    google: { label: 'Google', icon: 'fab fa-google', color: 'text-red-400' },
    facebook: { label: 'Facebook', icon: 'fab fa-facebook-f', color: 'text-blue-400' },
    instagram: { label: 'Instagram', icon: 'fab fa-instagram', color: 'text-pink-400' },
    github: { label: 'GitHub', icon: 'fab fa-github', color: 'text-slate-200' },
    microsoft: { label: 'Microsoft', icon: 'fab fa-microsoft', color: 'text-sky-400' }
};

async function loadOAuth() {
    try {
        const [settingsRes, publicRes] = await Promise.all([
            AdminAPI.get('settings/read.php'),
            fetch('/time/backend/api/auth/social-config-public.php').then(r => r.json())
        ]);
        const settings = settingsRes.data || [];
        const form = document.getElementById('oauthForm');
        oauthKeys.forEach(key => {
            const row = settings.find(s => s.setting_key === key);
            const input = form.querySelector(`[name="${key}"]`);
            if (input && row) input.value = row.setting_value || '';
        });
        const pub = publicRes.data || {};
        document.getElementById('redirectPreview').textContent = pub.redirect_uri || 'http://localhost/time/project/oauth-callback.html';
        renderStatus(pub.providers || {});
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function renderStatus(providers) {
    document.getElementById('providerStatus').innerHTML = Object.entries(providerMeta).map(([key, meta]) => {
        const ok = providers[key];
        return `<div class="rounded-xl p-4 border ${ok ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-slate-700 bg-slate-900'}">
            <div class="${meta.color} text-lg mb-1"><i class="${meta.icon}"></i> ${meta.label}</div>
            <div class="text-xs ${ok ? 'text-emerald-300' : 'text-slate-500'}">${ok ? '✓ Ready' : '✗ Keys missing'}</div>
        </div>`;
    }).join('');
}

document.getElementById('oauthForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const payload = {};
    oauthKeys.forEach(key => {
        payload[key] = form[key].value.trim();
    });
    try {
        await AdminAPI.put('settings/update.php', { settings: payload });
        showToast('OAuth keys saved — login page refresh karein');
        loadOAuth();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

loadOAuth();
</script>
SCRIPT;
include 'includes/layout-end.php';
?>
