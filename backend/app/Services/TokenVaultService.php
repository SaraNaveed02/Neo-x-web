<?php

declare(strict_types=1);

namespace App\Services;

use App\Config\Env;
use App\Core\AppException;

final class TokenVaultService
{
    private const CIPHER = 'AES-256-GCM';

    public function encrypt(string $plainText): string
    {
        if ($plainText === '') {
            throw new AppException('Cannot encrypt empty token', 500);
        }

        $key = $this->deriveKey();
        $ivLength = openssl_cipher_iv_length(self::CIPHER);
        if ($ivLength === false) {
            throw new AppException('Encryption unavailable', 500);
        }

        $iv = random_bytes($ivLength);
        $tag = '';
        $cipher = openssl_encrypt($plainText, self::CIPHER, $key, OPENSSL_RAW_DATA, $iv, $tag);
        if ($cipher === false) {
            throw new AppException('Token encryption failed', 500);
        }

        return base64_encode($iv . $tag . $cipher);
    }

    public function decrypt(string $encoded): string
    {
        if ($encoded === '') {
            return '';
        }

        $raw = base64_decode($encoded, true);
        if ($raw === false) {
            throw new AppException('Invalid encrypted token format', 500);
        }

        $key = $this->deriveKey();
        $ivLength = openssl_cipher_iv_length(self::CIPHER);
        if ($ivLength === false) {
            throw new AppException('Decryption unavailable', 500);
        }

        $tagLength = 16;
        if (strlen($raw) < $ivLength + $tagLength + 1) {
            throw new AppException('Corrupted encrypted token', 500);
        }

        $iv = substr($raw, 0, $ivLength);
        $tag = substr($raw, $ivLength, $tagLength);
        $cipher = substr($raw, $ivLength + $tagLength);

        $plain = openssl_decrypt($cipher, self::CIPHER, $key, OPENSSL_RAW_DATA, $iv, $tag);
        if ($plain === false) {
            throw new AppException('Token decryption failed — reconnect Microsoft account', 401);
        }

        return $plain;
    }

    private function deriveKey(): string
    {
        $secret = Env::get('TOKEN_ENCRYPTION_KEY') ?? Env::get('JWT_SECRET') ?? '';
        if (strlen($secret) < 32) {
            throw new AppException('TOKEN_ENCRYPTION_KEY must be at least 32 characters', 500);
        }
        return hash('sha256', $secret, true);
    }
}
