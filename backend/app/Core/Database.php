<?php

declare(strict_types=1);

namespace App\Core;

use App\Config\Env;
use PDO;
use PDOException;
use RuntimeException;

/**
 * Central PDO connection with .env configuration and error handling.
 */
final class Database
{
    private static ?PDO $connection = null;

    public static function connection(): PDO
    {
        if (self::$connection instanceof PDO) {
            return self::$connection;
        }

        $host = Env::get('DB_HOST', 'localhost') ?? 'localhost';
        $name = Env::get('DB_NAME', 'nexura_db') ?? 'nexura_db';
        $user = Env::get('DB_USER', 'root') ?? 'root';
        $pass = Env::get('DB_PASS', '') ?? '';

        try {
            self::$connection = new PDO(
                "mysql:host={$host};dbname={$name};charset=utf8mb4",
                $user,
                $pass,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            error_log('[Database] Connection failed: ' . $e->getMessage());
            throw new RuntimeException(
                'Database connection failed. Check MySQL is running and .env credentials are correct.',
                503
            );
        }

        return self::$connection;
    }

    /** Connect without selecting a database (installer). */
    public static function serverConnection(): PDO
    {
        $host = Env::get('DB_HOST', 'localhost') ?? 'localhost';
        $user = Env::get('DB_USER', 'root') ?? 'root';
        $pass = Env::get('DB_PASS', '') ?? '';

        try {
            return new PDO(
                "mysql:host={$host};charset=utf8mb4",
                $user,
                $pass,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        } catch (PDOException $e) {
            error_log('[Database] Server connection failed: ' . $e->getMessage());
            throw new RuntimeException('MySQL server is not reachable.', 503);
        }
    }

    public static function reset(): void
    {
        self::$connection = null;
    }

    public static function isConnected(): bool
    {
        try {
            self::connection()->query('SELECT 1');
            return true;
        } catch (RuntimeException) {
            return false;
        }
    }
}
