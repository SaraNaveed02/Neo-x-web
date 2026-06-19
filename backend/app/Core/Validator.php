<?php

declare(strict_types=1);

namespace App\Core;

final class Validator
{
    /** @var array<string, string> */
    private array $errors = [];

    public function required(string $field, mixed $value, string $message = null): self
    {
        if ($value === null || (is_string($value) && trim($value) === '')) {
            $this->errors[$field] = $message ?? ucfirst($field) . ' is required';
        }
        return $this;
    }

    public function email(string $field, string $value, string $message = null): self
    {
        if ($value !== '' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = $message ?? 'Invalid email format';
        }
        return $this;
    }

    public function minLength(string $field, string $value, int $min, string $message = null): self
    {
        if (strlen($value) < $min) {
            $this->errors[$field] = $message ?? ucfirst($field) . " must be at least {$min} characters";
        }
        return $this;
    }

    public function inList(string $field, string $value, array $allowed, string $message = null): self
    {
        if (!in_array($value, $allowed, true)) {
            $this->errors[$field] = $message ?? 'Invalid ' . $field;
        }
        return $this;
    }

    public function fails(): bool
    {
        return $this->errors !== [];
    }

    /** @return array<string, string> */
    public function errors(): array
    {
        return $this->errors;
    }

    public function firstError(): string
    {
        return reset($this->errors) ?: 'Validation failed';
    }

    public static function sanitizeString(?string $value): string
    {
        return htmlspecialchars(strip_tags(trim((string) $value)), ENT_QUOTES, 'UTF-8');
    }
}
