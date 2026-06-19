<?php
require_once __DIR__ . '/ui.php';
require_once __DIR__ . '/../../includes/auth-check.php';
requireAdminPage();

$adminName = htmlspecialchars($_SESSION['admin_username'] ?? 'Admin', ENT_QUOTES, 'UTF-8');
$adminEmail = htmlspecialchars($_SESSION['admin_email'] ?? '', ENT_QUOTES, 'UTF-8');
$pageTitle = $pageTitle ?? 'Admin';
$activeNav = $activeNav ?? '';
$NX_PARTIAL = !empty($NX_PARTIAL) || ui_is_partial_request();

if ($NX_PARTIAL) {
    return;
}
?>
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#020617">
    <title><?php echo htmlspecialchars($pageTitle, ENT_QUOTES); ?> | NEOXWEB Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: { brand: { purple: '#8b5cf6', green: '#10b981' } },
                    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
                }
            }
        };
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="assets/nexura-ui.css">
    <script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
</head>
<body class="nx-app-body bg-slate-950 text-slate-100 font-sans min-h-screen">
<?php echo ui_loading_overlay('pageLoader'); ?>

<div class="flex min-h-screen">
    <div id="sidebarOverlay" class="fixed inset-0 bg-black/60 z-40 hidden lg:hidden" onclick="toggleSidebar()"></div>

    <aside id="sidebar" class="fixed lg:static inset-y-0 left-0 z-50 w-72 -translate-x-full lg:translate-x-0 transition-transform duration-300 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div class="p-6 border-b border-slate-800">
            <a href="dashboard.php" class="text-xl font-extrabold bg-gradient-to-r from-violet-500 to-emerald-400 bg-clip-text text-transparent">✦ NEOXWEB</a>
            <p class="text-slate-400 text-sm mt-1">Admin Panel — full control</p>
        </div>
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
            <?php
            $navItems = [
                ['dashboard.php', 'fa-chart-pie', 'Dashboard', 'dashboard'],
                ['messages.php', 'fa-envelope', 'Messages', 'messages'],
                ['services.php', 'fa-briefcase', 'Services', 'services'],
                ['settings.php', 'fa-cog', 'Settings', 'settings'],
                ['site-stats.php', 'fa-chart-line', 'Site Stats', 'stats'],
                ['login-history.php', 'fa-history', 'Login History', 'logins'],
                ['oauth.php', 'fa-key', 'OAuth / API Keys', 'oauth'],
            ];
            foreach ($navItems as [$href, $icon, $label, $key]):
                $active = $activeNav === $key;
                $cls = $active
                    ? 'bg-violet-500/10 text-violet-400 nx-nav-active'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white';
            ?>
            <a href="<?php echo $href; ?>" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition <?php echo $cls; ?>">
                <i class="fas <?php echo $icon; ?> w-5"></i> <?php echo $label; ?>
            </a>
            <?php endforeach; ?>
        </nav>
        <div class="p-4 border-t border-slate-800">
            <button type="button" onclick="adminLogout()" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-sm font-medium">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
        <header class="sticky top-0 z-30 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
                <button type="button" onclick="toggleSidebar()" class="lg:hidden p-2 rounded-lg border border-slate-700 text-slate-300" aria-label="Menu"><i class="fas fa-bars"></i></button>
                <div class="min-w-0">
                    <h1 class="text-lg lg:text-xl font-bold truncate"><?php echo htmlspecialchars($pageTitle, ENT_QUOTES); ?></h1>
                    <p class="text-slate-400 text-sm hidden sm:block truncate">Welcome back, <?php echo $adminName; ?></p>
                </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span id="liveIndicator" class="hidden sm:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live
                </span>

                <button type="button" id="themeToggleBtn" class="nx-icon-btn" aria-label="Toggle theme"><i class="fas fa-moon"></i></button>

                <div class="relative">
                    <button type="button" id="notifToggleBtn" class="nx-icon-btn relative" aria-label="Notifications">
                        <i class="fas fa-bell"></i>
                        <span id="notifBadge" class="hidden absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-violet-600 text-[10px] font-bold grid place-items-center">0</span>
                    </button>
                    <div id="notifPanel" class="nx-notif-panel">
                        <div class="px-4 py-3 border-b border-slate-800 font-semibold text-sm">Notifications</div>
                        <div id="notifList"><p class="nx-notif-empty p-4 text-slate-500 text-sm">No new notifications</p></div>
                    </div>
                </div>

                <div class="relative">
                    <button type="button" id="profileToggleBtn" class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800/80 transition">
                        <span class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-emerald-400 grid place-items-center text-xs font-bold"><?php echo strtoupper(substr($adminName, 0, 2)); ?></span>
                        <span class="hidden md:block text-sm font-medium max-w-[7rem] truncate"><?php echo $adminName; ?></span>
                        <i class="fas fa-chevron-down text-xs text-slate-500 hidden md:inline"></i>
                    </button>
                    <div id="profilePanel" class="nx-profile-panel">
                        <div class="px-4 py-3 border-b border-slate-800">
                            <strong class="block text-sm"><?php echo $adminName; ?></strong>
                            <?php if ($adminEmail): ?><span class="text-xs text-slate-400"><?php echo $adminEmail; ?></span><?php endif; ?>
                        </div>
                        <a href="settings.php" data-spa-link><i class="fas fa-cog w-4"></i> Settings</a>
                        <a href="../../project/index.html" target="_blank" rel="noopener"><i class="fas fa-external-link-alt w-4"></i> View Website</a>
                        <button type="button" onclick="adminLogout()"><i class="fas fa-sign-out-alt w-4"></i> Sign out</button>
                    </div>
                </div>
            </div>
        </header>

        <main id="appContent" class="flex-1 p-4 lg:p-8 overflow-x-hidden nx-animate-in">
