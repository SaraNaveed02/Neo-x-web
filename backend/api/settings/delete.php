<?php
/*
    FILE: api/settings/delete.php
    PURPOSE: Delete a setting by key (admin only)
*/

require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../includes/auth-check.php';
require_once '../../includes/response.php';
require_once '../../includes/functions.php';
require_once '../../includes/request.php';

requireAdminRole();
requireMethod('DELETE');

$data = getJsonInput();
$key = sanitizeInput($data['key'] ?? $data['setting_key'] ?? '');

if ($key === '') {
    sendError('Setting key is required');
}

$protected = ['site_name', 'contact_email', 'maintenance_mode'];
if (in_array($key, $protected, true)) {
    sendError('This setting cannot be deleted', 400);
}

$database = new Database();
$db = $database->getConnection();
$stmt = $db->prepare('DELETE FROM settings WHERE setting_key = ?');

if ($stmt->execute([$key])) {
    sendSuccess('Setting deleted');
}

sendError('Delete failed', 500);

?>
