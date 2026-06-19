<?php
/*
    FILE: api/stats/create.php
    PURPOSE: Admin — add site stat
*/

require_once '../../includes/auth-jwt.php';
require_once '../../includes/bootstrap.php';
require_once '../../includes/functions.php';
require_once '../../includes/request.php';

requireAdminAuth();
requireMethod('POST');

$data = getJsonInput();

$key = sanitizeInput($data['stat_key'] ?? '');
$label = sanitizeInput($data['stat_label'] ?? '');
$value = sanitizeInput($data['stat_value'] ?? '');
$page = sanitizeInput($data['page_slug'] ?? 'global');
$sort = (int) ($data['sort_order'] ?? 0);
$isComputed = !empty($data['is_computed']) ? 1 : 0;
$computeType = sanitizeInput($data['compute_type'] ?? '');

if ($key === '' || $label === '') {
    sendError('Stat key and label are required', 400);
}

$db = db();

$check = $db->prepare('SELECT id FROM site_stats WHERE stat_key = ? LIMIT 1');
$check->execute([$key]);
if ($check->fetch()) {
    sendError('Stat key already exists', 409);
}

$stmt = $db->prepare(
    'INSERT INTO site_stats (stat_key, stat_value, stat_label, page_slug, sort_order, is_computed, compute_type)
     VALUES (?, ?, ?, ?, ?, ?, ?)'
);

if ($stmt->execute([$key, $value, $label, $page, $sort, $isComputed, $computeType ?: null])) {
    sendSuccess('Stat created', ['id' => (int) $db->lastInsertId()]);
}

sendError('Create failed', 500);

?>
