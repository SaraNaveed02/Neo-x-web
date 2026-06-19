<?php
/*
    FILE: api/microsoft/profile.php
    MVC entry — Microsoft Graph /me profile (live API example)
*/

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__, 2) . '/includes/request.php';
require_once dirname(__DIR__, 2) . '/includes/auth-jwt.php';

use App\Controllers\ApiResponse;
use App\Controllers\MicrosoftMailController;

requireMethod('GET');

try {
    $admin = requireAdminAuth();
    $controller = new MicrosoftMailController(db());
    $profile = $controller->profile((int) $admin['user_id']);
    ApiResponse::success('Microsoft profile', $profile);
} catch (Throwable $e) {
    ApiResponse::handle($e);
}
