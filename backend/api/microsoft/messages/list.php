<?php
/*
    FILE: api/microsoft/messages/list.php
    MVC entry — list cached/synced messages from database
*/

require_once __DIR__ . '/../_init.php';
require_once dirname(__DIR__, 3) . '/includes/request.php';
require_once dirname(__DIR__, 3) . '/includes/auth-jwt.php';

use App\Controllers\ApiResponse;
use App\Controllers\MicrosoftMailController;

requireMethod('GET');

try {
    $admin = requireAdminAuth();
    $limit = max(1, min(200, (int) ($_GET['limit'] ?? 50)));
    $offset = max(0, (int) ($_GET['offset'] ?? 0));
    $search = trim((string) ($_GET['search'] ?? ''));

    $controller = new MicrosoftMailController(db());
    $data = $controller->listCached((int) $admin['user_id'], $limit, $offset, $search);
    ApiResponse::success('Mail messages', $data);
} catch (Throwable $e) {
    ApiResponse::handle($e);
}
