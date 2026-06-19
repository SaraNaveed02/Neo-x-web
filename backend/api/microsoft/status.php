<?php
/*
    FILE: api/microsoft/status.php
    MVC entry — connection status
*/

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__, 2) . '/includes/request.php';
require_once dirname(__DIR__, 2) . '/includes/auth-jwt.php';

use App\Controllers\ApiResponse;
use App\Controllers\MicrosoftAuthController;

requireMethod('GET');

try {
    $admin = requireAdminAuth();
    $controller = new MicrosoftAuthController(db());
    ApiResponse::success('Microsoft status', $controller->status((int) $admin['user_id']));
} catch (Throwable $e) {
    ApiResponse::handle($e);
}
