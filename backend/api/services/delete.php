<?php
/*
    FILE: api/services/delete.php
    PURPOSE: Delete service (admin only)
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
    sendError('Service ID is required');
}

$database = new Database();
$db = $database->getConnection();
$stmt = $db->prepare('DELETE FROM services WHERE id = ?');

if ($stmt->execute([$id])) {
    sendSuccess('Service deleted successfully');
}

sendError('Delete failed', 500);

?>
