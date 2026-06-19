<?php
/*
    FILE: api/users/read.php
    PURPOSE: Return all registered users for admin use
*/

require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../includes/auth-check.php';
require_once '../../includes/response.php';

requireAdminRole();

$database = new Database();
$db = $database->getConnection();

$stmt = $db->query("SELECT id, name, email, google_id, facebook_id, instagram_id, github_id, auth_provider, avatar_url, role, is_active, last_login_at, created_at, updated_at FROM users ORDER BY created_at DESC");
$users = $stmt->fetchAll();

sendSuccess('Users retrieved', $users);
?>