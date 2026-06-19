<?php
/*
    FILE: includes/auth-jwt.php
    PURPOSE: JWT + session authentication middleware
*/

require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/auth-check.php';
require_once __DIR__ . '/../config/constants.php';

function getBearerToken(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';

    if ($header === '' && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (is_array($headers)) {
            foreach ($headers as $key => $value) {
                if (strtolower((string) $key) === 'authorization') {
                    $header = $value;
                    break;
                }
            }
        }
    }

    if ($header === '' && function_exists('getallheaders')) {
        foreach (getallheaders() as $key => $value) {
            if (strtolower((string) $key) === 'authorization') {
                $header = $value;
                break;
            }
        }
    }

    if (preg_match('/Bearer\s+(\S+)/i', $header, $matches)) {
        return $matches[1];
    }
    return null;
}

function authenticateRequest(): ?array
{
    $token = getBearerToken();
    if ($token) {
        $payload = JWT::decode($token, JWT_SECRET);
        if ($payload && !empty($payload['user_id'])) {
            return [
                'user_id' => (int) $payload['user_id'],
                'email' => $payload['email'] ?? '',
                'name' => $payload['name'] ?? '',
                'role' => $payload['role'] ?? 'client'
            ];
        }
    }

    sessionService()->startSecure();

    if (isUserLoggedIn()) {
        return [
            'user_id' => getSessionUserId(),
            'email' => $_SESSION['user_email'] ?? '',
            'name' => $_SESSION['user_name'] ?? '',
            'role' => $_SESSION['user_role'] ?? 'client'
        ];
    }

    return null;
}

function requireAuth(): array
{
    $user = authenticateRequest();
    if (!$user) {
        denyJson('Authentication required', 401);
    }
    return $user;
}

function requireAdminAuth(): array
{
    $user = authenticateRequest();
    if (!$user || $user['role'] !== 'admin') {
        denyJson('Admin access required', 403);
    }

    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    if (in_array($method, ['POST', 'PUT', 'DELETE', 'PATCH'], true)) {
        require_once __DIR__ . '/../app/Bootstrap.php';
        \App\Bootstrap::init();
        try {
            \App\Middleware\CsrfMiddleware::verifyForMutation();
        } catch (\App\Core\AppException $e) {
            denyJson($e->getMessage(), $e->statusCode());
        }
    }

    return $user;
}

function setUserSession(array $user): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'];

    if ($user['role'] === 'admin') {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_role'] = 'admin';
        $_SESSION['admin_username'] = $user['name'];
    }
}

?>
