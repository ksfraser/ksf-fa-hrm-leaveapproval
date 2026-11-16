<?php
declare(strict_types=1);

use Ksfraser\FrontAccounting\HRM\LeaveApproval\Controller\LeaveApprovalTabController;

$path_to_root = '../..';

require_once($path_to_root . '/includes/session.inc');

if (!function_exists('page_security')) {
    define('page_security', 'SA_LEAVEAPPROVAL_VIEW');
}

$controller = new LeaveApprovalTabController(null, array());
$controller->render();
