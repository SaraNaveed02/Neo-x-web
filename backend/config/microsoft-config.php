<?php
/*
    FILE: config/microsoft-config.php
    Legacy constants — populated from .env
*/

require_once __DIR__ . '/../app/Bootstrap.php';

use App\Bootstrap;
use App\Config\Env;

Bootstrap::init();

if (!defined('MICROSOFT_CLIENT_ID')) {
    define('MICROSOFT_CLIENT_ID', Env::get('MICROSOFT_CLIENT_ID', '') ?? '');
}
if (!defined('MICROSOFT_CLIENT_SECRET')) {
    define('MICROSOFT_CLIENT_SECRET', Env::get('MICROSOFT_CLIENT_SECRET', '') ?? '');
}
if (!defined('MICROSOFT_TENANT_ID')) {
    define('MICROSOFT_TENANT_ID', Env::get('MICROSOFT_TENANT_ID', 'common') ?? 'common');
}
if (!defined('MICROSOFT_REDIRECT_URI')) {
    define('MICROSOFT_REDIRECT_URI', Env::get(
        'MICROSOFT_REDIRECT_URI',
        'http://localhost/time/backend/api/microsoft/callback.php'
    ) ?? 'http://localhost/time/backend/api/microsoft/callback.php');
}

?>
