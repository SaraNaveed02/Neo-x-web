<?php
/*
    FILE: api/users/profile.php
    PURPOSE: Update logged-in user profile
*/

require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../includes/response.php';
require_once '../../includes/functions.php';
require_once '../../includes/request.php';
require_once '../../includes/auth-jwt.php';

$authUser = requireAuth();
requireMethod('PUT');

$data = getJsonInput();
$userId = $authUser['user_id'];

$database = new Database();
$db = $database->getConnection();

if (isset($data['name'])) {
    $name = sanitizeInput($data['name']);
    if (strlen($name) < 2) {
        sendError('Name must be at least 2 characters');
    }
    $stmt = $db->prepare('UPDATE users SET name = ? WHERE id = ?');
    $stmt->execute([$name, $userId]);
    $_SESSION['user_name'] = $name;
}

if (!empty($data['password'])) {
    if (strlen($data['password']) < 6) {
        sendError('Password must be at least 6 characters');
    }
    $hash = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt = $db->prepare('UPDATE users SET password = ? WHERE id = ?');
    $stmt->execute([$hash, $userId]);
}

$stmt = $db->prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();

sendSuccess('Profile updated', [
    'id' => $user['id'],
    'name' => $user['name'],
    'email' => $user['email'],
    'role' => $user['role'],
    'is_admin' => $user['role'] === 'admin'
]);

?>
