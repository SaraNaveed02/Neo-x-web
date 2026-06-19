<?php

declare(strict_types=1);

namespace App;

use App\Config\Env;

final class Bootstrap
{
    private static bool $initialized = false;

    public static function init(): void
    {
        if (self::$initialized) {
            return;
        }

        self::registerAutoloader();

        $root = dirname(__DIR__);
        Env::load($root . '/.env');

        if (Env::bool('APP_FORCE_HTTPS', false) && !self::isHttps()) {
            $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
            $uri = $_SERVER['REQUEST_URI'] ?? '/';
            header('Location: https://' . $host . $uri, true, 301);
            exit;
        }

        self::$initialized = true;
    }

    private static function registerAutoloader(): void
    {
        spl_autoload_register(static function (string $class): void {
            $prefix = 'App\\';
            if (strncmp($prefix, $class, strlen($prefix)) !== 0) {
                return;
            }
            $relative = str_replace('\\', '/', substr($class, strlen($prefix)));
            $file = __DIR__ . '/' . $relative . '.php';
            if (is_file($file)) {
                require_once $file;
            }
        });
    }

    private static function isHttps(): bool
    {
        if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
            return true;
        }
        return isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https';
    }
}
