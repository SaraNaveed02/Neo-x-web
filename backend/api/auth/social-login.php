<?php
/*
    FILE: api/auth/social-login.php
    PURPOSE: Facebook, Instagram, GitHub OAuth login → database
*/

require_once '../../config/cors.php';
require_once '../../config/constants.php';
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
$provider = strtolower(sanitizeInput($data['provider'] ?? ''));
$accessToken = $data['access_token'] ?? '';
$code = $data['code'] ?? '';

$allowed = ['facebook', 'instagram', 'github'];
if (!in_array($provider, $allowed, true)) {
    sendError('Invalid provider', 400);
}

$db = db();
$settings = loadOAuthSettings($db);
$redirectUri = $settings['oauth_redirect_uri'];

$profile = null;

if ($provider === 'github') {
    if ($code !== '') {
        $accessToken = exchangeGithubCode($code, $settings, $redirectUri);
    }
    $profile = fetchGithubProfile($accessToken);
} elseif ($provider === 'facebook') {
    if ($code !== '') {
        $accessToken = exchangeFacebookCode($code, $settings, $redirectUri);
    }
    $profile = fetchFacebookProfile($accessToken);
} elseif ($provider === 'instagram') {
    if ($code !== '') {
        $accessToken = exchangeInstagramCode($code, $settings, $redirectUri);
    }
    $profile = fetchInstagramProfile($accessToken);
}

if (!$profile || empty($profile['id'])) {
    sendError('Could not verify ' . $provider . ' account. Add OAuth keys in Admin → Settings.', 401);
}

try {
    $result = upsertOAuthUser($db, $provider, $profile);
} catch (InvalidArgumentException $e) {
    sendError($e->getMessage(), 401);
}

$user = $result['user'];
$isNewUser = $result['is_new_user'];
$userId = (int) $user['id'];
$email = $user['email'];
$name = $user['name'];

if ($isNewUser) {
    logActivity($db, 'signup', $name . ' registered via ' . ucfirst($provider), $email, $userId, $userId);
    emitRealtimeEvent('user:registered', ['user' => ['name' => $name, 'email' => $email]]);
}

setUserSession($user);
logLoginHistory($db, $userId, $email, 'client');
logActivity($db, 'login', $name . ' logged in via ' . ucfirst($provider), $email, $userId);

$stats = syncDashboardStats($db);
emitRealtimeEvent('user:login', ['stats' => $stats, 'user' => ['name' => $name, 'email' => $email]]);
emitRealtimeEvent('stats:update', $stats);

$response = buildAuthResponse($db, $user);
$response['is_new_user'] = $isNewUser;
$response['provider'] = $provider;
sendSuccess(ucfirst($provider) . ' login successful', $response);

function exchangeGithubCode(string $code, array $settings, string $redirectUri): ?string
{
    if (($settings['github_client_id'] ?? '') === '') {
        return null;
    }
    $ch = curl_init('https://github.com/login/oauth/access_token');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode([
            'client_id' => $settings['github_client_id'],
            'client_secret' => $settings['github_client_secret'],
            'code' => $code,
            'redirect_uri' => $redirectUri,
        ]),
        CURLOPT_HTTPHEADER => ['Accept: application/json', 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
    ]);
    $raw = curl_exec($ch);
    curl_close($ch);
    $json = json_decode($raw, true);
    return $json['access_token'] ?? null;
}

function fetchGithubProfile(?string $token): ?array
{
    if (!$token) {
        return null;
    }

    $ch = curl_init('https://api.github.com/user');
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'User-Agent: Nexura-App'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
    ]);
    $user = json_decode(curl_exec($ch), true);
    curl_close($ch);

    if (empty($user['id'])) {
        return null;
    }

    $email = $user['email'] ?? '';
    if ($email === '') {
        $ch = curl_init('https://api.github.com/user/emails');
        curl_setopt_array($ch, [
            CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'User-Agent: Nexura-App'],
            CURLOPT_RETURNTRANSFER => true,
        ]);
        $emails = json_decode(curl_exec($ch), true);
        curl_close($ch);
        foreach ($emails ?? [] as $row) {
            if (!empty($row['primary']) && !empty($row['email'])) {
                $email = $row['email'];
                break;
            }
        }
        if ($email === '' && !empty($emails[0]['email'])) {
            $email = $emails[0]['email'];
        }
    }

    return [
        'id' => (string) $user['id'],
        'name' => $user['name'] ?? $user['login'],
        'email' => $email,
        'avatar_url' => $user['avatar_url'] ?? '',
    ];
}

function exchangeFacebookCode(string $code, array $settings, string $redirectUri): ?string
{
    if (($settings['facebook_app_id'] ?? '') === '' || ($settings['facebook_app_secret'] ?? '') === '') {
        return null;
    }
    $url = 'https://graph.facebook.com/v19.0/oauth/access_token?' . http_build_query([
        'client_id' => $settings['facebook_app_id'],
        'client_secret' => $settings['facebook_app_secret'],
        'redirect_uri' => $redirectUri,
        'code' => $code,
    ]);
    $json = json_decode(@file_get_contents($url), true);
    return $json['access_token'] ?? null;
}

function fetchFacebookProfile(?string $token): ?array
{
    if (!$token) {
        return null;
    }
    $url = 'https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=' . urlencode($token);
    $json = json_decode(@file_get_contents($url), true);
    if (empty($json['id'])) {
        return null;
    }
    return [
        'id' => (string) $json['id'],
        'name' => $json['name'] ?? 'Facebook User',
        'email' => $json['email'] ?? '',
        'avatar_url' => $json['picture']['data']['url'] ?? '',
    ];
}

function exchangeInstagramCode(string $code, array $settings, string $redirectUri): ?string
{
    if (($settings['instagram_app_id'] ?? '') === '') {
        return null;
    }
    $ch = curl_init('https://api.instagram.com/oauth/access_token');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'client_id' => $settings['instagram_app_id'],
            'client_secret' => $settings['instagram_app_secret'],
            'grant_type' => 'authorization_code',
            'redirect_uri' => $redirectUri,
            'code' => $code,
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
    ]);
    $json = json_decode(curl_exec($ch), true);
    curl_close($ch);
    return $json['access_token'] ?? null;
}

function fetchInstagramProfile(?string $token): ?array
{
    if (!$token) {
        return null;
    }
    $url = 'https://graph.instagram.com/me?fields=id,username,account_type&access_token=' . urlencode($token);
    $json = json_decode(@file_get_contents($url), true);
    if (empty($json['id'])) {
        return null;
    }
    $username = $json['username'] ?? ('user' . $json['id']);
    return [
        'id' => (string) $json['id'],
        'name' => '@' . $username,
        'email' => '',
        'avatar_url' => '',
    ];
}

?>
