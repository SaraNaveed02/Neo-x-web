<?php
/*
    FILE: api/services/create.php
    PURPOSE: Create new service (admin only)
*/

require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../includes/auth-check.php';
require_once '../../includes/response.php';
require_once '../../includes/functions.php';
require_once '../../includes/request.php';

requireAdminRole();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();

$name = sanitizeInput($data['name'] ?? '');
$description = sanitizeInput($data['description'] ?? '');
$icon = sanitizeInput($data['icon'] ?? '');
$slug = sanitizeInput($data['slug'] ?? '');

if (empty($name)) {
    sendError('Service name is required');
}

$database = new Database();
$db = $database->getConnection();

$stmt = $db->prepare("INSERT INTO services (name, description, icon, slug, created_at) VALUES (?, ?, ?, ?, NOW())");

if ($stmt->execute([$name, $description, $icon, $slug])) {
    sendSuccess('Service created successfully', ['service_id' => $db->lastInsertId()]);
} else {
    sendError('Creation failed', 500);
}
?>