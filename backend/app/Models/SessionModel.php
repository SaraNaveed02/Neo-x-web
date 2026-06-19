<?php

declare(strict_types=1);

namespace App\Models;

final class SessionModel extends BaseModel
{
    public function create(int $userId, string $token, string $expiresAt): void
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? null;
        $agent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255);

        $this->db->prepare(
            'INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at)
             VALUES (?, ?, ?, ?, ?)'
        )->execute([$userId, $token, $ip, $agent, $expiresAt]);
    }

    public function deleteByToken(string $token): void
    {
        $this->db->prepare('DELETE FROM user_sessions WHERE session_token = ?')->execute([$token]);
    }

    public function deleteAllForUser(int $userId): void
    {
        $this->db->prepare('DELETE FROM user_sessions WHERE user_id = ?')->execute([$userId]);
    }

    public function purgeExpired(): void
    {
        $this->db->exec('DELETE FROM user_sessions WHERE expires_at < NOW()');
    }

    public function isValid(string $token): bool
    {
        $stmt = $this->db->prepare(
            'SELECT id FROM user_sessions WHERE session_token = ? AND expires_at > NOW() LIMIT 1'
        );
        $stmt->execute([$token]);
        return (bool) $stmt->fetch();
    }
}
