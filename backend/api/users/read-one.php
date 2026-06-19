<?php
/*
    FILE: api/users/read-one.php
    PURPOSE: Get single user by ID (admin only)
*/

require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../includes/auth-check.php';
require_once '../../includes/response.php';
require_once '../../includes/request.php';

requireAdminRole();

$id = getQueryInt('id');
if ($id <= 0) {
    sendError('User ID is required');
}

$database = new Database();
$db = $database->getConnection();

$stmt = $db->prepare('SELECT id, name, email, google_id, role, is_active, created_at, updated_at FROM users WHERE id = ?');
$stmt->execute([$id]);
$user = $stmt->fetch();

if (!$user) {
    sendError('User not found', 404);
}

$user['is_active'] = (bool) $user['is_active'];
sendSuccess('User retrieved', $user);

?>
