<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Core\AppException;

final class CsrfMiddleware
{
    public static function verifyForMutation(): void
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        if (!in_array($method, ['POST', 'PUT', 'DELETE', 'PATCH'], true)) {
            return;
        }

        require_once dirname(__DIR__, 2) . '/includes/security.php';

        $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if ($token === '' || !verifyCSRFToken($token)) {
            throw new AppException('Invalid or missing CSRF token', 403);
        }
    }

    public static function token(): string
    {
        require_once dirname(__DIR__, 2) . '/includes/security.php';
        return generateCSRFToken();
    }
}
