<?php
/*
    FILE: database/setup.php
    PURPOSE: Run schema migration (visit once in browser or CLI)
*/

require_once __DIR__ . '/../config/database.php';

header('Content-Type: text/plain; charset=UTF-8');

$sqlFile = __DIR__ . '/schema.sql';
if (!file_exists($sqlFile)) {
    echo "schema.sql not found\n";
    exit(1);
}

$database = new Database();
$pdo = $database->getConnection();

if (!$pdo) {
    echo "Database connection failed. Start MySQL in XAMPP.\n";
    exit(1);
}

$sql = file_get_contents($sqlFile);
$statements = array_filter(array_map('trim', preg_split('/;\s*\n/', $sql)));

$ok = 0;
$fail = 0;

foreach ($statements as $statement) {
    if ($statement === '' || stripos($statement, '/*') === 0) {
        continue;
    }
    try {
        $pdo->exec($statement);
        $ok++;
    } catch (PDOException $e) {
        $fail++;
        echo "Warning: " . $e->getMessage() . "\n";
    }
}

$upgrades = [
    "ALTER TABLE users ADD COLUMN username VARCHAR(50) UNIQUE NULL AFTER id",
    "ALTER TABLE users ADD COLUMN is_active TINYINT(1) DEFAULT 1",
    "ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL",
    "ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    "CREATE TABLE IF NOT EXISTS login_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        email VARCHAR(100) NOT NULL,
        ip_address VARCHAR(45) NULL,
        user_agent VARCHAR(255) NULL,
        login_type ENUM('client', 'admin') DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_login_user (user_id),
        INDEX idx_login_created (created_at)
    )",
    "CREATE TABLE IF NOT EXISTS activity_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        activity_type ENUM('signup', 'login', 'message') NOT NULL,
        user_id INT NULL,
        reference_id INT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        meta JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_activity_created (created_at)
    )",
    "CREATE TABLE IF NOT EXISTS dashboard_stats (
        stat_key VARCHAR(50) PRIMARY KEY,
        stat_value BIGINT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",
    "ALTER TABLE messages ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    "CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT NULL,
        icon VARCHAR(255) NULL,
        slug VARCHAR(150) UNIQUE NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",
    "CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT NULL,
        setting_group VARCHAR(50) DEFAULT 'general',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",
    "CREATE TABLE IF NOT EXISTS site_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stat_key VARCHAR(80) UNIQUE NOT NULL,
        stat_value VARCHAR(50) DEFAULT '0',
        stat_label VARCHAR(150) NOT NULL,
        page_slug VARCHAR(80) DEFAULT 'global',
        sort_order INT DEFAULT 0,
        is_computed TINYINT(1) DEFAULT 0,
        compute_type VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",
    "ALTER TABLE users ADD COLUMN github_id VARCHAR(255) NULL",
    "ALTER TABLE users ADD COLUMN facebook_id VARCHAR(255) NULL",
    "ALTER TABLE users ADD COLUMN instagram_id VARCHAR(255) NULL",
    "ALTER TABLE users ADD COLUMN linkedin_id VARCHAR(255) NULL",
    "ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) NULL",
    "ALTER TABLE users ADD COLUMN auth_provider VARCHAR(30) NULL",
    "CREATE TABLE IF NOT EXISTS user_sessions (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        session_token VARCHAR(64) NOT NULL,
        ip_address VARCHAR(45) NULL,
        user_agent VARCHAR(255) NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_session_token (session_token),
        INDEX idx_session_user (user_id),
        INDEX idx_session_expires (expires_at)
    )",
    "ALTER TABLE activity_log MODIFY activity_type ENUM('signup', 'login', 'message', 'logout') NOT NULL",
    "CREATE TABLE IF NOT EXISTS microsoft_connections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        microsoft_user_id VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        display_name VARCHAR(255) NULL,
        access_token_enc TEXT NOT NULL,
        refresh_token_enc TEXT NULL,
        token_expires_at DATETIME NULL,
        scopes TEXT NULL,
        is_active TINYINT(1) DEFAULT 1,
        last_sync_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_ms_user (user_id),
        INDEX idx_ms_email (email)
    )",
    "CREATE TABLE IF NOT EXISTS mail_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        connection_id INT NOT NULL,
        graph_message_id VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NULL,
        from_name VARCHAR(255) NULL,
        from_email VARCHAR(255) NULL,
        to_recipients TEXT NULL,
        body_preview TEXT NULL,
        body_html MEDIUMTEXT NULL,
        body_text MEDIUMTEXT NULL,
        is_read TINYINT(1) DEFAULT 0,
        has_attachments TINYINT(1) DEFAULT 0,
        received_at DATETIME NULL,
        synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_graph_msg (connection_id, graph_message_id),
        INDEX idx_mail_received (received_at),
        INDEX idx_mail_connection (connection_id)
    )",
];

