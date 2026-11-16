<?php

declare(strict_types=1);

namespace Ksfraser\FrontAccounting\HRM\LeaveApproval\App;

use ksfraser\FrontAccounting\Common\App\AbstractAppShell;
use ksfraser\FrontAccounting\Common\Menu\FAModuleMenu;
use Ksfraser\FrontAccounting\HRM\LeaveApproval\Controller\LeaveApprovalTabController;

class LeaveApprovalAppShell extends AbstractAppShell
{
    public function __construct()
    {
        parent::__construct('leaveapproval', 'index.php', 'view', 'leave_approvals');

        $this->add_module(_("Leave Approval"));

        $menu = new FAModuleMenu(
            'modules/ksf_FA_HRM_LeaveApproval/index.php',
            'view',
            ''
        );

        $menu->addItem('leave_approvals', _("Leave Approvals"), MENU_INQUIRY)
             ->registerWithApp($this, 'SA_LEAVEAPPROVAL_VIEW');

        $this->add_extensions();
    }
}
