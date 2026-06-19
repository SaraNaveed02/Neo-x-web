<?php

declare(strict_types=1);

namespace App\Services;

use App\Config\Env;
use App\Models\SessionModel;

final class SessionService
{
    public function __construct(private ?SessionModel $sessions = null)
    {
    }

    public function startSecure(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        $secure = Env::bool('APP_FORCE_HTTPS', false) || Env::get('APP_ENV') === 'production';

        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'domain' => '',
            'secure' => $secure,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        session_name('NEXURA_SESSID');
        session_start();
    }

    /** @param array<string, mixed> $user */
    public function loginUser(array $user, SessionModel $sessionModel): string
    {
        $this->startSecure();
        session_regenerate_id(true);

        $_SESSION['user_id'] = (int) $user['id'];
        $_SESSION['user_name'] = (string) $user['name'];
        $_SESSION['user_email'] = (string) $user['email'];
        $_SESSION['user_role'] = (string) $user['role'];

        if ($user['role'] === 'admin') {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_role'] = 'admin';
            $_SESSION['admin_username'] = (string) ($user['username'] ?? $user['name']);
            $_SESSION['admin_email'] = (string) $user['email'];
        }

        $token = bin2hex(random_bytes(32));
        $_SESSION['session_token'] = $token;

        $ttl = (int) (Env::get('JWT_TTL', '604800') ?? 604800);
        $expiresAt = date('Y-m-d H:i:s', time() + $ttl);
        $sessionModel->create((int) $user['id'], $token, $expiresAt);

        return $token;
    }

    public function logout(?SessionModel $sessionModel = null): void
    {
        $this->startSecure();

        if ($sessionModel && !empty($_SESSION['session_token'])) {
            $sessionModel->deleteByToken((string) $_SESSION['session_token']);
        }

        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                (bool) $params['secure'],
                (bool) $params['httponly']
            );
        }

        session_destroy();
    }

    public function isAdminLoggedIn(): bool
    {
        $this->startSecure();
        return !empty($_SESSION['admin_logged_in']) && !empty($_SESSION['user_id']);
    }

    public function getUserId(): int
    {
        $this->startSecure();
        return (int) ($_SESSION['user_id'] ?? 0);
    }
}
