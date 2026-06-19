<?php
/*
    FILE: api/login-history/delete.php
    PURPOSE: Admin — delete login history record(s)
*/

require_once '../../includes/auth-jwt.php';
require_once '../../includes/bootstrap.php';
require_once '../../includes/request.php';

requireAdminAuth();

$db = db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'DELETE') {
    $data = getJsonInput();
    $id = (int) ($data['id'] ?? 0);

    if ($id > 0) {
        $stmt = $db->prepare('DELETE FROM login_history WHERE id = ?');
        if ($stmt->execute([$id]) && $stmt->rowCount() > 0) {
            sendSuccess('Login record deleted');
        }
        sendError('Record not found', 404);
    }

    if (!empty($data['clear_all'])) {
        $db->exec('DELETE FROM login_history');
        sendSuccess('All login history cleared');
    }

    sendError('id or clear_all is required', 400);
}

sendError('Method not allowed', 405);

?>
