<?php

declare(strict_types=1);

namespace Ksfraser\FrontAccounting\HRM\LeaveApproval\App;

use ksfraser\FrontAccounting\Common\App\AbstractAppShell;
use ksfraser\FrontAccounting\Common\App\TabRegistration;

class LeaveApprovalAppShell extends AbstractAppShell
{
    public function __construct()
    {
        parent::__construct('leaveapproval', 'index.php', 'view', 'leave_approvals');

        $this->registerTab(new TabRegistration(
            'leave_approvals',
            'Leave Approvals',
            'SA_LEAVEAPPROVAL_VIEW',
            null,
            10,
            0,
            null,
            null,
            array()
        ));
    }
}
