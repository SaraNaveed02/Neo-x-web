<?php
/*
    FILE: includes/site-stats.php
    PURPOSE: Live computed values for frontend display stats
*/

function computeSiteStatValue(PDO $db, string $type): string
{
    switch ($type) {
        case 'services_count':
            return (string) (int) $db->query('SELECT COUNT(*) FROM services WHERE is_active = 1')->fetchColumn();

        case 'clients_count':
            return (string) (int) $db->query("SELECT COUNT(*) FROM users WHERE role = 'client'")->fetchColumn();

        case 'users_count':
            return (string) (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn();

        case 'messages_count':
            return (string) (int) $db->query('SELECT COUNT(*) FROM messages')->fetchColumn();

        case 'logins_count':
            return (string) (int) $db->query('SELECT COUNT(*) FROM login_history')->fetchColumn();

        case 'client_retention':
            $total = (int) $db->query("SELECT COUNT(*) FROM users WHERE role = 'client'")->fetchColumn();
            if ($total === 0) {
                return '0%';
            }
            $active = (int) $db->query("SELECT COUNT(*) FROM users WHERE role = 'client' AND last_login_at IS NOT NULL")->fetchColumn();
            return round(($active * 100) / $total) . '%';

        case 'support_coverage':
            $stmt = $db->prepare("SELECT setting_value FROM settings WHERE setting_key = 'support_coverage' LIMIT 1");
            $stmt->execute();
            $value = $stmt->fetchColumn();
            return $value !== false && $value !== '' ? (string) $value : '24/7';

        default:
            return '0';
    }
}

function resolveSiteStatValue(PDO $db, array $row): string
{
    if (!empty($row['is_computed']) && !empty($row['compute_type'])) {
        return computeSiteStatValue($db, $row['compute_type']);
    }

    return (string) ($row['stat_value'] ?? '0');
}

function getSiteStatsGrouped(PDO $db): array
{
    $stmt = $db->query(
        'SELECT id, stat_key, stat_value, stat_label, page_slug, sort_order, is_computed, compute_type
         FROM site_stats
         ORDER BY page_slug ASC, sort_order ASC, id ASC'
    );

    $pages = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $slug = $row['page_slug'] ?: 'global';
        if (!isset($pages[$slug])) {
            $pages[$slug] = [];
        }
        $pages[$slug][] = [
            'id' => (int) $row['id'],
            'key' => $row['stat_key'],
            'value' => resolveSiteStatValue($db, $row),
            'label' => $row['stat_label'],
            'is_computed' => (bool) $row['is_computed'],
            'compute_type' => $row['compute_type'],
        ];
    }

    return $pages;
}

function getLiveSiteCounts(PDO $db): array
{
    return [
        'services' => (int) computeSiteStatValue($db, 'services_count'),
        'clients' => (int) computeSiteStatValue($db, 'clients_count'),
        'users' => (int) computeSiteStatValue($db, 'users_count'),
        'messages' => (int) computeSiteStatValue($db, 'messages_count'),
        'logins' => (int) computeSiteStatValue($db, 'logins_count'),
        'client_retention' => computeSiteStatValue($db, 'client_retention'),
        'support_coverage' => computeSiteStatValue($db, 'support_coverage'),
    ];
}

function seedDefaultSiteStats(PDO $db): void
{
    $defaults = [
        ['home_products', '', 'Digital products launched', 'home', 1, 1, 'services_count'],
        ['home_clients', '', 'Registered clients', 'home', 2, 1, 'clients_count'],
        ['home_support', '24/7', 'Product support and maintenance', 'home', 3, 0, null],
        ['login_products', '', 'Products launched', 'login', 1, 1, 'services_count'],
        ['login_retention', '', 'Client retention', 'login', 2, 1, 'client_retention'],
        ['login_support', '24/7', 'Support coverage', 'login', 3, 0, null],
        ['about_clients', '', 'Registered clients', 'about', 1, 1, 'clients_count'],
        ['about_retention', '', 'Client retention rate', 'about', 2, 1, 'client_retention'],
        ['about_services', '', 'Active services', 'about', 3, 1, 'services_count'],
        ['global_services', '', 'Active services', 'global', 1, 1, 'services_count'],
        ['global_clients', '', 'Registered clients', 'global', 2, 1, 'clients_count'],
        ['global_messages', '', 'Client inquiries', 'global', 3, 1, 'messages_count'],
        ['global_support', '', 'Support available', 'global', 4, 1, 'support_coverage'],
    ];

    $stmt = $db->prepare(
        'INSERT IGNORE INTO site_stats (stat_key, stat_value, stat_label, page_slug, sort_order, is_computed, compute_type)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    foreach ($defaults as $row) {
        $stmt->execute($row);
    }

    $db->exec("INSERT IGNORE INTO settings (setting_key, setting_value, setting_group) VALUES ('support_coverage', '24/7', 'general')");
}

?>
