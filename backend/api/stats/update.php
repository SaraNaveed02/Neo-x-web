<?php
/*
    FILE: api/stats/update.php
    PURPOSE: Admin — update site stat
*/

require_once '../../includes/auth-jwt.php';
require_once '../../includes/bootstrap.php';
require_once '../../includes/functions.php';
require_once '../../includes/request.php';

requireAdminAuth();
requireMethod('PUT');

$data = getJsonInput();
$id = (int) ($data['id'] ?? 0);

if ($id <= 0) {
    sendError('Stat id is required', 400);
}

$db = db();

$fields = [];
$params = [];

if (isset($data['stat_value'])) {
    $fields[] = 'stat_value = ?';
    $params[] = sanitizeInput($data['stat_value']);
}
if (isset($data['stat_label'])) {
    $fields[] = 'stat_label = ?';
    $params[] = sanitizeInput($data['stat_label']);
}
if (isset($data['page_slug'])) {
    $fields[] = 'page_slug = ?';
    $params[] = sanitizeInput($data['page_slug']);
}
if (isset($data['sort_order'])) {
    $fields[] = 'sort_order = ?';
    $params[] = (int) $data['sort_order'];
}
if (isset($data['is_computed'])) {
    $fields[] = 'is_computed = ?';
    $params[] = !empty($data['is_computed']) ? 1 : 0;
}
if (array_key_exists('compute_type', $data)) {
    $fields[] = 'compute_type = ?';
    $params[] = sanitizeInput($data['compute_type']) ?: null;
}

if (empty($fields)) {
    sendError('Nothing to update', 400);
}

$params[] = $id;
$sql = 'UPDATE site_stats SET ' . implode(', ', $fields) . ' WHERE id = ?';

if ($db->prepare($sql)->execute($params)) {
    sendSuccess('Stat updated');
}

sendError('Update failed', 500);

?>
