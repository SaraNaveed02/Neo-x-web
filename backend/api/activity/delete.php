<?php
/*
    FILE: api/activity/delete.php
    PURPOSE: Admin — delete activity log entry
*/

require_once '../../includes/auth-jwt.php';
require_once '../../includes/bootstrap.php';
require_once '../../includes/request.php';

requireAdminAuth();
requireMethod('DELETE');

$data = getJsonInput();
$id = (int) ($data['id'] ?? 0);

if ($id <= 0) {
    sendError('Activity id is required', 400);
}

$db = db();
$stmt = $db->prepare('DELETE FROM activity_log WHERE id = ?');

if ($stmt->execute([$id]) && $stmt->rowCount() > 0) {
    sendSuccess('Activity deleted');
}

sendError('Delete failed or not found', 404);

?>
