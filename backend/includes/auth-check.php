<?php
/*
    FILE: includes/auth-check.php
    PURPOSE: Session authentication guards (same session as API login — NEXURA_SESSID)
*/

require_once __DIR__ . '/../app/Bootstrap.php';

use App\Bootstrap;
use App\Services\SessionService;

Bootstrap::init();

function sessionService(): SessionService
{
    static $service = null;
    if ($service === null) {
        $service = new SessionService();
    }
    return $service;
}

function isAdminLoggedIn(): bool
{
    return sessionService()->isAdminLoggedIn();
}

function isUserLoggedIn(): bool
{
    sessionService()->startSecure();
    return isset($_SESSION['user_id']) && (int) $_SESSION['user_id'] > 0;
}

function getSessionUserId(): int
{
    return sessionService()->getUserId();
}

function denyJson($message = 'Unauthorized', $statusCode = 401): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}

function requireAdminRole(): void
{
    require_once __DIR__ . '/auth-jwt.php';
    requireAdminAuth();
}

function requireLogin(): void
{
    require_once __DIR__ . '/auth-jwt.php';
    requireAdminAuth();
}

function requireUserSession(): void
{
    if (!isUserLoggedIn()) {
        denyJson('Authentication required', 401);
    }
}

function requireAdminPage(): void
{
    if (!isAdminLoggedIn()) {
        header('Location: ../index.php', true, 302);
        exit;
    }
}
