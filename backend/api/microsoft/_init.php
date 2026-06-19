<?php

declare(strict_types=1);

/**
 * Shared bootstrap for Microsoft 365 MVC API endpoints.
 */

require_once dirname(__DIR__, 2) . '/app/Bootstrap.php';

use App\Bootstrap;

Bootstrap::init();

require_once dirname(__DIR__, 2) . '/config/cors.php';
require_once dirname(__DIR__, 2) . '/includes/bootstrap.php';

use App\Config\MicrosoftConfig;

try {
    MicrosoftConfig::hydrateFromDatabase(db());
} catch (Throwable) {
    // Database may be unavailable during install
}
