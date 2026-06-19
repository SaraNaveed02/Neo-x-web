<?php
/*
    FILE: api/messages/update.php
    PURPOSE: Update message read status for admins
*/

require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../includes/auth-check.php';
require_once '../../includes/response.php';

requireAdminRole();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendError('Method not allowed', 405);
}

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? (int) $data['id'] : 0;
$isRead = isset($data['is_read']) ? (bool) $data['is_read'] : null;

if (!$id || $isRead === null) {
    sendError('Message ID and is_read are required');
}

$database = new Database();
$db = $database->getConnection();

$stmt = $db->prepare("UPDATE messages SET is_read = ? WHERE id = ?");

if ($stmt->execute([$isRead ? 1 : 0, $id])) {
    sendSuccess('Message status updated successfully');
} else {
    sendError('Update failed', 500);
}
?>