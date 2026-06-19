<?php
/*
    FILE: api/dashboard/stats.php
    PURPOSE: Dashboard statistics + recent activity
*/

require_once '../../includes/auth-jwt.php';
require_once '../../includes/bootstrap.php';
require_once '../../includes/activity.php';

requireAdminAuth();

$db = db();

$stats = syncDashboardStats($db);
$recentActivity = getRecentActivity($db, 20);

$recentMessages = $db->query(
    'SELECT id, name, email, message, is_read, created_at FROM messages ORDER BY created_at DESC LIMIT 8'
)->fetchAll();

$newThisMonth = (int) $db->query(
    "SELECT COUNT(*) AS c FROM users WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())"
)->fetch()['c'];

sendSuccess('Stats retrieved', [
    'total_users' => $stats['total_users'],
    'total_messages' => $stats['total_messages'],
    'total_logins' => $stats['total_logins'],
    'new_this_month' => $newThisMonth,
    'unread_messages' => (int) $db->query('SELECT COUNT(*) AS c FROM messages WHERE is_read = 0')->fetch()['c'],
    'recent_activity' => $recentActivity,
    'recent_messages' => $recentMessages
]);

?>
