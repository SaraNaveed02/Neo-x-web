<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\MicrosoftConfig;
use App\Core\AppException;
use App\Models\MailMessageModel;
use App\Models\MicrosoftConnectionModel;
use App\Services\MicrosoftGraphService;
use App\Services\MicrosoftOAuthService;
use PDO;

final class MicrosoftAuthController
{
    public function __construct(
        private PDO $db,
        private ?MicrosoftOAuthService $oauth = null,
        private ?MicrosoftGraphService $graph = null,
        private ?MicrosoftConnectionModel $connections = null
    ) {
        $this->oauth ??= new MicrosoftOAuthService();
        $this->graph ??= new MicrosoftGraphService();
        $this->connections ??= new MicrosoftConnectionModel($db);
    }

    public function connectRedirect(int $userId): void
    {
        $this->oauth->ensureConfigured();

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $request = $this->oauth->buildAuthorizationRequest();
        $_SESSION['microsoft_oauth_state'] = $request['state'];
        $_SESSION['microsoft_oauth_user_id'] = $userId;
        $_SESSION['microsoft_oauth_code_verifier'] = $request['code_verifier'];

        header('Location: ' . $request['url']);
        exit;
    }

    public function handleCallback(?string $code, ?string $state, ?string $error, ?string $errorDescription): void
    {
        $redirect = MicrosoftConfig::adminInboxUrl();

        if ($error !== null && $error !== '') {
            $this->redirectWithError($redirect, $errorDescription ?: $error);
        }

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $expectedState = (string) ($_SESSION['microsoft_oauth_state'] ?? '');
        $userId = (int) ($_SESSION['microsoft_oauth_user_id'] ?? 0);
        $codeVerifier = (string) ($_SESSION['microsoft_oauth_code_verifier'] ?? '');

        unset(
            $_SESSION['microsoft_oauth_state'],
            $_SESSION['microsoft_oauth_user_id'],
            $_SESSION['microsoft_oauth_code_verifier']
        );

        if ($code === null || $code === '' || $state === null || $state === '') {
            $this->redirectWithError($redirect, 'Missing authorization response from Microsoft');
        }

        if ($userId <= 0 || $expectedState === '' || !hash_equals($expectedState, $state)) {
            $this->redirectWithError($redirect, 'Invalid OAuth state — please try again');
        }

        if ($codeVerifier === '') {
            $this->redirectWithError($redirect, 'Missing PKCE verifier — please try again');
        }

        try {
            $tokens = $this->oauth->exchangeAuthorizationCode($code, $codeVerifier);
            $connectionId = $this->oauth->storeForUser($this->connections, $userId, $tokens);

            try {
                $profile = $this->graph->getProfile($this->connections, $userId);
                $this->connections->updateProfile(
                    $connectionId,
                    (string) ($profile['id'] ?? ''),
                    (string) ($profile['mail'] ?? $profile['userPrincipalName'] ?? ''),
                    (string) ($profile['displayName'] ?? '')
                );
            } catch (AppException) {
                // Profile fetch is optional if token was saved
            }

            try {
                $mailModel = new MailMessageModel($this->db);
                $this->graph->syncInbox($this->connections, $mailModel, $userId, 25);
            } catch (AppException) {
                // Initial sync may fail if Mail.Read not granted
            }

            header('Location: ' . $redirect . '?connected=1');
        } catch (AppException $e) {
            $this->redirectWithError($redirect, $e->getMessage());
        } catch (\Throwable $e) {
            $this->redirectWithError($redirect, 'Microsoft connection failed');
        }
        exit;
    }

    /** @return array<string, mixed> */
    public function status(int $userId): array
    {
        $connection = $this->connections->findByUserId($userId);
        return [
            'connection' => $this->connections->publicStatus($connection),
            'configured' => MicrosoftConfig::isConfigured(),
            'redirect_uri' => MicrosoftConfig::redirectUri(),
            'scopes' => MicrosoftConfig::scopes(),
        ];
    }

    public function disconnect(int $userId): void
    {
        $this->connections->deleteForUser($userId);
    }

    private function redirectWithError(string $baseUrl, string $message): void
    {
        header('Location: ' . $baseUrl . '?error=' . rawurlencode($message));
        exit;
    }
}
