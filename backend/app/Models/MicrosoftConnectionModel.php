<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\AppException;

final class MicrosoftConnectionModel extends BaseModel
{
    public function findByUserId(int $userId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM microsoft_connections WHERE user_id = ? AND is_active = 1 LIMIT 1'
        );
        $stmt->execute([$userId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findByIdForUser(int $connectionId, int $userId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM microsoft_connections WHERE id = ? AND user_id = ? AND is_active = 1 LIMIT 1'
        );
        $stmt->execute([$connectionId, $userId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function upsertTokens(
        int $userId,
        string $microsoftUserId,
        string $email,
        string $displayName,
        string $accessTokenEnc,
        ?string $refreshTokenEnc,
        string $expiresAt,
        string $scopes
    ): int {
        $existing = $this->findByUserId($userId);

        if ($existing) {
            $this->db->prepare(
                'UPDATE microsoft_connections SET
                    microsoft_user_id = ?, email = ?, display_name = ?,
                    access_token_enc = ?, refresh_token_enc = ?,
                    token_expires_at = ?, scopes = ?, is_active = 1, updated_at = NOW()
                 WHERE id = ?'
            )->execute([
                $microsoftUserId,
                $email,
                $displayName,
                $accessTokenEnc,
                $refreshTokenEnc,
                $expiresAt,
                $scopes,
                $existing['id'],
            ]);
            return (int) $existing['id'];
        }

        $this->db->prepare(
            'INSERT INTO microsoft_connections
                (user_id, microsoft_user_id, email, display_name, access_token_enc, refresh_token_enc, token_expires_at, scopes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            $userId,
            $microsoftUserId,
            $email,
            $displayName,
            $accessTokenEnc,
            $refreshTokenEnc,
            $expiresAt,
            $scopes,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function updateTokens(int $connectionId, string $accessTokenEnc, ?string $refreshTokenEnc, string $expiresAt): void
    {
        if ($refreshTokenEnc !== null) {
            $this->db->prepare(
                'UPDATE microsoft_connections SET access_token_enc = ?, refresh_token_enc = ?, token_expires_at = ?, updated_at = NOW() WHERE id = ?'
            )->execute([$accessTokenEnc, $refreshTokenEnc, $expiresAt, $connectionId]);
            return;
        }

        $this->db->prepare(
            'UPDATE microsoft_connections SET access_token_enc = ?, token_expires_at = ?, updated_at = NOW() WHERE id = ?'
        )->execute([$accessTokenEnc, $expiresAt, $connectionId]);
    }

    public function updateProfile(int $connectionId, string $microsoftUserId, string $email, string $displayName): void
    {
        $this->db->prepare(
            'UPDATE microsoft_connections SET microsoft_user_id = ?, email = ?, display_name = ?, updated_at = NOW() WHERE id = ?'
        )->execute([$microsoftUserId, $email, $displayName, $connectionId]);
    }

    public function markSynced(int $connectionId): void
    {
        $this->db->prepare('UPDATE microsoft_connections SET last_sync_at = NOW() WHERE id = ?')
            ->execute([$connectionId]);
    }

    public function deleteForUser(int $userId): void
    {
        $connection = $this->findByUserId($userId);
        if (!$connection) {
            return;
        }

        $this->db->prepare('DELETE FROM mail_messages WHERE connection_id = ?')
            ->execute([(int) $connection['id']]);
        $this->db->prepare('DELETE FROM microsoft_connections WHERE id = ?')
            ->execute([(int) $connection['id']]);
    }

    public function requireForUser(int $userId): array
    {
        $connection = $this->findByUserId($userId);
        if (!$connection) {
            throw new AppException('Connect Microsoft 365 first', 404);
        }
        return $connection;
    }

    /** @return array<string, mixed> */
    public function publicStatus(?array $connection): array
    {
        if (!$connection) {
            return [
                'connected' => false,
                'email' => null,
                'display_name' => null,
                'last_sync_at' => null,
                'token_expires_at' => null,
            ];
        }

        return [
            'connected' => true,
            'email' => $connection['email'],
            'display_name' => $connection['display_name'],
            'last_sync_at' => $connection['last_sync_at'],
            'token_expires_at' => $connection['token_expires_at'],
            'scopes' => $connection['scopes'],
        ];
    }
}
