<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Core\AppException;

final class RequireAdminMiddleware
{
    /** @return array{user_id:int, email:string, name:string, role:string} */
    public static function fromSession(): array
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (empty($_SESSION['admin_logged_in']) || empty($_SESSION['user_id'])) {
            throw new AppException('Admin session required', 401);
        }

        return [
            'user_id' => (int) $_SESSION['user_id'],
            'email' => (string) ($_SESSION['user_email'] ?? ''),
            'name' => (string) ($_SESSION['user_name'] ?? ''),
            'role' => (string) ($_SESSION['user_role'] ?? 'admin'),
        ];
    }

    public static function requireAdminPage(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (empty($_SESSION['admin_logged_in'])) {
            header('Location: login.php');
            exit;
        }
    }
}
