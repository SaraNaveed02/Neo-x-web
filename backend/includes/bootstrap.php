<?php
/*
    FILE: includes/bootstrap.php
    PURPOSE: Database bootstrap with MVC Database class + error handling
*/

require_once __DIR__ . '/../app/Bootstrap.php';
require_once __DIR__ . '/response.php';

use App\Bootstrap;
use App\Core\Database;

Bootstrap::init();

function db(): PDO
{
    try {
        return Database::connection();
    } catch (Throwable $e) {
        sendError(
            'Database not connected. Open http://localhost/time/backend/install.php and run setup.',
            503
        );
    }
}
