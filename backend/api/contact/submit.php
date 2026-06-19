<?php
/*
    FILE: api/contact/submit.php
    PURPOSE: Submit contact message from frontend
*/

require_once '../../config/database.php';
require_once '../../includes/response.php';
require_once '../../includes/functions.php';

header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = json_decode(file_get_contents('php://input'), true);

$name = sanitizeInput($data['name'] ?? '');
$email = sanitizeInput($data['email'] ?? '');
$phone = sanitizeInput($data['phone'] ?? '');
$message = sanitizeInput($data['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    sendError('Name, email, and message are required');
}

if (!validateEmail($email)) {
    sendError('Invalid email format');
}

$database = new Database();
$db = $database->getConnection();

$stmt = $db->prepare("INSERT INTO messages (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, NOW())");

if ($stmt->execute([$name, $email, $phone, $message])) {
    sendSuccess('Message sent successfully');
} else {
    sendError('Failed to send message', 500);
}
?>