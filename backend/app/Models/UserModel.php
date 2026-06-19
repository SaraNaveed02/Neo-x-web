<?php

declare(strict_types=1);

namespace App\Models;

use PDO;

final class UserModel extends BaseModel
{
    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT id, username, name, email, password, role, is_active, avatar_url, auth_provider, created_at, last_login_at
             FROM users WHERE email = ? LIMIT 1'
        );
        $stmt->execute([$email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT id, username, name, email, role, is_active, avatar_url, auth_provider,
                    google_id, facebook_id, instagram_id, github_id, created_at, last_login_at
             FROM users WHERE id = ? LIMIT 1'
        );
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findAdminByLogin(string $login): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT id, username, name, email, password, role, is_active
             FROM users
             WHERE role = 'admin' AND (username = ? OR email = ? OR name = ?)
             LIMIT 1"
        );
        $stmt->execute([$login, $login, $login]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function emailExists(string $email): bool
    {
        $stmt = $this->db->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        return (bool) $stmt->fetch();
    }

    public function createClient(string $name, string $email, string $passwordHash): int
    {
        $stmt = $this->db->prepare(
            "INSERT INTO users (name, email, password, role, auth_provider, is_active)
             VALUES (?, ?, ?, 'client', 'email', 1)"
        );
        $stmt->execute([$name, $email, $passwordHash]);
        return (int) $this->db->lastInsertId();
    }

    public function updateLastLogin(int $userId): void
    {
        $this->db->prepare('UPDATE users SET last_login_at = NOW() WHERE id = ?')->execute([$userId]);
    }

    public function hashPassword(string $plainPassword): string
    {
        return password_hash($plainPassword, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    public function verifyPassword(string $plainPassword, ?string $hash): bool
    {
        if ($hash === null || $hash === '') {
            return false;
        }
        return password_verify($plainPassword, $hash);
    }
}
