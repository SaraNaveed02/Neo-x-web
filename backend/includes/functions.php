<?php
/*
    FILE: includes/functions.php
    PURPOSE: Reusable helper functions
*/

function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function generateToken() {
    return bin2hex(random_bytes(32));
}

function getCurrentTimestamp() {
    return date('Y-m-d H:i:s');
}
?>