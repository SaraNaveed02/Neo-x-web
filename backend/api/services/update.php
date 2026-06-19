<?php
/*
    FILE: api/services/update.php
    PURPOSE: Update service (admin only)
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
$id = isset($data['id']) ? (int) $data['id'] : 0;

if ($id <= 0) {
    sendError('Service ID is required');
}

$database = new Database();
$db = $database->getConnection();

$fields = [];
$params = [];

if (isset($data['name'])) {
    $fields[] = 'name = ?';
    $params[] = sanitizeInput($data['name']);
}
if (isset($data['description'])) {
    $fields[] = 'description = ?';
    $params[] = sanitizeInput($data['description']);
}
if (isset($data['icon'])) {
    $fields[] = 'icon = ?';
    $params[] = sanitizeInput($data['icon']);
}
if (isset($data['slug'])) {
    $fields[] = 'slug = ?';
    $params[] = sanitizeInput($data['slug']);
}
if (isset($data['is_active'])) {
    $fields[] = 'is_active = ?';
    $params[] = $data['is_active'] ? 1 : 0;
}

if (empty($fields)) {
    sendError('No fields to update');
}

$params[] = $id;
$sql = 'UPDATE services SET ' . implode(', ', $fields) . ' WHERE id = ?';
$stmt = $db->prepare($sql);

if ($stmt->execute($params)) {
    sendSuccess('Service updated successfully');
}

sendError('Update failed', 500);

?>
