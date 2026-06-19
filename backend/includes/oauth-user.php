<?php
/*
    FILE: includes/oauth-user.php
    PURPOSE: Create/update users from OAuth providers
*/

function ensureOAuthUserColumns(PDO $db): void
{
    $columns = [
        'github_id VARCHAR(255) NULL',
        'facebook_id VARCHAR(255) NULL',
        'instagram_id VARCHAR(255) NULL',
        'linkedin_id VARCHAR(255) NULL',
        'avatar_url VARCHAR(500) NULL',
        "auth_provider VARCHAR(30) NULL",
    ];

    foreach ($columns as $definition) {
        $name = trim(strtok($definition, ' '));
        try {
            $db->exec("ALTER TABLE users ADD COLUMN {$definition}");
        } catch (PDOException $e) {
            // column exists
        }
    }
}

function providerIdColumn(string $provider): string
{
    $map = [
        'google' => 'google_id',
        'facebook' => 'facebook_id',
        'instagram' => 'instagram_id',
        'github' => 'github_id',
        'linkedin' => 'linkedin_id',
    ];
    return $map[$provider] ?? ($provider . '_id');
}

function upsertOAuthUser(PDO $db, string $provider, array $profile): array
{
    ensureOAuthUserColumns($db);

    $provider = strtolower($provider);
    $socialId = sanitizeInput((string) ($profile['id'] ?? ''));
    $name = sanitizeInput($profile['name'] ?? ucfirst($provider) . ' User');
    $email = sanitizeInput($profile['email'] ?? '');
    $avatar = sanitizeInput($profile['avatar_url'] ?? $profile['picture'] ?? '');

    if ($socialId === '') {
        throw new InvalidArgumentException('Invalid social profile');
    }

    if ($email === '' || !validateEmail($email)) {
        if ($provider === 'instagram') {
            $email = 'instagram_' . $socialId . '@social.nexura';
        } elseif ($provider === 'facebook') {
            $email = 'facebook_' . $socialId . '@social.nexura';
        } else {
            throw new InvalidArgumentException('Email required from provider');
        }
    }

    $idColumn = providerIdColumn($provider);
    $isNewUser = false;

    $stmt = $db->prepare("SELECT * FROM users WHERE {$idColumn} = ? OR email = ? LIMIT 1");
    $stmt->execute([$socialId, $email]);
    $user = $stmt->fetch();

    if (!$user) {
        $insert = $db->prepare("INSERT INTO users (name, email, {$idColumn}, avatar_url, auth_provider, role) VALUES (?, ?, ?, ?, ?, 'client')");
        $insert->execute([$name, $email, $socialId, $avatar ?: null, $provider]);
        $userId = (int) $db->lastInsertId();
        $user = [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'role' => 'client',
            'avatar_url' => $avatar,
            'auth_provider' => $provider,
        ];
        $isNewUser = true;
    } else {
        $userId = (int) $user['id'];
        $name = $user['name'] ?: $name;
        $updates = ["{$idColumn} = ?", 'auth_provider = ?', 'last_login_at = NOW()'];
        $params = [$socialId, $provider];
        if ($avatar !== '') {
            $updates[] = 'avatar_url = ?';
            $params[] = $avatar;
        }
        $params[] = $userId;
        $db->prepare('UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = ?')->execute($params);
        $user['name'] = $name;
        $user['auth_provider'] = $provider;
        if ($avatar !== '') {
            $user['avatar_url'] = $avatar;
        }
    }

    return ['user' => $user, 'is_new_user' => $isNewUser];
}

?>
