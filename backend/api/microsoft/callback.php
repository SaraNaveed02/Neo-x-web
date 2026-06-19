<?php
/*
    FILE: api/microsoft/callback.php
    MVC entry — OAuth callback (authorization code + PKCE)
*/

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__, 2) . '/includes/auth-check.php';

use App\Controllers\MicrosoftAuthController;

$controller = new MicrosoftAuthController(db());
$controller->handleCallback(
    $_GET['code'] ?? null,
    $_GET['state'] ?? null,
    $_GET['error'] ?? null,
    $_GET['error_description'] ?? null
);
