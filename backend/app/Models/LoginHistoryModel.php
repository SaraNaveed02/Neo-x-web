<?php

declare(strict_types=1);

namespace App\Models;

final class LoginHistoryModel extends BaseModel
{
    public function record(?int $userId, string $email, string $loginType): void
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $agent = substr($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 0, 255);

        $stmt = $this->db->prepare(
            'INSERT INTO login_history (user_id, email, ip_address, user_agent, login_type)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([$userId, $email, $ip, $agent, $loginType]);
    }
}
