<?php
/*
    FILE: api/stats/delete.php
    PURPOSE: Admin — delete site stat
*/

require_once '../../includes/auth-jwt.php';
require_once '../../includes/bootstrap.php';
require_once '../../includes/request.php';

requireAdminAuth();
requireMethod('DELETE');

$data = getJsonInput();
$id = (int) ($data['id'] ?? 0);

if ($id <= 0) {
    sendError('Stat id is required', 400);
}

$db = db();
$stmt = $db->prepare('DELETE FROM site_stats WHERE id = ?');

if ($stmt->execute([$id]) && $stmt->rowCount() > 0) {
    sendSuccess('Stat deleted');
}

sendError('Delete failed or stat not found', 404);

?>
