<?php
/*
    FILE: api/services/read.php
    PURPOSE: Get all services
*/

require_once '../../includes/bootstrap.php';

$db = db();

$activeOnly = !isset($_GET['all']) || $_GET['all'] !== '1';
$sql = $activeOnly
    ? "SELECT id, name, description, icon, slug, is_active, created_at FROM services WHERE is_active = 1 ORDER BY id ASC"
    : "SELECT id, name, description, icon, slug, is_active, created_at, updated_at FROM services ORDER BY id ASC";
$stmt = $db->query($sql);
$services = $stmt->fetchAll();

sendSuccess('Services retrieved', $services);
?>