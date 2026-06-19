<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\AppException;
use Throwable;

final class ApiResponse
{
    public static function success(string $message, mixed $data = null, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], JSON_THROW_ON_ERROR);
        exit;
    }

    public static function error(string $message, int $status = 400): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => false,
            'error' => $message,
        ], JSON_THROW_ON_ERROR);
        exit;
    }

    public static function handle(Throwable $e): void
    {
        if ($e instanceof AppException) {
            self::error($e->getMessage(), $e->statusCode());
        }

        error_log('[Microsoft365] ' . $e->getMessage());
        self::error('Internal server error', 500);
    }
}
