<?php
/*
    FILE: includes/request.php
    PURPOSE: Parse JSON request body and validate HTTP methods
*/

function getJsonInput() {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function requireMethod($method) {
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($method)) {
        sendError('Method not allowed', 405);
    }
}

function getQueryInt($key, $default = 0) {
    return isset($_GET[$key]) ? (int) $_GET[$key] : $default;
}

?>
