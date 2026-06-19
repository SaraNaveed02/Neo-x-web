<?php
/*
    FILE: api/microsoft/messages/sync.php
    MVC entry — sync inbox from Graph into database
*/

require_once __DIR__ . '/../_init.php';
require_once dirname(__DIR__, 3) . '/includes/request.php';
require_once dirname(__DIR__, 3) . '/includes/auth-jwt.php';

use App\Controllers\ApiResponse;
use App\Controllers\MicrosoftMailController;

requireMethod('POST');

try {
    $admin = requireAdminAuth();
    $input = getJsonInput();
    $limit = max(1, min(100, (int) ($input['limit'] ?? 50)));

    $controller = new MicrosoftMailController(db());
    $result = $controller->sync((int) $admin['user_id'], $limit);
    ApiResponse::success('Synced ' . $result['synced'] . ' messages', $result);
} catch (Throwable $e) {
    ApiResponse::handle($e);
}
