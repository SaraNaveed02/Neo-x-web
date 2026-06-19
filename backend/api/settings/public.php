<?php
/*
    FILE: api/settings/public.php
    PURPOSE: Public site settings for frontend (contact info, etc.)
*/

require_once '../../includes/bootstrap.php';

$db = db();

$publicKeys = [
    'site_name',
    'site_tagline',
    'contact_email',
    'contact_phone',
    'contact_address',
    'contact_response_time',
    'whatsapp_number',
    'whatsapp_number_2',
    'social_linkedin',
    'social_twitter',
    'support_coverage'
];

$placeholders = implode(',', array_fill(0, count($publicKeys), '?'));
$stmt = $db->prepare("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ($placeholders)");
$stmt->execute($publicKeys);

$settings = [];
foreach ($stmt->fetchAll() as $row) {
    $settings[$row['setting_key']] = $row['setting_value'];
}

foreach ($publicKeys as $key) {
    if (!isset($settings[$key])) {
        $settings[$key] = '';
    }
}

sendSuccess('Public settings retrieved', $settings);

?>
