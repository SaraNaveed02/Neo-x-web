<?php
/*
    FILE: api/auth/social-config-public.php
    PURPOSE: Public OAuth client IDs for frontend (no secrets)
*/

require_once '../../config/cors.php';
require_once '../../includes/response.php';
require_once '../../includes/bootstrap.php';
require_once '../../includes/oauth-config.php';

$db = db();
sendSuccess('Social auth config', oauthPublicConfig($db));

?>
