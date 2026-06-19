<?php
/*
    FILE: api/microsoft/inbox-live.php
    MVC entry — read emails directly from Graph API (live example)
*/

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__, 2) . '/includes/request.php';
require_once dirname(__DIR__, 2) . '/includes/auth-jwt.php';

use App\Controllers\ApiResponse;
use App\Controllers\MicrosoftMailController;

requireMethod('GET');

try {
    $admin = requireAdminAuth();
    $top = max(1, min(50, (int) ($_GET['top'] ?? 10)));
    $controller = new MicrosoftMailController(db());
    $inbox = $controller->liveInbox((int) $admin['user_id'], $top);
    ApiResponse::success('Live inbox from Microsoft Graph', $inbox);
} catch (Throwable $e) {
    ApiResponse::handle($e);
}
