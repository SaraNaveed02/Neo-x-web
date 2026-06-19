<?php
/*
    FILE: config/social-config.php
    OAuth keys — yahan YA social-config.local.php YA Admin → OAuth Settings
*/

if (file_exists(__DIR__ . '/social-config.local.php')) {
    require_once __DIR__ . '/social-config.local.php';
}

if (!defined('GITHUB_CLIENT_ID')) {
    define('GITHUB_CLIENT_ID', '');
}
if (!defined('GITHUB_CLIENT_SECRET')) {
    define('GITHUB_CLIENT_SECRET', '');
}
if (!defined('FACEBOOK_APP_ID')) {
    define('FACEBOOK_APP_ID', '');
}
if (!defined('FACEBOOK_APP_SECRET')) {
    define('FACEBOOK_APP_SECRET', '');
}
if (!defined('INSTAGRAM_APP_ID')) {
    define('INSTAGRAM_APP_ID', '');
}
if (!defined('INSTAGRAM_APP_SECRET')) {
    define('INSTAGRAM_APP_SECRET', '');
}
if (!defined('LINKEDIN_CLIENT_ID')) {
    define('LINKEDIN_CLIENT_ID', '');
}
if (!defined('LINKEDIN_CLIENT_SECRET')) {
    define('LINKEDIN_CLIENT_SECRET', '');
}
if (!defined('SOCIAL_REDIRECT_URI')) {
    define('SOCIAL_REDIRECT_URI', 'http://localhost/time/project/oauth-callback.html');
}

?>
