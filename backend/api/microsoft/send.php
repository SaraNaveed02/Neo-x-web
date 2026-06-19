<?php
/*
    FILE: api/microsoft/send.php
    MVC entry — send email via Graph (user consent Mail.Send)
*/

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__, 2) . '/includes/request.php';
require_once dirname(__DIR__, 2) . '/includes/auth-jwt.php';
require_once dirname(__DIR__, 2) . '/includes/functions.php';

use App\Controllers\ApiResponse;
use App\Controllers\MicrosoftMailController;

requireMethod('POST');

try {
    $admin = requireAdminAuth();
    $data = getJsonInput();

    $controller = new MicrosoftMailController(db());
    $controller->send(
        (int) $admin['user_id'],
        sanitizeInput($data['to'] ?? ''),
        sanitizeInput($data['subject'] ?? ''),
        trim((string) ($data['body'] ?? '')),
        !empty($data['is_html'])
    );

    ApiResponse::success('Email sent');
} catch (Throwable $e) {
    ApiResponse::handle($e);
}
