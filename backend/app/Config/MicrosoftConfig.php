<?php

declare(strict_types=1);

namespace App\Config;

use PDO;

final class MicrosoftConfig
{
    /** @var array<string, string>|null */
    private static ?array $merged = null;

    public static function hydrateFromDatabase(?PDO $db): void
    {
        if ($db === null) {
            return;
        }

        self::$merged = [
            'microsoft_client_id' => self::clientId(),
            'microsoft_client_secret' => self::clientSecret(),
            'microsoft_tenant_id' => self::tenantId(),
            'microsoft_redirect_uri' => self::redirectUri(),
            'microsoft_scopes' => implode(' ', self::scopes()),
        ];

        try {
            $keys = [
                'microsoft_client_id',
                'microsoft_client_secret',
                'microsoft_tenant_id',
                'microsoft_redirect_uri',
            ];
            $placeholders = implode(',', array_fill(0, count($keys), '?'));
            $stmt = $db->prepare("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ($placeholders)");
            $stmt->execute($keys);
            foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
                $value = trim((string) ($row['setting_value'] ?? ''));
                if ($value !== '') {
                    self::$merged[$row['setting_key']] = $value;
                }
            }
        } catch (\PDOException) {
        }
    }

    public static function clientId(): string
    {
        return trim((string) (self::$merged['microsoft_client_id'] ?? Env::get('MICROSOFT_CLIENT_ID', '')));
    }

    public static function clientSecret(): string
    {
        return trim((string) (self::$merged['microsoft_client_secret'] ?? Env::get('MICROSOFT_CLIENT_SECRET', '')));
    }

    public static function tenantId(): string
    {
        $tenant = trim((string) (self::$merged['microsoft_tenant_id'] ?? Env::get('MICROSOFT_TENANT_ID', 'common')));
        return $tenant !== '' ? $tenant : 'common';
    }

    public static function redirectUri(): string
    {
        $uri = trim((string) (self::$merged['microsoft_redirect_uri'] ?? Env::get(
            'MICROSOFT_REDIRECT_URI',
            'http://localhost/time/backend/api/microsoft/callback.php'
        )));
        return $uri;
    }

    /** @return list<string> */
    public static function scopes(): array
    {
        $raw = Env::get('MICROSOFT_SCOPES', 'openid profile offline_access User.Read Mail.Read');
        $parts = preg_split('/[\s,]+/', (string) $raw, -1, PREG_SPLIT_NO_EMPTY);
        return $parts ?: ['openid', 'profile', 'offline_access', 'User.Read', 'Mail.Read'];
    }

    public static function authorizeUrl(): string
    {
        return 'https://login.microsoftonline.com/' . rawurlencode(self::tenantId()) . '/oauth2/v2.0/authorize';
    }

    public static function tokenUrl(): string
    {
        return 'https://login.microsoftonline.com/' . rawurlencode(self::tenantId()) . '/oauth2/v2.0/token';
    }

    public static function graphBaseUrl(): string
    {
        return 'https://graph.microsoft.com/v1.0';
    }

    public static function isConfigured(): bool
    {
        return self::clientId() !== '' && self::clientSecret() !== '';
    }

    public static function adminInboxUrl(): string
    {
        $base = rtrim((string) Env::get('APP_BASE_URL', 'http://localhost/time/backend'), '/');
        return $base . '/admin/microsoft-inbox.php';
    }
}
