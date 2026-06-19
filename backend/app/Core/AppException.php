<?php

declare(strict_types=1);

namespace App\Core;

use Exception;
use Throwable;

final class AppException extends Exception
{
    public function __construct(
        string $message,
        private int $statusCode = 400,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $statusCode, $previous);
    }

    public function statusCode(): int
    {
        return $this->statusCode;
    }
}
