<?php
/*
    FILE: api/health.php
    PURPOSE: Check API + database + auth system status
*/

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/includes/response.php';

use App\Core\Database;

$checks = [
    'api' => true,
    'env' => is_file(dirname(__DIR__) . '/.env'),
    'database' => false,
    'tables' => [],
    'admin_user' => false,
    'mvc_auth' => class_exists('App\\Services\\AuthService'),
];

try {
    $db = Database::connection();
    $checks['database'] = true;

    $tables = [
        'users', 'user_sessions', 'messages', 'login_history', 'activity_log',
        'dashboard_stats', 'settings', 'services', 'site_stats',
        'microsoft_connections', 'mail_messages',
    ];

    foreach ($tables as $table) {
        try {
            $db->query("SELECT 1 FROM `{$table}` LIMIT 1");
            $checks['tables'][$table] = true;
        } catch (PDOException $e) {
            $checks['tables'][$table] = false;
        }
    }

    $stmt = $db->prepare("SELECT id, password FROM users WHERE username = 'admin' AND role = 'admin' LIMIT 1");
    $stmt->execute();
    $admin = $stmt->fetch();
    $checks['admin_user'] = (bool) $admin;
    $checks['admin_password_hashed'] = $admin
        ? (str_starts_with((string) $admin['password'], '$2y$') || str_starts_with((string) $admin['password'], '$2a$'))
        : false;
} catch (Throwable $e) {
    $checks['database_error'] = $e->getMessage();
}

$tableOk = !in_array(false, $checks['tables'], true);
$allOk = $checks['database'] && $checks['admin_user'] && $checks['admin_password_hashed'] && $tableOk && $checks['mvc_auth'];

sendSuccess($allOk ? 'All systems OK' : 'Setup required — run install.php', [
    'checks' => $checks,
    'install_url' => '/time/backend/install.php',
    'admin_login' => ['username' => 'admin', 'note' => 'Password stored as bcrypt hash'],
]);

?>
