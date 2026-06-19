<?php

declare(strict_types=1);

/**
 * Shared API bootstrap — loads .env, autoloader, database.
 */

require_once dirname(__DIR__) . '/app/Bootstrap.php';

use App\Bootstrap;
use App\Core\Database;

Bootstrap::init();

require_once dirname(__DIR__) . '/config/cors.php';

function app_db(): PDO
{
    return Database::connection();
}
