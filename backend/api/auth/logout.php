<?php
/*
    FILE: api/auth/logout.php
    MVC entry — destroy session and logout
*/

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__, 2) . '/includes/response.php';

use App\Controllers\AuthController;

$controller = new AuthController(app_db());
$controller->logout();
