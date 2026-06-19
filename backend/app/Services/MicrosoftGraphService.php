<?php

declare(strict_types=1);

namespace App\Services;

use App\Config\MicrosoftConfig;
use App\Core\AppException;
use App\Core\HttpClient;
use App\Models\MailMessageModel;
use App\Models\MicrosoftConnectionModel;

final class MicrosoftGraphService
{
    public function __construct(
        private HttpClient $http = new HttpClient(),
        private TokenVaultService $vault = new TokenVaultService(),
        private MicrosoftOAuthService $oauth = new MicrosoftOAuthService()
    ) {
    }

    /** @return array<string, mixed> */
    public function getProfile(MicrosoftConnectionModel $connections, int $userId): array
    {
        $connection = $connections->requireForUser($userId);
        return $this->graphGet($connections, $connection, '/me?$select=id,displayName,mail,userPrincipalName,jobTitle,mobilePhone');
    }

    /** @return array<string, mixed> */
    public function listInboxMessages(MicrosoftConnectionModel $connections, int $userId, int $top = 10): array
    {
        $connection = $connections->requireForUser($userId);
        $path = '/me/messages?$top=' . max(1, min(50, $top))
            . '&$orderby=receivedDateTime desc'
            . '&$select=id,subject,from,toRecipients,bodyPreview,isRead,hasAttachments,receivedDateTime';

        return $this->graphGet($connections, $connection, $path);
    }

    public function syncInbox(
        MicrosoftConnectionModel $connections,
        MailMessageModel $mailModel,
        int $userId,
        int $top = 50
    ): int {
        $connection = $connections->requireForUser($userId);
        $path = '/me/messages?$top=' . max(1, min(100, $top))
            . '&$orderby=receivedDateTime desc'
            . '&$select=id,subject,from,toRecipients,bodyPreview,isRead,hasAttachments,receivedDateTime,body';

        $result = $this->graphGet($connections, $connection, $path);
        $normalized = $this->normalizeMessages($result['value'] ?? []);
        $count = $mailModel->upsertBatch((int) $connection['id'], $normalized);
        $connections->markSynced((int) $connection['id']);
        return $count;
    }

    public function sendMail(MicrosoftConnectionModel $connections, int $userId, string $to, string $subject, string $body, bool $isHtml = false): void
    {
        $connection = $connections->requireForUser($userId);

        if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
            throw new AppException('Invalid recipient email address', 422);
        }

        $payload = [
            'message' => [
                'subject' => $subject,
                'body' => [
                    'contentType' => $isHtml ? 'HTML' : 'Text',
                    'content' => $body,
                ],
                'toRecipients' => [
                    ['emailAddress' => ['address' => $to]],
                ],
            ],
            'saveToSentItems' => true,
        ];

        $this->graphPost($connections, $connection, '/me/sendMail', $payload);
    }

    /** @return array<string, mixed> */
    private function graphGet(MicrosoftConnectionModel $connections, array $connection, string $path): array
    {
        $token = $this->resolveAccessToken($connections, $connection);
        return $this->http->requestJson('GET', MicrosoftConfig::graphBaseUrl() . $path, [
            'Authorization: Bearer ' . $token,
            'Accept: application/json',
        ]);
    }

    /** @param array<string, mixed> $payload */
    private function graphPost(MicrosoftConnectionModel $connections, array $connection, string $path, array $payload): array
    {
        $token = $this->resolveAccessToken($connections, $connection);
        return $this->http->requestJson('POST', MicrosoftConfig::graphBaseUrl() . $path, [
            'Authorization: Bearer ' . $token,
            'Accept: application/json',
            'Content-Type: application/json',
        ], json_encode($payload, JSON_THROW_ON_ERROR));
    }

    private function resolveAccessToken(MicrosoftConnectionModel $connections, array $connection): string
    {
        $expires = strtotime((string) ($connection['token_expires_at'] ?? ''));
        if ($expires !== false && $expires > time()) {
            return $this->vault->decrypt((string) $connection['access_token_enc']);
        }

        $this->oauth->refreshTokens($connections, $connection);

        $fresh = $connections->findByIdForUser((int) $connection['id'], (int) $connection['user_id']);
        if (!$fresh) {
            throw new AppException('Microsoft connection lost after refresh', 401);
        }

        return $this->vault->decrypt((string) $fresh['access_token_enc']);
    }

    /**
     * @param list<array<string, mixed>> $messages
     * @return list<array<string, mixed>>
     */
    private function normalizeMessages(array $messages): array
    {
        $rows = [];
        foreach ($messages as $msg) {
            $from = $msg['from']['emailAddress'] ?? [];
            $toList = [];
            foreach ($msg['toRecipients'] ?? [] as $recipient) {
                $address = $recipient['emailAddress']['address'] ?? null;
                if (is_string($address) && $address !== '') {
                    $toList[] = $address;
                }
            }

            $body = $msg['body'] ?? [];
            $contentType = strtolower((string) ($body['contentType'] ?? 'text'));
            $content = (string) ($body['content'] ?? '');

            $received = null;
            if (!empty($msg['receivedDateTime'])) {
                $ts = strtotime((string) $msg['receivedDateTime']);
                if ($ts !== false) {
                    $received = date('Y-m-d H:i:s', $ts);
                }
            }

            $rows[] = [
                'graph_message_id' => (string) ($msg['id'] ?? ''),
                'subject' => (string) ($msg['subject'] ?? '(No subject)'),
                'from_name' => (string) ($from['name'] ?? ''),
                'from_email' => (string) ($from['address'] ?? ''),
                'to_recipients' => implode(', ', $toList),
                'body_preview' => (string) ($msg['bodyPreview'] ?? ''),
                'body_html' => $contentType === 'html' ? $content : null,
                'body_text' => $contentType !== 'html' ? $content : null,
                'is_read' => !empty($msg['isRead']) ? 1 : 0,
                'has_attachments' => !empty($msg['hasAttachments']) ? 1 : 0,
                'received_at' => $received,
            ];
        }

        return $rows;
    }
}
