<?php
require_once '../config/cors.php';
require_once '../includes/response.php';

sendSuccess('Nexura API v3.0 — JWT + Realtime', [
    'base' => '/time/backend/api',
    'auth' => 'Bearer JWT token in Authorization header',
    'realtime' => 'http://localhost:3001',
    'endpoints' => [
        'auth' => ['login', 'signup', 'admin-login', 'session', 'logout'],
        'users' => ['read', 'read-one', 'create', 'update', 'delete', 'profile'],
        'messages' => ['create (public)', 'read', 'update', 'delete'],
        'login-history' => ['read', 'delete'],
        'activity' => ['delete'],
        'dashboard' => ['stats'],
        'stats' => ['public', 'read', 'create', 'update', 'delete'],
        'settings' => ['public', 'read', 'update', 'delete'],
        'services' => ['read', 'create', 'update', 'delete'],
        'microsoft' => ['connect', 'callback', 'status', 'disconnect', 'profile', 'inbox-live', 'send', 'messages/list', 'messages/sync', 'messages/read']
    ]
]);

?>
