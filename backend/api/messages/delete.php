<?php
/*
    FILE: api/messages/delete.php
    PURPOSE: Delete a message from the database (admin only)
*/

require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../includes/auth-check.php';
require_once '../../includes/response.php';

requireAdminRole();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendError('Method not allowed', 405);
}

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? (int) $data['id'] : 0;

if (!$id) {
    sendError('Message ID is required');
}

$database = new Database();
$db = $database->getConnection();

$stmt = $db->prepare("DELETE FROM messages WHERE id = ?");

if ($stmt->execute([$id])) {
    sendSuccess('Message deleted successfully');
} else {
    sendError('Delete failed', 500);
}
?>