<?php
/*
    FILE: api/auth/login.php
    MVC entry — client login (email + password)
*/

require_once __DIR__ . '/_init.php';

use App\Controllers\AuthController;

requireMethod('POST');

$controller = new AuthController(app_db());
$controller->clientLogin(getJsonInput());
