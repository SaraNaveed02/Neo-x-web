<?php
$pageTitle = 'Dashboard';
$activeNav = 'dashboard';
include 'includes/layout-start.php';
echo ui_partial_meta($pageTitle, $activeNav);
?>

<?php echo ui_page_header('Dashboard', 'Live stats from database & API', ui_btn('Refresh', 'loadDashboard()', 'secondary', 'fa-sync-alt')); ?>

<?php echo ui_error_banner('loadError'); ?>

<div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
    <?php
    echo ui_stat_card('statUsers', 'Total Users', 'fa-users', 'violet');
    echo ui_stat_card('statMessages', 'Messages', 'fa-envelope', 'emerald');
    echo ui_stat_card('statUnread', 'Unread', 'fa-inbox', 'amber');
    echo ui_stat_card('statLogins', 'Login Events', 'fa-sign-in-alt', 'cyan');
    ?>
</div>

<div class="grid lg:grid-cols-2 gap-6">
    <div class="nx-card p-5">
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-white">Recent Messages</h3>
            <a href="messages.php" class="text-sm text-emerald-400 hover:underline">View all</a>
        </div>
        <div id="recentMessages" class="space-y-3 text-sm text-slate-400">Loading...</div>
    </div>
    <div class="nx-card p-5">
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-white">Recent Activity</h3>
            <a href="login-history.php" class="text-sm text-violet-400 hover:underline">Login history</a>
        </div>
        <div id="recentActivity" class="space-y-3 text-sm text-slate-400">Loading...</div>
    </div>
</div>

<?php
$pageScript = <<<'SCRIPT'
<script>
async function loadDashboard() {
    const errEl = document.getElementById('loadError');
    errEl.classList.add('hidden');
    try {
        const res = await AdminAPI.get('dashboard/stats.php');
        const d = res.data || {};
        document.getElementById('statUsers').textContent = d.total_users ?? 0;
        document.getElementById('statMessages').textContent = d.total_messages ?? 0;
        document.getElementById('statUnread').textContent = d.unread_messages ?? 0;
        document.getElementById('statLogins').textContent = d.total_logins ?? 0;

        const msgEl = document.getElementById('recentMessages');
        const msgs = d.recent_messages || [];
        if (!msgs.length) {
            msgEl.innerHTML = '<p class="text-slate-500">No messages yet</p>';
        } else {
            msgEl.innerHTML = msgs.map(m => `
                <div class="border-b border-slate-800 pb-3 last:border-0">
                    <div class="flex justify-between gap-2">
                        <strong class="text-slate-200">${escapeHtml(m.name)}</strong>
                        <span class="text-xs ${m.is_read == 1 ? 'text-slate-500' : 'text-emerald-400'}">${m.is_read == 1 ? 'Read' : 'New'}</span>
                    </div>
                    <p class="text-xs text-slate-500">${escapeHtml(m.email)}</p>
                    <p class="mt-1 line-clamp-2">${escapeHtml(m.message || '')}</p>
                </div>
            `).join('');
        }

        const actEl = document.getElementById('recentActivity');
        const acts = d.recent_activity || [];
        if (!acts.length) {
            actEl.innerHTML = '<p class="text-slate-500">No activity yet</p>';
        } else {
            actEl.innerHTML = acts.map(a => `
                <div class="flex gap-3 border-b border-slate-800 pb-3 last:border-0">
                    <span class="shrink-0 w-8 h-8 rounded-lg bg-violet-500/15 text-violet-400 grid place-items-center text-xs"><i class="fas fa-bolt"></i></span>
                    <div class="min-w-0">
                        <p class="text-slate-200 font-medium truncate">${escapeHtml(a.title || a.activity_type || 'Activity')}</p>
                        <p class="text-xs text-slate-500">${escapeHtml(a.description || '')}</p>
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    initRealtime({ onStats: () => loadDashboard(), onMessage: () => loadDashboard() });
});
</script>
SCRIPT;

include 'includes/layout-end.php';
