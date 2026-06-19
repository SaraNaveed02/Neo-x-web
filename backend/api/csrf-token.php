<?php
/**
 * CSRF token for admin session (used by forms & mutating API calls)
 */
require_once __DIR__ . '/../../includes/bootstrap.php';
require_once __DIR__ . '/../../includes/request.php';
require_once __DIR__ . '/../../includes/security.php';
require_once __DIR__ . '/../../includes/auth-check.php';

requireMethod('GET');

if (!isAdminLoggedIn()) {
    sendError('Admin login required', 401);
}

sendSuccess('CSRF token', ['token' => generateCSRFToken()]);
