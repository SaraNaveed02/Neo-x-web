<?php
/*
    FILE: api/stats/public.php
    PURPOSE: Public frontend stats (real DB values)
*/

require_once '../../includes/bootstrap.php';
require_once '../../includes/site-stats.php';

$db = db();
seedDefaultSiteStats($db);

sendSuccess('Site stats retrieved', [
    'pages' => getSiteStatsGrouped($db),
    'live' => getLiveSiteCounts($db),
]);

?>
