<?php
/*
    FILE: config/constants.php
    PURPOSE: Application constants (.env aware)
*/

require_once __DIR__ . '/../app/Bootstrap.php';

use App\Bootstrap;
use App\Config\Env;

Bootstrap::init();

define('BASE_PATH', dirname(__DIR__));
define('ADMIN_PATH', BASE_PATH . '/admin');
define('API_PATH', BASE_PATH . '/api');
define('UPLOAD_PATH', BASE_PATH . '/uploads');

$baseUrl = Env::get('APP_BASE_URL', 'http://localhost/time/backend') ?? 'http://localhost/time/backend';
define('BASE_URL', rtrim($baseUrl, '/'));
define('API_URL', BASE_URL . '/api');
define('FRONTEND_URL', 'http://localhost/time/project');

define('APP_NAME', 'Nexura Admin');
define('APP_VERSION', '3.1.0');

define('JWT_SECRET', Env::get('JWT_SECRET', 'nexura-jwt-secret-change-in-production-2026'));
define('JWT_TTL', (int) (Env::get('JWT_TTL', '604800') ?? 604800));

define('REALTIME_URL', 'http://localhost:3001');
define('REALTIME_SECRET', 'nexura-realtime-secret-key');

?>
