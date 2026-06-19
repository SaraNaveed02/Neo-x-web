<?php
/*
    FILE: config/database.php
    PURPOSE: Legacy Database class — delegates to MVC App\Core\Database
*/

require_once __DIR__ . '/../app/Bootstrap.php';

use App\Bootstrap;
use App\Core\Database as DatabaseManager;

Bootstrap::init();

class Database
{
    public function getConnection()
    {
        try {
            return DatabaseManager::connection();
        } catch (Throwable $e) {
            error_log('[Database] ' . $e->getMessage());
            return null;
        }
    }
}
