<?php
/*
    FILE: api/stats/read.php
    PURPOSE: Admin — list all site stats
*/

require_once '../../includes/auth-jwt.php';
require_once '../../includes/bootstrap.php';
require_once '../../includes/site-stats.php';

requireAdminAuth();

$db = db();
$rows = $db->query(
    'SELECT id, stat_key, stat_value, stat_label, page_slug, sort_order, is_computed, compute_type, created_at, updated_at
     FROM site_stats
     ORDER BY page_slug ASC, sort_order ASC, id ASC'
)->fetchAll(PDO::FETCH_ASSOC);

foreach ($rows as &$row) {
    $row['display_value'] = resolveSiteStatValue($db, $row);
}
unset($row);

sendSuccess('Site stats retrieved', $rows);

?>
