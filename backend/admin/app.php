<?php
/** Admin app entry — login or messages inbox. */
require_once __DIR__ . '/../includes/auth-check.php';
if (isAdminLoggedIn()) {
    header('Location: messages.php', true, 302);
} else {
    header('Location: login.php', true, 302);
}
exit;
