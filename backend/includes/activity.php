<?php
/*
    FILE: includes/activity.php
    PURPOSE: Activity logging, login history, dashboard stats sync, realtime emit
*/

require_once __DIR__ . '/../config/constants.php';
require_once __DIR__ . '/jwt.php';

function logLoginHistory(PDO $db, ?int $userId, string $email, string $loginType = 'client'): void
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $agent = substr($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 0, 255);

    $stmt = $db->prepare(
        'INSERT INTO login_history (user_id, email, ip_address, user_agent, login_type) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([$userId, $email, $ip, $agent, $loginType]);

    if ($userId) {
        $db->prepare('UPDATE users SET last_login_at = NOW() WHERE id = ?')->execute([$userId]);
    }
}

function logActivity(PDO $db, string $type, string $title, ?string $description = null, ?int $userId = null, ?int $referenceId = null, ?array $meta = null): void
{
    $stmt = $db->prepare(
        'INSERT INTO activity_log (activity_type, user_id, reference_id, title, description, meta) VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $type,
        $userId,
        $referenceId,
        $title,
        $description,
        $meta ? json_encode($meta) : null
    ]);
}

function syncDashboardStats(PDO $db): array
{
    $totalUsers = (int) $db->query('SELECT COUNT(*) AS c FROM users')->fetch()['c'];
    $totalMessages = (int) $db->query('SELECT COUNT(*) AS c FROM messages')->fetch()['c'];
    $totalLogins = (int) $db->query('SELECT COUNT(*) AS c FROM login_history')->fetch()['c'];

    $pairs = [
        'total_users' => $totalUsers,
        'total_messages' => $totalMessages,
        'total_logins' => $totalLogins
    ];

    $upsert = $db->prepare(
        'INSERT INTO dashboard_stats (stat_key, stat_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE stat_value = VALUES(stat_value), updated_at = NOW()'
    );

    foreach ($pairs as $key => $value) {
        $upsert->execute([$key, $value]);
    }

    return $pairs;
}

function getRecentActivity(PDO $db, int $limit = 15): array
{
    $stmt = $db->prepare(
        'SELECT id, activity_type, user_id, reference_id, title, description, created_at
         FROM activity_log ORDER BY created_at DESC LIMIT ?'
    );
    $stmt->bindValue(1, $limit, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll();
}

function emitRealtimeEvent(string $event, array $data = []): void
{
    if (!defined('REALTIME_URL') || !defined('REALTIME_SECRET')) {
        return;
    }

    $url = rtrim(REALTIME_URL, '/') . '/emit';
    $payload = json_encode(['event' => $event, 'data' => $data]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'X-Realtime-Secret: ' . REALTIME_SECRET
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 2,
        CURLOPT_CONNECTTIMEOUT => 1
    ]);
    curl_exec($ch);
    curl_close($ch);
}

function buildAuthResponse(PDO $db, array $user): array
{
    $token = JWT::encode([
        'user_id' => (int) $user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'role' => $user['role']
    ], JWT_SECRET);

    return [
        'token' => $token,
        'user' => [
            'user_id' => (int) $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'is_admin' => $user['role'] === 'admin',
            'avatar_url' => $user['avatar_url'] ?? '',
            'auth_provider' => $user['auth_provider'] ?? 'email',
        ]
    ];
}

?>
