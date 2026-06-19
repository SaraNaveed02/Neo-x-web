<?php
/*
    FILE: api/auth/admin-login.php
    MVC entry — admin login (username/email + password)
*/

require_once __DIR__ . '/_init.php';

use App\Controllers\AuthController;

requireMethod('POST');

$controller = new AuthController(app_db());
$controller->adminLogin(getJsonInput());
