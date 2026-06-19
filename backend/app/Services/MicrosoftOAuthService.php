<?php

declare(strict_types=1);

namespace App\Services;

use App\Config\MicrosoftConfig;
use App\Core\AppException;
use App\Core\HttpClient;
use App\Models\MicrosoftConnectionModel;

final class MicrosoftOAuthService
{
    public function __construct(
        private HttpClient $http = new HttpClient(),
        private TokenVaultService $vault = new TokenVaultService()
    ) {
    }

    public function ensureConfigured(): void
    {
        if (!MicrosoftConfig::isConfigured()) {
            throw new AppException('Microsoft OAuth is not configured. Set MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET in .env', 503);
        }
    }

    /** @return array{url:string, state:string, code_verifier:string} */
    public function buildAuthorizationRequest(): array
    {
        $this->ensureConfigured();

        $state = bin2hex(random_bytes(32));
        $codeVerifier = $this->generateCodeVerifier();
        $codeChallenge = $this->generateCodeChallenge($codeVerifier);

        $params = http_build_query([
            'client_id' => MicrosoftConfig::clientId(),
            'response_type' => 'code',
            'redirect_uri' => MicrosoftConfig::redirectUri(),
            'response_mode' => 'query',
            'scope' => implode(' ', MicrosoftConfig::scopes()),
            'state' => $state,
            'code_challenge' => $codeChallenge,
            'code_challenge_method' => 'S256',
            'prompt' => 'consent',
        ]);

        return [
            'url' => MicrosoftConfig::authorizeUrl() . '?' . $params,
            'state' => $state,
            'code_verifier' => $codeVerifier,
        ];
    }

    /** @return array<string, mixed> */
    public function exchangeAuthorizationCode(string $code, string $codeVerifier): array
    {
        $this->ensureConfigured();

        $body = http_build_query([
            'client_id' => MicrosoftConfig::clientId(),
            'client_secret' => MicrosoftConfig::clientSecret(),
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => MicrosoftConfig::redirectUri(),
            'code_verifier' => $codeVerifier,
            'scope' => implode(' ', MicrosoftConfig::scopes()),
        ]);

        return $this->http->requestJson('POST', MicrosoftConfig::tokenUrl(), [
            'Content-Type: application/x-www-form-urlencoded',
        ], $body);
    }

    /** @return array<string, mixed> */
    public function refreshTokens(MicrosoftConnectionModel $connections, array $connection): array
    {
        $this->ensureConfigured();

        $refreshToken = $this->vault->decrypt((string) ($connection['refresh_token_enc'] ?? ''));
        if ($refreshToken === '') {
            throw new AppException('No refresh token available. Please reconnect Microsoft 365.', 401);
        }

        $body = http_build_query([
            'client_id' => MicrosoftConfig::clientId(),
            'client_secret' => MicrosoftConfig::clientSecret(),
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
            'redirect_uri' => MicrosoftConfig::redirectUri(),
            'scope' => implode(' ', MicrosoftConfig::scopes()),
        ]);

        $tokens = $this->http->requestJson('POST', MicrosoftConfig::tokenUrl(), [
            'Content-Type: application/x-www-form-urlencoded',
        ], $body);

        $this->persistTokenResponse($connections, (int) $connection['id'], $tokens);
        return $tokens;
    }

    /** @param array<string, mixed> $tokenPayload */
    public function storeForUser(
        MicrosoftConnectionModel $connections,
        int $userId,
        array $tokenPayload,
        ?array $profile = null
    ): int {
        $access = (string) ($tokenPayload['access_token'] ?? '');
        if ($access === '') {
            throw new AppException('Microsoft did not return an access token', 502);
        }

        $refresh = (string) ($tokenPayload['refresh_token'] ?? '');
        $expiresIn = max(60, (int) ($tokenPayload['expires_in'] ?? 3600) - 60);
        $expiresAt = date('Y-m-d H:i:s', time() + $expiresIn);
        $scopes = (string) ($tokenPayload['scope'] ?? implode(' ', MicrosoftConfig::scopes()));

        $email = (string) ($profile['mail'] ?? $profile['userPrincipalName'] ?? '');
        $name = (string) ($profile['displayName'] ?? '');
        $msId = (string) ($profile['id'] ?? '');

        return $connections->upsertTokens(
            $userId,
            $msId,
            $email,
            $name,
            $this->vault->encrypt($access),
            $refresh !== '' ? $this->vault->encrypt($refresh) : null,
            $expiresAt,
            $scopes
        );
    }

    /** @param array<string, mixed> $tokens */
    private function persistTokenResponse(MicrosoftConnectionModel $connections, int $connectionId, array $tokens): void
    {
        $access = (string) ($tokens['access_token'] ?? '');
        if ($access === '') {
            throw new AppException('Token refresh failed', 502);
        }

        $expiresIn = max(60, (int) ($tokens['expires_in'] ?? 3600) - 60);
        $expiresAt = date('Y-m-d H:i:s', time() + $expiresIn);
        $refreshEnc = null;
        if (!empty($tokens['refresh_token'])) {
            $refreshEnc = $this->vault->encrypt((string) $tokens['refresh_token']);
        }

        $connections->updateTokens(
            $connectionId,
            $this->vault->encrypt($access),
            $refreshEnc,
            $expiresAt
        );
    }

    private function generateCodeVerifier(): string
    {
        return rtrim(strtr(base64_encode(random_bytes(64)), '+/', '-_'), '=');
    }

    private function generateCodeChallenge(string $codeVerifier): string
    {
        return rtrim(strtr(base64_encode(hash('sha256', $codeVerifier, true)), '+/', '-_'), '=');
    }
}
