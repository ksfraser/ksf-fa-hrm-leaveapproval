<?php
declare(strict_types=1);

namespace Ksfraser\FrontAccounting\HRM\LeaveApproval;

require_once __DIR__ . '/../../../../../ksf_Infrastructure/FA/2.4.3/includes/session.inc';

/**
 * ksf_FA_HRM_LeaveApproval shared includes.
 *
 * Ensures FA core is bootstrapped before any module class is used when this
 * file is included from a standalone/CLI context (tests).
 */
if (!defined('TB_PREF')) {
    $path_to_root = dirname(__DIR__, 2);
    require_once $path_to_root . '/includes/session.inc';
}
