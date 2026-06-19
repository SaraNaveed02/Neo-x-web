<?php
/*
    FILE: includes/microsoft-graph.php
    PURPOSE: Legacy settings helpers for OAuth admin UI (.env + DB merge)
*/

require_once __DIR__ . '/../app/Bootstrap.php';

use App\Bootstrap;
use App\Config\MicrosoftConfig;

Bootstrap::init();

function microsoftSettingsMap(): array
{
    return [
        'microsoft_client_id' => ['const' => 'MICROSOFT_CLIENT_ID', 'group' => 'oauth'],
        'microsoft_client_secret' => ['const' => 'MICROSOFT_CLIENT_SECRET', 'group' => 'oauth', 'secret' => true],
        'microsoft_tenant_id' => ['const' => 'MICROSOFT_TENANT_ID', 'group' => 'oauth'],
        'microsoft_redirect_uri' => ['const' => 'MICROSOFT_REDIRECT_URI', 'group' => 'oauth'],
    ];
}

function loadMicrosoftSettings(?PDO $db = null, bool $forceReload = false): array
{
    static $cache = null;
    if ($forceReload) {
        $cache = null;
    }
    if ($cache !== null) {
        return $cache;
    }

    $settings = [
        'microsoft_client_id' => MicrosoftConfig::clientId(),
        'microsoft_client_secret' => MicrosoftConfig::clientSecret(),
        'microsoft_tenant_id' => MicrosoftConfig::tenantId(),
        'microsoft_redirect_uri' => MicrosoftConfig::redirectUri(),
    ];

    if ($db instanceof PDO) {
        try {
            $keys = array_keys(microsoftSettingsMap());
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
        }
    }

    $cache = $settings;
    return $cache;
}

function microsoftScopes(): array
{
    return MicrosoftConfig::scopes();
}

?>
