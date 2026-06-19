<?php
/*
    FILE: api/microsoft/disconnect.php
    MVC entry — disconnect mailbox (own account only)
*/

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__, 2) . '/includes/request.php';
require_once dirname(__DIR__, 2) . '/includes/auth-jwt.php';

use App\Controllers\ApiResponse;
use App\Controllers\MicrosoftAuthController;

requireMethod('POST');

try {
    $admin = requireAdminAuth();
    $controller = new MicrosoftAuthController(db());
    $controller->disconnect((int) $admin['user_id']);
    ApiResponse::success('Microsoft account disconnected');
} catch (Throwable $e) {
    ApiResponse::handle($e);
}
