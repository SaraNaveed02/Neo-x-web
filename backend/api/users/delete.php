<?php
/*
    FILE: api/users/delete.php
    PURPOSE: Delete user (admin only)
*/

require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../includes/auth-check.php';
require_once '../../includes/response.php';
require_once '../../includes/request.php';

requireAdminRole();
requireMethod('DELETE');

$data = getJsonInput();
$id = isset($data['id']) ? (int) $data['id'] : 0;

if ($id <= 0) {
    sendError('User ID is required');
}

$currentId = getSessionUserId();
if ($id === $currentId) {
    sendError('You cannot delete your own account', 400);
}

$database = new Database();
$db = $database->getConnection();

$stmt = $db->prepare('SELECT id, role FROM users WHERE id = ?');
$stmt->execute([$id]);
$user = $stmt->fetch();

if (!$user) {
    sendError('User not found', 404);
}

$adminCount = $db->query("SELECT COUNT(*) AS total FROM users WHERE role = 'admin'")->fetch();
if ($user['role'] === 'admin' && (int) $adminCount['total'] <= 1) {
    sendError('Cannot delete the last admin account', 400);
}

$delete = $db->prepare('DELETE FROM users WHERE id = ?');
if ($delete->execute([$id])) {
    sendSuccess('User deleted successfully');
}

sendError('Delete failed', 500);

?>
