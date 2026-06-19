<?php
/**
 * Backend confirmation — tests all APIs
 * Open: http://localhost/time/backend/confirm.php
 */
header('Content-Type: text/html; charset=UTF-8');

$base = 'http://localhost/time/backend/api';
$results = [];
$passed = 0;
$failed = 0;

function test($name, $ok, $detail = '') {
    global $results, $passed, $failed;
    $results[] = ['name' => $name, 'ok' => $ok, 'detail' => $detail];
    $ok ? $passed++ : $failed++;
}

function apiPost($url, $body, $headers = []) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($body),
        CURLOPT_HTTPHEADER => array_merge(['Content-Type: application/json'], $headers),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_HEADER => true
    ]);
    $raw = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);
    $bodyStr = substr($raw, $headerSize);
    $respHeaders = substr($raw, 0, $headerSize);
    return ['code' => $code, 'json' => json_decode($bodyStr, true), 'headers' => $respHeaders, 'raw' => $bodyStr];
}

function apiGet($url, $headers = []) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10
    ]);
    $raw = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $code, 'json' => json_decode($raw, true), 'raw' => $raw];
}

// 1. Health
$h = apiGet("$base/health.php");
test('Health Check', ($h['json']['success'] ?? false) && ($h['json']['data']['checks']['database'] ?? false), $h['raw']);

// 2. Public settings
$s = apiGet("$base/settings/public.php");
test('Public Settings API', $s['json']['success'] ?? false);

// 2b. Public site stats (real DB values)
$st = apiGet("$base/stats/public.php");
test('Public Site Stats API', $st['json']['success'] ?? false, 'Services: ' . ($st['json']['data']['live']['services'] ?? '?'));

// 3. Services read
$sv = apiGet("$base/services/read.php");
test('Services Read API', $sv['json']['success'] ?? false);

// 4. Admin login
$login = apiPost("$base/auth/admin-login.php", ['username' => 'admin', 'password' => 'admin123']);
$token = $login['json']['data']['token'] ?? '';
test('Admin Login (admin/admin123)', ($login['json']['success'] ?? false) && $token !== '', $login['json']['error'] ?? 'OK');

$authHeader = $token ? ["Authorization: Bearer $token"] : [];

// 5. Dashboard stats
$stats = apiGet("$base/dashboard/stats.php", $authHeader);
test('Dashboard Stats API', $stats['json']['success'] ?? false);

// 6. Users read
$users = apiGet("$base/users/read.php", $authHeader);
test('Users Read API', $users['json']['success'] ?? false, 'Count: ' . count($users['json']['data'] ?? []));

// 7. Messages read
$msgs = apiGet("$base/messages/read.php?limit=10", $authHeader);
test('Messages Read API', $msgs['json']['success'] ?? false, 'Count: ' . count($msgs['json']['data'] ?? []));

// 8. Login history
$lh = apiGet("$base/login-history/read.php", $authHeader);
test('Login History API', $lh['json']['success'] ?? false);

// 9. Settings read (admin)
$set = apiGet("$base/settings/read.php", $authHeader);
test('Settings Read API', $set['json']['success'] ?? false);

// 10. Message create (public)
$unique = 'test' . time() . '@confirm.com';
$msg = apiPost("$base/messages/create.php", [
    'name' => 'Confirm Test',
    'email' => $unique,
    'phone' => '03001234567',
    'message' => 'Backend confirmation test message with enough characters.'
]);
test('Contact Message Create API', $msg['json']['success'] ?? false, $msg['json']['error'] ?? 'ID: ' . ($msg['json']['data']['message_id'] ?? ''));

// 11. Signup
$signupEmail = 'signup' . time() . '@confirm.com';
$signup = apiPost("$base/auth/signup.php", [
    'name' => 'Test User',
    'email' => $signupEmail,
    'password' => 'test123456'
]);
test('User Signup API', $signup['json']['success'] ?? false, $signup['json']['error'] ?? 'OK');

// 12. Client login
$clogin = apiPost("$base/auth/login.php", ['email' => $signupEmail, 'password' => 'test123456']);
$clientToken = $clogin['json']['data']['token'] ?? '';
test('User Login API', ($clogin['json']['success'] ?? false) && $clientToken !== '');

// 13. Session
if ($clientToken) {
    $sess = apiGet("$base/auth/session.php", ["Authorization: Bearer $clientToken"]);
    test('Session API', $sess['json']['success'] ?? false);
} else {
    test('Session API', false, 'Skipped — no client token');
}

$allOk = $failed === 0;
?>
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backend Confirmation | Nexura</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white min-h-screen p-4 md:p-8 font-sans">
    <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold mb-2">Backend Confirmation</h1>
        <p class="text-slate-400 text-sm mb-6">Sab APIs test ho chuki hain — <?php echo date('Y-m-d H:i:s'); ?></p>

        <div class="mb-6 p-5 rounded-2xl <?php echo $allOk ? 'bg-emerald-500/10 border border-emerald-500/40' : 'bg-amber-500/10 border border-amber-500/40'; ?>">
            <?php if ($allOk): ?>
                <p class="text-emerald-300 text-lg font-bold">✓ 100% READY — Website finalize kar sakte hain!</p>
                <p class="text-emerald-400/80 text-sm mt-1"><?php echo $passed; ?>/<?php echo $passed + $failed; ?> tests passed</p>
            <?php else: ?>
                <p class="text-amber-300 text-lg font-bold">⚠ <?php echo $failed; ?> test(s) failed</p>
                <p class="text-amber-400/80 text-sm mt-1"><a href="install.php" class="underline">install.php</a> run karein</p>
            <?php endif; ?>
        </div>

        <div class="space-y-2">
            <?php foreach ($results as $r): ?>
            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm">
                <span class="<?php echo $r['ok'] ? 'text-emerald-400' : 'text-red-400'; ?> text-lg"><?php echo $r['ok'] ? '✓' : '✗'; ?></span>
                <div>
                    <strong><?php echo htmlspecialchars($r['name']); ?></strong>
                    <?php if ($r['detail']): ?><p class="text-slate-500 text-xs mt-0.5"><?php echo htmlspecialchars($r['detail']); ?></p><?php endif; ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <a href="admin/login.php" class="p-4 rounded-xl bg-violet-600/20 border border-violet-500/30 text-center hover:bg-violet-600/30">Admin Login</a>
            <a href="../links.html" class="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center hover:bg-slate-700">Mobile Links</a>
            <a href="admin/messages.php" class="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center hover:bg-slate-700">Messages</a>
            <a href="admin/dashboard.php" class="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center hover:bg-slate-700">Dashboard</a>
        </div>

        <div class="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <strong class="text-slate-300">Admin:</strong> admin / admin123<br>
            <strong class="text-slate-300">Database:</strong> backend/database/db.sql<br>
            <strong class="text-slate-300">Install:</strong> backend/install.php
        </div>
    </div>
</body>
</html>
