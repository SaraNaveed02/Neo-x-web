<?php
/*
    FILE: config/google-config.php
    PURPOSE: Google OAuth 2.0 Configuration
    NOTE: Replace with your actual Google Client ID and Secret
*/

// Google OAuth — Authorized JavaScript origins (Console mein add karein):
// http://localhost
// http://127.0.0.1
// https://neoxweb.netlify.app
// https://neo-x-web.netlify.app
// https://astounding-banoffee-387242.netlify.app
define('GOOGLE_CLIENT_ID', '99201620546-16nvbeh9uspnr8117m1ijeqj5up3e4kg.apps.googleusercontent.com');
define('GOOGLE_CLIENT_SECRET', 'YOUR_GOOGLE_CLIENT_SECRET');
define('GOOGLE_REDIRECT_URI', 'http://localhost/time/backend/api/auth/google-callback.php');

// Google API Endpoints
define('GOOGLE_AUTH_URL', 'https://accounts.google.com/o/oauth2/v2/auth');
define('GOOGLE_TOKEN_URL', 'https://oauth2.googleapis.com/token');
define('GOOGLE_USERINFO_URL', 'https://www.googleapis.com/oauth2/v2/userinfo');

// Scopes required
define('GOOGLE_SCOPES', 'email profile');
?>