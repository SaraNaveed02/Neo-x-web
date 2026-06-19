<?php
require_once __DIR__ . '/includes/auth-check.php';
if (isAdminLoggedIn()) {
    header('Location: admin/dashboard.php', true, 302);
    exit;
}
?>
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#020617">
    <title>Admin Login | NEOXWEB</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="admin/assets/nexura-ui.css">
    <style>
        body { background: radial-gradient(ellipse at top, #0f172a 0%, #020617 55%, #000 100%); }
        .nx-login-card { box-shadow: 0 24px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(74,222,128,.12); }
        .nx-login-foot a { font-size: 0.8125rem; }
    </style>
</head>
<body class="nx-app-body min-h-screen flex items-center justify-center p-4 font-sans text-slate-100">
    <div id="loginLoader" class="nx-page-loader hidden"><div class="nx-spinner"></div></div>

    <div class="w-full max-w-md rounded-2xl bg-slate-900/95 border border-slate-800 p-6 sm:p-8 nx-login-card nx-animate-in">
        <div class="text-center mb-8">
            <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-400 grid place-items-center text-xl font-bold text-slate-950">N</div>
            <h1 class="text-2xl font-extrabold text-white">NEOXWEB Admin</h1>
            <p class="text-slate-400 text-sm mt-2">Sign in to manage contact messages</p>
        </div>
        <form id="loginForm" class="space-y-4" novalidate>
            <div>
                <label class="block text-sm text-slate-400 mb-1.5" for="username">Username</label>
                <input type="text" id="username" required placeholder="admin" autocomplete="username" class="nx-input">
            </div>
            <div>
                <label class="block text-sm text-slate-400 mb-1.5" for="password">Password</label>
                <input type="password" id="password" required placeholder="admin123" autocomplete="current-password" class="nx-input">
            </div>
            <button type="submit" id="loginSubmitBtn" class="nx-btn nx-btn-primary w-full py-3.5">
                <span id="loginBtnText">Sign in</span>
                <i id="loginBtnSpinner" class="fas fa-spinner fa-spin hidden"></i>
            </button>
            <p id="errorMsg" class="text-red-400 text-sm text-center hidden"></p>
        </form>
        <div class="nx-login-foot text-center mt-6 space-y-2">
            <a href="install.php" class="block text-slate-500 hover:text-slate-300">First time? Install database</a>
            <a href="start.html" class="block text-slate-400 hover:text-slate-200">Backend links</a>
            <a href="../project/index.html" class="block text-emerald-400 hover:text-emerald-300">← Back to website</a>
        </div>
    </div>

    <script src="admin/assets/nexura-ui.js"></script>
    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const err = document.getElementById('errorMsg');
            const loader = document.getElementById('loginLoader');
            const btnText = document.getElementById('loginBtnText');
            const spinner = document.getElementById('loginBtnSpinner');
            err.classList.add('hidden');
            loader.classList.remove('hidden');
            btnText.textContent = 'Signing in...';
            spinner.classList.remove('hidden');

            try {
                const res = await fetch('api/auth/admin-login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        username: document.getElementById('username').value.trim(),
                        password: document.getElementById('password').value
                    })
                });
                const data = await res.json();
                if (data.success) {
                    if (data.data?.token) {
                        localStorage.setItem('nexuraAdminToken', data.data.token);
                        if (window.AdminAPI) AdminAPI.setToken(data.data.token);
                    }
                    if (data.data?.csrf_token) {
                        localStorage.setItem('nexuraAdminCsrf', data.data.csrf_token);
                        if (window.AdminAPI) AdminAPI.setCsrf(data.data.csrf_token);
                    }
                    window.location.href = 'admin/dashboard.php';
                } else {
                    err.textContent = data.error || 'Login failed — run install.php first';
                    err.classList.remove('hidden');
                }
            } catch {
                err.textContent = 'Server connect nahi hua — XAMPP Apache + MySQL on karein';
                err.classList.remove('hidden');
            } finally {
                loader.classList.add('hidden');
                btnText.textContent = 'Sign in';
                spinner.classList.add('hidden');
            }
        });
    </script>
</body>
</html>
