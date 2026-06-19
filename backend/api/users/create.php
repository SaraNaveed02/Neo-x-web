<?php
/*
    FILE: api/users/create.php
    PURPOSE: Create user (admin only)
*/

require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../includes/auth-check.php';
require_once '../../includes/response.php';
require_once '../../includes/functions.php';
require_once '../../includes/request.php';

requireAdminRole();
requireMethod('POST');

$data = getJsonInput();
$name = sanitizeInput($data['name'] ?? '');
$email = sanitizeInput($data['email'] ?? '');
$password = $data['password'] ?? '';
$role = sanitizeInput($data['role'] ?? 'client');

if (strlen($name) < 2) {
    sendError('Name must be at least 2 characters');
}
if (!validateEmail($email)) {
    sendError('Invalid email format');
}
if (!in_array($role, ['admin', 'client'], true)) {
    sendError('Invalid role');
}
if (strlen($password) < 6) {
    sendError('Password must be at least 6 characters');
}

$database = new Database();
$db = $database->getConnection();

$check = $db->prepare('SELECT id FROM users WHERE email = ?');
$check->execute([$email]);
if ($check->fetch()) {
    sendError('Email already registered', 409);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $db->prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');

if ($stmt->execute([$name, $email, $hash, $role])) {
    sendSuccess('User created successfully', ['id' => (int) $db->lastInsertId()]);
}

sendError('Failed to create user', 500);

?>
