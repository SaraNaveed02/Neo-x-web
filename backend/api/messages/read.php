<?php
/*
    FILE: api/messages/read.php
    PURPOSE: Return all messages for admin review
*/

require_once '../../includes/auth-jwt.php';
require_once '../../includes/bootstrap.php';

requireAdminAuth();

$limit = isset($_GET['limit']) ? max(1, min(500, (int) $_GET['limit'])) : 100;
$offset = isset($_GET['offset']) ? max(0, (int) $_GET['offset']) : 0;

$db = db();

$stmt = $db->prepare(
    'SELECT id, name, email, phone, message, is_read, created_at
     FROM messages ORDER BY created_at DESC LIMIT ? OFFSET ?'
);
$stmt->bindValue(1, $limit, PDO::PARAM_INT);
$stmt->bindValue(2, $offset, PDO::PARAM_INT);
$stmt->execute();

sendSuccess('Messages retrieved', $stmt->fetchAll());

?>
