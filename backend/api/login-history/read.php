<?php
/*
    FILE: api/login-history/read.php
    PURPOSE: List login history (admin only)
*/

require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../includes/response.php';
require_once '../../includes/auth-jwt.php';
require_once '../../includes/request.php';

requireAdminAuth();

$search = trim($_GET['search'] ?? '');
$type = trim($_GET['type'] ?? '');
$limit = max(1, min(200, getQueryInt('limit', 50)));
$offset = max(0, getQueryInt('offset', 0));

$database = new Database();
$db = $database->getConnection();

$sql = 'SELECT lh.id, lh.user_id, lh.email, lh.ip_address, lh.user_agent, lh.login_type, lh.created_at, u.name AS user_name
        FROM login_history lh
        LEFT JOIN users u ON u.id = lh.user_id
        WHERE 1=1';
$params = [];

if ($search !== '') {
    $sql .= ' AND (lh.email LIKE ? OR u.name LIKE ?)';
    $params[] = "%$search%";
    $params[] = "%$search%";
}
if ($type !== '' && in_array($type, ['client', 'admin'], true)) {
    $sql .= ' AND lh.login_type = ?';
    $params[] = $type;
}

$sql .= ' ORDER BY lh.created_at DESC LIMIT ? OFFSET ?';
$params[] = $limit;
$params[] = $offset;

$stmt = $db->prepare($sql);
foreach ($params as $i => $val) {
    $stmt->bindValue($i + 1, $val, is_int($val) ? PDO::PARAM_INT : PDO::PARAM_STR);
}
$stmt->execute();

sendSuccess('Login history retrieved', $stmt->fetchAll());

?>
