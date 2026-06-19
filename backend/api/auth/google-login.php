<?php
/*
    FILE: api/auth/google-login.php
    PURPOSE: Google login — saves user in DB, shows in admin
*/

require_once '../../config/cors.php';
require_once '../../config/constants.php';
require_once '../../config/google-config.php';
require_once '../../includes/response.php';
require_once '../../includes/functions.php';
require_once '../../includes/request.php';
require_once '../../includes/auth-jwt.php';
require_once '../../includes/activity.php';
require_once '../../includes/bootstrap.php';
require_once '../../includes/oauth-config.php';
require_once '../../includes/oauth-user.php';

requireMethod('POST');

$data = getJsonInput();
$googleToken = $data['credential'] ?? '';

if ($googleToken === '') {
    sendError('Google token is required');
}

$db = db();
$oauth = loadOAuthSettings($db);
$clientId = $oauth['google_client_id'] ?? '';

$validatedToken = validateGoogleIdToken($googleToken, $clientId);
if (!$validatedToken) {
    sendError('Unable to verify Google token. Check internet connection.', 401);
}

$email = sanitizeInput($validatedToken['email'] ?? '');
$name = sanitizeInput($validatedToken['name'] ?? 'Google User');
$googleId = sanitizeInput($validatedToken['sub'] ?? '');
$avatar = sanitizeInput($validatedToken['picture'] ?? '');

if ($email === '' || $googleId === '') {
    sendError('Invalid Google token payload');
}

try {
    $result = upsertOAuthUser($db, 'google', [
        'id' => $googleId,
        'name' => $name,
        'email' => $email,
        'avatar_url' => $avatar,
    ]);
} catch (InvalidArgumentException $e) {
    sendError($e->getMessage(), 401);
}

$user = $result['user'];
$isNewUser = $result['is_new_user'];
$userId = (int) $user['id'];
$email = $user['email'];
$name = $user['name'];

if ($isNewUser) {
    logActivity($db, 'signup', $name . ' registered via Google', $email, $userId, $userId);
    emitRealtimeEvent('user:registered', ['user' => ['name' => $name, 'email' => $email]]);
}

setUserSession($user);
logLoginHistory($db, $userId, $email, 'client');
logActivity($db, 'login', $name . ' logged in via Google', $email, $userId);

$stats = syncDashboardStats($db);
emitRealtimeEvent('user:login', ['stats' => $stats, 'user' => ['name' => $name, 'email' => $email]]);
emitRealtimeEvent('stats:update', $stats);

$response = buildAuthResponse($db, $user);
$response['is_new_user'] = $isNewUser;
sendSuccess('Google login successful', $response);

function validateGoogleIdToken($idToken, $clientId = '') {
    if ($clientId === '' && defined('GOOGLE_CLIENT_ID')) {
        $clientId = GOOGLE_CLIENT_ID;
    }
    $url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($idToken);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_TIMEOUT => 15
    ]);
    $output = curl_exec($ch);
    curl_close($ch);

    if (!$output) {
        return null;
    }

    $response = json_decode($output, true);
    if (!$response || empty($response['email'])) {
        return null;
    }

    if ($clientId && ($response['aud'] ?? '') !== $clientId) {
        return null;
    }

    return $response;
}

?>
