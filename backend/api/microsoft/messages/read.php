<?php
/*
    FILE: api/microsoft/messages/read.php
    MVC entry — read single cached message
*/

require_once __DIR__ . '/../_init.php';
require_once dirname(__DIR__, 3) . '/includes/request.php';
require_once dirname(__DIR__, 3) . '/includes/auth-jwt.php';

use App\Controllers\ApiResponse;
use App\Controllers\MicrosoftMailController;
use App\Core\AppException;

requireMethod('GET');

try {
    $admin = requireAdminAuth();
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        throw new AppException('Message id required', 422);
    }

    $controller = new MicrosoftMailController(db());
    $message = $controller->readCached((int) $admin['user_id'], $id);
    ApiResponse::success('Mail message', $message);
} catch (Throwable $e) {
    ApiResponse::handle($e);
}
