<?php
/*
    FILE: api/messages/create.php
    PURPOSE: Save contact message — shows in admin instantly
*/

require_once '../../config/constants.php';
require_once '../../includes/functions.php';
require_once '../../includes/request.php';
require_once '../../includes/activity.php';
require_once '../../includes/bootstrap.php';

requireMethod('POST');

$data = getJsonInput();
$name = sanitizeInput($data['name'] ?? '');
$email = sanitizeInput($data['email'] ?? '');
$phone = sanitizeInput($data['phone'] ?? '');
$message = sanitizeInput($data['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    sendError('Name, email, and message are required');
}
if (!validateEmail($email)) {
    sendError('Invalid email format');
}
if (strlen($message) < 10) {
    sendError('Message is too short (min 10 characters)');
}

$db = db();

$stmt = $db->prepare('INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)');
$stmt->execute([$name, $email, $phone, $message]);
$messageId = (int) $db->lastInsertId();

logActivity($db, 'message', 'New message from ' . $name, substr($message, 0, 200), null, $messageId);

$stats = syncDashboardStats($db);
emitRealtimeEvent('message:new', [
    'message' => [
        'id' => $messageId,
        'name' => $name,
        'email' => $email,
        'message' => $message,
        'created_at' => date('Y-m-d H:i:s')
    ],
    'stats' => $stats
]);
emitRealtimeEvent('stats:update', $stats);

sendSuccess('Message sent successfully', ['message_id' => $messageId]);

?>
