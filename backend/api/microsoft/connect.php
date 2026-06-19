<?php
/*
    FILE: api/microsoft/connect.php
    MVC entry — redirect to official Microsoft OAuth login
*/

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__, 2) . '/includes/auth-check.php';

use App\Controllers\MicrosoftAuthController;
use App\Middleware\RequireAdminMiddleware;

try {
    RequireAdminMiddleware::requireAdminPage();
    $admin = RequireAdminMiddleware::fromSession();

    if (!\App\Config\MicrosoftConfig::isConfigured()) {
        header('Location: ../../admin/microsoft-inbox.php?error=keys');
        exit;
    }

    $controller = new MicrosoftAuthController(db());
    $controller->connectRedirect($admin['user_id']);
} catch (Throwable $e) {
    header('Location: ../../admin/login.php');
    exit;
}
