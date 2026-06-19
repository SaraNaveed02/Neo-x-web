<?php
require_once __DIR__ . '/../app/Bootstrap.php';
require_once __DIR__ . '/../includes/auth-check.php';

use App\Core\Database;
use App\Models\SessionModel;
use App\Services\SessionService;

\App\Bootstrap::init();

$session = new SessionService();
$session->logout(new SessionModel(Database::connection()));

header('Location: ../index.php', true, 302);
exit;