foreach ($upgrades as $upgrade) {
    try {
        $pdo->exec($upgrade);
    } catch (PDOException $e) {
        // Column/table may already exist
    }
}

// Ensure default settings
$defaults = [
    ['site_name', 'Nexura', 'general'],
    ['site_tagline', 'Premium Software Agency', 'general'],
    ['contact_email', 'supportneoxweb@gmail.com', 'contact'],
    ['contact_phone', '+92 314 0666734', 'contact'],
    ['contact_address', 'Lahore, Pakistan', 'contact'],
    ['contact_response_time', 'Within minutes on WhatsApp', 'contact'],
    ['site_name', 'NEOXWEB', 'general'],
    ['site_tagline', 'Web Development & Digital Marketing Pakistan', 'general'],
    ['whatsapp_number', '923140666734', 'contact'],
    ['whatsapp_number_2', '923084858836', 'contact'],
    ['contact_address', '2211 Innovation Way, San Francisco, CA', 'contact'],
    ['contact_response_time', 'Within 1 business day', 'contact'],
    ['social_linkedin', 'https://linkedin.com/company/nexura', 'social'],
    ['social_twitter', 'https://twitter.com/nexura', 'social'],
    ['maintenance_mode', '0', 'system'],
    ['support_coverage', '24/7', 'general'],
    ['google_client_id', '99201620546-16nvbeh9uspnr8117m1ijeqj5up3e4kg.apps.googleusercontent.com', 'oauth'],
    ['google_client_secret', '', 'oauth'],
    ['facebook_app_id', '', 'oauth'],
    ['facebook_app_secret', '', 'oauth'],
    ['instagram_app_id', '', 'oauth'],
    ['instagram_app_secret', '', 'oauth'],
    ['github_client_id', '', 'oauth'],
    ['github_client_secret', '', 'oauth'],
    ['oauth_redirect_uri', 'http://localhost/time/project/oauth-callback.html', 'oauth'],
    ['microsoft_client_id', '', 'oauth'],
    ['microsoft_client_secret', '', 'oauth'],
    ['microsoft_tenant_id', 'common', 'oauth'],
    ['microsoft_redirect_uri', 'http://localhost/time/backend/api/microsoft/callback.php', 'oauth'],
];

$insertSetting = $pdo->prepare('INSERT IGNORE INTO settings (setting_key, setting_value, setting_group) VALUES (?, ?, ?)');
foreach ($defaults as $row) {
    $insertSetting->execute($row);
}

// Admin user: username admin / password admin123
$adminHash = '$2y$10$j.UiuQW5Clh66L/pEg35b.nnlEB004LvobhhzIr4ZozF.35NRBpbK';
$checkAdmin = $pdo->query("SELECT id FROM users WHERE username = 'admin' OR email = 'admin@example.com' LIMIT 1")->fetch();
if ($checkAdmin) {
    $pdo->prepare("UPDATE users SET username = 'admin', name = 'Admin', password = ?, role = 'admin', is_active = 1 WHERE id = ?")
        ->execute([$adminHash, $checkAdmin['id']]);
} else {
    $pdo->prepare("INSERT INTO users (username, name, email, password, role) VALUES ('admin', 'Admin', 'admin@example.com', ?, 'admin')")
        ->execute([$adminHash]);
}

// Sync dashboard stats
try {
    $pdo->exec("INSERT INTO dashboard_stats (stat_key, stat_value) VALUES ('total_users', 0), ('total_messages', 0), ('total_logins', 0) ON DUPLICATE KEY UPDATE stat_key = stat_key");
    $pdo->exec("UPDATE dashboard_stats SET stat_value = (SELECT COUNT(*) FROM users) WHERE stat_key = 'total_users'");
    $pdo->exec("UPDATE dashboard_stats SET stat_value = (SELECT COUNT(*) FROM messages) WHERE stat_key = 'total_messages'");
    $pdo->exec("UPDATE dashboard_stats SET stat_value = (SELECT COUNT(*) FROM login_history) WHERE stat_key = 'total_logins'");
} catch (PDOException $e) {}

require_once __DIR__ . '/../includes/site-stats.php';
try {
    seedDefaultSiteStats($pdo);
} catch (PDOException $e) {}

require_once __DIR__ . '/../includes/oauth-config.php';
try {
    syncOAuthFilesToDatabase($pdo);
} catch (Throwable $e) {}

echo "Migration complete. Executed: $ok, warnings: $fail\n";
echo "Admin login: username = admin  |  password = admin123\n";
echo "Import file: backend/database/nexura_db.sql\n";

?>
