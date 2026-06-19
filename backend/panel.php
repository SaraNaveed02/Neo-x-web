<?php
/**
 * Admin panel shortcut — opens dashboard after login
 */
require_once __DIR__ . '/includes/auth-check.php';

if (!isAdminLoggedIn()) {
    header('Location: index.php', true, 302);
    exit;
}

header('Location: admin/dashboard.php', true, 302);
exit;
