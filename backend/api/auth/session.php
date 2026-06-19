<?php
/*
    FILE: api/auth/session.php
    MVC entry — validate JWT/session and return profile
*/

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__, 2) . '/includes/auth-jwt.php';

use App\Controllers\AuthController;
use App\Controllers\ApiResponse;

requireMethod('GET');

$user = authenticateRequest();
if (!$user) {
    ApiResponse::error('Not authenticated', 401);
}

$controller = new AuthController(app_db());
$controller->session((int) $user['user_id']);
