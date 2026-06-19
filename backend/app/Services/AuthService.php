<?php

declare(strict_types=1);

namespace App\Services;

use App\Config\Env;
use App\Core\AppException;
use App\Core\Validator;
use App\Models\LoginHistoryModel;
use App\Models\SessionModel;
use App\Models\UserModel;
use JWT;
use PDO;

require_once dirname(__DIR__, 2) . '/includes/jwt.php';

final class AuthService
{
    public function __construct(
        private PDO $db,
        private ?UserModel $users = null,
        private ?LoginHistoryModel $loginHistory = null,
        private ?SessionModel $sessions = null,
        private ?SessionService $sessionService = null
    ) {
        $this->users ??= new UserModel($db);
        $this->loginHistory ??= new LoginHistoryModel($db);
        $this->sessions ??= new SessionModel($db);
        $this->sessionService ??= new SessionService();
    }

    /** @param array<string, string> $input */
    public function clientLogin(array $input): array
    {
        $email = Validator::sanitizeString($input['email'] ?? '');
        $password = (string) ($input['password'] ?? '');

        $validator = new Validator();
        $validator->required('email', $email)->email('email', $email)->required('password', $password);
        if ($validator->fails()) {
            throw new AppException($validator->firstError(), 422);
        }

        $user = $this->users->findByEmail($email);
        if (!$user || !$this->users->verifyPassword($password, $user['password'] ?? null)) {
            throw new AppException('Invalid email or password', 401);
        }
        if ((int) $user['is_active'] !== 1) {
            throw new AppException('Account is inactive', 403);
        }

        return $this->completeLogin($user, 'client');
    }

    /** @param array<string, string> $input */
    public function adminLogin(array $input): array
    {
        $login = Validator::sanitizeString($input['username'] ?? $input['email'] ?? '');
        $password = (string) ($input['password'] ?? '');

        $validator = new Validator();
        $validator->required('username', $login)->required('password', $password);
        if ($validator->fails()) {
            throw new AppException($validator->firstError(), 422);
        }

        $user = $this->users->findAdminByLogin($login);
        if (!$user || !$this->users->verifyPassword($password, $user['password'] ?? null)) {
            throw new AppException('Invalid admin credentials', 401);
        }
        if ((int) $user['is_active'] !== 1) {
            throw new AppException('Admin account is inactive', 403);
        }

        $response = $this->completeLogin($user, 'admin');
        $response['csrf_token'] = $this->generateCsrfToken();
        return $response;
    }

    /** @param array<string, string> $input */
    public function signup(array $input): array
    {
        $name = Validator::sanitizeString($input['name'] ?? '');
        $email = Validator::sanitizeString($input['email'] ?? '');
        $password = (string) ($input['password'] ?? '');

        $validator = new Validator();
        $validator
            ->required('name', $name)
            ->required('email', $email)
            ->email('email', $email)
            ->required('password', $password)
            ->minLength('password', $password, 6);
        if ($validator->fails()) {
            throw new AppException($validator->firstError(), 422);
        }

        if ($this->users->emailExists($email)) {
            throw new AppException('Email already registered', 409);
        }

        $hash = $this->users->hashPassword($password);
        $userId = $this->users->createClient($name, $email, $hash);
        $user = $this->users->findById($userId);
        if (!$user) {
            throw new AppException('Registration failed', 500);
        }

        require_once dirname(__DIR__, 2) . '/includes/activity.php';
        logActivity($this->db, 'signup', $name . ' registered', $email, $userId, $userId);

        return $this->completeLogin([
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'role' => 'client',
            'username' => null,
        ], 'client');
    }

    public function logout(): void
    {
        require_once dirname(__DIR__, 2) . '/includes/activity.php';

        $userId = $this->sessionService->getUserId();
        if ($userId > 0) {
            logActivity($this->db, 'logout', 'User logged out', null, $userId);
        }

        $this->sessionService->logout($this->sessions);
    }

    /** @return array<string, mixed> */
    public function currentUser(int $userId): array
    {
        $user = $this->users->findById($userId);
        if (!$user) {
            throw new AppException('User not found', 404);
        }

        $providers = [];
        foreach (['google_id' => 'google', 'facebook_id' => 'facebook', 'instagram_id' => 'instagram', 'github_id' => 'github'] as $col => $label) {
            if (!empty($user[$col])) {
                $providers[] = $label;
            }
        }
        if ($providers === []) {
            $providers[] = 'email';
        }

        return [
            'user_id' => (int) $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'avatar_url' => $user['avatar_url'] ?? '',
            'auth_provider' => $user['auth_provider'] ?? 'email',
            'providers' => $providers,
            'member_since' => $user['created_at'],
            'last_login_at' => $user['last_login_at'],
            'lastActive' => time(),
        ];
    }

    /** @param array<string, mixed> $user */
    private function completeLogin(array $user, string $loginType): array
    {
        require_once dirname(__DIR__, 2) . '/includes/activity.php';

        $this->sessionService->loginUser($user, $this->sessions);
        $this->users->updateLastLogin((int) $user['id']);
        $this->loginHistory->record((int) $user['id'], (string) $user['email'], $loginType);
        logActivity($this->db, 'login', $user['name'] . ' logged in', (string) $user['email'], (int) $user['id']);

        $stats = syncDashboardStats($this->db);
        emitRealtimeEvent('user:login', [
            'stats' => $stats,
            'user' => ['name' => $user['name'], 'email' => $user['email'], 'role' => $user['role']],
        ]);
        emitRealtimeEvent('stats:update', $stats);

        return $this->buildAuthResponse($user);
    }

    /** @param array<string, mixed> $user */
    private function buildAuthResponse(array $user): array
    {
        $secret = Env::get('JWT_SECRET', 'nexura-jwt-secret') ?? 'nexura-jwt-secret';
        $ttl = (int) (Env::get('JWT_TTL', '604800') ?? 604800);

        $token = JWT::encode([
            'user_id' => (int) $user['id'],
            'email' => (string) $user['email'],
            'name' => (string) $user['name'],
            'role' => (string) $user['role'],
        ], $secret, $ttl);

        return [
            'token' => $token,
            'user' => [
                'user_id' => (int) $user['id'],
                'name' => (string) $user['name'],
                'email' => (string) $user['email'],
                'role' => (string) $user['role'],
                'is_admin' => ($user['role'] ?? '') === 'admin',
                'avatar_url' => $user['avatar_url'] ?? '',
                'auth_provider' => $user['auth_provider'] ?? 'email',
            ],
        ];
    }

    private function generateCsrfToken(): string
    {
        require_once dirname(__DIR__, 2) . '/includes/security.php';
        return generateCSRFToken();
    }
}
