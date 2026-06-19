<?php
/*
    FILE: api/users/update.php
    PURPOSE: Update user (admin only)
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
    sendError('User ID is required');
}

$database = new Database();
$db = $database->getConnection();

$existing = $db->prepare('SELECT id, email, role FROM users WHERE id = ?');
$existing->execute([$id]);
$user = $existing->fetch();

if (!$user) {
    sendError('User not found', 404);
}

$fields = [];
$params = [];

if (isset($data['name'])) {
    $name = sanitizeInput($data['name']);
    if (strlen($name) < 2) {
        sendError('Name must be at least 2 characters');
    }
    $fields[] = 'name = ?';
    $params[] = $name;
}

if (isset($data['email'])) {
    $email = sanitizeInput($data['email']);
    if (!validateEmail($email)) {
        sendError('Invalid email format');
    }
    $dup = $db->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
    $dup->execute([$email, $id]);
    if ($dup->fetch()) {
        sendError('Email already in use', 409);
    }
    $fields[] = 'email = ?';
    $params[] = $email;
}

if (isset($data['role'])) {
    $role = sanitizeInput($data['role']);
    if (!in_array($role, ['admin', 'client'], true)) {
        sendError('Invalid role');
    }
    $fields[] = 'role = ?';
    $params[] = $role;
}

if (isset($data['is_active'])) {
    $fields[] = 'is_active = ?';
    $params[] = $data['is_active'] ? 1 : 0;
}

if (!empty($data['password'])) {
    if (strlen($data['password']) < 6) {
        sendError('Password must be at least 6 characters');
    }
    $fields[] = 'password = ?';
    $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
}

if (empty($fields)) {
    sendError('No fields to update');
}

$params[] = $id;
$sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?';
$stmt = $db->prepare($sql);

if ($stmt->execute($params)) {
    sendSuccess('User updated successfully');
}

sendError('Update failed', 500);

?>
