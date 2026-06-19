<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\AppException;
use App\Models\MailMessageModel;
use App\Models\MicrosoftConnectionModel;
use App\Services\MicrosoftGraphService;
use PDO;

final class MicrosoftMailController
{
    public function __construct(
        private PDO $db,
        private ?MicrosoftGraphService $graph = null,
        private ?MicrosoftConnectionModel $connections = null,
        private ?MailMessageModel $mail = null
    ) {
        $this->graph ??= new MicrosoftGraphService();
        $this->connections ??= new MicrosoftConnectionModel($db);
        $this->mail ??= new MailMessageModel($db);
    }

    /** @return array<string, mixed> */
    public function profile(int $userId): array
    {
        return $this->graph->getProfile($this->connections, $userId);
    }

    /** @return array<string, mixed> */
    public function liveInbox(int $userId, int $top = 10): array
    {
        return $this->graph->listInboxMessages($this->connections, $userId, $top);
    }

    /** @return array<string, mixed> */
    public function listCached(int $userId, int $limit, int $offset, string $search): array
    {
        $connection = $this->connections->requireForUser($userId);
        return [
            'messages' => $this->mail->listForConnection((int) $connection['id'], $limit, $offset, $search),
            'connection' => $this->connections->publicStatus($connection),
        ];
    }

    /** @return array<string, mixed> */
    public function readCached(int $userId, int $messageId): array
    {
        $connection = $this->connections->requireForUser($userId);
        $message = $this->mail->findForConnection($messageId, (int) $connection['id']);
        if (!$message) {
            throw new AppException('Message not found', 404);
        }
        return $message;
    }

    /** @return array<string, mixed> */
    public function sync(int $userId, int $limit): array
    {
        $count = $this->graph->syncInbox($this->connections, $this->mail, $userId, $limit);
        $connection = $this->connections->findByUserId($userId);
        return [
            'synced' => $count,
            'connection' => $this->connections->publicStatus($connection),
        ];
    }

    public function send(int $userId, string $to, string $subject, string $body, bool $isHtml): void
    {
        if ($to === '' || $subject === '' || $body === '') {
            throw new AppException('to, subject, and body are required', 422);
        }
        $this->graph->sendMail($this->connections, $userId, $to, $subject, $body, $isHtml);
    }
}
