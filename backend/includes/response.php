<?php
/*
    FILE: includes/response.php
    PURPOSE: Standard API response helper
*/

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function sendSuccess($message, $data = null) {
    sendResponse([
        'success' => true,
        'message' => $message,
        'data' => $data
    ]);
}

function sendError($message, $statusCode = 400) {
    sendResponse([
        'success' => false,
        'error' => $message
    ], $statusCode);
}
?>