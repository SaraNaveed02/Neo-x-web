<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\AppException;
use App\Services\AuthService;
use PDO;
use Throwable;

final class AuthController
{
    public function __construct(
        private PDO $db,
        private ?AuthService $auth = null
    ) {
        $this->auth ??= new AuthService($db);
    }

    /** @param array<string, string> $input */
    public function clientLogin(array $input): void
    {
        try {
            $data = $this->auth->clientLogin($input);
            ApiResponse::success('Login successful', $data);
        } catch (AppException $e) {
            ApiResponse::error($e->getMessage(), $e->statusCode());
        } catch (Throwable $e) {
            ApiResponse::handle($e);
        }
    }

    /** @param array<string, string> $input */
    public function adminLogin(array $input): void
    {
        try {
            $data = $this->auth->adminLogin($input);
            ApiResponse::success('Admin login successful', $data);
        } catch (AppException $e) {
            ApiResponse::error($e->getMessage(), $e->statusCode());
        } catch (Throwable $e) {
            ApiResponse::handle($e);
        }
    }

    /** @param array<string, string> $input */
    public function signup(array $input): void
    {
        try {
            $data = $this->auth->signup($input);
            ApiResponse::success('Registration successful', $data);
        } catch (AppException $e) {
            ApiResponse::error($e->getMessage(), $e->statusCode());
        } catch (Throwable $e) {
            ApiResponse::handle($e);
        }
    }

    public function logout(): void
    {
        try {
            $this->auth->logout();
            ApiResponse::success('Logged out successfully');
        } catch (Throwable $e) {
            ApiResponse::handle($e);
        }
    }

    public function session(int $userId): void
    {
        try {
            $data = $this->auth->currentUser($userId);
            ApiResponse::success('Session active', $data);
        } catch (AppException $e) {
            ApiResponse::error($e->getMessage(), $e->statusCode());
        } catch (Throwable $e) {
            ApiResponse::handle($e);
        }
    }
}
