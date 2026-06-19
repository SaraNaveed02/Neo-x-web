<?php
/*
    FILE: api/settings/update.php
    PURPOSE: Update one or many settings (admin only)
*/

require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../includes/auth-check.php';
require_once '../../includes/response.php';
require_once '../../includes/functions.php';
require_once '../../includes/request.php';

requireAdminRole();
requireMethod('PUT');

$data = getJsonInput();
$settings = $data['settings'] ?? $data;

if (!is_array($settings) || empty($settings)) {
    sendError('Settings payload is required');
}

$database = new Database();
$db = $database->getConnection();
$updated = 0;

foreach ($settings as $key => $value) {
    if (!is_string($key) || $key === '') {
        continue;
    }
    $cleanKey = sanitizeInput($key);
    $cleanValue = is_scalar($value) ? sanitizeInput((string) $value) : '';

    $stmt = $db->prepare('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
    if ($stmt->execute([$cleanKey, $cleanValue])) {
        $updated++;
    }
}

sendSuccess('Settings updated', ['updated' => $updated]);

?>
