<?php
/*
    FILE: includes/oauth-config.php
    PURPOSE: OAuth credentials from database settings + config file fallbacks
*/

require_once __DIR__ . '/../config/google-config.php';
require_once __DIR__ . '/../config/social-config.php';
require_once __DIR__ . '/../config/microsoft-config.php';

function oauthSettingsMap(): array
{
    return [
        'google_client_id' => ['const' => 'GOOGLE_CLIENT_ID', 'group' => 'oauth'],
        'google_client_secret' => ['const' => 'GOOGLE_CLIENT_SECRET', 'group' => 'oauth', 'secret' => true],
        'facebook_app_id' => ['const' => 'FACEBOOK_APP_ID', 'group' => 'oauth'],
        'facebook_app_secret' => ['const' => 'FACEBOOK_APP_SECRET', 'group' => 'oauth', 'secret' => true],
        'instagram_app_id' => ['const' => 'INSTAGRAM_APP_ID', 'group' => 'oauth'],
        'instagram_app_secret' => ['const' => 'INSTAGRAM_APP_SECRET', 'group' => 'oauth', 'secret' => true],
        'github_client_id' => ['const' => 'GITHUB_CLIENT_ID', 'group' => 'oauth'],
        'github_client_secret' => ['const' => 'GITHUB_CLIENT_SECRET', 'group' => 'oauth', 'secret' => true],
        'oauth_redirect_uri' => ['const' => 'SOCIAL_REDIRECT_URI', 'group' => 'oauth'],
        'microsoft_client_id' => ['const' => 'MICROSOFT_CLIENT_ID', 'group' => 'oauth'],
        'microsoft_client_secret' => ['const' => 'MICROSOFT_CLIENT_SECRET', 'group' => 'oauth', 'secret' => true],
        'microsoft_tenant_id' => ['const' => 'MICROSOFT_TENANT_ID', 'group' => 'oauth'],
        'microsoft_redirect_uri' => ['const' => 'MICROSOFT_REDIRECT_URI', 'group' => 'oauth'],
    ];
}

function loadOAuthSettings(?PDO $db = null, bool $forceReload = false): array
{
    static $cache = null;
    if ($forceReload) {
        $cache = null;
    }
    if ($cache !== null) {
        return $cache;
    }

    $settings = [];
    foreach (oauthSettingsMap() as $key => $meta) {
        $const = $meta['const'];
        $settings[$key] = defined($const) ? constant($const) : '';
    }

    if ($db instanceof PDO) {
        try {
            $keys = array_keys(oauthSettingsMap());
            $placeholders = implode(',', array_fill(0, count($keys), '?'));
            $stmt = $db->prepare("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ($placeholders)");
            $stmt->execute($keys);
            foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
                $value = trim((string) ($row['setting_value'] ?? ''));
                if ($value !== '') {
                    $settings[$row['setting_key']] = $value;
                }
            }
        } catch (PDOException $e) {
            // settings table may not exist yet
        }
    }

    if (empty($settings['oauth_redirect_uri'])) {
        $settings['oauth_redirect_uri'] = 'http://localhost/time/project/oauth-callback.html';
    }

    if ($settings['instagram_app_id'] === '' && $settings['facebook_app_id'] !== '') {
        $settings['instagram_app_id'] = $settings['facebook_app_id'];
    }
    if ($settings['instagram_app_secret'] === '' && $settings['facebook_app_secret'] !== '') {
        $settings['instagram_app_secret'] = $settings['facebook_app_secret'];
    }

    $cache = $settings;
    return $cache;
}

function resetOAuthCache(): void
{
    loadOAuthSettings(null, true);
}

function syncOAuthFilesToDatabase(PDO $db): void
{
    $settings = loadOAuthSettings(null, true);
    $stmt = $db->prepare('INSERT INTO settings (setting_key, setting_value, setting_group) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), setting_group = VALUES(setting_group)');
    foreach (oauthSettingsMap() as $key => $meta) {
        $value = trim((string) ($settings[$key] ?? ''));
        if ($value !== '') {
            $stmt->execute([$key, $value, $meta['group']]);
        }
    }
    resetOAuthCache();
}

function oauthValue(string $key, ?PDO $db = null): string
{
    $settings = loadOAuthSettings($db);
    return trim((string) ($settings[$key] ?? ''));
}

function oauthPublicConfig(?PDO $db = null): array
{
    $settings = loadOAuthSettings($db);

    $providers = [
        'google' => $settings['google_client_id'] !== '',
        'facebook' => $settings['facebook_app_id'] !== '',
        'instagram' => $settings['instagram_app_id'] !== '',
        'github' => $settings['github_client_id'] !== '',
        'microsoft' => ($settings['microsoft_client_id'] ?? '') !== '',
    ];

    return [
        'google_client_id' => $settings['google_client_id'],
        'facebook_app_id' => $settings['facebook_app_id'],
        'instagram_app_id' => $settings['instagram_app_id'],
        'github_client_id' => $settings['github_client_id'],
        'microsoft_client_id' => $settings['microsoft_client_id'] ?? '',
        'microsoft_redirect_uri' => $settings['microsoft_redirect_uri'] ?? '',
        'redirect_uri' => $settings['oauth_redirect_uri'],
        'providers' => $providers,
    ];
}

?>
