<?php
/*
    FILE: api/auth/signup.php
    MVC entry — user registration
*/

require_once __DIR__ . '/_init.php';

use App\Controllers\AuthController;

requireMethod('POST');

$controller = new AuthController(app_db());
$controller->signup(getJsonInput());
