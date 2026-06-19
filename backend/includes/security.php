<?php
/*
    FILE: includes/security.php
    PURPOSE: Security functions for XSS and CSRF protection (uses NEXURA_SESSID)
*/

require_once __DIR__ . '/auth-check.php';

function generateCSRFToken(): string
{
    sessionService()->startSecure();
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return (string) $_SESSION['csrf_token'];
}

function verifyCSRFToken($token): bool
{
    sessionService()->startSecure();
    if (!isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
        return false;
    }
    return true;
}

function preventXSS($data)
{
    if (is_array($data)) {
        return array_map('preventXSS', $data);
    }
    return htmlspecialchars((string) $data, ENT_QUOTES, 'UTF-8');
}
