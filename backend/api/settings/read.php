<?php
/*
    FILE: api/settings/read.php
    PURPOSE: Get all settings (admin only)
*/

require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../includes/auth-check.php';
require_once '../../includes/response.php';

requireAdminRole();

$database = new Database();
$db = $database->getConnection();

$group = isset($_GET['group']) ? trim($_GET['group']) : '';

if ($group !== '') {
    $stmt = $db->prepare('SELECT id, setting_key, setting_value, setting_group, updated_at FROM settings WHERE setting_group = ? ORDER BY setting_key');
    $stmt->execute([$group]);
} else {
    $stmt = $db->query('SELECT id, setting_key, setting_value, setting_group, updated_at FROM settings ORDER BY setting_group, setting_key');
}

$settings = $stmt->fetchAll();
sendSuccess('Settings retrieved', $settings);

?>
